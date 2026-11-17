# BandReady — IELTS Mock Test Platform

Realistic **computer-delivered IELTS** mock tests (Academic and General Training) with
rule-based marking for Listening and Reading, and **AI marking** for Writing and Speaking
against the four official criteria of each. You can use a **free** AI provider (Google Gemini, Groq or OpenRouter)
or a paid one (Claude, OpenAI).

It runs entirely in the browser and is hosted free on GitHub Pages: no server and no database.
All data stays in your browser.

## Features

**Exam engine (CD-IELTS look and feel)**
- **Listening:** 4 parts and 40 questions. The recording plays once only (no pause or rewind), with a volume slider, a sound check and 2 minutes of checking time. It uses uploaded audio, or reads the script aloud with a different voice per speaker.
- **Reading:** a split screen with a draggable divider. Right-click the passage to **highlight** text or **add a note**. Academic and General Training use separate band tables.
- **Writing:** Task 1 (charts drawn from data, process diagrams, maps, or a letter) and Task 2. Live word count, spell-check and autocorrect disabled, autosave every 10 seconds.
- **Speaking:** mic check with a level meter, an AI examiner voice, Parts 1–3, a Part 2 cue card with 1 minute of prep and a scratchpad, recording per answer, live transcription, and detection of pauses and filler words.
- **Navigation and display:** a question navigator (answered and flagged states), review flags, a timer you can hide, text size and contrast modes (yellow on black, white on black).
- **Integrity and resume:** auto-submit when time runs out, tab-switch warnings that are recorded, and resume after refresh (deadlines are stored, not counted down in memory).

**Marking**
- **Listening and Reading:** answers are compared ignoring case, punctuation and spacing. British/American spellings (`colour`/`color`), times (`10 am` / `10:00am`), dates, numbers written as words, and optional words (`(the) library`) are all accepted. Word limits are enforced.
- **Band conversion:** raw scores convert to bands with the official tables. Overall band rounding follows IELTS rules (.25 rounds up to .5, .75 rounds up to the next whole band).
- **Writing (AI examiner):** a band for each criterion (TA/TR, CC, LR, GRA), annotations on the candidate's own text, strengths, next steps, and a **Band 8.5+ model answer** built on the candidate's ideas. Task 2 counts double.
- **Speaking (AI examiner):** each criterion is marked from the transcripts plus measured speech rate, pauses and fillers. Notes are attached to the transcript, and recordings can be played back.

**Platform**
- **Dashboard:** progress charts for all 4 skills, a skill radar, weak areas (by question type and criterion), and a day streak.
- **Full review of past tests:** reopen any finished Listening or Reading module exactly as you sat it (passage, your highlights, the transcript) with every answer marked, or switch to a compact answer sheet: your answer, the correct answer and the explanation for each question. Click a wrong-question chip to jump straight to it.
- **Mistakes notebook:** every wrong answer from every test in one place, filterable by module and question type, with your most frequent mistake type, the explanation, a link back to the question in context, and **Retry this part**. Writing and Speaking corrections from the AI are collected there too.
- **Spaced review & vocabulary** — mark each mistake “Got it” and it returns after 1, 3 and 7 days until mastered; a Vocabulary tab collects the AI’s better-word suggestions plus your own words. Focus areas open the exact part with most questions of your weak type, and skill bands come from full mocks (practice is shown as an estimate).
- **History filters:** by mode (full mock or practice) and by module, with right/total counts per attempt.
- **Dark theme:** Light, Dark or System, from the sidebar.
- **Modes:** full mock (all modules in a row) or practice per module or part, timed or untimed, with instant answer checking and explanations.
- **Test Report Form:** printable to PDF, in the official style.
- **Examiner mode:** override any AI criterion band and leave feedback; the candidate's scores update.
- **Admin:** a test builder for every question type, audio and image upload, a bulk **CSV question importer**, a raw JSON editor, publishing checks, JSON import and export, analytics (hardest questions), and editable rubric prompts.
- **Backup:** back up and restore everything to a JSON file.

**Seed content:** 1 complete Academic test, 1 complete General Training test, and 3 Academic Task 1 practice packs. All content is original.

## AI marking setup

Open **Settings → AI marking**, pick a provider, paste a key, then click **Test connection**.

| Provider | Cost | Notes |
|---|---|---|
| **Google Gemini** (recommended) | Free tier | Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Very good marking; daily limits apply. |
| **Groq** | Free tier | Get a key at [console.groq.com/keys](https://console.groq.com/keys). Very fast open models (default `openai/gpt-oss-120b`). |
| **OpenRouter** | Free `:free` models | Get a key at [openrouter.ai/keys](https://openrouter.ai/keys). About 50 free requests a day. |
| **Anthropic Claude** | Paid (~$0.005–0.18 per full test) | The most accurate examiner. Default `claude-opus-5-5`; `claude-haiku-5-5` is the cheapest. |
| **OpenAI** | Paid | — |

Keys are stored only in your browser and are sent only to the provider you picked. Each provider's key is remembered, so if one free tier hits its daily limit you can switch to another.
Leave **Model** empty to get the recommended default, or click **Load** to choose from the models your key can use.
Without a key, Listening and Reading are still fully marked, and Writing and Speaking wait with a **Mark now** button.

Use **Chrome or Edge** for Speaking: live transcription relies on the Web Speech API.

## Development

```bash
npm install
npm run dev        # http://localhost:5173/ielts-mock-platform/
npm test           # scoring, CSV and seed-content checks
npm run build
```

Stack: Vite, React 19, TypeScript, Tailwind CSS 4, Motion, Recharts, and lucide icons.

## Deploy

Every push to `main` runs the tests, builds the app and deploys it to GitHub Pages
(`.github/workflows/deploy.yml`). In the repository, go to **Settings → Pages → Source** and select **GitHub Actions**.

## Project layout

```
src/
  lib/          types, scoring (+ tests), store, media (IndexedDB), claude, speech, attempts, analytics, csv
  data/seed/    original test content + integrity tests
  exam/         exam runner: chrome, passage, question renderer, 4 modules
  pages/        dashboard, tests, results, TRF, history, examiner, admin, test editor, settings
  components/   UI kit, rich content renderer, Task 1 charts
```

## Limits

- Data lives in one browser. Use **Settings → Download backup** to move it, and recordings stay on the device where they were made.
- There are no user accounts. Student, examiner and admin are pages of the same app, built for self-study or a single teacher. Multi-user use would need a backend.
- The pronunciation band is estimated from recognition quality and fluency, because the AI reads transcripts rather than listening to the audio.
- Free AI tiers have daily limits that the providers change from time to time. Free models also mark less consistently than Claude.
