import type { ListeningSection, ReadingSection, SpeakingPart1, SpeakingPart2, SpeakingPart3, Test, WritingTask } from '../../lib/types'

// Original seed content written for this app — not taken from any published IELTS/Cambridge material.
// voices: NARRATOR=m, WOMAN=f, MAN=m, MARTIN=m, PRIYA=f, TOM=m, MARGARET=f, ELEANOR=f

const T0 = Date.UTC(2026, 0, 1)

const stationPlan = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" font-family="Arial, Helvetica, sans-serif">
  <rect x="0" y="0" width="600" height="400" fill="#ffffff"/>
  <text x="300" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#222">Ashcombe Station</text>
  <rect x="40" y="35" width="150" height="65" fill="#f1ece2" stroke="#9a8a6a"/>
  <rect x="430" y="35" width="130" height="65" fill="#f1ece2" stroke="#9a8a6a"/>
  <rect x="40" y="110" width="520" height="50" fill="#e6e6e6" stroke="#999"/>
  <text x="160" y="140" text-anchor="middle" font-size="12" fill="#444">Platform 2</text>
  <g stroke="#555" stroke-width="2">
    <line x1="0" y1="172" x2="600" y2="172"/><line x1="0" y1="182" x2="600" y2="182"/>
    <line x1="0" y1="198" x2="600" y2="198"/><line x1="0" y1="208" x2="600" y2="208"/>
  </g>
  <rect x="40" y="220" width="520" height="50" fill="#e6e6e6" stroke="#999"/>
  <text x="200" y="250" text-anchor="middle" font-size="12" fill="#444">Platform 1</text>
  <rect x="455" y="105" width="24" height="170" fill="#d9d2c3" stroke="#8a7b5c"/>
  <text x="467" y="190" text-anchor="middle" font-size="10" fill="#5a4d33" transform="rotate(90 467 190)">Footbridge</text>
  <rect x="170" y="285" width="260" height="70" fill="#f1ece2" stroke="#9a8a6a"/>
  <line x1="300" y1="305" x2="300" y2="355" stroke="#9a8a6a"/>
  <text x="300" y="299" text-anchor="middle" font-size="11" fill="#5a4d33">Main building</text>
  <rect x="20" y="295" width="120" height="85" rx="6" fill="#f2f2f2" stroke="#999"/>
  <text x="80" y="342" text-anchor="middle" font-size="12" fill="#444">Car park</text>
  <rect x="455" y="295" width="125" height="80" rx="6" fill="#eef5e1" stroke="#9cb77a"/>
  <path d="M300 398 L288 382 L312 382 Z" fill="#333"/>
  <text x="300" y="374" text-anchor="middle" font-size="11" font-weight="bold" fill="#222">ENTRANCE</text>
  <g font-size="14" font-weight="bold" text-anchor="middle" fill="#111">
    <circle cx="235" cy="330" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="235" y="335">A</text>
    <circle cx="365" cy="330" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="365" y="335">B</text>
    <circle cx="80" cy="245" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="80" y="250">C</text>
    <circle cx="300" cy="135" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="300" y="140">D</text>
    <circle cx="115" cy="68" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="115" y="73">E</text>
    <circle cx="495" cy="68" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="495" y="73">F</text>
    <circle cx="530" cy="245" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="530" y="250">G</text>
    <circle cx="517" cy="335" r="14" fill="#fff" stroke="#111" stroke-width="2"/><text x="517" y="340">H</text>
  </g>
</svg>`

const listening: ListeningSection[] = [
  // ---------------------------------------------------------------- Part 1
  {
    id: 'm2-l-s1',
    title: 'Part 1',
    context: 'You will hear a man telephoning a gym to enquire about membership.',
    transcript: `NARRATOR: Part One. You will hear a man telephoning a gym to enquire about membership. First you have some time to look at questions 1 to 5.
NARRATOR: Now listen carefully and answer questions 1 to 5.
WOMAN: Good afternoon, Pinewood Leisure Club, Chloe speaking. How can I help?
MAN: Hi. I've just moved to the area and I'm thinking of joining a gym. I walked past yours yesterday and wondered if you could tell me about membership.
WOMAN: Of course. I'll take a few details and then go through the options with you. What's your name?
MAN: It's Kieran Thorley.
WOMAN: Is that T-H-O-R-L-Y?
MAN: Nearly. There's an E before the Y. So it's T-H-O-R-L-E-Y.
WOMAN: Thank you. And your address?
MAN: Flat 3, 28 Ashgrove Road.
WOMAN: And the postcode?
MAN: It's BS6 4RD. Sorry, no, I'm still getting used to it. It ends in 4RT, T for Tango. So BS6 4RT.
WOMAN: Got it. Now, we have three types of membership. Full membership lets you use the gym at any time and costs forty-five pounds a month. If you're in full-time education, there's a student rate of twenty-eight pounds.
MAN: I finished university last year, so I'm afraid that doesn't apply.
WOMAN: Then there's off-peak membership. That gives you access before four in the afternoon on weekdays, and all day at weekends.
MAN: That might suit me, actually. I work shifts at the hospital, mostly evenings, so I'd usually come in the mornings anyway. I'll go for off-peak.
WOMAN: Good choice. That's normally thirty-five pounds a month, but we have a special offer this month, so it's thirty-two pounds.
MAN: Thirty-two. Great. Is there a joining fee?
WOMAN: There usually is, but it's waived while the offer's on. When would you like to start?
MAN: Could I start on Monday the 3rd of June?
WOMAN: Let me see. Ah, the gym's closed that week while we replace the flooring. The earliest would be the following Monday, the 10th.
MAN: The 10th of June, then.
NARRATOR: Before you hear the rest of the conversation, you have some time to look at questions 6 to 10.
NARRATOR: Now listen and answer questions 6 to 10.
WOMAN: Before you can use the equipment, all new members have an induction with one of our trainers. It takes about an hour. We run them on Tuesdays and Thursdays.
MAN: I'm usually on a long shift on Tuesdays, so Thursday would be better.
WOMAN: Thursday it is. I'll put you down for the 13th at ten. And when you come, please bring a padlock for the lockers. We used to sell them at reception, but we don't any more. You don't need a towel, by the way; those are provided.
MAN: OK, a padlock. What about classes? Are they included?
WOMAN: Most of them. Yoga is included, and so is circuit training, which is very popular. Pilates and spinning are charged separately, at five pounds a session, because they use specialist instructors.
MAN: Yoga and circuit training. That's fine, I'm not really a spinning person anyway. Is there a car park?
WOMAN: Yes, members can park free for three hours. After that it's a pound an hour. Most people find two hours is plenty, but three gives you time for a swim as well.
MAN: Perfect. And how do I pay? Can I just pay by card each month?
WOMAN: We take cards for one-off payments like classes, but monthly membership has to be paid by direct debit. I'll email you the form today.
MAN: Direct debit's fine. Thanks very much, Chloe.
WOMAN: You're welcome, Kieran. See you on the 13th.
NARRATOR: That is the end of Part One.`,
    groups: [
      {
        id: 'm2-l-g1',
        type: 'completion',
        instructions: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        maxWords: 2,
        allowNumber: true,
        title: 'Membership enquiry',
        content: `## Pinewood Leisure Club — Membership Enquiry
| Name | Kieran {{1}} |
| Address | Flat 3, 28 Ashgrove Road |
| Postcode | {{2}} |
| Type of membership | {{3}} |
| Monthly fee | £{{4}} (special offer) |
| Start date | {{5}} |
## Other information
- Induction with a trainer on {{6}} at 10 am
- Bring a {{7}} for the lockers
- Classes included: yoga and {{8}}
- Free parking for up to {{9}} hours
- Monthly payments by {{10}}`,
        questions: [
          { id: 'm2-l-q1', number: 1, prompt: '', answer: ['Thorley'], explanation: `MAN: "There's an E before the Y. So it's T-H-O-R-L-E-Y."` },
          { id: 'm2-l-q2', number: 2, prompt: '', answer: ['BS6 4RT', 'BS64RT'], explanation: `MAN: "It's BS6 4RD. Sorry, no... It ends in 4RT, T for Tango. So BS6 4RT."` },
          { id: 'm2-l-q3', number: 3, prompt: '', answer: ['off-peak', 'off peak', 'offpeak'], explanation: `MAN: "I'll go for off-peak." (He is not a student; full membership is not chosen.)` },
          { id: 'm2-l-q4', number: 4, prompt: '', answer: ['32', '32.00'], explanation: `WOMAN: "That's normally thirty-five pounds a month, but we have a special offer this month, so it's thirty-two pounds."` },
          { id: 'm2-l-q5', number: 5, prompt: '', answer: ['10th June', '10 June', 'June 10', 'June 10th', '10/6', '10/06'], explanation: `WOMAN: "The earliest would be the following Monday, the 10th." (The 3rd of June is not possible because the gym is closed.)` },
          { id: 'm2-l-q6', number: 6, prompt: '', answer: ['Thursday', '13th', '13 June', '13th June'], explanation: `MAN: "Thursday would be better." WOMAN: "Thursday it is." (Tuesday is rejected.)` },
          { id: 'm2-l-q7', number: 7, prompt: '', answer: ['padlock', 'lock'], explanation: `WOMAN: "please bring a padlock for the lockers." (Towels are provided.)` },
          { id: 'm2-l-q8', number: 8, prompt: '', answer: ['circuit training', 'circuits'], explanation: `WOMAN: "Yoga is included, and so is circuit training." Pilates and spinning cost extra.` },
          { id: 'm2-l-q9', number: 9, prompt: '', answer: ['3', 'three'], explanation: `WOMAN: "members can park free for three hours." (Two hours is what most people need, not the limit.)` },
          { id: 'm2-l-q10', number: 10, prompt: '', answer: ['direct debit'], explanation: `WOMAN: "monthly membership has to be paid by direct debit." Cards are only for one-off payments.` },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 2
  {
    id: 'm2-l-s2',
    title: 'Part 2',
    context: 'You will hear a volunteer guide talking to a group of visitors at a restored railway station.',
    transcript: `NARRATOR: Part Two. You will hear a volunteer guide talking to a group of visitors at a restored railway station. First you have some time to look at questions 11 to 14.
NARRATOR: Now listen carefully and answer questions 11 to 14.
MARTIN: Good morning, everyone, and welcome to Ashcombe Station. I'm Martin, and like everyone who works here, I'm a volunteer. Before we walk round, let me give you a bit of background.
MARTIN: The station opened in 1871 and served the town for almost a century. People often assume it closed because passenger numbers fell once everyone started driving, and it's true that traffic was declining. Others have heard that the valley flooded, and it did, badly, in 1958, but the station was repaired within a few months. The real reason it closed, in 1964, was that the main line was moved to run along the coast, where a new bridge had been built, and Ashcombe was simply left at the end of a branch line that went nowhere.
MARTIN: For thirty years the building stood empty. Restoration began in 1996. The county council helped by selling us the land for one pound, but it didn't give us any money. We applied to the national lottery, but our first application was turned down. In the end, nearly all of the cost was met by a public appeal: thousands of local people sent in donations, some of them just a few pounds.
MARTIN: Much of what you'll see is a careful reproduction. The iron canopy over the platform, for example, was recast from the original drawings, and the ticket counter is a copy based on old photographs. But there's one thing that's been here since the very first day, and that's the clock above the entrance. It turned up in a farmer's barn, and it still keeps perfect time.
MARTIN: Many of you will want to ride on the steam train. I'm afraid it runs at weekends only, not every day, even in summer, because we don't have enough volunteer drivers. You can buy tickets online or in the booking hall on the day, so there's no need to book in advance. Oh, and children under five travel free.
NARRATOR: Now look at questions 15 to 20.
NARRATOR: Now listen and answer questions 15 to 20.
MARTIN: Now, if you look at the plan, you'll see we're standing at the entrance, at the bottom. The main building is directly in front of you, and the platforms and tracks are beyond it.
MARTIN: The main building is divided into two halves. As you walk in, the left-hand half is the old booking hall, which is now our café. So that's where to go for tea and cake.
MARTIN: The right-hand half used to be the parcels office, and that's now the gift shop. All the profits go back into the railway.
MARTIN: Walk through the building and you come out onto Platform 1. If you turn left, at the far end of the platform you'll see an empty space where the water tower stood. Sadly, it was demolished years ago. Turn right instead and walk past the footbridge, and at the very end of the platform is the signal box. You can climb up and have a go at pulling the levers.
MARTIN: To get to Platform 2, cross the tracks using the footbridge. Right in the middle of Platform 2, directly opposite the main building, is the waiting room, which has been restored with its original fireplace.
MARTIN: Behind Platform 2 there are two old buildings. The one at the right-hand end, near the footbridge, is the engine shed, and that's closed to the public because it's a working area. The one at the left-hand end is the old goods shed, and that's where you'll find our model railway, a scale model of the whole valley line.
MARTIN: Finally, if you've brought some food, there's a picnic area outside. Come back out through the entrance and turn right. It's beside the main building, on the opposite side from the car park.
MARTIN: Right, enjoy your visit.
NARRATOR: That is the end of Part Two.`,
    groups: [
      {
        id: 'm2-l-g2',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B or C.',
        questions: [
          {
            id: 'm2-l-q11', number: 11, prompt: 'Why did Ashcombe Station close?',
            options: [{ key: 'A', text: 'Passenger numbers had fallen.' }, { key: 'B', text: 'It was damaged by a flood.' }, { key: 'C', text: 'The main line was moved.' }],
            answer: ['C'], explanation: `MARTIN: "The real reason it closed... was that the main line was moved to run along the coast". Falling traffic and the 1958 flood are mentioned but rejected.`,
          },
          {
            id: 'm2-l-q12', number: 12, prompt: 'Most of the cost of restoring the station was paid by',
            options: [{ key: 'A', text: 'members of the public.' }, { key: 'B', text: 'the county council.' }, { key: 'C', text: 'the national lottery.' }],
            answer: ['A'], explanation: `MARTIN: "nearly all of the cost was met by a public appeal". The council only sold the land; the lottery application was turned down.`,
          },
          {
            id: 'm2-l-q13', number: 13, prompt: 'Which feature of the station is original?',
            options: [{ key: 'A', text: 'the platform canopy' }, { key: 'B', text: 'the clock' }, { key: 'C', text: 'the ticket counter' }],
            answer: ['B'], explanation: `MARTIN: "there's one thing that's been here since the very first day, and that's the clock above the entrance." The canopy and counter are copies.`,
          },
          {
            id: 'm2-l-q14', number: 14, prompt: 'What does the guide say about the steam train?',
            options: [{ key: 'A', text: 'It runs every day in summer.' }, { key: 'B', text: 'Tickets must be booked in advance.' }, { key: 'C', text: 'Young children can travel without paying.' }],
            answer: ['C'], explanation: `MARTIN: "children under five travel free." It runs at weekends only, and there is "no need to book in advance".`,
          },
        ],
      },
      {
        id: 'm2-l-g3',
        type: 'matching',
        instructions: 'Label the plan below. Write the correct letter, A–H, next to Questions 15–20.',
        title: 'Ashcombe Station',
        svg: stationPlan,
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((k) => ({ key: k, text: k })),
        questions: [
          { id: 'm2-l-q15', number: 15, prompt: 'Café', answer: ['A'], explanation: `MARTIN: "As you walk in, the left-hand half is the old booking hall, which is now our café."` },
          { id: 'm2-l-q16', number: 16, prompt: 'Gift shop', answer: ['B'], explanation: `MARTIN: "The right-hand half used to be the parcels office, and that's now the gift shop."` },
          { id: 'm2-l-q17', number: 17, prompt: 'Signal box', answer: ['G'], explanation: `MARTIN: "Turn right instead and walk past the footbridge, and at the very end of the platform is the signal box." (C is where the water tower stood.)` },
          { id: 'm2-l-q18', number: 18, prompt: 'Waiting room', answer: ['D'], explanation: `MARTIN: "Right in the middle of Platform 2, directly opposite the main building, is the waiting room".` },
          { id: 'm2-l-q19', number: 19, prompt: 'Model railway', answer: ['E'], explanation: `MARTIN: "The one at the left-hand end is the old goods shed, and that's where you'll find our model railway". F is the engine shed, closed to the public.` },
          { id: 'm2-l-q20', number: 20, prompt: 'Picnic area', answer: ['H'], explanation: `MARTIN: "Come back out through the entrance and turn right. It's beside the main building, on the opposite side from the car park."` },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 3
  {
    id: 'm2-l-s3',
    title: 'Part 3',
    context: 'You will hear two marine biology students, Priya and Tom, discussing their rock-pool field project with their tutor, Margaret.',
    transcript: `NARRATOR: Part Three. You will hear two marine biology students, Priya and Tom, discussing their rock-pool field project with their tutor, Margaret. First you have some time to look at questions 21 to 26.
NARRATOR: Now listen carefully and answer questions 21 to 26.
MARGARET: Hello, you two. Come and sit down. So, how is the rock-pool project going?
PRIYA: Pretty well, I think. We've finished the first round of surveys at Hallow Bay, and we've decided on our second site.
MARGARET: Remind me why you wanted a second site.
TOM: Well, Hallow Bay is very sheltered, so we wanted to compare it with a shore that's exposed to much bigger waves. We've chosen Kelby Point.
MARGARET: Kelby's a long way from the road, isn't it? It's quite a walk with all your equipment.
PRIYA: It is, about forty minutes, so easy access certainly wasn't a reason. But it gets the full force of the Atlantic swell, which is exactly the contrast we need. And the other big advantage is that someone surveyed Kelby in the 1990s, so we've got earlier data to compare ours with.
MARGARET: Yes, that's valuable. I'd heard there was a sewage outlet near there, though.
TOM: There used to be, but it was closed ten years ago, so that wasn't a factor. And we did ask the coastguard about safety, but they didn't suggest the site; we'd already chosen it by then.
MARGARET: Good. Now, how did your first visit go?
PRIYA: Not brilliantly. We'd prepared for rain and wind, and actually the weather was lovely. The problem was that we'd looked up the tide times for the wrong harbour, so the tide came back in about an hour earlier than we expected and we had to abandon the lower pools.
MARGARET: That happens to everyone once. Did you find anything unexpected?
TOM: I thought we'd find fewer species at Kelby because the waves are so strong. Priya expected the same.
PRIYA: But in fact Kelby had far more species than Hallow Bay, nearly twice as many. That really surprised me. The numbers of limpets and barnacles were about what we'd predicted, though.
MARGARET: Interesting. What about identification? Some of those small sea slugs and worms are very hard to tell apart.
TOM: That's been a problem. We thought we might collect a few and bring them back to the lab to look at under the microscope.
MARGARET: I'd rather you didn't. You'd need a permit to remove animals from the shore, and that takes months. You could photograph them and send the pictures to an expert, but they get hundreds of requests and you might wait weeks for a reply. The department has a reference collection of preserved specimens in the basement. That's your best option, and it's right here in the building.
PRIYA: Oh, I didn't know about that. We'll use that, then.
MARGARET: And is there anything you'd change about your method for the next round?
TOM: We'd thought about using bigger quadrats, the frames we put over each pool, and maybe visiting more often.
MARGARET: Neither of those is the main issue. What worries me is that at Hallow Bay you surveyed pools at different heights on the shore. A pool near the top is a completely different environment from one near the bottom.
PRIYA: So we should survey pools at the same tidal height on both shores.
MARGARET: Exactly. That's the change I'd make.
NARRATOR: Before you hear the rest of the discussion, you have some time to look at questions 27 to 30.
NARRATOR: Now listen and answer questions 27 to 30.
MARGARET: Now, how are you dividing up the work for the report?
PRIYA: Tom's much better with numbers than I am, so he's going to do all the statistical analysis.
TOM: Yes, I'm happy with that.
MARGARET: And the maps of the two sites?
TOM: I was going to do those, but Priya's done a course in mapping software, so she's taking them on.
PRIYA: I don't mind at all.
MARGARET: Have you contacted the local wildlife trust yet? They'll want a copy of your data.
PRIYA: Not yet. We thought we'd both go and meet them, since they might have questions about any part of the project.
MARGARET: Sensible. And the literature review?
TOM: Priya started it, but she's got the maps now, so I'll finish it.
MARGARET: Good. Let's meet again in two weeks.
NARRATOR: That is the end of Part Three.`,
    groups: [
      {
        id: 'm2-l-g4',
        type: 'mcq_multi',
        instructions: 'Choose TWO letters, A–E.',
        content: 'Which TWO reasons do the students give for choosing Kelby Point as their second site?',
        options: [
          { key: 'A', text: 'It is easy to reach.' },
          { key: 'B', text: 'It is exposed to large waves.' },
          { key: 'C', text: 'Data from an earlier survey is available.' },
          { key: 'D', text: 'It is close to a sewage outlet.' },
          { key: 'E', text: 'It was recommended by the coastguard.' },
        ],
        questions: [
          { id: 'm2-l-q21', number: 21, prompt: '', answer: ['B'], explanation: `PRIYA: "it gets the full force of the Atlantic swell, which is exactly the contrast we need."` },
          { id: 'm2-l-q22', number: 22, prompt: '', answer: ['C'], explanation: `PRIYA: "someone surveyed Kelby in the 1990s, so we've got earlier data to compare ours with." (Access is difficult, the outlet is closed, and the coastguard did not suggest it.)` },
        ],
      },
      {
        id: 'm2-l-g5',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B or C.',
        questions: [
          {
            id: 'm2-l-q23', number: 23, prompt: 'What went wrong on the students\' first visit?',
            options: [{ key: 'A', text: 'The weather was poor.' }, { key: 'B', text: 'They used the wrong tide information.' }, { key: 'C', text: 'They forgot some equipment.' }],
            answer: ['B'], explanation: `PRIYA: "we'd looked up the tide times for the wrong harbour, so the tide came back in about an hour earlier than we expected".`,
          },
          {
            id: 'm2-l-q24', number: 24, prompt: 'What surprised Priya about the results?',
            options: [{ key: 'A', text: 'Kelby Point had a greater variety of species.' }, { key: 'B', text: 'There were very few limpets at Kelby Point.' }, { key: 'C', text: 'Hallow Bay had more barnacles than expected.' }],
            answer: ['A'], explanation: `PRIYA: "Kelby had far more species than Hallow Bay, nearly twice as many. That really surprised me." Limpets and barnacles were as predicted.`,
          },
          {
            id: 'm2-l-q25', number: 25, prompt: 'The tutor advises the students to identify difficult specimens by',
            options: [{ key: 'A', text: 'taking them to the laboratory.' }, { key: 'B', text: 'sending photographs to an expert.' }, { key: 'C', text: 'using the department\'s reference collection.' }],
            answer: ['C'], explanation: `MARGARET: "The department has a reference collection of preserved specimens in the basement. That's your best option".`,
          },
          {
            id: 'm2-l-q26', number: 26, prompt: 'What change to their method does the tutor recommend?',
            options: [{ key: 'A', text: 'surveying pools at the same height on the shore' }, { key: 'B', text: 'using larger quadrats' }, { key: 'C', text: 'visiting the sites more often' }],
            answer: ['A'], explanation: `MARGARET: "Neither of those is the main issue..." PRIYA: "So we should survey pools at the same tidal height on both shores." MARGARET: "Exactly."`,
          },
        ],
      },
      {
        id: 'm2-l-g6',
        type: 'matching',
        instructions: 'Who will do each of the following tasks? Write the correct letter, A, B or C, next to Questions 27–30.',
        options: [
          { key: 'A', text: 'Priya' },
          { key: 'B', text: 'Tom' },
          { key: 'C', text: 'both Priya and Tom' },
        ],
        questions: [
          { id: 'm2-l-q27', number: 27, prompt: 'statistical analysis', answer: ['B'], explanation: `PRIYA: "Tom's much better with numbers than I am, so he's going to do all the statistical analysis."` },
          { id: 'm2-l-q28', number: 28, prompt: 'maps of the sites', answer: ['A'], explanation: `TOM: "I was going to do those, but Priya's done a course in mapping software, so she's taking them on."` },
          { id: 'm2-l-q29', number: 29, prompt: 'meeting the wildlife trust', answer: ['C'], explanation: `PRIYA: "We thought we'd both go and meet them".` },
          { id: 'm2-l-q30', number: 30, prompt: 'literature review', answer: ['B'], explanation: `TOM: "Priya started it, but she's got the maps now, so I'll finish it."` },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Part 4
  {
    id: 'm2-l-s4',
    title: 'Part 4',
    context: 'You will hear a lecture on the history of glass-making.',
    transcript: `NARRATOR: Part Four. You will hear a lecture on the history of glass-making. First you have some time to look at questions 31 to 40.
NARRATOR: Now listen carefully and answer questions 31 to 40.
ELEANOR: Good afternoon. In today's lecture in our series on materials and society, I'm going to trace the history of glass, a material so ordinary now that we barely notice it, but which for most of human history was a luxury.
ELEANOR: Long before anyone learned to make glass, people were using a natural form of it. Obsidian is a black volcanic glass that forms when lava cools very quickly. It breaks with extremely sharp edges, and from the Stone Age onwards it was highly prized for making tools, especially knives and arrowheads. It was traded over hundreds of kilometres.
ELEANOR: Manufactured glass seems to have first appeared in Mesopotamia, in what is now Iraq, around four and a half thousand years ago. The earliest objects weren't vessels or windows; they were beads, which were treated almost like precious stones. Glass vessels came several centuries later, and they were made by a slow process of winding molten glass around a core of clay.
ELEANOR: The basic recipe has changed surprisingly little. The main ingredient is sand, which is mostly silica. On its own, silica melts only at a very high temperature, so a second ingredient, called a flux, is added to lower the melting point. In the ancient world this was soda. In some regions soda came from a mineral deposit, but in northern Europe it was usually obtained by burning seaweed and collecting the ash. Soda glass on its own, though, slowly dissolves in water, so a third ingredient, lime, was added to make it stable. Sand, soda and lime: that's still the basis of most of the glass we use today.
ELEANOR: The great turning point came in the first century BC, somewhere on the eastern coast of the Mediterranean, with the invention of glassblowing. By blowing air through a metal tube into a blob of molten glass, a worker could make a vessel in minutes rather than days. Glass suddenly became cheap. Within a few generations, glass cups and bottles were no longer reserved for the rich; they were found in ordinary households throughout the Roman Empire.
ELEANOR: The Romans were also the first to put glass in windows, though not in the way we might imagine. You might expect the earliest examples to come from the villas of wealthy families, but in fact they've been found in public baths, where the glass helped to keep the heat in. This glass was thick and greenish; it let in light, but you couldn't really see through it.
ELEANOR: Let's move forward to medieval Venice, which became the centre of European glass-making. In 1291, the city's glassmakers were all ordered to move their furnaces to the nearby island of Murano. It's often said this was done to protect trade secrets, but the official reason given at the time was the danger of fire, since so many of the city's buildings were made of wood. Whatever the motive, the glassmakers became extremely valuable to the state. They enjoyed high social status, but in return they were forbidden to leave the Venetian Republic, and those who tried to set up workshops abroad could face severe punishment.
ELEANOR: In the seventeenth century, English glassmakers developed lead glass, sometimes called lead crystal. Adding lead oxide made the glass heavier and more brilliant, but the important thing for the industry was that it was also softer, which meant it was much easier to cut into the elaborate patterns that became fashionable on drinking glasses and chandeliers.
ELEANOR: Finally, flat glass. For centuries, window glass was made by blowing a large cylinder or disc and flattening it, which left the glass slightly uneven. Large, perfectly flat sheets needed hours of grinding and polishing. Then, in the 1950s, a British company developed what's called the float process. Molten glass is poured onto a bath of molten tin. Because the glass floats on the metal, it spreads out into a perfectly smooth, even sheet, with no polishing needed at all. Almost every window in the world today is made this way.
ELEANOR: Next week we'll look at how glass is used in fibre-optic communications.
NARRATOR: That is the end of Part Four.`,
    groups: [
      {
        id: 'm2-l-g7',
        type: 'completion',
        instructions: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
        maxWords: 1,
        title: 'The history of glass-making',
        content: `## Before manufactured glass
- Obsidian, a natural volcanic glass, was used for making {{31}}
## Early glass
- The first manufactured glass objects, in Mesopotamia, were {{32}}
## Ingredients
- Sand, which is mostly silica
- Soda lowers the melting point; in northern Europe it came from burning {{33}}
- {{34}} was added to stop the glass dissolving in water
## Glassblowing (1st century BC)
- Glass became cheap and was used in ordinary {{35}} across the Roman Empire
- The earliest Roman window glass was used in public {{36}}
## Venice
- Glassmakers moved to Murano, officially because of the risk of {{37}}
- Glassmakers were not allowed to {{38}} the Republic
## Later developments
- Lead glass was softer, so it was easier to {{39}}
- Float process (1950s): molten glass is poured onto molten {{40}}`,
        questions: [
          { id: 'm2-l-q31', number: 31, prompt: '', answer: ['tools'], explanation: `ELEANOR: "it was highly prized for making tools, especially knives and arrowheads."` },
          { id: 'm2-l-q32', number: 32, prompt: '', answer: ['beads'], explanation: `ELEANOR: "The earliest objects weren't vessels or windows; they were beads".` },
          { id: 'm2-l-q33', number: 33, prompt: '', answer: ['seaweed'], explanation: `ELEANOR: "in northern Europe it was usually obtained by burning seaweed and collecting the ash."` },
          { id: 'm2-l-q34', number: 34, prompt: '', answer: ['lime'], explanation: `ELEANOR: "Soda glass on its own... slowly dissolves in water, so a third ingredient, lime, was added to make it stable."` },
          { id: 'm2-l-q35', number: 35, prompt: '', answer: ['households', 'homes'], explanation: `ELEANOR: "they were found in ordinary households throughout the Roman Empire."` },
          { id: 'm2-l-q36', number: 36, prompt: '', answer: ['baths'], explanation: `ELEANOR: "You might expect... the villas of wealthy families, but in fact they've been found in public baths".` },
          { id: 'm2-l-q37', number: 37, prompt: '', answer: ['fire'], explanation: `ELEANOR: "It's often said this was done to protect trade secrets, but the official reason given at the time was the danger of fire".` },
          { id: 'm2-l-q38', number: 38, prompt: '', answer: ['leave'], explanation: `ELEANOR: "they were forbidden to leave the Venetian Republic".` },
          { id: 'm2-l-q39', number: 39, prompt: '', answer: ['cut'], explanation: `ELEANOR: "it was also softer, which meant it was much easier to cut into the elaborate patterns".` },
          { id: 'm2-l-q40', number: 40, prompt: '', answer: ['tin'], explanation: `ELEANOR: "Molten glass is poured onto a bath of molten tin."` },
        ],
      },
    ],
  },
]

const letters = (...keys: string[]) => keys.map((k) => ({ key: k, text: `Paragraph ${k}` }))

const reading: ReadingSection[] = [
  // ───────────────────────────── Passage 1 ─────────────────────────────
  {
    id: 'm2-r-s1',
    title: 'Passage 1',
    passageTitle: 'Farming Upwards',
    passage: `A| In a former printing works on the edge of an industrial estate, rows of lettuces are growing in trays stacked twelve levels high, bathed in a pinkish-purple light. There is no soil, no sunlight and, as far as the eye can see, no farmer. Temperature, humidity and the composition of the air are adjusted continuously by software, and the plants are harvested by a machine that lifts each tray from its rack on a precise schedule. This is vertical farming: the cultivation of crops in stacked layers inside a closed, controlled building. Its supporters describe it as the future of food production. Its critics regard it as an extremely expensive way of growing salad.

B| The idea itself is not new. Architects sketched multi-storey farms as early as the 1910s, and in the 1950s several research institutes experimented with growing vegetables under artificial lamps. What held the concept back for most of the twentieth century was lighting. The lamps available were inefficient, converting most of the electricity they consumed into heat rather than light, and that heat then had to be removed by air-conditioning. The arrival of cheap, efficient light-emitting diodes (LEDs) in the early 2000s changed the calculation. LEDs can be tuned to emit only the red and blue wavelengths that plants use most for photosynthesis — hence the distinctive colour of most vertical farms — and they run cool enough to be placed just centimetres above the leaves, allowing layers to be stacked closely together.

C| Most vertical farms grow plants hydroponically, with their roots suspended in a shallow stream of water to which nutrients have been added. Some use a variation called aeroponics, in which the roots hang in the air and are sprayed with a fine nutrient mist. In both systems, the water that is not taken up by the plants is collected, filtered and pumped round again. Operators claim that, as a result, they use up to ninety-five per cent less water than a conventional farm for the same weight of produce. Because the building is sealed, insects and fungal diseases are rare, and most farms use no pesticides at all. Nor are crops at the mercy of drought, frost or flooding: a lettuce grown in a warehouse in January tastes exactly like one grown in June.

D| The most striking claim, however, concerns productivity. By stacking crops vertically and harvesting them all year round, a farm occupying a single hectare of floor space can, in principle, produce as many leafy greens as a hundred hectares of open fields. Growth is also faster: under optimised conditions, a lettuce that would take around eight weeks to mature outdoors can be ready in less than five. For cities where land is scarce and expensive, the attraction is obvious. Food can be grown within a few kilometres of the people who eat it, cutting transport costs and allowing it to reach supermarket shelves within hours of being picked, rather than days.

E| Yet the economics remain fragile. Sunlight, which costs a field farmer nothing, must be replaced entirely by electricity, and lighting typically accounts for between a quarter and a half of a vertical farm's operating costs. When energy prices across Europe rose sharply in 2022, several well-funded companies were forced to close facilities or stop trading altogether. Critics also point out that the environmental benefits depend heavily on where the electricity comes from: a farm powered by coal-fired generation may produce a lettuce with a larger carbon footprint than one grown in a field and transported by lorry across the continent. Start-up costs are high too, since a farm requires climate-control systems, automated equipment and specialist staff from the outset.

F| A further limitation lies in what can be grown. Leafy greens and herbs suit vertical farms well: they are small, grow quickly, and almost the whole plant can be sold. Staple crops are another matter. Wheat, rice and maize need a great deal of light to produce relatively little edible grain, and the calories they provide sell for very low prices. One study estimated that a loaf of bread made from wheat grown indoors would cost more than ten times as much as an ordinary loaf, largely because of the electricity required. For the foreseeable future, then, vertical farming is unlikely to feed the world; the crops that provide most of humanity's calories will continue to be grown outdoors.

G| Some in the industry argue that the right comparison is not with field farming but with greenhouses, and that the most promising future lies in combining the two approaches. Hybrid designs that use natural sunlight where possible and switch on LED lighting only on dull days are already being tested. Others see potential in places where conventional agriculture is almost impossible, such as desert cities that import most of their fresh food, or research stations in polar regions. Whatever its long-term role, vertical farming has already shown that food can be produced with very little water, land or pesticide. The question that remains is whether it can do so at a price that ordinary shoppers are willing to pay.`,
    groups: [
      {
        id: 'm2-r-g1',
        type: 'matching',
        instructions:
          'Reading Passage 1 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G. NB You may use any letter more than once.',
        options: letters('A', 'B', 'C', 'D', 'E', 'F', 'G'),
        questions: [
          { id: 'm2-r-q1', number: 1, prompt: 'an example of businesses failing because of rising costs', answer: ['E'], explanation: `Paragraph E: "When energy prices across Europe rose sharply in 2022, several well-funded companies were forced to close facilities or stop trading altogether."` },
          { id: 'm2-r-q2', number: 2, prompt: 'a description of how water is used more than once', answer: ['C'], explanation: `Paragraph C: "the water that is not taken up by the plants is collected, filtered and pumped round again."` },
          { id: 'm2-r-q3', number: 3, prompt: 'the reason why early attempts at indoor farming made little progress', answer: ['B'], explanation: `Paragraph B: "What held the concept back for most of the twentieth century was lighting."` },
          { id: 'm2-r-q4', number: 4, prompt: 'a comparison of how long a crop takes to grow indoors and outdoors', answer: ['D'], explanation: `Paragraph D: "a lettuce that would take around eight weeks to mature outdoors can be ready in less than five."` },
          { id: 'm2-r-q5', number: 5, prompt: 'a reference to places where ordinary farming is hardly possible', answer: ['G'], explanation: `Paragraph G: "places where conventional agriculture is almost impossible, such as desert cities... or research stations in polar regions."` },
        ],
      },
      {
        id: 'm2-r-g2',
        type: 'tfng',
        instructions:
          'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.',
        questions: [
          { id: 'm2-r-q6', number: 6, prompt: 'Most vertical farms are located in buildings that were originally used for other purposes.', answer: ['NOT GIVEN'], explanation: 'Paragraph A describes one farm in a former printing works, but nothing is said about where most farms are located.' },
          { id: 'm2-r-q7', number: 7, prompt: 'The LEDs used in vertical farms can be set to produce light of particular colours.', answer: ['TRUE'], explanation: `Paragraph B: "LEDs can be tuned to emit only the red and blue wavelengths that plants use most".` },
          { id: 'm2-r-q8', number: 8, prompt: 'Vertical farms usually depend on chemicals to protect crops from insects.', answer: ['FALSE'], explanation: `Paragraph C: "insects and fungal diseases are rare, and most farms use no pesticides at all."` },
          { id: 'm2-r-q9', number: 9, prompt: 'Crops from a vertical farm always have a smaller carbon footprint than those grown in fields.', answer: ['FALSE'], explanation: `Paragraph E: a coal-powered farm "may produce a lettuce with a larger carbon footprint than one grown in a field".` },
        ],
      },
      {
        id: 'm2-r-g3',
        type: 'completion',
        instructions: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
        maxWords: 1,
        title: 'The limits of vertical farming',
        content: `Vertical farms are particularly suitable for leafy greens and {{10}}, which grow fast and can be sold almost whole. Staple crops are a different case: wheat, for example, needs a lot of {{11}} but produces only a small amount of grain. According to one study, bread made from indoor wheat would be more than ten times the normal price, mostly because of the cost of {{12}}. Some people in the industry believe vertical farms should be compared not with field farming but with {{13}}, and hybrid designs combining the two are now being tested.`,
        questions: [
          { id: 'm2-r-q10', number: 10, prompt: '', answer: ['herbs'], explanation: `Paragraph F: "Leafy greens and herbs suit vertical farms well".` },
          { id: 'm2-r-q11', number: 11, prompt: '', answer: ['light'], explanation: `Paragraph F: "Wheat, rice and maize need a great deal of light to produce relatively little edible grain".` },
          { id: 'm2-r-q12', number: 12, prompt: '', answer: ['electricity'], explanation: `Paragraph F: "largely because of the electricity required."` },
          { id: 'm2-r-q13', number: 13, prompt: '', answer: ['greenhouses'], explanation: `Paragraph G: "the right comparison is not with field farming but with greenhouses".` },
        ],
      },
    ],
  },

  // ───────────────────────────── Passage 2 ─────────────────────────────
  {
    id: 'm2-r-s2',
    title: 'Passage 2',
    passageTitle: 'Running on Empty: The Science of Decision Fatigue',
    passage: `A| On an ordinary day, an adult makes a remarkable number of choices. Estimates vary wildly, and the often-repeated figure of 35,000 decisions a day has no clear scientific source, but even a cautious count of conscious choices — what to wear, what to eat, which email to answer first, whether to take the stairs or the lift — runs into the hundreds. Most of these feel trivial, and few people would describe choosing a sandwich as hard work. Yet a growing body of research suggests that making choices may carry a hidden cost: that the quality of our decisions declines the more of them we have to make. Psychologists call this phenomenon decision fatigue, and it has become one of the most widely discussed ideas in popular psychology.

B| The concept grew out of a series of experiments in the late 1990s on what researchers termed 'ego depletion'. In a typical study, volunteers who had first been told to resist a plate of freshly baked biscuits and eat radishes instead gave up sooner on an impossible puzzle than volunteers who had been allowed to eat the biscuits. The researchers proposed that self-control draws on a limited mental resource, rather like a muscle that tires with use. Later studies extended the idea to decision-making, finding that people who had spent time making a long series of choices between consumer products showed less persistence on later tasks than people who had simply rated the same products without choosing between them. Over the following decade, hundreds of studies appeared to confirm the effect, and the muscle metaphor became so familiar that it was rarely questioned.

C| The most widely cited real-world evidence came from a study of parole hearings published in 2011. Researchers examined more than a thousand decisions made by experienced judges and found a striking pattern. At the start of each session, about two-thirds of prisoners were granted parole. As the session went on, the proportion fell steadily, almost to zero, before jumping back to its original level after the judges took a meal break. The authors suggested that, as their mental resources ran down, the judges increasingly fell back on the easiest option — leaving things as they were, which in this case meant refusing parole. The study was reported around the world as proof that tired minds take the path of least resistance, and it is still quoted in management books today. Few readers paused to ask whether anything other than tiredness might explain the pattern.

D| However, the parole study soon attracted criticism. Other researchers pointed out that the order of cases was not random: prisoners without legal representation tended to be heard at the end of each session, and such cases were less likely to succeed regardless of when they were heard. The judges also tended to finish one group of related cases before a break, which may have shaped the timing of decisions in ways the original analysis did not capture. More seriously, the ego-depletion effect itself has proved difficult to reproduce. In 2016, a large project involving twenty-three laboratories repeated a standard depletion experiment and found an effect so small that it was statistically indistinguishable from zero. Further attempts have produced similarly mixed results, and some psychologists now question whether willpower is a finite resource at all.

E| Defenders of the idea argue that these failures do not mean decision fatigue is imaginary, only that the original explanation was too simple. One influential alternative proposes that what declines over time is not a store of mental energy but motivation. After a period of demanding activity, the mind becomes less willing to invest effort in the task at hand and more inclined to switch to something rewarding. On this view, fatigue is a signal rather than a shortage, and its effects can be offset if a task is made more meaningful or if people believe they still have energy left. Intriguingly, studies have found that people who regard willpower as unlimited show little or no depletion effect, which suggests that our beliefs about our own capacity may matter as much as the capacity itself.

F| Whatever its precise mechanism, the notion that too many choices can be draining has shaped practical advice. Some public figures have spoken of wearing similar clothes every day in order to save their decision-making capacity for matters that count. Hospitals have experimented with scheduling complex procedures early in the day, after studies found that doctors were more likely to prescribe unnecessary antibiotics as their shifts went on. Behavioural scientists recommend 'defaults' — pre-selected options such as automatic enrolment in pension schemes — which spare people the need to decide at all. Such measures make sense whether or not the underlying theory is correct, but researchers caution against exaggerating the evidence. The safest conclusion may be that people do make poorer choices when they are tired, hungry or overloaded, but that the reasons are more complicated than a mental fuel tank simply running dry.`,
    groups: [
      {
        id: 'm2-r-g4',
        type: 'matching',
        instructions:
          'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–viii.',
        title: 'List of Headings',
        options: [
          { key: 'i', text: 'Where the theory began' },
          { key: 'ii', text: 'A well-known example from the legal system' },
          { key: 'iii', text: 'Problems with the evidence' },
          { key: 'iv', text: 'A different explanation for the same effect' },
          { key: 'v', text: 'Putting the idea into practice' },
          { key: 'vi', text: 'The unseen cost of everyday choices' },
          { key: 'vii', text: 'Why judges are more cautious than other professionals' },
          { key: 'viii', text: 'The influence of diet on mental performance' },
        ],
        questions: [
          { id: 'm2-r-q14', number: 14, prompt: 'Paragraph A', answer: ['vi'], explanation: `Paragraph A: "making choices may carry a hidden cost".` },
          { id: 'm2-r-q15', number: 15, prompt: 'Paragraph B', answer: ['i'], explanation: `Paragraph B: "The concept grew out of a series of experiments in the late 1990s".` },
          { id: 'm2-r-q16', number: 16, prompt: 'Paragraph C', answer: ['ii'], explanation: 'Paragraph C describes the parole-hearing study of judges\' decisions.' },
          { id: 'm2-r-q17', number: 17, prompt: 'Paragraph D', answer: ['iii'], explanation: `Paragraph D: "the parole study soon attracted criticism... the ego-depletion effect itself has proved difficult to reproduce."` },
          { id: 'm2-r-q18', number: 18, prompt: 'Paragraph E', answer: ['iv'], explanation: `Paragraph E: "One influential alternative proposes that what declines over time is not a store of mental energy but motivation."` },
          { id: 'm2-r-q19', number: 19, prompt: 'Paragraph F', answer: ['v'], explanation: `Paragraph F: "the notion that too many choices can be draining has shaped practical advice" — clothing, hospital scheduling, defaults.` },
        ],
      },
      {
        id: 'm2-r-g5',
        type: 'mcq_multi',
        instructions: 'Choose TWO letters, A–E.',
        content: 'Which TWO criticisms of the research on decision fatigue are mentioned in the passage?',
        options: [
          { key: 'A', text: 'The judges in the parole study were inexperienced.' },
          { key: 'B', text: 'The cases in the parole study were not heard in a random order.' },
          { key: 'C', text: 'The parole study looked at too few decisions.' },
          { key: 'D', text: 'A large repeat of a standard experiment found almost no effect.' },
          { key: 'E', text: 'The original researchers were paid by food companies.' },
        ],
        questions: [
          { id: 'm2-r-q20', number: 20, prompt: '', answer: ['B'], explanation: `Paragraph D: "the order of cases was not random".` },
          { id: 'm2-r-q21', number: 21, prompt: '', answer: ['D'], explanation: `Paragraph D: twenty-three laboratories "found an effect so small that it was statistically indistinguishable from zero." (The judges were experienced and there were over a thousand decisions.)` },
        ],
      },
      {
        id: 'm2-r-g6',
        type: 'completion',
        instructions: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
        maxWords: 2,
        title: 'New thinking about decision fatigue',
        content: `One alternative theory suggests that what falls over time is not mental energy but {{22}}. According to this view, fatigue is a {{23}} rather than evidence of a shortage. People who consider willpower to be {{24}} appear to be hardly affected at all. In practice, hospitals have tried carrying out {{25}} earlier in the day, while behavioural scientists recommend pre-selected options, known as {{26}}, which remove the need to make a choice.`,
        questions: [
          { id: 'm2-r-q22', number: 22, prompt: '', answer: ['motivation'], explanation: `Paragraph E: "what declines over time is not a store of mental energy but motivation."` },
          { id: 'm2-r-q23', number: 23, prompt: '', answer: ['signal'], explanation: `Paragraph E: "fatigue is a signal rather than a shortage".` },
          { id: 'm2-r-q24', number: 24, prompt: '', answer: ['unlimited'], explanation: `Paragraph E: "people who regard willpower as unlimited show little or no depletion effect".` },
          { id: 'm2-r-q25', number: 25, prompt: '', answer: ['complex procedures', 'procedures'], explanation: `Paragraph F: "Hospitals have experimented with scheduling complex procedures early in the day".` },
          { id: 'm2-r-q26', number: 26, prompt: '', answer: ['defaults'], explanation: `Paragraph F: "Behavioural scientists recommend 'defaults' — pre-selected options".` },
        ],
      },
    ],
  },

  // ───────────────────────────── Passage 3 ─────────────────────────────
  {
    id: 'm2-r-s3',
    title: 'Passage 3',
    passageTitle: 'Should We Bring Back the Mammoth?',
    passage: `Few scientific announcements capture the public imagination quite like the promise to resurrect an extinct animal. In recent years, several companies and research groups have declared their intention to bring back the woolly mammoth, the passenger pigeon and the thylacine, the striped marsupial predator of Tasmania that vanished in the 1930s. The language used to describe these projects is often breathless, and the investment they attract is considerable. Yet before we celebrate, it is worth asking what exactly is being proposed, and whether it represents the best use of conservation's limited resources. My own view is that de-extinction, as it is currently promoted, is a fascinating technical challenge but a doubtful conservation strategy.

The first point to make is that nothing that has died out can truly be brought back. For species that disappeared thousands of years ago, no living cells survive, and the DNA recovered from bones or frozen tissue is broken into millions of tiny fragments. What researchers actually intend is to edit the genome of a closely related living species — in the mammoth's case, the Asian elephant — so that the resulting animal carries some of the extinct species' characteristics: dense hair, a thick layer of fat, perhaps smaller ears. The result would be a cold-tolerant elephant, not a mammoth. Proponents are usually careful to acknowledge this in their scientific papers, but the distinction tends to disappear in press releases and headlines, and I do not think it is pedantic to insist on it.

Supporters of de-extinction offer several justifications. The most persuasive, to my mind, is ecological. Large animals shape their environments, and some scientists argue that herds of cold-adapted elephants grazing the Arctic tundra could help restore the grasslands that once covered the region, trampling the snow and thereby keeping the permafrost beneath it frozen for longer. If this were achieved, it would slow the release of greenhouse gases currently locked in the frozen ground. It is an ingenious idea. The difficulty is one of scale: to have any measurable effect, the animals would need to number in the tens of thousands, and an elephant's pregnancy lasts nearly two years. Even under the most optimistic assumptions, meaningful numbers would take many decades to achieve — far too slowly to make a difference to the climate crisis we face now.

A second argument is that the research will produce tools that are useful for living species. Here I find myself in partial agreement. Techniques developed for de-extinction, such as methods for editing the genes of endangered animals to make them resistant to disease, could prove genuinely valuable. Scientists working on a project to revive the passenger pigeon have, for example, contributed to efforts to improve the genetic diversity of the black-footed ferret, a critically endangered North American species. But if these benefits are the real goal, it would surely be more efficient to pursue them directly rather than as a side effect of a project whose headline aim is something else.

This brings me to what I consider the most serious objection, which is cost. Conservation is chronically underfunded. Thousands of species are currently threatened with extinction, many of which could be saved by relatively cheap measures: protecting habitat, controlling invasive predators, enforcing laws against hunting. One widely discussed analysis by a group of ecologists concluded that spending money on reviving extinct species could, in many cases, lead to a net loss of biodiversity, because the same funds would protect a greater number of existing species if they were spent conventionally. Defenders reply that de-extinction is paid for largely by private investors who would never otherwise give to conservation, so no money is diverted. That is a fair point, as far as it goes. But public attention is also a limited resource, and I am not persuaded that the glamour of a resurrected mammoth will draw sympathy towards the less photogenic beetles and freshwater mussels that are quietly disappearing.

There is, too, the question of what economists call moral hazard. If the public comes to believe that extinction can be reversed, the urgency of preventing it may fade. Why fund expensive protection for a rare frog if science can simply recreate it later? This anxiety may be overstated; there is little evidence so far that people's attitudes have actually changed. Nevertheless, it seems unwise to send a message, however unintended, that extinction is no longer forever.

Finally, we should consider the animals themselves. A revived creature would be born without parents of its own kind to learn from, into a habitat that may have changed beyond recognition since its ancestors lived there. Elephants are highly social animals, and calves learn crucial behaviour from older members of the herd. A surrogate-born, laboratory-reared animal might well suffer in ways we cannot easily predict. I do not believe this objection on its own should halt all research, but it ought to carry more weight in public discussion than it currently does.

None of this is to say that the science should be abandoned. The genetic and reproductive techniques being developed are remarkable, and some of them will almost certainly help to save species that are still with us. But the priorities should be reversed: the work should be framed, funded and evaluated primarily as a tool for protecting living species, with the revival of extinct ones treated as, at most, a distant possibility. The mammoth has waited four thousand years; it can wait a little longer while we attend to the animals we are still in danger of losing.`,
    groups: [
      {
        id: 'm2-r-g7',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B, C or D.',
        questions: [
          {
            id: 'm2-r-q27', number: 27, prompt: 'What point does the writer make in the second paragraph?',
            options: [
              { key: 'A', text: 'The technology to edit elephant genes does not yet exist.' },
              { key: 'B', text: 'An animal produced by the project would not really be a mammoth.' },
              { key: 'C', text: 'Scientists have deliberately misled readers of their papers.' },
              { key: 'D', text: 'Mammoth DNA is too rare to be worth studying.' },
            ],
            answer: ['B'], explanation: `"The result would be a cold-tolerant elephant, not a mammoth." Scientists are "careful to acknowledge this in their scientific papers", so C is wrong.`,
          },
          {
            id: 'm2-r-q28', number: 28, prompt: 'Why does the writer doubt the ecological argument for de-extinction?',
            options: [
              { key: 'A', text: 'It is based on a misunderstanding of how permafrost forms.' },
              { key: 'B', text: 'Elephants would be unable to survive Arctic winters.' },
              { key: 'C', text: 'It would take far too long to have any real effect.' },
              { key: 'D', text: 'The grasslands of the Arctic cannot be restored.' },
            ],
            answer: ['C'], explanation: `"meaningful numbers would take many decades to achieve — far too slowly to make a difference to the climate crisis we face now."`,
          },
          {
            id: 'm2-r-q29', number: 29, prompt: 'The black-footed ferret is mentioned as an example of',
            options: [
              { key: 'A', text: 'a species that has been successfully revived.' },
              { key: 'B', text: 'a living species that has gained from de-extinction research.' },
              { key: 'C', text: 'a conservation project that was abandoned.' },
              { key: 'D', text: 'an animal threatened mainly by disease.' },
            ],
            answer: ['B'], explanation: 'Passenger-pigeon scientists "contributed to efforts to improve the genetic diversity of the black-footed ferret".',
          },
          {
            id: 'm2-r-q30', number: 30, prompt: 'What does the writer recommend in the final paragraph?',
            options: [
              { key: 'A', text: 'De-extinction research should be stopped altogether.' },
              { key: 'B', text: 'Private investors should fund conventional conservation instead.' },
              { key: 'C', text: 'The research should be directed mainly at protecting existing species.' },
              { key: 'D', text: 'The mammoth should be the first species to be revived.' },
            ],
            answer: ['C'], explanation: `"the work should be framed, funded and evaluated primarily as a tool for protecting living species". The writer says the science should not be abandoned.`,
          },
        ],
      },
      {
        id: 'm2-r-g8',
        type: 'ynng',
        instructions:
          'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.',
        questions: [
          { id: 'm2-r-q31', number: 31, prompt: 'It is important to distinguish between an extinct species and a modified version of a living relative.', answer: ['YES'], explanation: `Paragraph 2: "I do not think it is pedantic to insist on it."` },
          { id: 'm2-r-q32', number: 32, prompt: 'The ecological case is the strongest argument offered by supporters of de-extinction.', answer: ['YES'], explanation: `Paragraph 3: "The most persuasive, to my mind, is ecological."` },
          { id: 'm2-r-q33', number: 33, prompt: 'Most private investors in de-extinction would otherwise give money to conservation.', answer: ['NO'], explanation: `Paragraph 5: defenders say investors "would never otherwise give to conservation" and the writer calls this "a fair point".` },
          { id: 'm2-r-q34', number: 34, prompt: 'There is strong evidence that public concern about extinction has already declined.', answer: ['NO'], explanation: `Paragraph 6: "there is little evidence so far that people's attitudes have actually changed."` },
          { id: 'm2-r-q35', number: 35, prompt: 'Revived animals would probably live longer in captivity than in the wild.', answer: ['NOT GIVEN'], explanation: 'Paragraph 7 discusses the welfare of revived animals but says nothing about how long they would live in captivity or in the wild.' },
        ],
      },
      {
        id: 'm2-r-g9',
        type: 'matching',
        instructions: 'Complete each sentence with the correct ending, A–G, below. Write the correct letter, A–G.',
        options: [
          { key: 'A', text: 'is too badly broken up to be used without a living relative.' },
          { key: 'B', text: 'could help to prevent frozen ground from thawing.' },
          { key: 'C', text: 'could save many species that are currently under threat.' },
          { key: 'D', text: 'might reduce the sense of urgency about protecting wildlife.' },
          { key: 'E', text: 'may miss out on learning important behaviour.' },
          { key: 'F', text: 'would attract more money than any other conservation project.' },
          { key: 'G', text: 'has already been tested successfully on a small scale.' },
        ],
        questions: [
          { id: 'm2-r-q36', number: 36, prompt: 'DNA recovered from ancient bones or frozen tissue', answer: ['A'], explanation: `Paragraph 2: the DNA "is broken into millions of tiny fragments", so researchers must edit "a closely related living species".` },
          { id: 'm2-r-q37', number: 37, prompt: 'Herds of cold-adapted elephants on the Arctic tundra', answer: ['B'], explanation: `Paragraph 3: trampling the snow would keep "the permafrost beneath it frozen for longer."` },
          { id: 'm2-r-q38', number: 38, prompt: 'Inexpensive measures such as protecting habitat', answer: ['C'], explanation: `Paragraph 5: "many of which could be saved by relatively cheap measures: protecting habitat..."` },
          { id: 'm2-r-q39', number: 39, prompt: 'A belief that extinction can be reversed', answer: ['D'], explanation: `Paragraph 6: "If the public comes to believe that extinction can be reversed, the urgency of preventing it may fade."` },
          { id: 'm2-r-q40', number: 40, prompt: 'Young elephants raised without older members of a herd', answer: ['E'], explanation: `Paragraph 7: "calves learn crucial behaviour from older members of the herd."` },
        ],
      },
    ],
  },
]

const TASK1_TAIL =
  'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.'
const TASK2_TAIL =
  'Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.'

const writing: WritingTask[] = [
  {
    id: 'm2-w-t1',
    number: 1,
    kind: 'chart',
    prompt: `The bar chart below shows how the average household in one country divided its spending between seven categories in 2004 and 2024.\n\n${TASK1_TAIL}`,
    chart: {
      kind: 'bar',
      title: 'Share of average household spending by category, 2004 and 2024',
      categories: ['Housing', 'Food and drink', 'Transport', 'Leisure and recreation', 'Energy', 'Clothing', 'Other'],
      series: [
        { name: '2004', values: [21, 19, 15, 13, 5, 9, 18] },
        { name: '2024', values: [29, 14, 13, 15, 9, 5, 15] },
      ],
      unit: '%',
      xLabel: 'Category',
      yLabel: '% of total household spending',
    },
    visualDescription: `Bar chart: % of average household spending by category in one country, 2004 vs 2024 (each year totals 100).
Housing: 21 → 29 (largest in both years; biggest increase).
Food and drink: 19 → 14 (second largest in 2004, fell sharply).
Transport: 15 → 13.
Leisure and recreation: 13 → 15 (overtook food and transport by 2024).
Energy: 5 → 9 (almost doubled).
Clothing: 9 → 5 (nearly halved; largest relative fall).
Other: 18 → 15.
Only housing, leisure and energy rose; all other categories fell.`,
    minWords: 150,
    minutes: 20,
    sample: `The bar chart compares how the average household in one country divided its spending between seven categories in 2004 and 2024.

Overall, the most noticeable change was the growing share taken by housing, which became by far the largest expense, while the proportions spent on food and clothing fell considerably.

In 2004, housing accounted for just over a fifth of household spending (21%), only slightly ahead of food and drink (19%). Over the following two decades, however, the share devoted to housing rose to 29%, whereas food and drink dropped to 14%. Spending on energy also grew markedly in relative terms, almost doubling from 5% to 9%.

Among the remaining categories, clothing saw the steepest decline, falling from 9% to just 5%. Transport and miscellaneous items also fell, though more modestly, from 15% to 13% and from 18% to 15% respectively. Leisure and recreation was the only other category to grow, edging up from 13% to 15%, with the result that by 2024 households were spending a larger share on leisure than on either food or transport.`,
  },
  {
    id: 'm2-w-t2',
    number: 2,
    kind: 'essay',
    prompt: `Some people believe that university education should be free for all students and paid for by the government. Others argue that students should pay for their own higher education because they are the ones who benefit most from it.\n\nDiscuss both these views and give your own opinion.\n\n${TASK2_TAIL}`,
    minWords: 250,
    minutes: 40,
    sample: `Whether higher education should be funded by the state or by students themselves is a question that divides governments as much as individuals. While there are reasonable arguments for asking graduates to contribute, I believe that university tuition should largely be free.

Those who favour charging fees argue that graduates are the main beneficiaries of their degrees. On average, they earn considerably more over their lifetimes than non-graduates, so it seems unfair that a cleaner or a shop assistant who never attended university should help to pay, through taxation, for a future lawyer's education. Fees may also encourage students to choose their courses more carefully and to take their studies seriously, since they have a personal financial stake in the outcome.

On the other hand, the benefits of a university education are not confined to the individual. Society as a whole depends on doctors, engineers and teachers, and a better-educated population tends to be healthier, more innovative and more engaged in civic life. Moreover, high fees deter talented young people from poorer families, who are understandably reluctant to take on debts that may follow them for decades. If access to university depends on the ability to pay, a country wastes much of its potential and entrenches existing inequalities.

In my view, the second argument is the more convincing. The concern about fairness is real, but it is better addressed through a progressive tax system, under which high-earning graduates contribute more in any case, than through upfront fees that discourage the very students who would gain most. Free tuition should, however, be accompanied by accountability, so that public money supports courses of genuine value.

In conclusion, although graduates undoubtedly benefit personally, the wider social gains justify public funding, provided that it is spent wisely.`,
  },
]

const part1: SpeakingPart1 = {
  topics: [
    {
      topic: 'Hobbies',
      questions: [
        'Do you have any hobbies?',
        'How much time do you spend on your hobbies in a typical week?',
        'Did you have the same hobbies when you were a child?',
        'Is there a new hobby you would like to try in the future?',
      ],
    },
    {
      topic: 'Music',
      questions: [
        'How often do you listen to music?',
        'What kind of music is popular in your country?',
        'Do you prefer listening to music on your own or with other people?',
        'Have you ever been to a live concert?',
      ],
    },
    {
      topic: 'Your neighbourhood',
      questions: [
        'Can you describe the neighbourhood where you live?',
        'Do you know many of your neighbours?',
        'What do you like most about your neighbourhood?',
        'How could your neighbourhood be improved?',
      ],
    },
  ],
}

const part2: SpeakingPart2 = {
  topic: 'Describe a useful skill you learned',
  bullets: ['what the skill is', 'when and where you learned it', 'how you learned it or who taught you'],
  closing: 'and explain why this skill is useful to you.',
  roundOff: ['Would you like to teach this skill to someone else?', 'Was it difficult to learn?'],
  sample: `I'd like to talk about learning to cook properly, which is something I picked up when I was about nineteen, in my first year at university. Before that, to be honest, I could barely boil an egg, because my mum had always done the cooking at home.

So when I moved into shared student accommodation, I suddenly realised I was spending a fortune on takeaways, and I felt pretty rubbish most of the time as well. One of my flatmates, a guy called Arjun, was a brilliant cook, and he offered to teach me in exchange for some help with his statistics assignments, which seemed like a fair deal.

He started me off with really basic things — how to chop an onion properly, how to make a decent tomato sauce from scratch, that kind of thing. Then we gradually moved on to curries and stir-fries. What I found really useful was that he didn't just hand me recipes; he explained why you do things in a certain order, so after a while I could actually improvise with whatever happened to be left in the fridge.

As for why it's useful, well, partly it's money, obviously — I probably save around a hundred pounds a month compared with eating out. But it's more than that, really. I eat a lot more healthily now, and cooking has become a way for me to unwind after a long day. And I suppose it's quite a sociable skill as well, because I often have friends round for dinner, which I'd never have dared to do before.`,
}

const part3: SpeakingPart3 = {
  theme: 'Learning and skills',
  questions: [
    'Which skills do you think are most important for young people to learn today?',
    'Should practical skills like cooking or basic repairs be taught at school, or is that the job of parents?',
    'Do you think people learn new things more easily as children or as adults? Why?',
    'How important is it for workers to keep updating their skills throughout their careers?',
    'Some employers value experience more than formal qualifications. Is this fair?',
    'Will traditional skills, such as handwriting or mental arithmetic, still matter in the future?',
  ],
}

export const mock2: Test = {
  id: 'seed-academic-2',
  title: 'Academic Mock Test 2',
  variant: 'academic',
  description: 'A second complete computer-delivered Academic test: Listening, Reading, Writing and Speaking.',
  status: 'published',
  createdAt: T0,
  updatedAt: T0,
  listening: { sections: listening },
  reading: { sections: reading },
  writing: { tasks: writing },
  speaking: { part1, part2, part3 },
}
