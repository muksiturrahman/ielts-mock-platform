"""Records every seed Listening part to public/audio/<part id>.mp3 with Piper (free, offline, neural voices).

  npx vite-node scripts/dump-listening.ts > /tmp/parts.json
  python make_audio.py /tmp/parts.json <piper voice dir>   # needs `pip install piper-tts` and ffmpeg

Voices: https://huggingface.co/rhasspy/piper-voices (en_GB alan/cori/jenny_dioco/alba/northern_english_male, en_US lessac/ryan).
Like the real recordings, the files include the question-reading pauses, so the app plays them straight through.
"""
import json, os, re, subprocess, sys
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

data = json.load(open(sys.argv[1]))
vdir = Path(sys.argv[2])
out = Path(__file__).resolve().parent.parent / 'public' / 'audio'
out.mkdir(parents=True, exist_ok=True)
# espeak-ng fails on long paths (e.g. inside a deep virtualenv), so its data can be copied somewhere short.
ESPEAK = Path(os.environ.get('ESPEAK_DATA', Path.home() / '.cache/piper/espeak-ng-data'))
RATE = 22050
NARRATOR = 'en_GB-cori-high'
POOL = {'f': ['en_GB-jenny_dioco-medium', 'en_US-lessac-high', 'en_GB-alba-medium'],
        'm': ['en_GB-alan-medium', 'en_GB-northern_english_male-medium', 'en_US-ryan-high']}
loaded = {}
def voice(name):
    if name not in loaded: loaded[name] = PiperVoice.load(str(vdir / f'{name}.onnx'), espeak_data_dir=ESPEAK)
    return loaded[name]

def gender(part, label):
    if label not in part['voices']: sys.exit(f'{part["id"]}: no gender for speaker {label} — add it to the "// voices:" comment')
    return part['voices'][label]

def silence(sec): return b'\0\0' * int(RATE * sec)
# Real tests give ~30 s to read the questions before each block.
PREVIEW = re.compile(r'time to look at|^now look at questions', re.I)

only = set(sys.argv[3:])
for n, part in enumerate(data):
    if only and part['id'] not in only: continue
    lines = [(m.group(1).strip(), m.group(2)) if (m := re.match(r'^([A-Z][A-Z .\'()-]*):\s*(.*)$', l)) else ('NARRATOR', l)
             for l in part['transcript'].splitlines() if l.strip()]
    cast, used = {}, {'f': 0, 'm': 0}
    for sp, _ in lines:
        if sp != 'NARRATOR' and sp not in cast:
            g = gender(part, sp); pool = POOL[g]
            cast[sp] = pool[(used[g] + n) % len(pool)]; used[g] += 1
    pcm = bytearray(silence(0.5))
    for sp, text in lines:
        v = voice(NARRATOR if sp == 'NARRATOR' else cast[sp])
        for chunk in v.synthesize(text, syn_config=SynthesisConfig(length_scale=1.05 if sp == 'NARRATOR' else 1.0)):
            assert chunk.sample_rate == RATE
            pcm += chunk.audio_int16_bytes
        pcm += silence(30 if sp == 'NARRATOR' and PREVIEW.search(text) else 1.0 if sp == 'NARRATOR' else 0.45)
    dest = out / f"{part['id']}.mp3"
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', '-',
                    '-af', 'loudnorm=I=-18:TP=-2', '-ac', '1', '-b:a', '48k', str(dest)], input=bytes(pcm), check=True)
    print(dest.name, f'{len(pcm) / 2 / RATE / 60:.1f} min', cast, flush=True)
