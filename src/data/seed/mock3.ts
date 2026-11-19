import type { Test } from '../../lib/types'

// Original seed content written for this app — not taken from any published IELTS test.
// voices: NARRATOR=f, WOMAN=f, MAN=m, JAMES=m, PRIYA=f, TOM=m, DR HELEN MARSH=f, DR LUCY GRANT=f

const T0 = Date.UTC(2026, 0, 1)

const TASK1_TAIL =
  'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.'
const TASK2_TAIL =
  'Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.'

const PAPER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Arial, sans-serif" font-size="13">
  <defs>
    <marker id="m3arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#222"/>
    </marker>
  </defs>
  <rect width="640" height="360" fill="#fff"/>
  <text x="320" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#111">How recycled paper is made</text>
  <g fill="#fff" stroke="#222" stroke-width="1.5">
    <rect x="30" y="60" width="120" height="60" rx="6"/>
    <rect x="185" y="60" width="120" height="60" rx="6"/>
    <rect x="340" y="60" width="120" height="60" rx="6"/>
    <rect x="495" y="60" width="120" height="60" rx="6"/>
    <rect x="495" y="240" width="120" height="60" rx="6"/>
    <rect x="340" y="240" width="120" height="60" rx="6" stroke-dasharray="5 3"/>
    <rect x="185" y="240" width="120" height="60" rx="6"/>
    <rect x="30" y="240" width="120" height="60" rx="6"/>
  </g>
  <g fill="#111" text-anchor="middle" font-size="11.5">
    <text x="90" y="86">1. Waste paper<tspan x="90" dy="16">collected</tspan></text>
    <text x="245" y="86">2. Sorted into<tspan x="245" dy="16">grades at depot</tspan></text>
    <text x="400" y="86">3. Mixed with water<tspan x="400" dy="16">+ chemicals (pulper)</tspan></text>
    <text x="555" y="86">4. Screened: staples,<tspan x="555" dy="16">plastic removed</tspan></text>
    <text x="555" y="266">5. De-inked using<tspan x="555" dy="16">air bubbles</tspan></text>
    <text x="400" y="266">6. Bleached<tspan x="400" dy="16">(white paper only)</tspan></text>
    <text x="245" y="266">7. Pressed and dried<tspan x="245" dy="16">on heated rollers</tspan></text>
    <text x="90" y="266">8. Wound into rolls<tspan x="90" dy="16">and cut to size</tspan></text>
  </g>
  <g stroke="#222" stroke-width="2" marker-end="url(#m3arr)">
    <line x1="150" y1="90" x2="183" y2="90"/>
    <line x1="305" y1="90" x2="338" y2="90"/>
    <line x1="460" y1="90" x2="493" y2="90"/>
    <line x1="555" y1="120" x2="555" y2="238"/>
    <line x1="495" y1="270" x2="462" y2="270"/>
    <line x1="340" y1="270" x2="307" y2="270"/>
    <line x1="185" y1="270" x2="152" y2="270"/>
    <path d="M90,240 L90,122" fill="none" stroke-dasharray="5 4"/>
  </g>
  <text x="100" y="185" fill="#444" font-size="12">used paper returned</text>
  <text x="100" y="200" fill="#444" font-size="12">for recycling</text>
  <text x="400" y="320" text-anchor="middle" fill="#444" font-size="11">(dashed box = optional stage)</text>
</svg>`

export const mock3: Test = {
  id: 'seed-academic-3',
  title: 'Academic Mock Test 3',
  variant: 'academic',
  description: 'A complete computer-delivered Academic test: Listening, Reading, Writing and Speaking.',
  status: 'published',
  createdAt: T0,
  updatedAt: T0,

  // ════════════════════════════════════════════════════════════ LISTENING
  listening: {
    sections: [
      // ---------------------------------------------------------------- Part 1
      {
        id: 'm3-l-s1',
        title: 'Part 1',
        context: 'You will hear a woman telephoning a holiday letting agency to book a cottage for a family holiday.',
        transcript: `NARRATOR: Part One. You will hear a woman telephoning a holiday letting agency to book a cottage for a family holiday. First you have some time to look at questions 1 to 5.
NARRATOR: Now listen carefully and answer questions 1 to 5.
MAN: Good afternoon, Coastline Cottages, Mark speaking. How can I help?
WOMAN: Hello. I'm hoping to book a cottage for a week this summer. I saw a few on your website, but I wasn't sure which ones would suit us.
MAN: No problem at all. Can I start by taking your name?
WOMAN: Yes, it's Rachel Haldane.
MAN: Is that H-A-L-L...?
WOMAN: No, just one L. H-A-L-D-A-N-E.
MAN: Thank you. And how many people will be staying?
WOMAN: Four of us, my husband and I and our two teenage sons. Oh, and our dog, which is the tricky part.
MAN: Ah, right. That does rule a few out. Which ones caught your eye?
WOMAN: Well, we loved the look of Bramble Cottage, the one with the big garden.
MAN: It's lovely, but I'm afraid Bramble doesn't accept pets. The owners are very strict about it. Kestrel Cottage takes dogs, but it only sleeps three. The one I'd suggest is Heron Cottage. It sleeps up to five, dogs are welcome, and it's only a short walk from the sea.
WOMAN: Heron Cottage. That sounds ideal. Let's go with that.
MAN: And what dates were you thinking of?
WOMAN: We were hoping to arrive on Saturday the twelfth of July.
MAN: Let me just check... I'm sorry, Heron's already booked that week. The following Saturday is free, though, the nineteenth.
WOMAN: The nineteenth of July. Yes, that should be fine. The boys don't finish school until the eighteenth anyway.
MAN: Great. So that's seven nights, from the nineteenth to the twenty-sixth.
WOMAN: And how much will that come to?
MAN: In the low season it's seven hundred and sixty pounds a week, but July counts as high season, so it's eight hundred and forty. There's normally a pet charge of twenty-five pounds on top, but the owners of Heron Cottage don't charge it.
WOMAN: So eight hundred and forty in total. That's fine. Is everything provided? Bedding, towels and so on?
MAN: The beds will be made up when you arrive, so you don't need to bring sheets or duvet covers. But the owners don't supply towels, so you'll need to bring your own. There's a washing machine if you need one.
WOMAN: OK, towels. I'll make a note of that.
NARRATOR: Before you hear the rest of the conversation, you have some time to look at questions 6 to 10.
NARRATOR: Now listen and answer questions 6 to 10.
WOMAN: Could you tell me a bit about arriving? How do we get the keys?
MAN: Yes. The owners live abroad, so the keys are left in the village. A lot of our cottages use the village shop, but it closes at lunchtime on Saturdays, so for Heron Cottage you collect them from the post office. It's open until six.
WOMAN: The post office. Got it. And is there internet?
MAN: There's Wi-Fi, yes. The password used to be written in the welcome folder, but guests kept taking the folder home with them, so now it's on a card stuck to the fridge.
WOMAN: Very sensible. How far is the beach?
MAN: The website says ten minutes, but that's by car. On foot it's about twenty minutes along the road, though if you take the cliff path it's quicker, about fifteen minutes' walk.
WOMAN: Fifteen minutes, lovely. And parking? We might have two cars, because my brother's joining us for a couple of days.
MAN: There's one space outside the cottage. Please don't park on the lane, because the farmer needs to get his tractor past. But there's a free car park next to the church, which is just round the corner.
WOMAN: Next to the church. Perfect. Any tips for things to do?
MAN: Your boys might enjoy cycling. There's a lovely trail along the old railway line, and you can hire bikes from the little shop beside the harbour. I'd book a day ahead in summer, though, as they get very busy.
WOMAN: That sounds great. Right, how do I pay?
MAN: I'll email you a secure payment link this afternoon, and the booking's confirmed as soon as the deposit goes through.
WOMAN: Thanks so much, Mark.
NARRATOR: That is the end of Part One.`,
        groups: [
          {
            id: 'm3-l-g1',
            type: 'completion',
            instructions: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
            maxWords: 2,
            allowNumber: true,
            title: 'Holiday cottage booking',
            content: `## Coastline Cottages — Booking Form
| Customer name | Rachel {{1}} |
| Party | 4 people and 1 dog |
| Cottage chosen | {{2}} Cottage |
| Arrival date | {{3}} (7 nights) |
| Total cost | £{{4}} |
| Guests must bring their own | {{5}} |
## Arrival information
- Collect the keys from the {{6}} (open until 6 pm)
- Wi-Fi password: on a card on the {{7}}
- Beach: about {{8}} minutes on foot using the cliff path
- Extra car: free car park next to the {{9}}
- Bikes can be hired from a shop beside the {{10}}`,
            questions: [
              { id: 'm3-l-q1', number: 1, prompt: '', answer: ['Haldane'], explanation: 'WOMAN: "No, just one L. H-A-L-D-A-N-E."' },
              { id: 'm3-l-q2', number: 2, prompt: '', answer: ['Heron'], explanation: 'MAN: "The one I\'d suggest is Heron Cottage." WOMAN: "Let\'s go with that." (Bramble does not accept pets; Kestrel only sleeps three.)' },
              { id: 'm3-l-q3', number: 3, prompt: '', answer: ['19 July', '19th July', 'July 19', 'July 19th', '19/7', '19/07'], explanation: 'MAN: "Heron\'s already booked that week. The following Saturday is free, though, the nineteenth." (The 12th was the first request.)' },
              { id: 'm3-l-q4', number: 4, prompt: '', answer: ['840', '840.00'], explanation: 'MAN: "July counts as high season, so it\'s eight hundred and forty." (£760 is the low-season price; the pet charge is not applied.)' },
              { id: 'm3-l-q5', number: 5, prompt: '', answer: ['towels'], explanation: 'MAN: "the owners don\'t supply towels, so you\'ll need to bring your own." (Bedding is provided.)' },
              { id: 'm3-l-q6', number: 6, prompt: '', answer: ['post office'], explanation: 'MAN: "for Heron Cottage you collect them from the post office." (The village shop closes at lunchtime on Saturdays.)' },
              { id: 'm3-l-q7', number: 7, prompt: '', answer: ['fridge'], explanation: 'MAN: "now it\'s on a card stuck to the fridge." (It used to be in the welcome folder.)' },
              { id: 'm3-l-q8', number: 8, prompt: '', answer: ['15', 'fifteen'], explanation: 'MAN: "if you take the cliff path it\'s quicker, about fifteen minutes\' walk." (Ten minutes is by car; twenty is along the road.)' },
              { id: 'm3-l-q9', number: 9, prompt: '', answer: ['church'], explanation: 'MAN: "there\'s a free car park next to the church".' },
              { id: 'm3-l-q10', number: 10, prompt: '', answer: ['harbour', 'harbor'], explanation: 'MAN: "you can hire bikes from the little shop beside the harbour."' },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Part 2
      {
        id: 'm3-l-s2',
        title: 'Part 2',
        context: 'You will hear the manager of a city farm talking to a group of new volunteers on their first morning.',
        transcript: `NARRATOR: Part Two. You will hear the manager of a city farm talking to a group of new volunteers on their first morning. First you have some time to look at questions 11 to 15.
NARRATOR: Now listen carefully and answer questions 11 to 15.
JAMES: Morning, everyone, and thanks for coming. I'm James, and I manage Millbrook City Farm. You're the biggest group of new volunteers we've ever had, so I'll keep this short and then we'll get you out onto the farm.
JAMES: First, a bit of background. People often assume this land was always a park, or that the council set the farm up. In fact, until the late nineteen-seventies the whole site was a railway goods yard. When the yard closed, a group of local parents cleared the land themselves, because they wanted somewhere their children could see animals. The council only got involved years later.
JAMES: These days we get about forty thousand visitors a year. The council does give us a small grant, but it's been cut twice in the last five years, so it's a fairly minor part of our income. We also charge schools a small fee for organised visits, but that barely covers the cost of our education officer. The bulk of our money comes from donations and from what we make in the café.
JAMES: Now, some practical points. You'll each shadow an experienced volunteer for your first three sessions. A few of you asked about training. There is a short online food hygiene course, but that's only for people working in the café. And you don't need to buy any special clothing; we've got boots in every size in the shed by the gate. What all of you must do, before you go near any of the animals, is attend the health and safety briefing. The next one's this Thursday at ten.
JAMES: As for hours, we ask for one session a week, and a session is three hours. We're very flexible about which day you choose, weekdays or weekends. The one thing we're strict about is letting us know if you can't come. Please text the volunteer phone by eight in the morning, because the animals have to be fed whatever happens.
JAMES: And this year's new project. We'd hoped to put up a new barn, but we're still waiting for planning permission. There's been talk of opening a farm shop, too, but that's some way off. What is going ahead this spring is a sensory garden, with scented plants and different textures, designed for visitors with disabilities. We'll need plenty of help planting it.
NARRATOR: Now look at questions 16 to 20.
NARRATOR: Now listen and answer questions 16 to 20.
JAMES: Right, let me quickly run through the main areas of the farm. First, the goat barn. The goats are probably our biggest attraction. You'd expect the school groups to make straight for them, but actually the children are far more interested in the pigs. The thing to know about the goat barn is that it's shut to the public every day between twelve and two, so the goats can rest. They get very stressed by crowds.
JAMES: Then there are the vegetable plots, right at the back of the farm. That's where all of you will start, for your first few weeks, because it's the easiest place to learn how we work.
JAMES: Next, the beehives. Some of you have asked about helping there. Bees are surprisingly calm if you're careful, but for safety reasons nobody, not even me, goes into the beehive enclosure without one of our two beekeepers.
JAMES: The duck pond. You'll find it on the left of the main gate now. It used to be behind the barn, but last autumn we dug a new one near the entrance, so that visitors in wheelchairs can get close to the water. By the way, the fence around the pig pen is being repaired at the moment, so please use the side path there.
JAMES: And finally, the café. It's run entirely by volunteers, and it's become really busy at weekends, so, honestly, we're always short of people there. If you enjoy chatting to the public, please put your name down.
NARRATOR: That is the end of Part Two.`,
        groups: [
          {
            id: 'm3-l-g2',
            type: 'mcq',
            instructions: 'Choose the correct letter, A, B or C.',
            questions: [
              {
                id: 'm3-l-q11', number: 11, prompt: 'Before the farm was created, the site was',
                options: [{ key: 'A', text: 'a public park.' }, { key: 'B', text: 'a railway yard.' }, { key: 'C', text: 'land owned by the council.' }],
                answer: ['B'], explanation: 'JAMES: "until the late nineteen-seventies the whole site was a railway goods yard." People only assume it was a park or a council project.',
              },
              {
                id: 'm3-l-q12', number: 12, prompt: 'Most of the farm\'s income comes from',
                options: [{ key: 'A', text: 'a council grant.' }, { key: 'B', text: 'fees paid by schools.' }, { key: 'C', text: 'donations and the café.' }],
                answer: ['C'], explanation: 'JAMES: "The bulk of our money comes from donations and from what we make in the café." The grant is "a fairly minor part"; school fees "barely cover" costs.',
              },
              {
                id: 'm3-l-q13', number: 13, prompt: 'Before working with animals, all volunteers must',
                options: [{ key: 'A', text: 'complete an online course.' }, { key: 'B', text: 'attend a safety briefing.' }, { key: 'C', text: 'buy suitable boots.' }],
                answer: ['B'], explanation: 'JAMES: "What all of you must do, before you go near any of the animals, is attend the health and safety briefing." The online course is only for café volunteers; boots are provided.',
              },
              {
                id: 'm3-l-q14', number: 14, prompt: 'What does James say about volunteers\' hours?',
                options: [{ key: 'A', text: 'Volunteers must work at weekends.' }, { key: 'B', text: 'Sessions can be any length.' }, { key: 'C', text: 'Volunteers must report if they cannot attend.' }],
                answer: ['C'], explanation: 'JAMES: "The one thing we\'re strict about is letting us know if you can\'t come." Sessions are three hours; any day is fine.',
              },
              {
                id: 'm3-l-q15', number: 15, prompt: 'Which new project will go ahead this spring?',
                options: [{ key: 'A', text: 'a new barn' }, { key: 'B', text: 'a farm shop' }, { key: 'C', text: 'a sensory garden' }],
                answer: ['C'], explanation: 'JAMES: "What is going ahead this spring is a sensory garden". The barn is waiting for permission; the shop is "some way off".',
              },
            ],
          },
          {
            id: 'm3-l-g3',
            type: 'matching',
            instructions: 'What does James say about each area of the farm? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
            options: [
              { key: 'A', text: 'is closed to visitors at certain times' },
              { key: 'B', text: 'is where new volunteers will start' },
              { key: 'C', text: 'needs more volunteers' },
              { key: 'D', text: 'has recently been moved' },
              { key: 'E', text: 'must not be entered without an expert' },
              { key: 'F', text: 'is the most popular with school groups' },
              { key: 'G', text: 'is being repaired' },
            ],
            questions: [
              { id: 'm3-l-q16', number: 16, prompt: 'Goat barn', answer: ['A'], explanation: 'JAMES: "it\'s shut to the public every day between twelve and two". Children prefer the pigs, so not F.' },
              { id: 'm3-l-q17', number: 17, prompt: 'Vegetable plots', answer: ['B'], explanation: 'JAMES: "That\'s where all of you will start, for your first few weeks".' },
              { id: 'm3-l-q18', number: 18, prompt: 'Beehives', answer: ['E'], explanation: 'JAMES: "nobody, not even me, goes into the beehive enclosure without one of our two beekeepers."' },
              { id: 'm3-l-q19', number: 19, prompt: 'Duck pond', answer: ['D'], explanation: 'JAMES: "It used to be behind the barn, but last autumn we dug a new one near the entrance". (The pig pen fence is being repaired, not the pond.)' },
              { id: 'm3-l-q20', number: 20, prompt: 'Café', answer: ['C'], explanation: 'JAMES: "we\'re always short of people there. If you enjoy chatting to the public, please put your name down."' },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Part 3
      {
        id: 'm3-l-s3',
        title: 'Part 3',
        context: 'You will hear two students, Priya and Tom, talking to their tutor, Dr Helen Marsh, about a survey they carried out on how people commute.',
        transcript: `NARRATOR: Part Three. You will hear two students, Priya and Tom, talking to their tutor, Dr Helen Marsh, about a survey they carried out on how people commute. First you have some time to look at questions 21 to 26.
NARRATOR: Now listen carefully and answer questions 21 to 26.
DR HELEN MARSH: Hello, Priya, Tom. Have a seat. So, the commuting survey is finished. Tell me how the pilot went first, because I know you changed a few things afterwards.
PRIYA: Yes, we did. We piloted it with about twenty people at the main bus station. The questionnaire itself seemed to work. People finished it in about five minutes, so we didn't need to cut anything.
TOM: We thought about putting it online to reach more people, but in the end we felt face-to-face interviews gave us better answers, so we kept that.
PRIYA: The first real change was where we did the interviews. At the bus station, obviously, almost everyone was a bus user, so for the main survey we moved to the entrance of the shopping centre, where you get a much better mix of people.
DR HELEN MARSH: Sensible. And the second change?
TOM: Several people in the pilot said that what mattered most to them was how much their journey cost, and we hadn't asked about that at all. So we added a question on weekly travel costs.
DR HELEN MARSH: Did you consider offering an incentive? A prize draw, say?
PRIYA: We did discuss it, but the department told us we weren't allowed to.
DR HELEN MARSH: Fair enough. Now, I've looked at your data. Two hundred and twelve responses is plenty for a project like this, so size isn't a concern. What does worry me a little is who your respondents are. Nearly half of them describe themselves as students.
TOM: That's probably because the shopping centre's right next to the college.
DR HELEN MARSH: Probably. The age range looks reasonable, but you'll need to acknowledge that students are over-represented when you write it up.
DR HELEN MARSH: What did you find about journey times?
PRIYA: We'd expected people here to have shorter commutes than the national average, because it's quite a compact city. But our average was thirty-eight minutes each way, which is almost exactly the national figure.
TOM: And we can't really say whether journeys have got longer, because there's no earlier local survey to compare with.
DR HELEN MARSH: In your draft you compare the types of transport: car, bus, bike and so on. That's fine, but it can be misleading, because cyclists tend to live much closer to where they work. I think you'd get more out of the data if you grouped people by how far they travel. I know you'd been thinking of grouping them by age, but I'd do distance first.
PRIYA: OK, that makes sense.
DR HELEN MARSH: So, what's next?
TOM: I was going to start redrawing the charts, but Priya thought we should get some official figures first.
PRIYA: The city council's transport office publishes passenger numbers, and it would be good to check our results against them.
TOM: Yes, all right. I'll email the transport office this afternoon, and the charts can wait until we've heard back.
NARRATOR: Before you hear the rest of the discussion, you have some time to look at questions 27 to 30.
NARRATOR: Now listen and answer questions 27 to 30.
DR HELEN MARSH: Let's go through your main findings for each group of commuters. Start with the cyclists.
TOM: Well, the cyclists were by far the happiest with their journey. Nearly ninety per cent said they were satisfied or very satisfied, even the ones who cycle in the rain.
DR HELEN MARSH: And the bus users?
PRIYA: We'd assumed bus users would complain most about reliability, but that wasn't the big issue. Fares went up in the spring, and over sixty per cent of them said cost was their biggest concern.
DR HELEN MARSH: The drivers?
TOM: Drivers were the group most likely to describe their journey as stressful, mostly because of the traffic on the ring road. We asked whether anything would make them leave the car at home, and very few said they would, even if parking prices went up.
DR HELEN MARSH: And train passengers?
PRIYA: There weren't many of them, but what stood out was how they use the time. Most said they read or answer emails on the train, so for them the journey is really part of the working day.
DR HELEN MARSH: That's a nice point to finish your results section on. Well done, both of you.
NARRATOR: That is the end of Part Three.`,
        groups: [
          {
            id: 'm3-l-g4',
            type: 'mcq_multi',
            instructions: 'Choose TWO letters, A–E.',
            content: 'Which TWO changes did the students make after the pilot survey?',
            options: [
              { key: 'A', text: 'They shortened the questionnaire.' },
              { key: 'B', text: 'They added a question about cost.' },
              { key: 'C', text: 'They changed where the interviews took place.' },
              { key: 'D', text: 'They offered a prize draw.' },
              { key: 'E', text: 'They moved the survey online.' },
            ],
            questions: [
              { id: 'm3-l-q21', number: 21, prompt: '', answer: ['B'], explanation: 'TOM: "So we added a question on weekly travel costs."' },
              { id: 'm3-l-q22', number: 22, prompt: '', answer: ['C'], explanation: 'PRIYA: "for the main survey we moved to the entrance of the shopping centre". They did not shorten it, go online or offer a prize.' },
            ],
          },
          {
            id: 'm3-l-g5',
            type: 'mcq',
            instructions: 'Choose the correct letter, A, B or C.',
            questions: [
              {
                id: 'm3-l-q23', number: 23, prompt: 'What concern does the tutor have about the sample?',
                options: [{ key: 'A', text: 'It is too small.' }, { key: 'B', text: 'It contains too many students.' }, { key: 'C', text: 'It does not cover a range of ages.' }],
                answer: ['B'], explanation: 'DR HELEN MARSH: "Nearly half of them describe themselves as students... students are over-represented". Size "isn\'t a concern"; the age range "looks reasonable".',
              },
              {
                id: 'm3-l-q24', number: 24, prompt: 'What did the students discover about the length of commutes?',
                options: [{ key: 'A', text: 'It was shorter than the national average.' }, { key: 'B', text: 'It was similar to the national average.' }, { key: 'C', text: 'It had increased in recent years.' }],
                answer: ['B'], explanation: 'PRIYA: "our average was thirty-eight minutes each way, which is almost exactly the national figure." They cannot say whether journeys have got longer.',
              },
              {
                id: 'm3-l-q25', number: 25, prompt: 'The tutor suggests analysing the data according to',
                options: [{ key: 'A', text: 'the distance people travel.' }, { key: 'B', text: 'the age of the respondents.' }, { key: 'C', text: 'the type of transport used.' }],
                answer: ['A'], explanation: 'DR HELEN MARSH: "you\'d get more out of the data if you grouped people by how far they travel."',
              },
              {
                id: 'm3-l-q26', number: 26, prompt: 'What will Tom do next?',
                options: [{ key: 'A', text: 'redraw the charts' }, { key: 'B', text: 'contact the council' }, { key: 'C', text: 'revise the questionnaire' }],
                answer: ['B'], explanation: 'TOM: "I\'ll email the transport office this afternoon, and the charts can wait".',
              },
            ],
          },
          {
            id: 'm3-l-g6',
            type: 'matching',
            instructions: 'What did the survey find about each group of commuters? Choose FOUR answers from the box and write the correct letter, A–F, next to Questions 27–30.',
            options: [
              { key: 'A', text: 'found their journey the most stressful' },
              { key: 'B', text: 'said their journeys had become longer' },
              { key: 'C', text: 'would change if parking became more expensive' },
              { key: 'D', text: 'use their journey time productively' },
              { key: 'E', text: 'were the most satisfied group' },
              { key: 'F', text: 'said cost was their main concern' },
            ],
            questions: [
              { id: 'm3-l-q27', number: 27, prompt: 'Cyclists', answer: ['E'], explanation: 'TOM: "the cyclists were by far the happiest with their journey."' },
              { id: 'm3-l-q28', number: 28, prompt: 'Bus users', answer: ['F'], explanation: 'PRIYA: "over sixty per cent of them said cost was their biggest concern." Reliability "wasn\'t the big issue".' },
              { id: 'm3-l-q29', number: 29, prompt: 'Car drivers', answer: ['A'], explanation: 'TOM: "Drivers were the group most likely to describe their journey as stressful". Very few would switch even if parking prices rose, so not C.' },
              { id: 'm3-l-q30', number: 30, prompt: 'Train passengers', answer: ['D'], explanation: 'PRIYA: "Most said they read or answer emails on the train, so for them the journey is really part of the working day."' },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Part 4
      {
        id: 'm3-l-s4',
        title: 'Part 4',
        context: 'You will hear a lecture in an environmental science course about the restoration of coral reefs.',
        transcript: `NARRATOR: Part Four. You will hear a lecture in an environmental science course about the restoration of coral reefs. First you have some time to look at questions 31 to 40.
NARRATOR: Now listen carefully and answer questions 31 to 40.
DR LUCY GRANT: Good morning, everyone. Today I want to look at coral reef restoration: why it's needed, the main techniques scientists are using, and what we can realistically expect it to achieve.
DR LUCY GRANT: Let's start with why reefs matter. Coral reefs cover less than one per cent of the ocean floor, and yet roughly a quarter of all marine species depend on them at some stage of their lives. They matter enormously to people, too. A healthy reef acts as a natural breakwater. It can absorb most of the energy of incoming waves before they reach the shore, which protects coastal towns from storms and erosion. Fishing and tourism are important as well, of course, but it's this protection that communities living behind reefs tend to value most.
DR LUCY GRANT: So what's going wrong? Overfishing and pollution from farmland both cause serious damage. But the biggest single threat is rising sea temperature. Corals depend on microscopic algae that live inside their tissues. The algae produce most of the coral's food through photosynthesis, and they also give it its colour. When the water stays too warm for several weeks, the coral expels the algae and turns white. That's what we call bleaching. A bleached coral isn't dead yet, but if temperatures don't fall, it will starve.
DR LUCY GRANT: Now, restoration. I'll describe four newer approaches first, and then come back to the method that's been used the longest.
DR LUCY GRANT: The first is larval seeding. Many corals reproduce in a single mass spawning event, when colonies across a whole reef release their eggs and sperm on the same night. The timing isn't random. It's set by the moon, and spawning usually happens a few nights after a full moon in the warmer months. Researchers collect the spawn from the surface with floating nets, raise the larvae in tanks for about a week, and then release them over damaged areas of reef.
DR LUCY GRANT: The second approach deals with a problem you might not expect. After a storm, or blast fishing, a reef can be reduced to loose rubble. Young corals settle on it, but the rubble keeps shifting and they get crushed. In Indonesia, teams have fixed the rubble in place with small hexagonal steel frames. The frames are coated with sand, partly because the rough surface helps young corals attach, and they're cheap enough for local communities to build themselves.
DR LUCY GRANT: The third approach is sometimes called assisted evolution. The idea is to find colonies that survived a bleaching event when others around them died, and to use them as parents in breeding programmes, in the hope that their offspring will inherit some of that tolerance to heat. It's promising, but it risks reducing genetic diversity, so it has to be done very carefully.
DR LUCY GRANT: The fourth is my favourite, because it's so simple. A healthy reef is a noisy place. Fish grunt, shrimps snap, and young fish use that noise to find somewhere to settle. Researchers placed underwater loudspeakers on patches of dead reef and played recordings of the sound of a healthy reef. Those patches attracted roughly twice as many young fish as silent ones, and the fish then help the reef recover by grazing on seaweed.
DR LUCY GRANT: Finally, coral gardening, which is still the most widely used method. It works rather like a plant nursery. First, divers cut small fragments from healthy donor colonies. They only take a small part of each colony, so the donors aren't harmed. The fragments are then hung on frames in an underwater nursery. Early nurseries used flat tables, but these days most use frames shaped like trees, made of plastic pipe, so the fragments hang freely and get plenty of light and current.
DR LUCY GRANT: Some guides say the fragments are ready to move after about six months, but in our own projects we've found they usually need nine months to grow large enough. Then they're attached to the damaged reef. In the past, divers tied them on with cable ties, but these often snapped, so now we use a special marine cement that sets underwater.
DR LUCY GRANT: Gardening works, but it's slow and expensive, and even the largest projects cover only a few hectares. Restoration can buy time, but unless we deal with warming seas themselves, it can't save reefs on its own. Next week we'll look at marine protected areas.
NARRATOR: That is the end of Part Four.`,
        groups: [
          {
            id: 'm3-l-g7',
            type: 'completion',
            instructions: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
            maxWords: 1,
            title: 'Coral reef restoration',
            content: `## Why reefs matter
- Home to about a quarter of all marine species
- Protect coastal towns by absorbing the energy of {{31}}
## Main threat: rising sea temperature
- Corals expel the {{32}} living in their tissues and turn white (bleaching)
## Newer restoration methods
- Larval seeding: the timing of mass spawning is set by the {{33}}
- Rubble: fixed with hexagonal steel frames coated with {{34}}
- Assisted evolution: corals that survived bleaching are used as {{35}} in breeding programmes
- Loudspeakers play recordings of the {{36}} of a healthy reef to attract young fish`,
            questions: [
              { id: 'm3-l-q31', number: 31, prompt: '', answer: ['waves'], explanation: 'DR LUCY GRANT: "It can absorb most of the energy of incoming waves before they reach the shore".' },
              { id: 'm3-l-q32', number: 32, prompt: '', answer: ['algae'], explanation: 'DR LUCY GRANT: "When the water stays too warm for several weeks, the coral expels the algae and turns white."' },
              { id: 'm3-l-q33', number: 33, prompt: '', answer: ['moon'], explanation: 'DR LUCY GRANT: "The timing isn\'t random. It\'s set by the moon".' },
              { id: 'm3-l-q34', number: 34, prompt: '', answer: ['sand'], explanation: 'DR LUCY GRANT: "The frames are coated with sand".' },
              { id: 'm3-l-q35', number: 35, prompt: '', answer: ['parents'], explanation: 'DR LUCY GRANT: "to use them as parents in breeding programmes".' },
              { id: 'm3-l-q36', number: 36, prompt: '', answer: ['sound', 'sounds', 'noise'], explanation: 'DR LUCY GRANT: "played recordings of the sound of a healthy reef."' },
            ],
          },
          {
            id: 'm3-l-g8',
            type: 'completion',
            instructions: 'Complete the flow-chart below. Write ONE WORD AND/OR A NUMBER for each answer.',
            maxWords: 1,
            allowNumber: true,
            title: 'Coral gardening',
            content: `- Small fragments are cut from healthy {{37}} colonies
- ↓
- Fragments are hung on frames shaped like {{38}} in an underwater nursery
- ↓
- After about {{39}} months, fragments are large enough to move
- ↓
- Fragments are fixed to the damaged reef with marine {{40}}`,
            questions: [
              { id: 'm3-l-q37', number: 37, prompt: '', answer: ['donor'], explanation: 'DR LUCY GRANT: "divers cut small fragments from healthy donor colonies."' },
              { id: 'm3-l-q38', number: 38, prompt: '', answer: ['trees', 'tree'], explanation: 'DR LUCY GRANT: "these days most use frames shaped like trees" (early nurseries used tables).' },
              { id: 'm3-l-q39', number: 39, prompt: '', answer: ['9', 'nine'], explanation: 'DR LUCY GRANT: "Some guides say... about six months, but... they usually need nine months".' },
              { id: 'm3-l-q40', number: 40, prompt: '', answer: ['cement'], explanation: 'DR LUCY GRANT: "now we use a special marine cement that sets underwater." (Cable ties were used in the past.)' },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════ READING
  reading: {
    sections: [
      // ───────────────────────────── Passage 1 ─────────────────────────────
      {
        id: 'm3-r-s1',
        title: 'Passage 1',
        passageTitle: 'From Hobby-Horse to Safety Bicycle',
        passage: `In the summer of 1817, a German civil servant named Karl von Drais set off from the city of Mannheim on a machine that few of the people watching had ever seen before. It consisted of two wooden wheels of equal size, joined by a wooden beam on which the rider sat. There were no pedals: the rider pushed against the ground with alternate feet, gliding forward in a kind of long running stride, and steered by turning a bar connected to the front wheel. Drais covered roughly fourteen kilometres in a little over an hour, considerably faster than a person could walk. His invention, which he called the Laufmaschine or 'running machine', is generally regarded as the earliest ancestor of the modern bicycle.

Why Drais built it is still debated. One popular explanation links the machine to the eruption of the Indonesian volcano Tambora in 1815, which caused crop failures across Europe the following year. With oats scarce and expensive, the argument goes, many horses were slaughtered or starved, and there was a pressing need for a form of personal transport that did not depend on animals. The theory is appealing, but historians point out that Drais left no written statement of his motives, and that he had been experimenting with human-powered carriages for several years before the volcano erupted.

For a brief period the running machine was fashionable. Copies soon appeared in Paris and London, where they were known as draisines or hobby-horses, and they became the playthings of wealthy young men. But the craze faded almost as quickly as it had begun. Riders found the machines exhausting on rough, rutted roads, and when they took to the smoother pavements instead, they collided with pedestrians. Several cities introduced bans or fines, and by the early 1820s the hobby-horse had become an object of ridicule in newspaper cartoons.

Nearly half a century passed before the next decisive step. In the 1860s, workshops in Paris began fitting cranks and pedals directly to the front wheel of a two-wheeled machine. Exactly who did so first is a matter of dispute — at least three people later claimed the honour — but the result, the velocipede, was soon being manufactured in large numbers. Its frame was made of heavy iron, and its wooden wheels had iron rims, so that every stone in the road was transmitted straight to the rider's spine. In Britain it acquired the nickname 'boneshaker', and it was said by some to be harder work to ride than to walk.

Because the pedals turned the front wheel directly, one turn of the pedals produced exactly one turn of the wheel. The only way to travel faster, therefore, was to make that wheel larger. By the 1870s, British manufacturers were producing machines with front wheels as much as 1.5 metres high, matched by a tiny rear wheel that served mainly to keep the machine upright. These were called 'ordinaries' at the time, although they are better known today as penny-farthings, after the largest and smallest British coins of the period. Lighter and much faster than the boneshaker — thanks partly to solid rubber tyres and wire-spoked wheels — the ordinary was nevertheless dangerous. The rider sat high above the front axle, and if the wheel struck a stone or a rut, he could be thrown over the handlebars head first, an accident so common that it had its own name: 'taking a header'. Cycling became a sport for athletic young men; women, older people and the cautious were largely excluded.

The machine that changed this was the 'safety bicycle'. Several designers worked on the idea, but the most influential version was the Rover, produced in Coventry in 1885 by John Kemp Starley. It had two wheels of similar size, with the rider seated between them, and the pedals drove the rear wheel by means of a chain. The chain was the crucial element. By using a large toothed wheel at the pedals and a smaller one at the rear, a designer could make the rear wheel turn faster than the pedals, so speed no longer depended on the size of the wheel.

One problem remained: with smaller wheels and solid tyres, the safety bicycle gave an uncomfortable ride. The solution came from an unexpected source. In 1888 John Boyd Dunlop, a Scottish vet working in Belfast, fitted air-filled rubber tubes to the wheels of his young son's tricycle to make it run more smoothly over the city's cobbled streets. Dunlop was not the first to think of the idea — a patent for an air-filled tyre had been granted more than forty years earlier, though it had been almost entirely forgotten — but his version arrived at exactly the right moment. Within a few years the pneumatic tyre was standard on new bicycles.

The consequences were felt far beyond the world of sport. In the 1890s, cycling became a mass activity in Europe and North America, and the bicycle offered ordinary people a kind of independence they had never known. Workers could live further from the factories that employed them; young people could travel to neighbouring villages, and some historians argue that marriages between people from different districts became more common as a result. Women in particular embraced the safety bicycle, which demanded new, less restrictive forms of clothing and gave them a freedom of movement that many commentators of the time found alarming.`,
        groups: [
          {
            id: 'm3-r-g1',
            type: 'tfng',
            instructions:
              'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.',
            questions: [
              { id: 'm3-r-q1', number: 1, prompt: "Drais's machine was steered using a bar attached to the front wheel.", answer: ['TRUE'], explanation: 'Paragraph 1: the rider "steered by turning a bar connected to the front wheel."' },
              { id: 'm3-r-q2', number: 2, prompt: 'On his first journey, Drais travelled more slowly than a person on foot.', answer: ['FALSE'], explanation: 'Paragraph 1: he covered fourteen kilometres in a little over an hour, "considerably faster than a person could walk."' },
              { id: 'm3-r-q3', number: 3, prompt: 'Drais wrote that a shortage of horses was his reason for building the machine.', answer: ['FALSE'], explanation: 'Paragraph 2: "Drais left no written statement of his motives".' },
              { id: 'm3-r-q4', number: 4, prompt: 'The hobby-horse was more popular in London than in Paris.', answer: ['NOT GIVEN'], explanation: 'Paragraph 3 says copies appeared in both cities but never compares their popularity.' },
              { id: 'm3-r-q5', number: 5, prompt: 'Some cities punished people for riding hobby-horses.', answer: ['TRUE'], explanation: 'Paragraph 3: "Several cities introduced bans or fines".' },
              { id: 'm3-r-q6', number: 6, prompt: 'Historians agree on who first attached pedals to a two-wheeled machine.', answer: ['FALSE'], explanation: 'Paragraph 4: "Exactly who did so first is a matter of dispute".' },
              { id: 'm3-r-q7', number: 7, prompt: 'The ordinary cost more to buy than the boneshaker.', answer: ['NOT GIVEN'], explanation: 'Paragraph 5 compares weight, speed and safety, but says nothing about price.' },
            ],
          },
          {
            id: 'm3-r-g2',
            type: 'completion',
            instructions: 'Complete the table below. Choose ONE WORD AND/OR A NUMBER from the passage for each answer.',
            maxWords: 1,
            allowNumber: true,
            title: 'Early bicycles',
            content: `| Machine | Date | Key features | Main drawback |
| Running machine | 1817 | no pedals; rider pushed against the ground with the {{8}} | tiring on rough roads |
| Velocipede | 1860s | pedals on the front wheel; heavy {{9}} frame | so uncomfortable it was nicknamed the 'boneshaker' |
| Ordinary | 1870s | front wheel up to {{10}} metres high | rider could be thrown over the {{11}} |
| Rover | {{12}} | a {{13}} connected the pedals to the rear wheel | uncomfortable ride until air-filled tyres appeared |`,
            questions: [
              { id: 'm3-r-q8', number: 8, prompt: '', answer: ['feet'], explanation: 'Paragraph 1: "the rider pushed against the ground with alternate feet".' },
              { id: 'm3-r-q9', number: 9, prompt: '', answer: ['iron'], explanation: 'Paragraph 4: "Its frame was made of heavy iron".' },
              { id: 'm3-r-q10', number: 10, prompt: '', answer: ['1.5'], explanation: 'Paragraph 5: "front wheels as much as 1.5 metres high".' },
              { id: 'm3-r-q11', number: 11, prompt: '', answer: ['handlebars'], explanation: 'Paragraph 5: "he could be thrown over the handlebars head first".' },
              { id: 'm3-r-q12', number: 12, prompt: '', answer: ['1885'], explanation: 'Paragraph 6: "the Rover, produced in Coventry in 1885".' },
              { id: 'm3-r-q13', number: 13, prompt: '', answer: ['chain'], explanation: 'Paragraph 6: "the pedals drove the rear wheel by means of a chain."' },
            ],
          },
        ],
      },

      // ───────────────────────────── Passage 2 ─────────────────────────────
      {
        id: 'm3-r-s2',
        title: 'Passage 2',
        passageTitle: 'Finding the Way Home: How Honeybees Navigate',
        passage: `A| A honeybee forager may fly several kilometres from its hive in search of nectar and pollen, visiting hundreds of flowers on a single trip, and then return in an almost straight line to an entrance only a few centimetres wide. It achieves this with a brain smaller than a grain of rice, containing fewer than a million neurons. For more than a century, the question of how so small an animal accomplishes so demanding a task has occupied biologists, and the answers they have found have repeatedly overturned assumptions about what simple nervous systems are capable of.

B| The most important tool in the bee's kit is the sun. A bee leaving the hive notes the angle between its flight path and the sun's position, and on the way back it reverses that angle. The difficulty is that the sun does not stay still: it crosses the sky by roughly fifteen degrees every hour, so a bee that relied on a fixed angle would gradually drift off course. In a series of experiments, Lena Brandt moved hives overnight to unfamiliar sites and showed that bees compensate for this movement, adjusting their angle according to the time of day. They possess, in effect, an internal clock linked to a model of the sun's daily path. This model is not inborn, however. Tomas Reyes raised bees in an incubator under artificial light and found that, when they were first allowed outdoors, they made large errors that disappeared only after several days of flying under the real sky.

C| Clouds might be expected to defeat a navigator that depends on the sun, but bees cope remarkably well with overcast weather. The reason lies in their eyes. Sunlight scattered by the atmosphere becomes polarised, meaning that its waves vibrate predominantly in one direction, and the pattern of polarisation across the sky is arranged around the sun's position. Humans cannot perceive this pattern, but a narrow strip of specialised cells along the upper edge of each of the bee's compound eyes can. As long as a small patch of blue sky is visible, a bee can work out where the sun must be. Only when cloud cover is complete do foragers struggle, and on such days far fewer of them leave the hive.

D| Knowing a direction, though, is not enough; a bee must also know how far it has travelled. Early researchers assumed that it measured the energy it used, much as a walker might judge distance by tiredness. The idea was abandoned after Paolo Mancini attached tiny weights to foragers and found that they estimated distances no differently from unburdened bees. The current explanation is visual. As a bee flies, the image of the ground and vegetation streams across its eyes, and the bee appears to add up this 'optic flow'. The strongest evidence comes from the tunnel experiments of Grace Whitfield. Bees trained to reach a feeder through a narrow tunnel lined with a fine chequered pattern behaved, on their return to the hive, as though they had flown many times further than they actually had, because the pattern so close to their eyes generated an exaggerated sense of movement.

E| Bees also share what they learn. A forager that has found a rich source of food performs the so-called waggle dance on the vertical surface of the comb, in the darkness of the hive. She runs in a straight line while shaking her abdomen, loops back and repeats the run many times. The angle of the straight run relative to vertical corresponds to the angle between the food and the sun, while the duration of the waggle indicates distance. Other bees follow the dance and then fly out to search the area indicated. It was long debated whether these recruits really used the information or simply followed the scent of the dancer. The question was largely settled when a team led by Samuel Adeyemi tracked recruits with harmonic radar, which detects a tiny transponder glued to the bee's back. Most recruits flew directly towards the advertised location, although they then relied on scent to find the flowers in the last few metres.

F| The most recent research suggests that bees may possess something closer to a map than a simple set of directions. In later radar studies by the same team, foragers were captured as they left the hive and released at an unfamiliar point a few hundred metres away. At first they flew in the direction they had originally intended, even though the route they had stored was now useless. After a short period of searching, however, most set off on a direct path to the hive, and some flew straight to a feeder they had visited previously, by routes they had never flown before. To do this, they appear to have combined their memory of landmarks with their sense of direction into a single representation of the landscape. Whether such a representation deserves to be called a 'cognitive map' is fiercely argued, but few researchers now doubt that the navigation of bees is far more flexible than was once thought.`,
        groups: [
          {
            id: 'm3-r-g3',
            type: 'matching',
            instructions:
              'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–ix.',
            title: 'List of Headings',
            options: [
              { key: 'i', text: 'A remarkable achievement for a tiny brain' },
              { key: 'ii', text: 'Making use of light that people cannot see' },
              { key: 'iii', text: 'Allowing for a reference point that moves' },
              { key: 'iv', text: 'Judging distance from what passes before the eyes' },
              { key: 'v', text: 'Passing on a location to others' },
              { key: 'vi', text: 'Signs of a more complete mental picture' },
              { key: 'vii', text: 'Why bees stay at home in bad weather' },
              { key: 'viii', text: 'The role of scent in finding flowers' },
              { key: 'ix', text: 'Energy as a measure of distance travelled' },
            ],
            questions: [
              { id: 'm3-r-q14', number: 14, prompt: 'Paragraph A', answer: ['i'], explanation: 'Paragraph A: bees navigate kilometres "with a brain smaller than a grain of rice", overturning assumptions about simple nervous systems.' },
              { id: 'm3-r-q15', number: 15, prompt: 'Paragraph B', answer: ['iii'], explanation: 'Paragraph B: the sun "crosses the sky by roughly fifteen degrees every hour" and bees "compensate for this movement".' },
              { id: 'm3-r-q16', number: 16, prompt: 'Paragraph C', answer: ['ii'], explanation: 'Paragraph C: "Humans cannot perceive this pattern" of polarised light, but bees can. Staying at home (vii) is only a detail in the last sentence.' },
              { id: 'm3-r-q17', number: 17, prompt: 'Paragraph D', answer: ['iv'], explanation: 'Paragraph D: "The current explanation is visual... the bee appears to add up this \'optic flow\'." The energy idea (ix) "was abandoned".' },
              { id: 'm3-r-q18', number: 18, prompt: 'Paragraph E', answer: ['v'], explanation: 'Paragraph E: "Bees also share what they learn" through the waggle dance. Scent (viii) is only used in the last few metres.' },
              { id: 'm3-r-q19', number: 19, prompt: 'Paragraph F', answer: ['vi'], explanation: 'Paragraph F: bees may have "something closer to a map", combining landmarks and direction "into a single representation of the landscape".' },
            ],
          },
          {
            id: 'm3-r-g4',
            type: 'matching',
            instructions:
              'Look at the following findings (Questions 20–23) and the list of researchers below. Match each finding with the correct researcher, A–E. Write the correct letter, A–E. NB You may use any letter more than once.',
            title: 'List of Researchers',
            options: [
              { key: 'A', text: 'Lena Brandt' },
              { key: 'B', text: 'Tomas Reyes' },
              { key: 'C', text: 'Paolo Mancini' },
              { key: 'D', text: 'Grace Whitfield' },
              { key: 'E', text: 'Samuel Adeyemi' },
            ],
            questions: [
              { id: 'm3-r-q20', number: 20, prompt: 'Bees can be misled about distance by their surroundings.', answer: ['D'], explanation: 'Paragraph D: in Whitfield\'s tunnels, bees "behaved... as though they had flown many times further than they actually had".' },
              { id: 'm3-r-q21', number: 21, prompt: "Bees have to learn how to allow for the sun's movement.", answer: ['B'], explanation: 'Paragraph B: Reyes\'s incubator bees "made large errors that disappeared only after several days of flying under the real sky." Brandt (A) showed compensation exists, not that it is learnt.' },
              { id: 'm3-r-q22', number: 22, prompt: 'The physical effort of flying is not used to judge distance.', answer: ['C'], explanation: 'Paragraph D: Mancini\'s weighted bees "estimated distances no differently from unburdened bees."' },
              { id: 'm3-r-q23', number: 23, prompt: 'Bees can reach a known place by a route they have never used.', answer: ['E'], explanation: 'Paragraph F: in "later radar studies by the same team" (Adeyemi\'s), some bees "flew straight to a feeder... by routes they had never flown before."' },
            ],
          },
          {
            id: 'm3-r-g5',
            type: 'matching',
            instructions: 'Complete the summary using the list of words, A–H, below. Write the correct letter, A–H.',
            title: 'The waggle dance',
            options: [
              { key: 'A', text: 'distance' },
              { key: 'B', text: 'scent' },
              { key: 'C', text: 'speed' },
              { key: 'D', text: 'sun' },
              { key: 'E', text: 'vertical surface' },
              { key: 'F', text: 'hive entrance' },
              { key: 'G', text: 'horizontal floor' },
              { key: 'H', text: 'sound' },
            ],
            content: `A forager that has found plenty of food dances on the {{24}} of the comb. The angle of her straight run shows the direction of the food in relation to the {{25}}, and the duration of the waggle shows the {{26}}. Radar tracking has shown that most bees that follow the dance fly straight to the right area, but they use {{27}} to locate the flowers over the final few metres.`,
            questions: [
              { id: 'm3-r-q24', number: 24, prompt: '', answer: ['E'], explanation: 'Paragraph E: "performs the so-called waggle dance on the vertical surface of the comb".' },
              { id: 'm3-r-q25', number: 25, prompt: '', answer: ['D'], explanation: 'Paragraph E: the angle "corresponds to the angle between the food and the sun".' },
              { id: 'm3-r-q26', number: 26, prompt: '', answer: ['A'], explanation: 'Paragraph E: "the duration of the waggle indicates distance."' },
              { id: 'm3-r-q27', number: 27, prompt: '', answer: ['B'], explanation: 'Paragraph E: "they then relied on scent to find the flowers in the last few metres."' },
            ],
          },
        ],
      },

      // ───────────────────────────── Passage 3 ─────────────────────────────
      {
        id: 'm3-r-s3',
        title: 'Passage 3',
        passageTitle: 'The Scarcest Resource: The Economics of Attention',
        passage: `It has become a commonplace to say that the services we use online are not really free: if you are not paying for the product, the saying goes, then you are the product. Like many slogans, this one wraps a truth inside a distortion. What the user of a search engine or social network actually supplies is not himself or herself, but something narrower and, in economic terms, far more interesting: attention. Every minute spent scrolling is a minute that can be sold to an advertiser, and the companies that dominate the digital economy are, at bottom, in the business of capturing those minutes and reselling them. To understand their behaviour, and the choices facing the rest of us, it helps to treat attention as what economists call a scarce resource.

The idea is not new. As early as the 1970s, the economist Herbert Simon observed that an abundance of information inevitably consumes something else — the attention of those who receive it — so that a world rich in information is necessarily poor in attention. What has changed is the scale. The quantity of material competing for a person's eyes has grown by orders of magnitude, while the number of waking hours in a day has, of course, stayed exactly the same. When the supply of one thing explodes and another remains fixed, it is the fixed thing that becomes valuable.

Defenders of the industry argue that this competition benefits consumers. Firms must offer ever more engaging products to win our time, and the advertising that pays for them allows billions of people to use sophisticated tools without paying a penny. There is something in this argument, and I do not wish to dismiss it. Free access to maps, reference works and communication has been of genuine value, particularly to people on low incomes. But the argument rests on an assumption: that the time we give to a product reflects the value we receive from it, in the way that the price we pay for a coat reflects how much we want it. That assumption is precisely what is in doubt.

The difficulty is that attention is not wholly under our voluntary control. Much of it is captured by mechanisms that evolved for quite different purposes: a sudden movement at the edge of our vision, an unexpected sound, the possibility of a reward that may or may not arrive. Designers have become extremely skilled at exploiting these mechanisms. The notification that arrives at unpredictable intervals, the feed that never reaches an end, the video that begins before the previous one has finished — none of these features exists because users asked for it. They exist because they increase the time users spend, and time spent is what the business model rewards. A measure of engagement, in other words, can rise even as the satisfaction of those engaged falls, and surveys in which heavy users say they wish they spent less time on particular apps suggest that this is exactly what has happened.

If this is a market, it is a peculiar one, and its peculiarities generate costs that appear on no balance sheet. Economists use the term 'externality' for a cost imposed on people who are not party to a transaction, such as the pollution produced by a factory. The fragmentation of attention may be an externality of a similar kind. A student whose concentration is broken by a dozen alerts during an evening's study pays a price, but so does the teacher who must hold the attention of a class accustomed to constant novelty — and so, arguably, does a democracy whose citizens find it increasingly hard to follow a complex argument to its conclusion. I am wary of claims that our capacity for concentration has been permanently damaged; the research on that question is young, and some of the more alarming figures in circulation, such as the claim that human attention spans are now shorter than those of goldfish, have no credible source at all. But one need not accept the more extreme claims to recognise that something is being lost.

What, then, should be done? The most common answer is that individuals should take responsibility for their own habits: switch off notifications, delete apps, take periodic 'digital detoxes'. Such advice is not wrong, but it places the entire burden on the party with the least power. Asking a person to resist, through willpower alone, a product designed by teams of engineers to defeat that willpower is rather like asking diners to eat sensibly in a restaurant whose menu has been engineered to make them overeat. A more promising approach would be to change the incentives facing the companies themselves. Some have proposed a tax on digital advertising, which would reduce the reward for capturing attention at any cost; others argue that users should have a legal right to a version of each service with its most compulsive features switched off. I have reservations about the first proposal, which might simply push companies towards subscription models that exclude poorer users, but the second seems to me both modest and overdue.

None of this requires us to romanticise the past. People in earlier centuries were easily distracted too, and every new medium, from the novel to the radio, has been accused in its turn of corrupting the minds of the young. The difference today is not that distraction exists but that it has become the product of a highly profitable industry, refined continuously through measurement and experiment. Attention, once something we simply had, has become something that others are competing to take. The first step towards protecting it is to recognise what it is worth.`,
        groups: [
          {
            id: 'm3-r-g6',
            type: 'mcq',
            instructions: 'Choose the correct letter, A, B, C or D.',
            questions: [
              {
                id: 'm3-r-q28', number: 28, prompt: 'The writer refers to the saying "you are the product" in order to',
                options: [
                  { key: 'A', text: 'suggest that it is only partly accurate.' },
                  { key: 'B', text: 'explain why online services are so popular.' },
                  { key: 'C', text: 'argue that online advertising should be banned.' },
                  { key: 'D', text: 'show that most users understand the business model.' },
                ],
                answer: ['A'], explanation: 'Paragraph 1: "this one wraps a truth inside a distortion" — what users supply is not themselves but attention.',
              },
              {
                id: 'm3-r-q29', number: 29, prompt: "According to the writer, what has changed since Simon's observation?",
                options: [
                  { key: 'A', text: 'the amount of free time people have' },
                  { key: 'B', text: 'the quantity of material competing for attention' },
                  { key: 'C', text: 'the way economists define scarcity' },
                  { key: 'D', text: 'the number of companies offering online services' },
                ],
                answer: ['B'], explanation: 'Paragraph 2: "What has changed is the scale. The quantity of material competing for a person\'s eyes has grown by orders of magnitude". Waking hours have "stayed exactly the same".',
              },
              {
                id: 'm3-r-q30', number: 30, prompt: 'What does the writer say about the argument put forward by defenders of the industry?',
                options: [
                  { key: 'A', text: 'It overlooks the benefits for people on low incomes.' },
                  { key: 'B', text: 'It depends on a questionable assumption.' },
                  { key: 'C', text: 'It has no merit whatsoever.' },
                  { key: 'D', text: 'It is based on out-of-date research.' },
                ],
                answer: ['B'], explanation: 'Paragraph 3: "the argument rests on an assumption... That assumption is precisely what is in doubt." The writer admits "There is something in this argument", so not C.',
              },
              {
                id: 'm3-r-q31', number: 31, prompt: 'In the fourth paragraph, the writer suggests that features such as endless feeds',
                options: [
                  { key: 'A', text: 'were developed in response to requests from users.' },
                  { key: 'B', text: 'are becoming less effective than they once were.' },
                  { key: 'C', text: 'increase use without necessarily increasing satisfaction.' },
                  { key: 'D', text: 'are mainly found in video-sharing applications.' },
                ],
                answer: ['C'], explanation: 'Paragraph 4: "A measure of engagement... can rise even as the satisfaction of those engaged falls". A is contradicted: "none of these features exists because users asked for it."',
              },
              {
                id: 'm3-r-q32', number: 32, prompt: 'The writer compares a person resisting a digital product to a diner in a restaurant in order to show that',
                options: [
                  { key: 'A', text: 'the individual is at a serious disadvantage.' },
                  { key: 'B', text: 'people should choose products more carefully.' },
                  { key: 'C', text: 'technology companies are breaking the law.' },
                  { key: 'D', text: 'digital detoxes have no effect at all.' },
                ],
                answer: ['A'], explanation: 'Paragraph 6: the advice "places the entire burden on the party with the least power" — willpower alone against "teams of engineers".',
              },
            ],
          },
          {
            id: 'm3-r-g7',
            type: 'ynng',
            instructions:
              'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.',
            questions: [
              { id: 'm3-r-q33', number: 33, prompt: 'Free online services have been genuinely useful to some groups of people.', answer: ['YES'], explanation: 'Paragraph 3: "Free access to maps, reference works and communication has been of genuine value, particularly to people on low incomes."' },
              { id: 'm3-r-q34', number: 34, prompt: 'Most users do not realise that online services are paid for by advertising.', answer: ['NOT GIVEN'], explanation: 'The writer explains the advertising model but never says what most users know about it.' },
              { id: 'm3-r-q35', number: 35, prompt: 'There is reliable evidence that human attention spans are now shorter than those of goldfish.', answer: ['NO'], explanation: 'Paragraph 5: the goldfish claim has "no credible source at all."' },
              { id: 'm3-r-q36', number: 36, prompt: 'Users should be legally entitled to a version of a service without its most compulsive features.', answer: ['YES'], explanation: 'Paragraph 6: this proposal "seems to me both modest and overdue."' },
              { id: 'm3-r-q37', number: 37, prompt: "Fears that new media harm young people's minds are a recent development.", answer: ['NO'], explanation: 'Paragraph 7: "every new medium, from the novel to the radio, has been accused in its turn of corrupting the minds of the young."' },
            ],
          },
          {
            id: 'm3-r-g8',
            type: 'completion',
            instructions: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
            maxWords: 2,
            title: 'The hidden costs of distraction',
            content: `The writer suggests that the fragmentation of attention may be an {{38}}: a cost borne by people outside a transaction, comparable to the {{39}} produced by a factory. Distraction itself is not new, but today it has become the product of a highly profitable {{40}} that is constantly refined through measurement and experiment.`,
            questions: [
              { id: 'm3-r-q38', number: 38, prompt: '', answer: ['externality'], explanation: 'Paragraph 5: "Economists use the term \'externality\' for a cost imposed on people who are not party to a transaction".' },
              { id: 'm3-r-q39', number: 39, prompt: '', answer: ['pollution'], explanation: 'Paragraph 5: "such as the pollution produced by a factory."' },
              { id: 'm3-r-q40', number: 40, prompt: '', answer: ['industry'], explanation: 'Paragraph 7: "it has become the product of a highly profitable industry, refined continuously through measurement and experiment."' },
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════ WRITING
  writing: {
    tasks: [
      {
        id: 'm3-w-t1',
        number: 1,
        kind: 'process',
        prompt: `The diagram below shows how recycled paper is made.\n\n${TASK1_TAIL}`,
        svg: PAPER_SVG,
        visualDescription: `Process diagram, "How recycled paper is made", 8 stages in a cycle:
1. Waste paper is collected.
2. It is sorted into grades at a depot.
3. It is mixed with water and chemicals in a pulper.
4. The pulp is screened to remove staples and plastic.
5. The ink is removed using air bubbles (de-inking).
6. The pulp is bleached — an optional stage, for white paper only (dashed box).
7. The pulp is pressed and dried on heated rollers.
8. The paper is wound into rolls and cut to size.
A dashed arrow from stage 8 back to stage 1 shows used paper being returned for recycling, so the process is a continuous cycle.`,
        minWords: 150,
        minutes: 20,
        sample: `The diagram illustrates the stages by which waste paper is turned into new, recycled paper.

Overall, the process consists of eight steps, beginning with the collection of used paper and ending with the production of rolls of new paper. Since the finished product can itself be collected again once it has been used, the process is essentially cyclical. One stage, bleaching, is optional.

In the first stage, waste paper is collected and taken to a depot, where it is sorted into different grades. It is then placed in a pulper, a large container in which it is mixed with water and chemicals until it breaks down into pulp. Next, this pulp is screened so that unwanted items such as staples and plastic are removed, after which the ink is extracted by means of air bubbles.

If white paper is required, the de-inked pulp is bleached at this point; otherwise, this step is omitted. The pulp is subsequently pressed and dried on heated rollers, and the resulting paper is wound into large rolls, which are finally cut to size. Once the paper has been used, it can be returned for recycling and the cycle begins again.`,
      },
      {
        id: 'm3-w-t2',
        number: 2,
        kind: 'essay',
        prompt: `In many cities around the world, traffic congestion is becoming an increasingly serious problem.\n\nWhat are the main causes of this problem, and what measures could be taken to reduce it?\n\n${TASK2_TAIL}`,
        minWords: 250,
        minutes: 40,
        sample: `Traffic congestion has become one of the defining features of modern urban life, costing commuters hours every week and polluting the air they breathe. In my view, the problem stems mainly from rising car ownership and poorly planned urban growth, and it can best be tackled by making alternatives to driving genuinely attractive while making unnecessary car journeys more expensive.

The most obvious cause is the sheer number of private vehicles. As incomes have risen, particularly in fast-growing economies, cars have become affordable to millions of households for whom they were once a luxury, and road networks designed decades ago simply cannot accommodate them. A second, less visible cause is the way cities have expanded. When new housing is built on the outskirts, far from workplaces, schools and shops, and is not served by adequate public transport, residents have little choice but to drive, often alone and at the same peak times every day.

Tackling these causes requires a combination of incentives and restrictions. On the one hand, governments should invest in fast, frequent and affordable public transport, together with safe, separated cycle lanes, so that leaving the car at home becomes the convenient option rather than a sacrifice. Several northern European cities have shown how dramatically commuting habits can change once cycling is taken seriously. On the other hand, measures such as congestion charges and higher parking fees in city centres discourage journeys that could easily be made in other ways, and the revenue they raise can fund the improvements just mentioned. In the longer term, planners should also ensure that new neighbourhoods have services close at hand, reducing the need to travel at all.

In conclusion, congestion is largely the product of growing car dependence and sprawling development. Only a balanced strategy, which both improves the alternatives and puts a fair price on driving, is likely to bring lasting relief.`,
      },
    ],
  },

  // ════════════════════════════════════════════════════════════ SPEAKING
  speaking: {
    part1: {
      topics: [
        {
          topic: 'Food',
          questions: [
            'What kind of food do you enjoy eating most?',
            'Do you prefer eating at home or eating out?',
            'Has your diet changed since you were a child?',
            'Is there any food you really dislike?',
          ],
        },
        {
          topic: 'Shopping',
          questions: [
            'Do you enjoy going shopping?',
            'Do you prefer shopping online or in shops? Why?',
            'What was the last thing you bought for yourself?',
            'Is there a shop near your home that you visit often?',
          ],
        },
        {
          topic: 'Sleep',
          questions: [
            'How many hours do you usually sleep at night?',
            'Do you ever have a nap during the day?',
            "What do you do if you can't get to sleep?",
            'Do you think people get enough sleep these days?',
          ],
        },
      ],
    },
    part2: {
      topic: 'Describe a place you visited that was very crowded',
      bullets: ['where the place was', 'when you went there', 'why it was so crowded'],
      closing: 'and explain how you felt about being in such a crowded place.',
      roundOff: ['Do you usually try to avoid crowded places?', 'Would you go back there again?'],
      sample: `OK, so the place I'd like to talk about is a big night market I visited in Taipei a couple of years ago, when I was travelling with two friends from university. We'd read about it online, and everyone said, you know, you can't go to Taipei without trying the street food there, so on our second evening we took the metro across the city to have a look.

Honestly, I wasn't prepared for how packed it was. It was a Saturday night, which I suppose was our first mistake, and it turned out there was a public holiday that weekend as well, so it felt like half the city had had the same idea. The main lane was maybe four or five metres wide, with food stalls on both sides, and people were shuffling along really slowly, almost shoulder to shoulder. At one point we got separated, and it took us a good ten minutes to find each other again, because, of course, nobody could hear their phone ringing.

As for how I felt... well, it was a bit of a mixture, to be honest. For the first half hour I found it quite overwhelming — the noise, the heat coming off the grills, the smell of fried food everywhere. But once we stopped trying to rush and just went with the flow, I actually started to enjoy it. There was a real buzz about the place, everyone seemed to be in a good mood, and it never felt unsafe. And the food was absolutely worth it. I still think about the pepper buns we queued twenty minutes for. So, although I wouldn't go on a holiday weekend again, I'm really glad I experienced it.`,
    },
    part3: {
      theme: 'Cities and crowds',
      questions: [
        'Why do so many people choose to live in big cities, despite the crowds?',
        'What problems can overcrowding cause in cities?',
        'How can city planners make crowded public places more pleasant for people?',
        'Do you think people who grow up in cities cope with crowds better than people from the countryside?',
        'Some people say tourism makes popular places too crowded. Should the number of visitors be limited?',
        'Do you think more people will move away from big cities in the future? Why or why not?',
      ],
    },
  },
}
