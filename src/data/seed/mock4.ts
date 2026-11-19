import type { ReadingSection, ListeningSection, Test } from '../../lib/types'

// Original seed content written for this app — not taken from any published IELTS test.
// voices: NARRATOR=m, WOMAN=f, MAN=m, SARAH=f, DAVID=m

const TFNG_INSTRUCTIONS = `Do the following statements agree with the information given in the text?

Write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this`

const townMap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" font-family="Arial, Helvetica, sans-serif">
  <rect x="0" y="0" width="600" height="400" fill="#ffffff"/>
  <text x="20" y="16" font-size="13" font-weight="bold" fill="#222">Ashbury town centre</text>
  <rect x="285" y="55" width="30" height="310" fill="#e6e6e6"/>
  <text x="300" y="330" text-anchor="middle" font-size="10" fill="#555" transform="rotate(-90 300 330)">Station Road</text>
  <rect x="20" y="185" width="560" height="30" fill="#e6e6e6"/>
  <text x="80" y="204" font-size="11" fill="#555">High Street</text>
  <rect x="230" y="22" width="140" height="33" rx="4" fill="#f2f2f2" stroke="#999"/>
  <text x="300" y="43" text-anchor="middle" font-size="11" fill="#333">Railway station</text>
  <rect x="50" y="70" width="160" height="80" rx="4" fill="#f4efe4" stroke="#b9a77d"/>
  <text x="130" y="114" text-anchor="middle" font-size="12" fill="#5b4a22">Library</text>
  <rect x="380" y="65" width="180" height="50" rx="4" fill="#f4efe4" stroke="#b9a77d"/>
  <text x="470" y="94" text-anchor="middle" font-size="12" fill="#5b4a22">Supermarket</text>
  <rect x="380" y="125" width="180" height="53" fill="#f2f2f2" stroke="#999" stroke-dasharray="4 3"/>
  <text x="440" y="155" text-anchor="middle" font-size="11" fill="#444">Car park</text>
  <rect x="30" y="235" width="140" height="75" rx="4" fill="#f4efe4" stroke="#b9a77d"/>
  <text x="100" y="276" text-anchor="middle" font-size="12" fill="#5b4a22">Leisure centre</text>
  <rect x="180" y="230" width="90" height="70" fill="#fbf7ee" stroke="#c9b98f"/>
  <text x="225" y="245" text-anchor="middle" font-size="10" fill="#5b4a22">Market Square</text>
  <circle cx="225" cy="285" r="8" fill="#d6ebf8" stroke="#7aa9c9"/>
  <rect x="370" y="235" width="200" height="120" rx="10" fill="#e3efd9" stroke="#7d9c63"/>
  <text x="470" y="300" text-anchor="middle" font-size="12" fill="#3f5a2b">Victoria Park</text>
  <rect x="245" y="365" width="110" height="30" rx="4" fill="#f2f2f2" stroke="#999"/>
  <text x="300" y="384" text-anchor="middle" font-size="11" font-weight="bold" fill="#222">TOWN HALL</text>
  <text x="365" y="384" font-size="10" fill="#777">(you are here)</text>
  <g font-size="14" font-weight="bold" text-anchor="middle" fill="#111">
    <circle cx="130" cy="168" r="13" fill="#fff" stroke="#111" stroke-width="2"/><text x="130" y="173">A</text>
    <circle cx="247" cy="110" r="13" fill="#fff" stroke="#111" stroke-width="2"/><text x="247" y="115">B</text>
    <circle cx="395" cy="40" r="13" fill="#fff" stroke="#111" stroke-width="2"/><text x="395" y="45">C</text>
    <circle cx="535" cy="160" r="13" fill="#fff" stroke="#111" stroke-width="2"/><text x="535" y="165">D</text>
    <circle cx="540" cy="258" r="13" fill="#fff" stroke="#111" stroke-width="2"/><text x="540" y="263">E</text>
    <circle cx="225" cy="267" r="11" fill="#fff" stroke="#111" stroke-width="2"/><text x="225" y="272">F</text>
    <circle cx="100" cy="340" r="13" fill="#fff" stroke="#111" stroke-width="2"/><text x="100" y="345">G</text>
    <circle cx="395" cy="335" r="13" fill="#fff" stroke="#111" stroke-width="2"/><text x="395" y="340">H</text>
  </g>
</svg>`

const letters = (n: number) => 'ABCDEFGHIJ'.slice(0, n).split('').map(k => ({ key: k, text: k }))

const listening: ListeningSection[] = [
  // ---------------------------------------------------------------- Part 1
  {
    id: 'm4-l-s1',
    title: 'Part 1',
    context: 'You will hear a man talking to an assistant at the lost property office of a bus station.',
    transcript: `NARRATOR: Part One. You will hear a man talking to an assistant at the lost property office of a bus station. First you have some time to look at questions 1 to 5.
NARRATOR: Now listen carefully and answer questions 1 to 5.
WOMAN: Good afternoon, Kingsgate Bus Station, lost property. How can I help?
MAN: Hi. I left a bag on one of your buses earlier this week, and I was hoping someone might have handed it in.
WOMAN: Oh dear. Well, let me fill in a report form first, and then I can check it against everything that's come in. Can I take your name?
MAN: Yes, it's Martin Holloway.
WOMAN: Is that H-O-L-L-O-W-A-Y?
MAN: That's right, with two Ls in the middle. People sometimes put an E near the end, but it's just A-Y.
WOMAN: Thank you. And a phone number, so we can contact you if it turns up?
MAN: My mobile's best. It's 07854 293 618.
WOMAN: 07854 293 680?
MAN: No, sorry, the end is six one eight. 618.
WOMAN: Got it. So, when did you lose the bag?
MAN: It was on Monday. Oh, no, I tell a lie. On Monday I was working from home. It was Tuesday, the 11th of November.
WOMAN: The 11th of November. And which route were you on?
MAN: I normally get the 47 into town, but that morning it was cancelled, so I took the 74 instead. It goes the long way round, past the hospital.
WOMAN: The 74. And can you tell me what kind of bag it was? A handbag, a briefcase?
MAN: It's a rucksack. A backpack, I suppose some people would call it. Medium-sized.
NARRATOR: Before you hear the rest of the conversation, you have some time to look at questions 6 to 10.
NARRATOR: Now listen and answer questions 6 to 10.
WOMAN: What colour is it?
MAN: Everybody thinks it's black when they first see it, but it's actually a very dark green.
WOMAN: Dark green. Is there anything that would help us to recognise it? A name tag, perhaps?
MAN: There's no name tag, unfortunately. My daughter stuck a sticker of a cat on the front, but I think that fell off months ago. The main thing is there's a small torch clipped onto one of the zips.
WOMAN: A torch on the zip, that's useful. And what was inside?
MAN: Well, luckily my wallet and keys were in my coat pocket. In the bag there's a waterproof jacket, my reading glasses, and a library book. That's actually what I'm most worried about, because it's already overdue.
WOMAN: I see. Where on the bus were you sitting?
MAN: Near the front. I didn't want it on the seat next to me, so I put it up on the luggage rack above my head, and of course when I got off I completely forgot about it.
WOMAN: That happens a lot, I'm afraid. Now, if it's found, we keep items for three months. You can collect it from this office in person, and that's free of charge.
MAN: The problem is I work long hours, and the office closes at five, doesn't it?
WOMAN: It does. In that case, we can send it to you. A courier costs twelve pounds and gets it to you the next day, or standard post is six pounds fifty, which takes three to five days.
MAN: Standard post is fine. There's no rush.
WOMAN: OK, I'll make a note of that. We'll call you as soon as we hear anything.
MAN: Thanks very much.
NARRATOR: That is the end of Part One.`,
    groups: [
      {
        id: 'm4-l-g1',
        type: 'completion',
        instructions: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        maxWords: 2,
        allowNumber: true,
        title: 'Lost property report',
        content: `## Kingsgate Bus Station — Lost Property Report
| Name | Martin {{1}} |
| Mobile number | {{2}} |
| Date of journey | {{3}} |
| Bus route number | {{4}} |
## Description of item
- Type of bag: {{5}}
- Colour: dark {{6}}
- Distinguishing feature: a small {{7}} attached to a zip
- Contents: waterproof jacket, reading glasses, a {{8}}
- Left on the {{9}} near the front of the bus
- Cost of returning the item by standard post: £{{10}}`,
        questions: [
          { id: 'm4-l-q1', number: 1, prompt: '', answer: ['Holloway'], explanation: 'MAN: "with two Ls in the middle. People sometimes put an E near the end, but it\'s just A-Y."' },
          { id: 'm4-l-q2', number: 2, prompt: '', answer: ['07854293618', '07854 293 618'], explanation: 'MAN: "No, sorry, the end is six one eight. 618." (Not 680.)' },
          { id: 'm4-l-q3', number: 3, prompt: '', answer: ['11 November', '11th November', 'November 11', 'November 11th', '11/11'], explanation: 'MAN: "It was Tuesday, the 11th of November." (He first said Monday, then corrected himself.)' },
          { id: 'm4-l-q4', number: 4, prompt: '', answer: ['74', 'seventy-four'], explanation: 'MAN: "I normally get the 47 ... but that morning it was cancelled, so I took the 74 instead."' },
          { id: 'm4-l-q5', number: 5, prompt: '', answer: ['rucksack', 'backpack', '(a) rucksack', '(a) backpack'], explanation: 'MAN: "It\'s a rucksack. A backpack, I suppose some people would call it."' },
          { id: 'm4-l-q6', number: 6, prompt: '', answer: ['green'], explanation: 'MAN: "Everybody thinks it\'s black ... but it\'s actually a very dark green."' },
          { id: 'm4-l-q7', number: 7, prompt: '', answer: ['torch'], explanation: 'MAN: "there\'s a small torch clipped onto one of the zips." (The cat sticker fell off; there is no name tag.)' },
          { id: 'm4-l-q8', number: 8, prompt: '', answer: ['library book'], explanation: 'MAN: "a waterproof jacket, my reading glasses, and a library book." (The wallet was in his pocket.)' },
          { id: 'm4-l-q9', number: 9, prompt: '', answer: ['luggage rack', 'rack'], explanation: 'MAN: "I put it up on the luggage rack above my head".' },
          { id: 'm4-l-q10', number: 10, prompt: '', answer: ['6.50'], explanation: 'WOMAN: "standard post is six pounds fifty" (a courier costs £12; collecting in person is free).' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 2
  {
    id: 'm4-l-s2',
    title: 'Part 2',
    context: 'You will hear a council officer talking to residents at a public meeting about a new recycling scheme in the town of Ashbury.',
    transcript: `NARRATOR: Part Two. You will hear a council officer talking to residents at a public meeting about a new recycling scheme in the town of Ashbury. First you have some time to look at questions 11 to 15.
NARRATOR: Now listen carefully and answer questions 11 to 15.
MAN: Good evening, everyone, and thanks for coming out on such a wet night. My name's Graham Pike, and I'm the waste and recycling officer at Ashbury Council. I'm going to explain the changes to household collections that start next month, and then I'll show you where the new collection points in the town centre are.
MAN: Let's start with the bins outside your homes. At the moment your black bin, for general waste, is emptied every week. Some councils have gone over to collecting general waste every three weeks, and we did look at that, but we felt it was too big a jump. So from next month your black bin will be emptied every two weeks, and your blue recycling bin will be collected every week instead.
MAN: Next, food waste. Every household is getting a small grey caddy to keep in the kitchen. Our first leaflet said you should line the caddy with compostable bags, and I know some of you have already bought them. Unfortunately, the plant that processes our food waste has since told us it can't break those bags down quickly enough. So please, just wrap your scraps in newspaper. And of course, no ordinary plastic bags at all.
MAN: Now, the blue bin. Tins, cans and plastic bottles have always gone in, as you know. Plastic film, so things like crisp packets and cling film, still can't be accepted, I'm afraid. But the good news is that you can now put in juice and milk cartons, which we've never been able to take before. We've found a company that can separate the layers of card and foil.
MAN: Some larger households have told us that one blue bin isn't enough. If that's you, you can have a second one free of charge. Please don't phone the council about this, the switchboard is overloaded as it is, and there's no need to write to your local councillor either. Just fill in the short request form on the council website, and the bin will be delivered within ten days.
MAN: And I know there have been rumours about fines, so let me be clear. Nobody is going to be fined straight away. If our crews find the wrong things in your bin, they'll attach a tag to it, and you'll be sent a letter explaining the rules. Only if the problem carries on after that would a fine even be considered.
NARRATOR: Now look at questions 16 to 20.
NARRATOR: Now listen and answer questions 16 to 20.
MAN: Right. Some things can't go in your bins at home, so we've set up collection points around the town centre. If you look at the map on the screen, we're here at the Town Hall, at the bottom of Station Road.
MAN: First, glass. Bottles and jars still don't go in the blue bin, they go to a bottle bank. There used to be one outside the library, between the library and the High Street, but the neighbours complained about the noise, so it's been removed. The new bottle bank is in the supermarket car park, in the corner nearest the High Street, at the end furthest from Station Road.
MAN: Next, clothes and shoes. The textile bank is right beside the railway station. Walk up Station Road to the top and you'll find it on the side of the station nearest the supermarket.
MAN: For batteries, we'd planned to put a collection bin inside the library, but the fire safety officer wasn't happy with that. So instead, the battery point is in the Market Square, right next to the fountain.
MAN: Small electrical items, things like old kettles, toasters and phone chargers, can be taken to the leisure centre. The drop-off point isn't at the front entrance, though. It's round the back of the building, on the side furthest from the High Street.
MAN: And finally, garden waste. There's a large skip for grass cuttings and branches in Victoria Park. It isn't up by the tennis courts in the far corner. It's in the corner of the park nearest to us here at the Town Hall, so it's very easy to reach.
MAN: Right, I'll take questions now.
NARRATOR: That is the end of Part Two.`,
    groups: [
      {
        id: 'm4-l-g2',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B or C.',
        questions: [
          {
            id: 'm4-l-q11', number: 11, prompt: 'Under the new scheme, general waste will be collected',
            options: [{ key: 'A', text: 'every week.' }, { key: 'B', text: 'every two weeks.' }, { key: 'C', text: 'every three weeks.' }],
            answer: ['B'], explanation: 'MAN: "from next month your black bin will be emptied every two weeks" (three-weekly was considered but rejected).',
          },
          {
            id: 'm4-l-q12', number: 12, prompt: 'Residents are asked to wrap food waste in',
            options: [{ key: 'A', text: 'newspaper.' }, { key: 'B', text: 'compostable bags.' }, { key: 'C', text: 'plastic bags.' }],
            answer: ['A'], explanation: 'MAN: "the plant ... can\'t break those bags down quickly enough. So please, just wrap your scraps in newspaper."',
          },
          {
            id: 'm4-l-q13', number: 13, prompt: 'What can residents put in the blue bin for the first time?',
            options: [{ key: 'A', text: 'plastic film' }, { key: 'B', text: 'food tins' }, { key: 'C', text: 'drinks cartons' }],
            answer: ['C'], explanation: 'MAN: "you can now put in juice and milk cartons, which we\'ve never been able to take before." Tins always went in; film still can\'t.',
          },
          {
            id: 'm4-l-q14', number: 14, prompt: 'Residents who need an extra recycling bin should',
            options: [{ key: 'A', text: 'complete a form online.' }, { key: 'B', text: 'telephone the council.' }, { key: 'C', text: 'contact their local councillor.' }],
            answer: ['A'], explanation: 'MAN: "Just fill in the short request form on the council website".',
          },
          {
            id: 'm4-l-q15', number: 15, prompt: 'What does the speaker say about fines?',
            options: [{ key: 'A', text: 'They will be introduced when the scheme starts.' }, { key: 'B', text: 'Households will receive a letter before any fine.' }, { key: 'C', text: 'The council has decided not to use them.' }],
            answer: ['B'], explanation: 'MAN: "Nobody is going to be fined straight away ... you\'ll be sent a letter explaining the rules. Only if the problem carries on after that would a fine even be considered."',
          },
        ],
      },
      {
        id: 'm4-l-g3',
        type: 'matching',
        instructions: 'Label the map below. Write the correct letter, A–H, next to Questions 16–20.',
        title: 'Ashbury town centre: recycling collection points',
        svg: townMap,
        options: letters(8),
        questions: [
          { id: 'm4-l-q16', number: 16, prompt: 'Bottle bank', answer: ['D'], explanation: 'MAN: "in the supermarket car park, in the corner nearest the High Street, at the end furthest from Station Road." (A, outside the library, was the old site.)' },
          { id: 'm4-l-q17', number: 17, prompt: 'Textile bank', answer: ['C'], explanation: 'MAN: "right beside the railway station ... on the side of the station nearest the supermarket."' },
          { id: 'm4-l-q18', number: 18, prompt: 'Battery collection point', answer: ['F'], explanation: 'MAN: "the battery point is in the Market Square, right next to the fountain." (The library was rejected.)' },
          { id: 'm4-l-q19', number: 19, prompt: 'Small electrical items', answer: ['G'], explanation: 'MAN: "round the back of the building, on the side furthest from the High Street."' },
          { id: 'm4-l-q20', number: 20, prompt: 'Garden waste skip', answer: ['H'], explanation: 'MAN: "It isn\'t up by the tennis courts in the far corner. It\'s in the corner of the park nearest to us here at the Town Hall".' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 3
  {
    id: 'm4-l-s3',
    title: 'Part 3',
    context: 'You will hear two colleagues, Sarah and David, planning a training day for the staff at their company.',
    transcript: `NARRATOR: Part Three. You will hear two colleagues, Sarah and David, planning a training day for the staff at their company. First you have some time to look at questions 21 to 26.
NARRATOR: Now listen carefully and answer questions 21 to 26.
SARAH: Hi David. Have you got a few minutes to go through the plans for the staff training day?
DAVID: Sure. I've been reading the feedback from last year's event, actually, so we don't make the same mistakes again.
SARAH: Good idea. What did people say?
DAVID: Well, I was expecting complaints about the location, because the hotel was forty minutes out of town, but hardly anyone mentioned it. The coach was comfortable, apparently.
SARAH: I thought the speakers might have been a problem, but there were only two of them, and people seemed to like both.
DAVID: That's right. The thing that came up again and again was that the sessions went on far too long. The spreadsheet session lasted over two hours without a break.
SARAH: I remember that. I was falling asleep. What else?
DAVID: Lunch. Lots of people said the food was poor. It was just cold sandwiches, and there was almost nothing for the vegetarians.
SARAH: Right, we'll definitely sort out both of those. Did anyone say they didn't have time to ask questions?
DAVID: No, that was fine. There was a question time at the end of every session.
SARAH: OK. So, where shall we hold it this year? The hotel has put its prices up by thirty per cent.
DAVID: We could just use our own building. The conference room upstairs is big enough.
SARAH: In theory, yes. But in my experience, when training's held in the office, people keep slipping back to their desks to check their emails.
DAVID: True. What about the Riverside Community Centre? It's only ten minutes' walk away, the main hall holds a hundred people, and it's much cheaper than the hotel.
SARAH: Let's go for that. I'll ring them this afternoon.
DAVID: And what day of the week?
SARAH: Last year it was a Friday, and by three o'clock half the room was looking at the clock.
DAVID: And Monday's our busiest day for customer calls, so that's out.
SARAH: So, Wednesday, then? Right in the middle of the week.
DAVID: Wednesday it is.
SARAH: Now, for the customer service session, I thought Jenny, one of our team leaders, could run it. She's brilliant at it.
DAVID: She is, and she'd do it for nothing, so it's not about the money. But I really think we should bring in someone from outside. When it's a colleague talking, people tend to think "I've heard all this before". An outside trainer gets more attention, and people take the message more seriously.
SARAH: Fair enough. Jenny's very busy at the moment anyway, but that's not the main reason. OK, an external trainer.
DAVID: And how are we going to collect feedback this time?
SARAH: Last year we gave out paper forms at the end of the day.
DAVID: Which people filled in in about thirty seconds while they were putting their coats on.
SARAH: An online survey the following week, then?
DAVID: The response rate for those is always terrible. What about finishing the day with a short discussion in small groups, with someone in each group taking notes? People say much more when they're talking than when they're writing.
SARAH: I like that. Let's do it.
NARRATOR: Before you hear the rest of the discussion, you have some time to look at questions 27 to 30.
NARRATOR: Now listen and answer questions 27 to 30.
SARAH: Now, the individual sessions. The health and safety update first.
DAVID: It's the same every year, and people find it very dull. Why don't we record it as a short video that everyone watches at their desk the week before? That would free up an hour on the day.
SARAH: Great, we'll replace it with a video. Next, the demonstration of the new booking system. Should we shorten it?
DAVID: I don't think we can, it's quite complicated. But last year's plan had it straight after lunch, when everyone's sleepy. Let's move it to the morning, when people are more alert.
SARAH: Good. Then the team-building activity. I'd wondered about combining it with the customer service session, but that might be too much at once.
DAVID: Agreed, let's keep them separate. But why not take it outside? The community centre's right next to the park, and if it's dry, people would enjoy being out in the fresh air.
SARAH: Lovely. And finally, the wellbeing talk.
DAVID: Some people really value it, but others feel it's a bit personal. I don't think we should force anyone to attend.
SARAH: So we'll make it optional. Anyone who'd rather not go can use the quiet room to catch up on some reading.
DAVID: Perfect. I think that's everything.
NARRATOR: That is the end of Part Three.`,
    groups: [
      {
        id: 'm4-l-g4',
        type: 'mcq_multi',
        instructions: 'Choose TWO letters, A–E.',
        content: 'Which TWO problems with last year\'s training day were mentioned most in the feedback?',
        options: [
          { key: 'A', text: 'The venue was too far away.' },
          { key: 'B', text: 'The sessions were too long.' },
          { key: 'C', text: 'There were too many speakers.' },
          { key: 'D', text: 'The food was poor.' },
          { key: 'E', text: 'There was no time for questions.' },
        ],
        questions: [
          { id: 'm4-l-q21', number: 21, prompt: '', answer: ['B'], explanation: 'DAVID: "The thing that came up again and again was that the sessions went on far too long."' },
          { id: 'm4-l-q22', number: 22, prompt: '', answer: ['D'], explanation: 'DAVID: "Lots of people said the food was poor." (Location, speakers and questions were not problems.)' },
        ],
      },
      {
        id: 'm4-l-g5',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B or C.',
        questions: [
          {
            id: 'm4-l-q23', number: 23, prompt: 'Where will the training day be held?',
            options: [{ key: 'A', text: 'in the company\'s own building' }, { key: 'B', text: 'at a hotel' }, { key: 'C', text: 'at a community centre' }],
            answer: ['C'], explanation: 'DAVID suggests the Riverside Community Centre; SARAH: "Let\'s go for that." The hotel is too expensive and staff in the office go back to their desks.',
          },
          {
            id: 'm4-l-q24', number: 24, prompt: 'On which day will the training take place?',
            options: [{ key: 'A', text: 'Monday' }, { key: 'B', text: 'Wednesday' }, { key: 'C', text: 'Friday' }],
            answer: ['B'], explanation: 'DAVID: "Wednesday it is." Friday people watch the clock; Monday is the busiest day for calls.',
          },
          {
            id: 'm4-l-q25', number: 25, prompt: 'Why does David want an external trainer for the customer service session?',
            options: [{ key: 'A', text: 'Staff will take the session more seriously.' }, { key: 'B', text: 'Jenny does not have enough time.' }, { key: 'C', text: 'It will cost less.' }],
            answer: ['A'], explanation: 'DAVID: "An outside trainer gets more attention, and people take the message more seriously." Money is "not about the money"; Jenny being busy is "not the main reason".',
          },
          {
            id: 'm4-l-q26', number: 26, prompt: 'How will they collect feedback this year?',
            options: [{ key: 'A', text: 'paper forms at the end of the day' }, { key: 'B', text: 'an online survey the following week' }, { key: 'C', text: 'group discussions at the end of the day' }],
            answer: ['C'], explanation: 'DAVID: "finishing the day with a short discussion in small groups" — SARAH: "Let\'s do it."',
          },
        ],
      },
      {
        id: 'm4-l-g6',
        type: 'matching',
        instructions: 'What do Sarah and David decide to do about each session? Choose FOUR answers from the box and write the correct letter, A–F, next to Questions 27–30.',
        options: [
          { key: 'A', text: 'make it optional' },
          { key: 'B', text: 'move it to the morning' },
          { key: 'C', text: 'shorten it' },
          { key: 'D', text: 'hold it outdoors' },
          { key: 'E', text: 'combine it with another session' },
          { key: 'F', text: 'replace it with a video' },
        ],
        questions: [
          { id: 'm4-l-q27', number: 27, prompt: 'Health and safety update', answer: ['F'], explanation: 'SARAH: "we\'ll replace it with a video."' },
          { id: 'm4-l-q28', number: 28, prompt: 'Booking system demonstration', answer: ['B'], explanation: 'DAVID: "Let\'s move it to the morning" — it cannot be shortened because it is complicated.' },
          { id: 'm4-l-q29', number: 29, prompt: 'Team-building activity', answer: ['D'], explanation: 'DAVID: "why not take it outside? ... people would enjoy being out in the fresh air." Combining it was rejected.' },
          { id: 'm4-l-q30', number: 30, prompt: 'Wellbeing talk', answer: ['A'], explanation: 'SARAH: "So we\'ll make it optional."' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 4
  {
    id: 'm4-l-s4',
    title: 'Part 4',
    context: 'You will hear a lecture in a social history course about the history of public libraries.',
    transcript: `NARRATOR: Part Four. You will hear a lecture in a social history course about the history of public libraries. First you have some time to look at questions 31 to 40.
NARRATOR: Now listen carefully and answer questions 31 to 40.
WOMAN: Good afternoon. Continuing our series on the history of everyday institutions, today I want to look at the public library, an idea we now take so much for granted that it's easy to forget how recent, and how radical, it actually was.
WOMAN: Libraries themselves are, of course, very old. The great library of Alexandria in Egypt is the famous example, but it's worth remembering that it was never open to ordinary people. Not even wealthy merchants could simply walk in. Its collections were there for scholars, many of whom were invited to the city and paid by its rulers.
WOMAN: In medieval Europe, books were copied by hand, which made them extremely valuable. Most were kept in monasteries, and in some libraries the books were actually attached to the shelves or reading desks with chains, so that nobody could carry them away.
WOMAN: From the late seventeenth century, a new kind of library appeared: the subscription library. Members paid a fee every year, and the money was used to buy books that all the members could share. We often imagine these were only for the rich, and many of them were, but some were set up by groups of skilled workers who pooled their money.
WOMAN: Alongside these there were circulating libraries, which were usually run by booksellers as a business. They lent books for a small charge, and although they stocked some history and travel writing, most of what people actually borrowed was novels. This worried a number of critics, who believed novels were a bad influence, especially on young readers.
WOMAN: The real turning point came in the middle of the nineteenth century. In Britain, a law passed in 1850 allowed towns to pay for libraries out of local taxes. At first the amount they were allowed to raise was tiny, and a town had to hold a vote before opening a library, so progress was slow.
WOMAN: What really sped things up was private money. Andrew Carnegie, who had made an enormous fortune in the steel industry in the United States, paid for more than two and a half thousand library buildings around the world. There was a condition, though. The town had to provide the land and promise to pay for the books and the staff.
WOMAN: If you had walked into one of these early public libraries, you would have found it very different from a library today. You couldn't go to the shelves yourself. You looked up the book in a catalogue, filled in a slip, and handed it to a librarian, who went and fetched it for you. This system was known as closed access, and it was mainly intended to prevent theft. Open shelves only became normal in the early twentieth century.
WOMAN: Interestingly, the busiest room in many libraries was not the lending department at all, but the newsroom, where people came to read newspapers. For unemployed men in particular, the job advertisements were a vital resource, and some libraries even blacked out the horse-racing results to discourage gambling.
WOMAN: Children, on the other hand, were often not welcome. Many libraries set a minimum age of fourteen, partly because librarians assumed that children would be noisy and disturb the serious readers. Separate children's rooms only became common later.
WOMAN: Finally, a word about today. Libraries have faced serious budget cuts, and some have closed. But many have reinvented themselves. They offer free internet access, help with job applications, and space for clubs and classes, and a lot of them now describe themselves as community hubs rather than simply places to borrow books.
WOMAN: Next week we'll look at the history of the post office.
NARRATOR: That is the end of Part Four.`,
    groups: [
      {
        id: 'm4-l-g7',
        type: 'completion',
        instructions: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
        maxWords: 1,
        title: 'The history of public libraries',
        content: `## Early libraries
- The library of Alexandria was used only by {{31}}
- In medieval libraries, books were sometimes fixed to shelves with {{32}}
## 17th–19th centuries
- Subscription libraries: members paid a yearly {{33}} to buy shared books
- Circulating libraries, run by booksellers, mostly lent {{34}}
- An 1850 law allowed towns to fund libraries from local {{35}}
- Andrew Carnegie, who made his fortune in {{36}}, paid for over 2,500 buildings
## Early public libraries
- Closed access: readers asked a {{37}} to fetch books
- The newsroom was popular for reading {{38}}
- Children were often excluded because they were expected to be {{39}}
## Today
- Many libraries now describe themselves as community {{40}}`,
        questions: [
          { id: 'm4-l-q31', number: 31, prompt: '', answer: ['scholars'], explanation: 'WOMAN: "Its collections were there for scholars". Not even wealthy merchants could walk in.' },
          { id: 'm4-l-q32', number: 32, prompt: '', answer: ['chains'], explanation: 'WOMAN: "the books were actually attached to the shelves or reading desks with chains".' },
          { id: 'm4-l-q33', number: 33, prompt: '', answer: ['fee'], explanation: 'WOMAN: "Members paid a fee every year".' },
          { id: 'm4-l-q34', number: 34, prompt: '', answer: ['novels'], explanation: 'WOMAN: "most of what people actually borrowed was novels."' },
          { id: 'm4-l-q35', number: 35, prompt: '', answer: ['taxes'], explanation: 'WOMAN: "allowed towns to pay for libraries out of local taxes."' },
          { id: 'm4-l-q36', number: 36, prompt: '', answer: ['steel'], explanation: 'WOMAN: "who had made an enormous fortune in the steel industry".' },
          { id: 'm4-l-q37', number: 37, prompt: '', answer: ['librarian'], explanation: 'WOMAN: "handed it to a librarian, who went and fetched it for you."' },
          { id: 'm4-l-q38', number: 38, prompt: '', answer: ['newspapers'], explanation: 'WOMAN: "the newsroom, where people came to read newspapers."' },
          { id: 'm4-l-q39', number: 39, prompt: '', answer: ['noisy'], explanation: 'WOMAN: "librarians assumed that children would be noisy and disturb the serious readers."' },
          { id: 'm4-l-q40', number: 40, prompt: '', answer: ['hubs'], explanation: 'WOMAN: "a lot of them now describe themselves as community hubs".' },
        ],
      },
    ],
  },
]

const reading: ReadingSection[] = [
  // ---------------------------------------------------------------- Section 1
  {
    id: 'm4-r-s1',
    title: 'Section 1',
    passageTitle: 'Evening classes at Hallam Adult Learning Centre / Lindford Leisure Centre: swimming pool timetable',
    passage: `## Evening classes at Hallam Adult Learning Centre

A| Spanish for Travellers
Planning a trip to Spain or Latin America? This ten-week course concentrates on the language you will need for hotels, restaurants and getting around. Please note that this is not a course for absolute beginners: you should already be able to hold a simple conversation in Spanish. Tuesdays, 7–9 pm. Fee: £120, including all printed materials.

B| Thai Street Food
Learn to cook six classic dishes from the markets of Bangkok with our experienced chef. All ingredients are included in the £150 fee, and at the end of each session the group sits down together to eat what they have cooked. Containers are provided if you would like to take any leftovers home. Wednesdays, 6.30–9 pm, for six weeks.

C| Bookkeeping for Small Businesses
Ideal for anyone running, or thinking of starting, their own business. Over twelve weeks you will learn to keep accurate accounts, prepare invoices and manage cash flow. Learners who pass the final assessment receive a nationally recognised Level 2 certificate. Mondays, 6–8.30 pm. Fee: £210. Tea and coffee are available from the machine in the main foyer.

D| Upcycling Old Furniture
Give tired furniture a new life. You will learn how to strip, repair, paint and decorate wooden pieces. Please bring along a small item of furniture to work on, such as a chair, a stool or a bedside table. All tools, brushes and paints are provided. Thursdays, 7–9.30 pm, for eight weeks. Fee: £135.

E| Smartphone Photography
Take better pictures with the phone you already own. Because much of the course involves shooting outdoors, sessions meet at the café in the Botanic Gardens rather than at the Learning Centre. Sign up with a friend and you will each receive 15% off the £90 fee. Thursdays, 6–8 pm, for five weeks in the summer term, while evenings are still light.

F| Creative Writing
Whether you dream of writing a novel or simply want to record family memories, this friendly group will help you find your voice. Complete beginners are very welcome. The £180 fee may be spread over three equal monthly payments if you prefer. Wednesdays, 7–9 pm, for ten weeks.

## Lindford Leisure Centre: changes to the swimming pool timetable

The following changes will apply from Monday 3 February.

Early-morning swimming will now begin at 6.30 am instead of 7 am, Monday to Friday, following requests from customers who wish to swim before work.

The main pool will be closed every Monday from 9 am to 12 noon for cleaning and routine maintenance.

During lane swimming sessions, the pool will be divided into slow, medium and fast lanes. Please choose the lane that matches your speed and always swim in a clockwise direction.

Family sessions will move from Saturday mornings to Sunday afternoons, 1–4 pm. During these sessions, children under eight must be accompanied in the water by an adult, with no more than two children per adult. Floats and inflatables may be used during family sessions only.

Aqua aerobics classes will continue on Tuesday and Thursday evenings. Because of high demand, an additional class has been added on Fridays at 10 am.

The women-only session will continue on Wednesdays from 8 to 9 pm, with female lifeguards on duty.

The teaching pool will be closed throughout February while its tiles are replaced. During this time, all swimming lessons will take place in the main pool.

All sessions can be booked online up to seven days in advance. Swimming is free for members; non-members pay £5.20 per session.`,
    groups: [
      {
        id: 'm4-r-g1',
        type: 'matching',
        instructions: `Look at the six advertisements for evening classes, A–F.

For which class are the following statements true?

Choose the correct letter, A–F.

NB You may use any letter more than once.`,
        options: [
          { key: 'A', text: 'Spanish for Travellers' },
          { key: 'B', text: 'Thai Street Food' },
          { key: 'C', text: 'Bookkeeping for Small Businesses' },
          { key: 'D', text: 'Upcycling Old Furniture' },
          { key: 'E', text: 'Smartphone Photography' },
          { key: 'F', text: 'Creative Writing' },
        ],
        questions: [
          { id: 'm4-r-q1', number: 1, prompt: 'Students must bring an item that they will repair or decorate.', answer: ['D'], explanation: 'D: "Please bring along a small item of furniture to work on". Tools and paints are provided.' },
          { id: 'm4-r-q2', number: 2, prompt: 'There is a reduction for people who enrol together.', answer: ['E'], explanation: 'E: "Sign up with a friend and you will each receive 15% off".' },
          { id: 'm4-r-q3', number: 3, prompt: 'Successful students can obtain a qualification.', answer: ['C'], explanation: 'C: "Learners who pass the final assessment receive a nationally recognised Level 2 certificate."' },
          { id: 'm4-r-q4', number: 4, prompt: 'The class is held away from the Learning Centre.', answer: ['E'], explanation: 'E: "sessions meet at the café in the Botanic Gardens rather than at the Learning Centre."' },
          { id: 'm4-r-q5', number: 5, prompt: 'A meal is included in the price.', answer: ['B'], explanation: 'B: ingredients are included and "the group sits down together to eat what they have cooked." (C only mentions a coffee machine.)' },
          { id: 'm4-r-q6', number: 6, prompt: 'Some previous knowledge is required.', answer: ['A'], explanation: 'A: "this is not a course for absolute beginners: you should already be able to hold a simple conversation".' },
          { id: 'm4-r-q7', number: 7, prompt: 'The fee can be paid in instalments.', answer: ['F'], explanation: 'F: "The £180 fee may be spread over three equal monthly payments".' },
        ],
      },
      {
        id: 'm4-r-g2',
        type: 'tfng',
        instructions: `Look at the notice "Lindford Leisure Centre: changes to the swimming pool timetable".

${TFNG_INSTRUCTIONS}`,
        questions: [
          { id: 'm4-r-q8', number: 8, prompt: 'On weekdays, people will be able to swim earlier in the morning than before.', answer: ['TRUE'], explanation: '"Early-morning swimming will now begin at 6.30 am instead of 7 am, Monday to Friday".' },
          { id: 'm4-r-q9', number: 9, prompt: 'Family sessions will continue to take place on Saturday mornings.', answer: ['FALSE'], explanation: '"Family sessions will move from Saturday mornings to Sunday afternoons".' },
          { id: 'm4-r-q10', number: 10, prompt: 'Children under eight may swim without an adult in the water during family sessions.', answer: ['FALSE'], explanation: '"children under eight must be accompanied in the water by an adult".' },
          { id: 'm4-r-q11', number: 11, prompt: 'The Friday aqua aerobics class costs less than the evening classes.', answer: ['NOT GIVEN'], explanation: 'The notice says a Friday class has been added but gives no prices for aqua aerobics.' },
          { id: 'm4-r-q12', number: 12, prompt: 'Swimming lessons will be cancelled while the teaching pool is closed.', answer: ['FALSE'], explanation: '"During this time, all swimming lessons will take place in the main pool."' },
          { id: 'm4-r-q13', number: 13, prompt: 'Sessions can be reserved a week ahead.', answer: ['TRUE'], explanation: '"All sessions can be booked online up to seven days in advance."' },
          { id: 'm4-r-q14', number: 14, prompt: 'The women-only session was started because customers asked for it.', answer: ['NOT GIVEN'], explanation: 'The notice only says the session "will continue"; it does not say why it began. (Customer requests are mentioned only for early-morning swimming.)' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Section 2
  {
    id: 'm4-r-s2',
    title: 'Section 2',
    passageTitle: 'Flexible working at Corran Insurance / First aid at work: what every employee should know',
    passage: `## Flexible working at Corran Insurance: a guide for employees

Corran Insurance recognises that a good balance between work and home life benefits both our staff and the business. This guide explains the flexible working options available and how to apply for them.

Who can apply?
Any employee may apply for flexible working once they have completed 26 weeks of continuous employment with the company. Applications can be made once in any twelve-month period.

What options are available?
Flexitime allows you to choose your start and finish times, provided you work your contracted hours and are present during core hours, which run from 10 am to 3 pm. Compressed hours allow you to work your full weekly hours over four days instead of five, giving you an extra day off each week. Job sharing means that two people divide the duties and pay of one full-time post between them. Finally, hybrid working combines time at home with time in the office. Hybrid workers must attend the office on their team's anchor days, which are usually two fixed days per week chosen by the team manager.

How do I apply?
Complete the request form available on the staff intranet and send it to your line manager. Your manager must arrange a meeting with you to discuss the request within 14 days of receiving it, and you may bring a colleague to this meeting if you wish. You will normally receive a written decision within two months.

Most new arrangements begin with a trial period of six weeks, after which you and your manager will review whether the arrangement is working for you, your team and our customers. If your request is refused, you may appeal to the Head of Human Resources within ten working days.

Working from home
Staff who work from home for any part of the week will be supplied with a laptop and a headset. Before starting, you must complete a self-assessment of your home workstation, which helps us make sure your desk, chair and screen are set up safely.

## First aid at work: what every employee should know

A| Every floor of our building has at least two trained first aiders. You can find their names and phone extensions on the green signs next to each lift. First aiders also wear a green lanyard instead of the standard blue one, so they are easy to spot in an emergency.

B| If a colleague is injured or suddenly becomes ill, stay with them and send someone to fetch the nearest first aider. Do not try to move the person unless they are in immediate danger, and do not give them anything to eat or drink. If the situation appears serious, call an ambulance straight away rather than waiting for the first aider to arrive.

C| First aid boxes are located in every kitchen area. They are checked monthly by the facilities team, but if you use the last of any item, please report it using the facilities request form so that it can be replaced quickly. Items in the boxes are for treating injuries at work only and must not be taken home.

D| Every accident, however minor, must be entered in the accident book held at main reception. The entry should be made by the person who was injured or, if they are unable to do so, by the first aider who treated them. Entries must be completed within 24 hours, as the information may be required by our insurers.

E| We are always looking for new first aiders. The training consists of a three-day course, which takes place during working hours at no cost to you. In recognition of the extra responsibility, first aiders receive one additional day of annual leave each year. Qualifications must be renewed every three years.

F| A defibrillator, a device used to restart the heart, is kept in a yellow box beside the main reception desk. No training is necessary to use it: once switched on, it gives clear spoken instructions and will only deliver a shock if one is needed. Anyone may use it in an emergency while waiting for the ambulance.`,
    groups: [
      {
        id: 'm4-r-g3',
        type: 'completion',
        instructions: `Complete the notes below.

Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the text for each answer.`,
        maxWords: 2,
        allowNumber: true,
        title: 'Flexible working',
        content: `## Eligibility and options
- Staff can apply after {{15}} weeks with the company.
- Flexitime: everyone must be at work during {{16}}.
- Compressed hours: full hours worked in {{17}} days.
- Hybrid working: staff must come to the office on {{18}}.

## Applying
- The line manager must hold a {{19}} within 14 days.
- New arrangements usually start with a {{20}} lasting six weeks.
- Home workers must first complete a {{21}} of their workstation.`,
        questions: [
          { id: 'm4-r-q15', number: 15, prompt: '', answer: ['26', 'twenty-six'], explanation: '"once they have completed 26 weeks of continuous employment".' },
          { id: 'm4-r-q16', number: 16, prompt: '', answer: ['core hours'], explanation: '"present during core hours, which run from 10 am to 3 pm."' },
          { id: 'm4-r-q17', number: 17, prompt: '', answer: ['four', '4'], explanation: '"work your full weekly hours over four days instead of five".' },
          { id: 'm4-r-q18', number: 18, prompt: '', answer: ['anchor days'], explanation: '"Hybrid workers must attend the office on their team\'s anchor days".' },
          { id: 'm4-r-q19', number: 19, prompt: '', answer: ['meeting'], explanation: '"Your manager must arrange a meeting with you ... within 14 days".' },
          { id: 'm4-r-q20', number: 20, prompt: '', answer: ['trial period', 'trial'], explanation: '"Most new arrangements begin with a trial period of six weeks".' },
          { id: 'm4-r-q21', number: 21, prompt: '', answer: ['self-assessment', 'self assessment'], explanation: '"you must complete a self-assessment of your home workstation".' },
        ],
      },
      {
        id: 'm4-r-g4',
        type: 'matching',
        instructions: `The text "First aid at work: what every employee should know" has six sections, A–F.

Choose the correct heading for each section from the list of headings below.

Choose the correct number, i–ix.`,
        options: [
          { key: 'i', text: 'Making a written record' },
          { key: 'ii', text: 'Equipment that requires no training' },
          { key: 'iii', text: 'Claiming compensation after an accident' },
          { key: 'iv', text: 'How to recognise the people who can help' },
          { key: 'v', text: 'Keeping supplies available' },
          { key: 'vi', text: 'Preventing common accidents' },
          { key: 'vii', text: 'What to do first' },
          { key: 'viii', text: 'Taking on the role yourself' },
          { key: 'ix', text: 'Support for stress and anxiety' },
        ],
        questions: [
          { id: 'm4-r-q22', number: 22, prompt: 'Section A', answer: ['iv'], explanation: 'A: first aiders\' names are on green signs and they "wear a green lanyard ... so they are easy to spot".' },
          { id: 'm4-r-q23', number: 23, prompt: 'Section B', answer: ['vii'], explanation: 'B: the immediate steps — stay with the person, fetch a first aider, do not move them, call an ambulance if serious.' },
          { id: 'm4-r-q24', number: 24, prompt: 'Section C', answer: ['v'], explanation: 'C: boxes are checked monthly and used items must be reported "so that it can be replaced quickly".' },
          { id: 'm4-r-q25', number: 25, prompt: 'Section D', answer: ['i'], explanation: 'D: "Every accident ... must be entered in the accident book".' },
          { id: 'm4-r-q26', number: 26, prompt: 'Section E', answer: ['viii'], explanation: 'E: "We are always looking for new first aiders" — training, extra leave and renewal for volunteers.' },
          { id: 'm4-r-q27', number: 27, prompt: 'Section F', answer: ['ii'], explanation: 'F: "No training is necessary to use it" — the defibrillator gives spoken instructions.' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Section 3
  {
    id: 'm4-r-s3',
    title: 'Section 3',
    passageTitle: 'The Steel Box: How the Shipping Container Changed Trade',
    passage: `A| Almost everything in a typical home, from the television to the trainers by the door, has spent part of its life inside a steel box roughly six metres or twelve metres long. Shipping containers are so common that most people notice them only as a blur of colour on a passing lorry or a stack beside a motorway. Yet this plain, unglamorous object has arguably done more to shape the modern economy than many inventions that are far better known. By making it cheap and reliable to move goods across oceans, it allowed factories on one side of the world to supply shops on the other.

B| To understand why the container mattered, it helps to picture a port in the early 1950s. Cargo arrived at the docks in every imaginable form: sacks of coffee, barrels of oil, crates of machinery, bundles of timber. Each item had to be carried, lifted and stowed in the ship's hold by teams of dockers, often by hand or with simple slings. A cargo ship could spend a week or more in port being loaded and unloaded, earning nothing while it waited. The work was slow and dangerous, and theft was so common that some dock workers regarded a share of the cargo as an unofficial part of their wages. By some estimates, handling costs at the two ends of a voyage accounted for around half the total cost of shipping goods.

C| The man usually credited with changing this was not a sailor but a lorry owner. Malcom McLean had built up a successful trucking company in the United States, and he had spent many frustrating hours waiting at docks while goods were removed from his vehicles one piece at a time. His first idea was to drive entire lorry trailers onto ships. He soon realised, however, that the wheels and chassis took up valuable space and could not be stacked, so he decided to lift only the box itself. In 1956 he bought a shipping company, and in April of that year a converted oil tanker called the Ideal X sailed from New Jersey to Texas carrying 58 metal containers on its deck.

D| The savings were immediate. Calculations made at the time suggested that the cost of loading a ton of cargo fell from almost six dollars to around sixteen cents. Because containers could be filled at the factory and sealed, theft fell dramatically, and insurance became cheaper as a result. Ships that had once spent days in port could now be turned around in a matter of hours, which meant that each vessel could make many more voyages a year.

E| Early progress, however, was held back by a lack of agreement. Different shipping lines used boxes of different lengths and heights, with different fittings at the corners for lifting and locking them together. A container belonging to one company often could not be handled by another company's cranes, or carried on another company's ships, trains or lorries. During the 1960s, after years of difficult negotiation, international standards were agreed. The most important were two standard lengths, twenty and forty feet, and a common design for the corner fittings. The "twenty-foot equivalent unit", or TEU, became the measure by which ships and ports are still compared today.

F| An unexpected boost came from the military. In the mid-1960s the United States army was struggling to supply its forces in Vietnam, where ports were badly congested and supplies often went missing. McLean's company won a contract to carry military cargo across the Pacific in containers, and the system proved so efficient that it quickly silenced many doubters. McLean also saw an opportunity: rather than allowing his ships to return home empty, he arranged for them to stop in Japan and collect goods for American customers, helping to open what would become one of the busiest trade routes in the world.

G| Not everyone benefited. Container ports needed deep water, enormous cranes and acres of flat land on which to stack thousands of boxes. Many old docks in the centres of cities had none of these things. The traditional docks of London and of Manhattan in New York went into steep decline, while newer ports such as Felixstowe in eastern England, which had been a small harbour, grew rapidly. The number of dock workers fell sharply, as a single crane operator could now do the work of dozens of men, and the change was marked in many places by bitter strikes.

H| Today, the largest container ships can carry more than twenty thousand TEU, and their size means that harbours around the world have had to be deepened and widened to receive them. Containers are lost overboard in storms every year, and the industry's fuel consumption has made it a target for environmental campaigners. Meanwhile, old containers have found second lives as homes, shops, offices and even swimming pools. Seventy years after the Ideal X left New Jersey, the basic steel box is almost unchanged, and the global economy still depends on it.`,
    groups: [
      {
        id: 'm4-r-g5',
        type: 'matching',
        instructions: `The reading passage has eight paragraphs, A–H.

Which paragraph contains the following information?

Choose the correct letter, A–H.`,
        options: [
          { key: 'A', text: 'Paragraph A' },
          { key: 'B', text: 'Paragraph B' },
          { key: 'C', text: 'Paragraph C' },
          { key: 'D', text: 'Paragraph D' },
          { key: 'E', text: 'Paragraph E' },
          { key: 'F', text: 'Paragraph F' },
          { key: 'G', text: 'Paragraph G' },
          { key: 'H', text: 'Paragraph H' },
        ],
        questions: [
          { id: 'm4-r-q28', number: 28, prompt: 'a description of how cargo was handled before containers were introduced', answer: ['B'], explanation: 'B: "Each item had to be carried, lifted and stowed in the ship\'s hold by teams of dockers".' },
          { id: 'm4-r-q29', number: 29, prompt: 'the reason why common sizes for containers were needed', answer: ['E'], explanation: 'E: "A container belonging to one company often could not be handled by another company\'s cranes".' },
          { id: 'm4-r-q30', number: 30, prompt: 'examples of ports that lost business', answer: ['G'], explanation: 'G: "The traditional docks of London and of Manhattan in New York went into steep decline".' },
          { id: 'm4-r-q31', number: 31, prompt: 'a reference to the use of containers to supply armed forces', answer: ['F'], explanation: 'F: "McLean\'s company won a contract to carry military cargo across the Pacific in containers".' },
          { id: 'm4-r-q32', number: 32, prompt: 'figures showing how much cheaper loading became', answer: ['D'], explanation: 'D: "the cost of loading a ton of cargo fell from almost six dollars to around sixteen cents."' },
        ],
      },
      {
        id: 'm4-r-g6',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B, C or D.',
        questions: [
          {
            id: 'm4-r-q33',
            number: 33,
            prompt: 'What first led McLean to think about a new way of shipping goods?',
            options: [
              { key: 'A', text: 'his experience of working as a docker' },
              { key: 'B', text: 'the delays his business suffered at ports' },
              { key: 'C', text: 'a report on the cost of theft at the docks' },
              { key: 'D', text: 'a suggestion from a shipbuilder' },
            ],
            answer: ['B'],
            explanation: 'Paragraph C: he "had spent many frustrating hours waiting at docks while goods were removed from his vehicles one piece at a time." He was a lorry owner, not a docker.',
          },
          {
            id: 'm4-r-q34',
            number: 34,
            prompt: 'Why did McLean decide not to put whole trailers on ships?',
            options: [
              { key: 'A', text: 'The trailers were often damaged at sea.' },
              { key: 'B', text: 'The trailers were too heavy for cranes to lift.' },
              { key: 'C', text: 'The wheels and chassis wasted space.' },
              { key: 'D', text: 'The law did not allow vehicles on cargo ships.' },
            ],
            answer: ['C'],
            explanation: 'Paragraph C: "the wheels and chassis took up valuable space and could not be stacked".',
          },
          {
            id: 'm4-r-q35',
            number: 35,
            prompt: 'According to paragraph F, the military contract was important because',
            options: [
              { key: 'A', text: 'it made McLean the richest shipowner in the United States.' },
              { key: 'B', text: 'it led to the development of trade between Japan and the United States.' },
              { key: 'C', text: 'it persuaded the army to build new ports in Vietnam.' },
              { key: 'D', text: 'it was the first time containers had crossed the Pacific.' },
            ],
            answer: ['B'],
            explanation: 'Paragraph F: his ships stopped "in Japan and collect[ed] goods for American customers, helping to open what would become one of the busiest trade routes in the world."',
          },
          {
            id: 'm4-r-q36',
            number: 36,
            prompt: 'What does the writer say about modern container ships?',
            options: [
              { key: 'A', text: 'They can use most traditional city-centre docks.' },
              { key: 'B', text: 'They rarely lose containers at sea.' },
              { key: 'C', text: 'Their size has required changes to harbours.' },
              { key: 'D', text: 'They use less fuel than earlier ships.' },
            ],
            answer: ['C'],
            explanation: 'Paragraph H: "their size means that harbours around the world have had to be deepened and widened to receive them." Containers are lost "every year" (not B); fuel use is criticised (not D).',
          },
        ],
      },
      {
        id: 'm4-r-g7',
        type: 'completion',
        instructions: `Complete the summary below.

Choose ONE WORD ONLY from the passage for each answer.`,
        maxWords: 1,
        title: 'The effects of the container',
        content: `Before containers, ships spent a long time in port and {{37}} of cargo was widespread. Because containers were sealed at the factory, losses fell and {{38}} costs were reduced. Shipping lines eventually agreed standard lengths and a shared design for the corner {{39}}. However, the new system needed ports with deep water, large cranes and plenty of flat land, and the number of jobs for dock workers fell, leading in some places to {{40}}.`,
        questions: [
          { id: 'm4-r-q37', number: 37, prompt: '', answer: ['theft'], explanation: 'Paragraph B: "theft was so common that some dock workers regarded a share of the cargo as an unofficial part of their wages."' },
          { id: 'm4-r-q38', number: 38, prompt: '', answer: ['insurance'], explanation: 'Paragraph D: "theft fell dramatically, and insurance became cheaper as a result."' },
          { id: 'm4-r-q39', number: 39, prompt: '', answer: ['fittings'], explanation: 'Paragraph E: "a common design for the corner fittings."' },
          { id: 'm4-r-q40', number: 40, prompt: '', answer: ['strikes'], explanation: 'Paragraph G: "the change was marked in many places by bitter strikes."' },
        ],
      },
    ],
  },
]

const T0 = Date.UTC(2026, 0, 1)

export const mock4: Test = {
  id: 'seed-general-2',
  title: 'General Training Mock Test 2',
  variant: 'general',
  description: 'A complete computer-delivered General Training test: Listening, Reading, Writing and Speaking.',
  status: 'published',
  createdAt: T0,
  updatedAt: T0,
  listening: { sections: listening },
  reading: { sections: reading },
  writing: {
    tasks: [
      {
        id: 'm4-w-t1',
        number: 1,
        kind: 'letter',
        prompt: `You rent a flat, and something in the flat needs to be repaired. You told your landlord about the problem some time ago, but nothing has been done.\n\nWrite a letter to your landlord. In your letter\n• describe the problem\n• explain how it is affecting you\n• say what you would like the landlord to do\n\nWrite at least 150 words.\n\nYou do NOT need to write any addresses.\n\nBegin your letter as follows:\n\nDear Mr Patel,`,
        minWords: 150,
        minutes: 20,
        sample: `Dear Mr Patel,

I am writing about the boiler in my flat at 14 Elmfield Road, which I first reported to you by phone on 3 October. Unfortunately, the situation has since become considerably worse.

At first, the boiler switched itself off several times a day and a red warning light on the control panel kept flashing. For the past nine days, however, it has not worked at all, so I have had no heating or hot water. Now that the nights are getting colder, the flat is extremely uncomfortable. I have had to buy an electric heater, which is adding noticeably to my bills, and I have been showering at my gym before work, which is far from ideal.

I would therefore be grateful if you could arrange for a qualified engineer to inspect the boiler by the end of this week. If a replacement part has to be ordered, I would appreciate an approximate date for the repair. I am at home most evenings after six and would be happy to let the engineer in.

I look forward to hearing from you soon.

Yours sincerely,
Elena Marsh`,
      },
      {
        id: 'm4-w-t2',
        number: 2,
        kind: 'essay',
        prompt: `In many countries, the age at which people can retire is being raised, so that people have to work until they are older.\n\nDo the advantages of this development outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.`,
        minWords: 250,
        minutes: 40,
        sample: `Across much of the world, governments are gradually raising the age at which people can claim a state pension, which means that many will now work into their late sixties or beyond. Although this policy creates genuine hardship for some workers, I believe its advantages are greater overall.

The strongest argument for later retirement is financial. As life expectancy rises and birth rates fall, there are fewer working-age taxpayers to support each pensioner. Unless people work for longer, governments will be forced to choose between higher taxes on the young and smaller pensions for the old, neither of which is fair or sustainable. Later retirement can also benefit individuals. Work provides not only an income but also structure, social contact and a sense of purpose, and many people who stop working abruptly report feeling isolated.

That said, the change does not affect everyone equally. An accountant or a university lecturer may be perfectly able to work until seventy, but a builder, nurse or cleaner whose job is physically demanding may find this impossible. For such people, a higher pension age may simply mean several years of poor health, unemployment or reliance on benefits before their pension begins. There is also a concern that older employees staying in post may slow down promotion for younger colleagues.

In my view, these problems are real but manageable. Governments could allow earlier retirement for those in physically demanding occupations, while employers could offer part-time or less strenuous roles to older staff. Such flexibility would protect vulnerable workers without abandoning a reform that is, in the long run, necessary.

In conclusion, while raising the retirement age places a heavy burden on certain groups, its benefits for public finances and for the wellbeing of many older people outweigh its drawbacks, provided that the policy is applied with sufficient flexibility.`,
      },
    ],
  },
  speaking: {
    part1: {
      topics: [
        {
          topic: 'Your home',
          questions: [
            'Do you live in a house or a flat?',
            'Which room in your home do you spend the most time in?',
            'Is there anything you would like to change about your home?',
            'Do you think you will live there for a long time?',
          ],
        },
        {
          topic: 'Transport',
          questions: [
            'How do you usually travel to work or school?',
            'Do you prefer using public transport or travelling by car?',
            'Has public transport in your area changed since you were a child?',
            'Would you like to cycle more often? Why or why not?',
          ],
        },
        {
          topic: 'Weekends',
          questions: [
            'What do you usually do at the weekend?',
            'Do you prefer busy weekends or relaxing ones?',
            'What did you do last weekend?',
            'Are weekends more important to you now than when you were younger?',
          ],
        },
      ],
    },
    part2: {
      topic: 'Describe a family celebration that you remember well',
      bullets: ['what the celebration was', 'when and where it took place', 'who was there', 'what happened during the celebration'],
      closing: 'and explain why you remember it so well.',
      roundOff: ['Do you enjoy family celebrations?', 'Did anyone take photos that day?'],
      sample: `I'd like to talk about my grandmother's eightieth birthday, which we celebrated about three years ago. It was in early spring, and we held it in the garden of my aunt's house, which is in a small village about an hour from where I live.

Pretty much the whole family was there, so there were around forty of us, from my grandmother herself right down to my cousin's baby, who was only a few weeks old at the time. Some relatives flew in from abroad, and a couple of them I hadn't seen since I was a child, so it was a bit of a reunion as well as a birthday.

What happened was that we'd planned it as a surprise. My uncle took my grandmother out for lunch, supposedly just the two of them, and while they were away the rest of us decorated the garden and set out the food. When she walked through the gate and saw everybody, she was completely lost for words, and then she burst into tears, happy tears, of course. Later on, each of the grandchildren read out a short memory of her, and my brother had put together a slideshow of old photos, some of them from when she was a young woman, which nobody had ever seen before.

I think the reason it's stuck in my mind is that it was the last time the whole family was together in one place. People are so spread out now that it's really hard to arrange. And seeing my grandmother so moved, after everything she's done for all of us, was something I'll never forget.`,
    },
    part3: {
      theme: 'Family and traditions',
      questions: [
        'What kinds of events do families in your country usually celebrate together?',
        'Do you think family celebrations are less important to young people today than they were in the past?',
        'Why do some traditions survive for hundreds of years while others disappear?',
        'Should parents make an effort to pass on traditions to their children? Why?',
        'How has technology changed the way families keep in touch with each other?',
        'Some people say that big celebrations have become too expensive. Do you agree?',
      ],
    },
  },
}
