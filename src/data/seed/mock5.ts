// voices: NARRATOR=m, LISA=f, MR PRITCHARD=m, GRAHAM=m, SOPHIE=f, TOM=m, MARGARET=f
import type { Test } from '../../lib/types'

// Original seed content written for this app — not taken from any published IELTS test.

const TFNG_INSTRUCTIONS = `Do the following statements agree with the information given in the text?

Write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this`

const T0 = Date.UTC(2026, 0, 1)

export const mock5: Test = {
  id: 'seed-general-3',
  title: 'General Training Mock Test 3',
  variant: 'general',
  description: 'A complete computer-delivered General Training test: Listening, Reading, Writing and Speaking.',
  status: 'published',
  createdAt: T0,
  updatedAt: T0,

  // ================================================================ LISTENING
  listening: {
    sections: [
      // ---------------------------------------------------------------- Part 1
      {
        id: 'm5-l-s1',
        title: 'Part 1',
        context: 'You will hear a father telephoning a summer sports camp to book a place for his son.',
        transcript: `NARRATOR: Part One. You will hear a father telephoning a summer sports camp to book a place for his son. First you have some time to look at questions 1 to 5.
NARRATOR: Now listen carefully and answer questions 1 to 5.
LISA: Good afternoon, Westbrook Summer Sports Camp, Lisa speaking.
MR PRITCHARD: Hi there. I'd like to book a place for my son on one of your summer camps, if you've still got space.
LISA: Of course. I'll just take a few details. What's your son's name?
MR PRITCHARD: Oliver. Oliver Pritchard.
LISA: And how do you spell the surname?
MR PRITCHARD: P-R-I-T-C-H-A-R-D.
LISA: Thank you. And how old is Oliver?
MR PRITCHARD: He's eight. Oh, hang on, no. He had his birthday last month, so he's nine now. Sorry, I still haven't got used to it.
LISA: Nine, that's fine. Our camps are for children from seven to thirteen, and we put them in groups by age. Which week were you interested in?
MR PRITCHARD: We were hoping for the week starting the 21st of July.
LISA: Let me have a look. I'm afraid that week is completely full now. But the week after, starting the 28th of July, still has a few places.
MR PRITCHARD: The 28th... yes, that should work. We're away in the middle of August anyway. Let's book that one.
LISA: Lovely. Each child chooses one main sport for the week, which they do every morning, and the afternoons are a mix of other games. What would Oliver like to do?
MR PRITCHARD: Well, he plays football at school all year round, so I assumed he'd pick that, but he told me he'd rather try something new. He's chosen tennis.
LISA: Tennis it is. We provide the rackets, so he doesn't need to bring his own.
NARRATOR: Before you hear the rest of the conversation, you have some time to look at questions 6 to 10.
NARRATOR: Now listen and answer questions 6 to 10.
LISA: Now, does Oliver have any medical conditions or allergies that our staff should know about?
MR PRITCHARD: No medical conditions, but he is allergic to strawberries. It's nothing serious, he just comes out in a rash, but it's best if he avoids them.
LISA: I'll make a note of that. We don't serve meals, the children bring a packed lunch, but we do hand out fruit at break time, so that's useful to know. As for what to bring, he'll need a water bottle, of course, and because nearly all the activities are outdoors, please make sure he has sun cream with him every day. A hat's a good idea too, although we don't insist on one.
MR PRITCHARD: Sun cream, right. And what time does it all start?
LISA: The gates open at half past eight, and you can drop him off any time after that. The first session starts at nine fifteen, so please make sure he's there by then. We finish at four.
MR PRITCHARD: OK. And how much is it?
LISA: The standard price is one hundred and eighty-five pounds for the week. But there's an early booking discount for anyone who books before the end of May, so for you it's one hundred and sixty-five pounds.
MR PRITCHARD: Oh, that's good. One hundred and sixty-five.
LISA: Who'll be collecting Oliver at the end of the day? We only let children go home with the adults named on the form.
MR PRITCHARD: Normally it would be me or my wife, but we're both working that week, so it'll be his grandmother. She lives just round the corner from the camp.
LISA: His grandmother, fine. She'll need to show some ID the first time. And finally, we always ask people how they heard about us.
MR PRITCHARD: I think I saw a leaflet in the library... no, actually, it was the school newsletter. They had a short piece about you last term.
LISA: The school newsletter, great. I'll email you the confirmation and a payment link later today.
MR PRITCHARD: Thanks very much. Bye.
NARRATOR: That is the end of Part One.`,
        groups: [
          {
            id: 'm5-l-g1',
            type: 'completion',
            instructions: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
            maxWords: 2,
            allowNumber: true,
            title: 'Camp booking form',
            content: `## Westbrook Summer Sports Camp — Booking Form
| Child's name | Oliver {{1}} |
| Age | {{2}} |
| Week starting | {{3}} |
| Main sport | {{4}} |
## Other information
- Allergy: {{5}}
- Must bring: a water bottle and {{6}} every day
- First session starts at {{7}} am
- Cost: £{{8}} (early booking discount)
- Collected by: his {{9}}
- Heard about the camp through: the {{10}}`,
            questions: [
              { id: 'm5-l-q1', number: 1, prompt: '', answer: ['Pritchard'], explanation: `MR PRITCHARD: "P-R-I-T-C-H-A-R-D."` },
              { id: 'm5-l-q2', number: 2, prompt: '', answer: ['9', 'nine'], explanation: `MR PRITCHARD: "He's eight. Oh, hang on, no... he's nine now."` },
              { id: 'm5-l-q3', number: 3, prompt: '', answer: ['28 July', '28th July', 'July 28', 'July 28th', '28/7', '28/07'], explanation: `LISA: the 21st is full; "the week after, starting the 28th of July, still has a few places." MR PRITCHARD: "Let's book that one."` },
              { id: 'm5-l-q4', number: 4, prompt: '', answer: ['tennis'], explanation: `MR PRITCHARD: "I assumed he'd pick [football]... He's chosen tennis."` },
              { id: 'm5-l-q5', number: 5, prompt: '', answer: ['strawberries', 'strawberry'], explanation: `MR PRITCHARD: "he is allergic to strawberries."` },
              { id: 'm5-l-q6', number: 6, prompt: '', answer: ['sun cream', 'suncream'], explanation: `LISA: "please make sure he has sun cream with him every day." A hat is optional.` },
              { id: 'm5-l-q7', number: 7, prompt: '', answer: ['9.15', '9:15', '9.15 am'], explanation: `LISA: "The gates open at half past eight... The first session starts at nine fifteen."` },
              { id: 'm5-l-q8', number: 8, prompt: '', answer: ['165'], explanation: `LISA: the standard price is £185, but with the early booking discount "for you it's one hundred and sixty-five pounds."` },
              { id: 'm5-l-q9', number: 9, prompt: '', answer: ['grandmother'], explanation: `MR PRITCHARD: "we're both working that week, so it'll be his grandmother."` },
              { id: 'm5-l-q10', number: 10, prompt: '', answer: ['school newsletter', 'newsletter'], explanation: `MR PRITCHARD: "I think I saw a leaflet in the library... no, actually, it was the school newsletter."` },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Part 2
      {
        id: 'm5-l-s2',
        title: 'Part 2',
        context: 'You will hear a local radio presenter talking about a food festival that is taking place in the town.',
        transcript: `NARRATOR: Part Two. You will hear a local radio presenter talking about a food festival that is taking place in the town. First you have some time to look at questions 11 to 15.
NARRATOR: Now listen carefully and answer questions 11 to 15.
GRAHAM: Good morning, and welcome back to Weekend Wanderings here on Coastline Radio. Now, it's that time of year again. The Harbourside Food Festival returns to Kingsport next weekend, and I've been finding out what's in store.
GRAHAM: First, a little history. The festival began twelve years ago. A lot of people believe it was started by the town's restaurants as a way of bringing in tourists, and they're certainly big supporters now. The council only got involved a few years later. But in fact it was organised by a small group of fishermen, who wanted to show local people how much good seafood was being landed in the harbour and then sent straight off to London. That first year there were just fifteen stalls.
GRAHAM: This year there'll be more than two hundred, and the organisers have made one important change. In previous years entry was free on both days, which meant enormous queues on the Saturday. Entry is still free, but this year you'll need a timed ticket for Saturday, which you can book online. On Sunday you can just turn up. There was some talk of extending the festival to three days, but in the end the council decided that two was enough.
GRAHAM: Now, getting there. Several streets in the town centre will be closed to traffic, so parking will be very limited, and I'd leave the car at home. You might think the train is the answer, but there are engineering works on the line that weekend and trains are being replaced by buses, which will be slow. What the organisers are strongly recommending is the park-and-ride bus from the leisure centre on the edge of town. It runs every ten minutes and it's free for everyone.
GRAHAM: The festival is trying hard to cut down on waste this year. Stallholders won't be giving out plastic bags, so visitors are asked to bring their own shopping bags. You don't need to bring cutlery, though, because every stall will provide wooden forks and spoons, and there'll be free drinking water fountains all over the site, so there's no need to bring bottled water either.
GRAHAM: And the highlight? Well, most people would say the celebrity chef, and this year's guest is certainly very popular. Sadly, the fireworks on Saturday night have been cancelled because of the cost. But for me, and I think for most locals, the thing not to miss is the oyster-opening contest on Sunday afternoon. It's fast, it's noisy, and it's tremendous fun to watch.
NARRATOR: Now look at questions 16 to 20.
NARRATOR: Now listen and answer questions 16 to 20.
GRAHAM: The festival is spread across five main areas of the town, so let me give you a quick guide.
GRAHAM: Market Square is the heart of the festival. You might expect the main music stage to be there, and it was in previous years, but this year the square is given over entirely to street food from around the world, everything from Korean pancakes to Ethiopian stews.
GRAHAM: If you head down to the Harbour Wall, that's where you'll find the cookery demonstrations. Local chefs will be showing you how to prepare fish straight from the boats, and you can ask them questions as they work.
GRAHAM: The Old Corn Exchange, the big stone building on Bridge Street, would make a wonderful concert venue, but it's actually hosting the farmers' market, with cheese, bread and vegetables from farms within thirty miles of the town. Those of you who remember the wine-tasting tent will be sorry to hear that it isn't coming back this year.
GRAHAM: Families should make for Castle Gardens. There'll be face painting, a puppet theatre and a junior chef tent where children can make their own pizzas. There are a few food stalls there as well, but the focus is very much on younger visitors.
GRAHAM: And the live music has moved to St Anne's Church Field, down by the river. Bands will be playing from midday until nine o'clock on both days, and there's plenty of space to sit on the grass.
GRAHAM: So that's the Harbourside Food Festival, next Saturday and Sunday. Enjoy it, and do let us know how you get on.
NARRATOR: That is the end of Part Two.`,
        groups: [
          {
            id: 'm5-l-g2',
            type: 'mcq',
            instructions: 'Choose the correct letter, A, B or C.',
            questions: [
              {
                id: 'm5-l-q11', number: 11, prompt: 'The festival was first organised by',
                options: [{ key: 'A', text: 'local restaurant owners.' }, { key: 'B', text: 'a group of fishermen.' }, { key: 'C', text: 'the town council.' }],
                answer: ['B'], explanation: `GRAHAM: "in fact it was organised by a small group of fishermen". The restaurants are supporters now; the council came later.`,
              },
              {
                id: 'm5-l-q12', number: 12, prompt: 'What change has been made to the festival this year?',
                options: [{ key: 'A', text: 'Visitors must pay to enter.' }, { key: 'B', text: 'A ticket is needed on one of the days.' }, { key: 'C', text: 'It has been extended to three days.' }],
                answer: ['B'], explanation: `GRAHAM: "Entry is still free, but this year you'll need a timed ticket for Saturday... On Sunday you can just turn up."`,
              },
              {
                id: 'm5-l-q13', number: 13, prompt: 'The organisers recommend that visitors travel to the festival by',
                options: [{ key: 'A', text: 'train.' }, { key: 'B', text: 'car.' }, { key: 'C', text: 'park-and-ride bus.' }],
                answer: ['C'], explanation: `GRAHAM: "What the organisers are strongly recommending is the park-and-ride bus from the leisure centre".`,
              },
              {
                id: 'm5-l-q14', number: 14, prompt: 'Visitors are asked to bring their own',
                options: [{ key: 'A', text: 'cutlery.' }, { key: 'B', text: 'shopping bags.' }, { key: 'C', text: 'drinking water.' }],
                answer: ['B'], explanation: `GRAHAM: "visitors are asked to bring their own shopping bags." Cutlery and water are provided.`,
              },
              {
                id: 'm5-l-q15', number: 15, prompt: 'In the presenter\'s opinion, the best part of the festival is',
                options: [{ key: 'A', text: 'the appearance of a famous chef.' }, { key: 'B', text: 'the oyster-opening contest.' }, { key: 'C', text: 'the fireworks display.' }],
                answer: ['B'], explanation: `GRAHAM: "for me... the thing not to miss is the oyster-opening contest on Sunday afternoon." The fireworks are cancelled.`,
              },
            ],
          },
          {
            id: 'm5-l-g3',
            type: 'matching',
            instructions: 'What can visitors find at each of the following places? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
            options: [
              { key: 'A', text: 'cookery demonstrations' },
              { key: 'B', text: 'activities for children' },
              { key: 'C', text: 'live music' },
              { key: 'D', text: 'produce from local farms' },
              { key: 'E', text: 'international street food' },
              { key: 'F', text: 'a wine-tasting tent' },
              { key: 'G', text: 'a seafood auction' },
            ],
            questions: [
              { id: 'm5-l-q16', number: 16, prompt: 'Market Square', answer: ['E'], explanation: `GRAHAM: "this year the square is given over entirely to street food from around the world" (the music stage was there in previous years).` },
              { id: 'm5-l-q17', number: 17, prompt: 'Harbour Wall', answer: ['A'], explanation: `GRAHAM: "If you head down to the Harbour Wall, that's where you'll find the cookery demonstrations."` },
              { id: 'm5-l-q18', number: 18, prompt: 'Old Corn Exchange', answer: ['D'], explanation: `GRAHAM: "it's actually hosting the farmers' market, with cheese, bread and vegetables from farms within thirty miles". The wine tent isn't coming back.` },
              { id: 'm5-l-q19', number: 19, prompt: 'Castle Gardens', answer: ['B'], explanation: `GRAHAM: "Families should make for Castle Gardens... the focus is very much on younger visitors."` },
              { id: 'm5-l-q20', number: 20, prompt: "St Anne's Church Field", answer: ['C'], explanation: `GRAHAM: "the live music has moved to St Anne's Church Field".` },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Part 3
      {
        id: 'm5-l-s3',
        title: 'Part 3',
        context: 'You will hear two students, Sophie and Tom, discussing a part-time job fair they went to at their university.',
        transcript: `NARRATOR: Part Three. You will hear two students, Sophie and Tom, discussing a part-time job fair they went to at their university. First you have some time to look at questions 21 to 24.
NARRATOR: Now listen carefully and answer questions 21 to 24.
TOM: So, Sophie, was the job fair worth going to, do you think?
SOPHIE: Definitely. I wasn't sure beforehand, but the CV-checking stand made it worthwhile on its own. The careers adviser went through mine line by line, and she told me to cut the whole section on my school exam results.
TOM: I didn't get round to that, the queue was enormous. For me the best thing was the practice interviews. I've never had a proper job interview, and doing a mock one with a real manager from a hotel chain made me realise how much I ramble.
SOPHIE: Oh, I did one of those too, after you'd gone. It was really helpful. Much more useful than the talk on employment rights, to be honest.
TOM: Yes, that talk was pretty basic. Most of it's on the student union website already.
SOPHIE: And the list of vacancies they handed out was mostly jobs on the other side of the city, which is no good to me without a car.
TOM: Did you notice what the employers kept going on about? I'd assumed they'd all want people who'd done that kind of work before.
SOPHIE: So did I. But the woman from the bookshop said she'd much rather train someone from scratch. What nearly all of them stressed was being willing to work at different times: evenings, weekends, covering shifts at short notice.
TOM: Yes, flexibility. And almost every one of them said what they look for above everything else is how people talk to customers, whether they come across as warm and friendly. The café manager said you can teach anyone to make coffee.
SOPHIE: A couple of them mentioned that speaking another language would be a bonus, but only a bonus. And nobody said anything about what you should wear, apart from the hotel.
NARRATOR: Before you hear the rest of the discussion, you have some time to look at questions 25 to 30.
NARRATOR: Now listen and answer questions 25 to 30.
SOPHIE: So, which ones are you actually going to apply to? Let's go through the list.
TOM: Well, the supermarket. Everyone says stacking shelves is boring, but they pay nearly two pounds an hour more than most of the others, so that's hard to ignore.
SOPHIE: True. What about the cinema? The pay there is only the minimum, but the thing I liked is that all their shifts are in the evenings and at weekends, so they'd never clash with my lectures.
TOM: The sports centre looked good too. They'd put you through a lifeguard qualification and a first-aid certificate, and pay for all of it. That's worth having whatever you end up doing.
SOPHIE: And the hotel? They seemed keen on you after your mock interview.
TOM: They were, and the pay's fine. But it's right out by the airport, and the last bus back is at ten. It'd take me over an hour each way.
SOPHIE: The bookshop's my favourite. I know the pay's only average, but staff get thirty per cent off everything, and I spend a fortune on books for my course.
TOM: And the call centre?
SOPHIE: Hmm. They said a lot of their managers started out as student staff, and they've got a graduate scheme. If you were interested in a career in business, it could be a way in.
TOM: Not really my thing, but I can see the appeal. Right, let's get the applications in this week.
NARRATOR: That is the end of Part Three.`,
        groups: [
          {
            id: 'm5-l-g4',
            type: 'mcq_multi',
            instructions: 'Choose TWO letters, A–E.',
            content: 'Which TWO parts of the job fair do the students say were useful?',
            options: [
              { key: 'A', text: 'the CV-checking service' },
              { key: 'B', text: 'the talk on employment rights' },
              { key: 'C', text: 'the practice interviews' },
              { key: 'D', text: 'the list of vacancies' },
              { key: 'E', text: 'the student union website' },
            ],
            questions: [
              { id: 'm5-l-q21', number: 21, prompt: '', answer: ['A'], explanation: `SOPHIE: "the CV-checking stand made it worthwhile on its own."` },
              { id: 'm5-l-q22', number: 22, prompt: '', answer: ['C'], explanation: `TOM: "For me the best thing was the practice interviews." SOPHIE: "It was really helpful."` },
            ],
          },
          {
            id: 'm5-l-g5',
            type: 'mcq_multi',
            instructions: 'Choose TWO letters, A–E.',
            content: 'Which TWO qualities did most employers at the fair say they were looking for?',
            options: [
              { key: 'A', text: 'previous experience of similar work' },
              { key: 'B', text: 'flexibility about working hours' },
              { key: 'C', text: 'a smart appearance' },
              { key: 'D', text: 'a friendly manner with customers' },
              { key: 'E', text: 'the ability to speak a second language' },
            ],
            questions: [
              { id: 'm5-l-q23', number: 23, prompt: '', answer: ['B'], explanation: `SOPHIE: "What nearly all of them stressed was being willing to work at different times".` },
              { id: 'm5-l-q24', number: 24, prompt: '', answer: ['D'], explanation: `TOM: "almost every one of them said what they look for above everything else is how people talk to customers". Only "a couple" mentioned languages.` },
            ],
          },
          {
            id: 'm5-l-g6',
            type: 'matching',
            instructions: 'What do the students say about each employer? Choose SIX answers from the box and write the correct letter, A–G, next to Questions 25–30.',
            options: [
              { key: 'A', text: 'The pay is better than average.' },
              { key: 'B', text: 'The hours would fit around lectures.' },
              { key: 'C', text: 'It provides useful qualifications.' },
              { key: 'D', text: 'It is too difficult to get to.' },
              { key: 'E', text: 'The work would be boring.' },
              { key: 'F', text: 'There is a good staff discount.' },
              { key: 'G', text: 'It could lead to a long-term career.' },
            ],
            questions: [
              { id: 'm5-l-q25', number: 25, prompt: 'the supermarket', answer: ['A'], explanation: `TOM: "they pay nearly two pounds an hour more than most of the others". "Boring" is what everyone else says, not the reason he gives.` },
              { id: 'm5-l-q26', number: 26, prompt: 'the cinema', answer: ['B'], explanation: `SOPHIE: "all their shifts are in the evenings and at weekends, so they'd never clash with my lectures."` },
              { id: 'm5-l-q27', number: 27, prompt: 'the sports centre', answer: ['C'], explanation: `TOM: "They'd put you through a lifeguard qualification and a first-aid certificate".` },
              { id: 'm5-l-q28', number: 28, prompt: 'the hotel', answer: ['D'], explanation: `TOM: "it's right out by the airport, and the last bus back is at ten."` },
              { id: 'm5-l-q29', number: 29, prompt: 'the bookshop', answer: ['F'], explanation: `SOPHIE: "staff get thirty per cent off everything".` },
              { id: 'm5-l-q30', number: 30, prompt: 'the call centre', answer: ['G'], explanation: `SOPHIE: "a lot of their managers started out as student staff... it could be a way in."` },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Part 4
      {
        id: 'm5-l-s4',
        title: 'Part 4',
        context: 'You will hear a lecture in a psychology course about how sleep affects memory.',
        transcript: `NARRATOR: Part Four. You will hear a lecture in a psychology course about how sleep affects memory. First you have some time to look at questions 31 to 40.
NARRATOR: Now listen carefully and answer questions 31 to 40.
MARGARET: Good afternoon, everyone. Today we're turning to a question that I suspect matters to all of you, especially with exams coming up: what does sleep actually do for memory? For a long time, sleep was thought of as a kind of shutdown, a period when the brain simply rested. We now know that's far from the truth. In some ways the sleeping brain is just as busy as the waking one.
MARGARET: Let's start with the basics. Sleep isn't one uniform state. We move through a series of cycles, each lasting roughly ninety minutes, and within each cycle there are different stages. The stage that matters most for our purposes today is deep sleep. If you record the electrical activity of the brain during deep sleep, you see large, slow waves, very different from the fast, irregular activity of the waking brain. Deep sleep is concentrated in the first half of the night.
MARGARET: Later in the night we spend more time in what's called REM sleep, which stands for rapid eye movement. As the name suggests, the eyes dart about beneath the eyelids, and this is the stage in which most dreams occur, although we now know that some dreaming happens in other stages too.
MARGARET: So how does all this relate to memory? The key idea is something called consolidation. When you learn a new fact or experience an event, the memory is first stored, temporarily, in a small structure deep in the brain called the hippocampus. That's H-I-P-P-O-C-A-M-P-U-S. You can think of the hippocampus as a sort of in-tray. It can take in information quickly, but it can't hold very much, and the memories there are fragile.
MARGARET: During deep sleep, something remarkable happens. Patterns of activity from the day are replayed, and in the process, memories are gradually transferred to the cortex, the outer layer of the brain, where they can be stored for the long term. It's rather like moving files from your desktop into a properly organised filing cabinet.
MARGARET: REM sleep seems to play a different role. People often assume it's mainly to do with emotions, and there is some evidence for that. But the most consistent findings link REM sleep to learning skills: things like playing a musical instrument, typing, or a new technique in sport. People who practise a skill in the evening often perform it better the next morning, without any further practice at all.
MARGARET: Let me give you an example of the research. In one well-known type of study, students learn a list of words in the evening. Half of them then sleep normally, and the other half stay awake. When they're tested the next day, those who slept typically recall around twenty per cent more words. And interestingly, it doesn't have to be a full night. Even a short nap of about twenty minutes in the afternoon can produce a measurable improvement, although longer naps that include some deep sleep seem to work better still.
MARGARET: There's another side to this. Sleep isn't only about strengthening memories; it's also about getting rid of what we don't need. During sleep, the brain appears to weaken connections that weren't used much during the day, which helps to clear away irrelevant information. Without this process, the brain would quickly become overloaded.
MARGARET: Which brings me to the all-nighter. Many students believe that staying up all night to revise is a sensible strategy. The evidence says otherwise. Not only is the newly learnt material poorly consolidated, but the next day tiredness seriously affects concentration, so students struggle to use even the information they do remember. Some people blame stress for the poor results, and that may play a part, but the main problem is simply lack of sleep.
MARGARET: So, what practical advice can we take from all this? Many people focus on the number of hours they sleep, and of course that matters. But the single most useful thing you can do is keep a regular routine: go to bed and get up at roughly the same time every day, even at weekends. Your brain will then reach deep sleep more quickly and more reliably. Next week, we'll look at what happens to memory as we get older.
NARRATOR: That is the end of Part Four.`,
        groups: [
          {
            id: 'm5-l-g7',
            type: 'completion',
            instructions: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
            maxWords: 1,
            title: 'Sleep and memory',
            content: `## Stages of sleep
- Sleep follows cycles of about 90 minutes.
- Deep sleep: the brain produces large, slow {{31}}.
- REM sleep: the eyes move rapidly and most {{32}} take place.
## Consolidation
- New memories are first held temporarily in the {{33}}.
- During deep sleep, memories are replayed and moved to the {{34}} for long-term storage.
- REM sleep appears to be important for learning {{35}}, e.g. playing an instrument.
## Research findings
- Students who slept after learning recalled about 20% more {{36}} than those who stayed awake.
- A {{37}} of around 20 minutes can also improve recall.
- Sleep helps the brain to remove {{38}} information.
- After an all-nighter, tiredness reduces students' {{39}}.
## Practical advice
- The most helpful thing is to keep a regular {{40}}.`,
            questions: [
              { id: 'm5-l-q31', number: 31, prompt: '', answer: ['waves'], explanation: `MARGARET: "you see large, slow waves".` },
              { id: 'm5-l-q32', number: 32, prompt: '', answer: ['dreams'], explanation: `MARGARET: "this is the stage in which most dreams occur".` },
              { id: 'm5-l-q33', number: 33, prompt: '', answer: ['hippocampus'], explanation: `MARGARET: "the memory is first stored, temporarily, in a small structure deep in the brain called the hippocampus."` },
              { id: 'm5-l-q34', number: 34, prompt: '', answer: ['cortex'], explanation: `MARGARET: "memories are gradually transferred to the cortex... where they can be stored for the long term."` },
              { id: 'm5-l-q35', number: 35, prompt: '', answer: ['skills'], explanation: `MARGARET: "the most consistent findings link REM sleep to learning skills" (not mainly emotions).` },
              { id: 'm5-l-q36', number: 36, prompt: '', answer: ['words'], explanation: `MARGARET: "those who slept typically recall around twenty per cent more words."` },
              { id: 'm5-l-q37', number: 37, prompt: '', answer: ['nap'], explanation: `MARGARET: "Even a short nap of about twenty minutes in the afternoon can produce a measurable improvement".` },
              { id: 'm5-l-q38', number: 38, prompt: '', answer: ['irrelevant'], explanation: `MARGARET: sleep "helps to clear away irrelevant information."` },
              { id: 'm5-l-q39', number: 39, prompt: '', answer: ['concentration'], explanation: `MARGARET: "the next day tiredness seriously affects concentration". Stress is mentioned, but lack of sleep is "the main problem".` },
              { id: 'm5-l-q40', number: 40, prompt: '', answer: ['routine'], explanation: `MARGARET: "the single most useful thing you can do is keep a regular routine" (more useful than focusing on the number of hours).` },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================ READING
  reading: {
    sections: [
      // ---------------------------------------------------------------- Section 1
      {
        id: 'm5-r-s1',
        title: 'Section 1',
        passageTitle: 'Mobile phone plans compared / Welcome to the Brantwood Hotel',
        passage: `## Mobile phone plans compared

A| TalkLite Basic
A no-frills plan for people who already own a handset. For just £8 a month you get 5 GB of data and unlimited calls and texts to any UK number. There is no fixed contract: the plan runs month by month, and you can leave whenever you like without paying a cancellation fee. Please note that TalkLite Basic cannot be used abroad, and calls to numbers outside the UK are charged at standard international rates.

B| Connect Plus
Our most popular plan comes with a brand-new smartphone of your choice from our Plus range. For £22 a month over a 24-month contract, you get unlimited data, unlimited UK calls and texts, and free calls to landlines and mobiles in 40 countries. Using your phone in Europe costs nothing extra. Customers who end the contract early must pay the remaining monthly charges in full.

C| FamilyShare
One bill for the whole household. For £35 a month, up to four people can share a total of 60 GB of data, and each SIM card has its own number with unlimited UK calls and texts. Additional SIM cards can be added for £6 a month each. Free parental controls let you block unsuitable websites and set daily screen-time limits on children's phones. Minimum contract: 12 months.

D| Student Saver
Available exclusively to people in full-time education who can show a valid student ID card. For £12 a month you receive 20 GB of data, and any data you don't use is carried over to the following month instead of being lost. New customers also get six months' free access to a music streaming service. Minimum contract: 12 months.

## Welcome to the Brantwood Hotel: guest information

Breakfast is served in the Garden Restaurant from 7 am to 10 am on weekdays and from 7.30 am to 10.30 am at weekends. If you would prefer breakfast in your room, simply complete the card provided and hang it on your door handle before 2 am. A tray charge of £5 applies to all room service orders.

Check-out time is 11 am. Guests who need to stay longer may request a late check-out until 2 pm at reception. This is free of charge for members of our Brantwood Rewards scheme, subject to availability; other guests will be charged £20.

Wi-Fi is available free of charge throughout the hotel. The network name and password are printed on the inside of your key card wallet.

The swimming pool and gym are on the lower ground floor and are open from 6.30 am to 9 pm daily. Towels are provided at the poolside. Children under 16 must be accompanied by an adult in the pool at all times.

The hotel car park has a limited number of spaces, which are allocated on a first-come, first-served basis at a cost of £12 per night. It is not possible to reserve a space in advance.

If you wish to explore the city after checking out, our reception team will be happy to look after your luggage until the end of the day at no charge.

All bedrooms are non-smoking. A cleaning fee of £150 will be added to the bill of any guest who smokes in their room. Reception can book taxis at any time, although the railway station is only a ten-minute walk away.`,
        groups: [
          {
            id: 'm5-r-g1',
            type: 'matching',
            instructions: `Look at the four mobile phone plans, A–D.

For which plan are the following statements true?

Choose the correct letter, A–D.

NB You may use any letter more than once.`,
            options: [
              { key: 'A', text: 'TalkLite Basic' },
              { key: 'B', text: 'Connect Plus' },
              { key: 'C', text: 'FamilyShare' },
              { key: 'D', text: 'Student Saver' },
            ],
            questions: [
              { id: 'm5-r-q1', number: 1, prompt: 'Customers can cancel at any time without a penalty.', answer: ['A'], explanation: `A: "you can leave whenever you like without paying a cancellation fee."` },
              { id: 'm5-r-q2', number: 2, prompt: 'A new phone is included in the price.', answer: ['B'], explanation: `B: "comes with a brand-new smartphone of your choice".` },
              { id: 'm5-r-q3', number: 3, prompt: 'Data that is not used can be kept for later.', answer: ['D'], explanation: `D: "any data you don't use is carried over to the following month".` },
              { id: 'm5-r-q4', number: 4, prompt: 'Customers must prove they belong to a particular group.', answer: ['D'], explanation: `D: "Available exclusively to people in full-time education".` },
              { id: 'm5-r-q5', number: 5, prompt: 'Customers can control what children are able to do online.', answer: ['C'], explanation: `C: "Free parental controls let you block unsuitable websites".` },
              { id: 'm5-r-q6', number: 6, prompt: 'Some calls to other countries cost nothing extra.', answer: ['B'], explanation: `B: "free calls to landlines and mobiles in 40 countries." A charges standard international rates.` },
              { id: 'm5-r-q7', number: 7, prompt: 'It is possible to pay more to add extra users.', answer: ['C'], explanation: `C: "Additional SIM cards can be added for £6 a month each."` },
            ],
          },
          {
            id: 'm5-r-g2',
            type: 'tfng',
            instructions: `Look at the text "Welcome to the Brantwood Hotel: guest information".

${TFNG_INSTRUCTIONS}`,
            questions: [
              { id: 'm5-r-q8', number: 8, prompt: 'Guests can have breakfast in their room at no extra cost.', answer: ['FALSE'], explanation: `"A tray charge of £5 applies to all room service orders."` },
              { id: 'm5-r-q9', number: 9, prompt: 'Breakfast starts later at weekends than on weekdays.', answer: ['TRUE'], explanation: `Weekdays from 7 am; weekends "from 7.30 am".` },
              { id: 'm5-r-q10', number: 10, prompt: 'All guests have to pay if they want to check out late.', answer: ['FALSE'], explanation: `Late check-out "is free of charge for members of our Brantwood Rewards scheme".` },
              { id: 'm5-r-q11', number: 11, prompt: 'Children are not allowed to use the gym.', answer: ['NOT GIVEN'], explanation: `The text only says children under 16 must be accompanied in the pool; it says nothing about children in the gym.` },
              { id: 'm5-r-q12', number: 12, prompt: 'Guests can reserve a parking space when they book their room.', answer: ['FALSE'], explanation: `"It is not possible to reserve a space in advance."` },
              { id: 'm5-r-q13', number: 13, prompt: 'People who are not staying at the hotel may eat in the Garden Restaurant.', answer: ['NOT GIVEN'], explanation: `The text does not say whether non-residents can use the restaurant.` },
              { id: 'm5-r-q14', number: 14, prompt: 'Guests may leave their bags at the hotel after checking out.', answer: ['TRUE'], explanation: `"our reception team will be happy to look after your luggage until the end of the day at no charge."` },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Section 2
      {
        id: 'm5-r-s2',
        title: 'Section 2',
        passageTitle: 'Apprenticeships at Lowfield District Council / Working safely with display screens',
        passage: `## Apprenticeships at Lowfield District Council

Lowfield District Council is offering twenty apprenticeships this year in four areas of work: IT support, accountancy, parks and horticulture, and building maintenance. An apprenticeship allows you to earn a wage while gaining a recognised qualification, and it is an excellent route into a career in local government.

How the programme works
Apprentices spend four days a week working alongside experienced council staff and one day a week studying at Lowfield College, where they work towards a nationally recognised qualification in their chosen field. The programme lasts 18 months. Apprentices are paid £9.50 an hour in their first year, rising to £11.20 an hour for the final six months. Every apprentice is given a mentor: an experienced member of staff from a different department who meets them regularly to discuss their progress and any concerns.

Who can apply
Applicants must be aged 16 or over and must either live in the Lowfield district or be studying at a school or college within it. There is no upper age limit, and we particularly welcome applications from people returning to work after a career break. However, the programme is not open to anyone who already holds a degree.

How to apply
Applications must be made online through the careers page of the council's website. As part of the form, you will be asked to write a personal statement of no more than 500 words explaining why you are interested in your chosen area of work. CVs are not accepted. The closing date for applications is 14 March. Shortlisted candidates will be invited to an assessment day in April, which includes a group task and a short interview.

After the programme
Many of our former apprentices have gone on to permanent posts with the council. Although a job cannot be guaranteed, every apprentice who completes the programme successfully is guaranteed an interview for any suitable vacancy that arises within the following year.

## Working safely with display screens: guidance for office staff

A| This guidance applies to all staff who normally use a computer, laptop or tablet for continuous periods of an hour or more as a significant part of their working day. If you are not sure whether you fall into this category, ask your line manager. Staff who only use a screen occasionally, for example to check emails, are not covered by these requirements.

B| Poorly arranged workstations are a common cause of back, neck and shoulder pain. Your chair should be adjusted so that your feet rest flat on the floor and your forearms are roughly horizontal when you type. The screen should be about an arm's length away, with the top of the screen at or slightly below eye level. Position your keyboard and mouse close enough that you do not have to stretch to reach them.

C| Working at a screen for long periods without a change of activity can lead to tired eyes, headaches and stiffness. Research shows that short, frequent pauses are more effective than occasional long breaks: a five-minute break every hour is better than a twenty-minute break every two hours. You do not need to stop working: simply switching to a task away from the screen, such as making a phone call or filing, is enough. Looking at something in the distance from time to time also helps to rest your eyes.

D| Staff who use display screens are entitled to a free eye test, paid for by the company, every two years. Book an appointment at any optician and claim the cost back through the expenses system. If the optician confirms that you need glasses specifically for screen work, the company will contribute up to £60 towards the cost of the frames and lenses.

E| The same standards apply to staff who work from home on a regular basis. Home workers must complete the online self-assessment checklist within their first month of home working, and again whenever they move house. Where the checklist shows a problem, the company can lend equipment such as a separate monitor, a keyboard or an adjustable chair.

F| If you experience aches, pains or eye problems that you think may be linked to your work, report them to your line manager as soon as possible, rather than waiting to see if they go away. Early action usually prevents minor problems becoming serious. Your manager may arrange a workstation assessment or refer you to our occupational health service for specialist advice.`,
        groups: [
          {
            id: 'm5-r-g3',
            type: 'completion',
            instructions: `Complete the notes below.

Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the text for each answer.`,
            maxWords: 2,
            allowNumber: true,
            title: 'Council apprenticeships',
            content: `## The programme
- One day a week is spent studying at {{15}}.
- Total length of the programme: {{16}} months
- Each apprentice is supported by a {{17}} from another department.
## Applying
- Applicants cannot already have a {{18}}.
- The application form includes a {{19}} of up to 500 words.
- Applications must be received by {{20}}.
- Shortlisted applicants attend an {{21}} that includes a group task.`,
            questions: [
              { id: 'm5-r-q15', number: 15, prompt: '', answer: ['Lowfield College'], explanation: `"one day a week studying at Lowfield College".` },
              { id: 'm5-r-q16', number: 16, prompt: '', answer: ['18', 'eighteen'], explanation: `"The programme lasts 18 months."` },
              { id: 'm5-r-q17', number: 17, prompt: '', answer: ['mentor'], explanation: `"Every apprentice is given a mentor: an experienced member of staff from a different department".` },
              { id: 'm5-r-q18', number: 18, prompt: '', answer: ['degree'], explanation: `"the programme is not open to anyone who already holds a degree."` },
              { id: 'm5-r-q19', number: 19, prompt: '', answer: ['personal statement'], explanation: `"you will be asked to write a personal statement of no more than 500 words".` },
              { id: 'm5-r-q20', number: 20, prompt: '', answer: ['14 March', '14th March', 'March 14', 'March 14th'], explanation: `"The closing date for applications is 14 March."` },
              { id: 'm5-r-q21', number: 21, prompt: '', answer: ['assessment day'], explanation: `"Shortlisted candidates will be invited to an assessment day in April, which includes a group task and a short interview."` },
            ],
          },
          {
            id: 'm5-r-g4',
            type: 'matching',
            instructions: `The text "Working safely with display screens" has six sections, A–F.

Choose the correct heading for each section from the list of headings below.

Choose the correct number, i–viii.`,
            options: [
              { key: 'i', text: 'Getting help when symptoms appear' },
              { key: 'ii', text: 'Choosing suitable software' },
              { key: 'iii', text: 'Who the guidance is for' },
              { key: 'iv', text: 'Financial support for checking eyesight' },
              { key: 'v', text: 'The benefits of regular short pauses' },
              { key: 'vi', text: 'Penalties for ignoring the rules' },
              { key: 'vii', text: 'Arranging furniture and equipment correctly' },
              { key: 'viii', text: 'Applying the rules outside the office' },
            ],
            questions: [
              { id: 'm5-r-q22', number: 22, prompt: 'Section A', answer: ['iii'], explanation: `A: "This guidance applies to all staff who normally use a computer... for continuous periods of an hour or more".` },
              { id: 'm5-r-q23', number: 23, prompt: 'Section B', answer: ['vii'], explanation: `B: how to adjust the chair, screen, keyboard and mouse.` },
              { id: 'm5-r-q24', number: 24, prompt: 'Section C', answer: ['v'], explanation: `C: "short, frequent pauses are more effective than occasional long breaks".` },
              { id: 'm5-r-q25', number: 25, prompt: 'Section D', answer: ['iv'], explanation: `D: a free eye test "paid for by the company" and up to £60 towards glasses.` },
              { id: 'm5-r-q26', number: 26, prompt: 'Section E', answer: ['viii'], explanation: `E: "The same standards apply to staff who work from home".` },
              { id: 'm5-r-q27', number: 27, prompt: 'Section F', answer: ['i'], explanation: `F: report "aches, pains or eye problems" early; your manager may refer you for specialist advice.` },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------- Section 3
      {
        id: 'm5-r-s3',
        title: 'Section 3',
        passageTitle: 'The Buzz on the Rooftops: The Rise of Urban Beekeeping',
        passage: `A| Walk past the headquarters of a bank, a department store or even a fire station in many European and North American cities today, and there is a fair chance that somewhere above your head several thousand honeybees are going about their business. Over the past two decades, beekeeping has moved decisively into the city. In London alone, the number of registered hives is estimated to have more than doubled in ten years, and similar growth has been reported in Paris, Berlin, New York and Toronto. Rooftops, allotments, school grounds and even hotel balconies now host colonies that would once have been found almost exclusively in the countryside.

B| The reasons behind this boom are varied. For many new beekeepers, the starting point was concern. From the mid-2000s, newspapers began to report alarming losses of honeybee colonies, and stories of empty hives and warnings about the future of food production prompted thousands of people to ask what they could do to help. Keeping bees seemed an obvious answer. For others, the attraction was more personal: beekeeping offers a direct connection with the natural world that is otherwise hard to find in a city, and many describe the hour spent inspecting a hive as a kind of meditation. Businesses, meanwhile, discovered that a hive on the roof made an appealing story for their annual reports, and some began to install colonies as part of their environmental programmes, often paying specialist companies to look after them.

C| Surprisingly, cities can be good places for bees. Urban gardens, parks, railway embankments and street trees provide a remarkable variety of flowers, and because so many different species are planted for decoration, something is usually in bloom from early spring to late autumn. In the countryside, by contrast, large areas are often given over to a single crop, which offers an abundance of food for a few weeks and then very little. Cities are also generally a few degrees warmer than the surrounding land, which allows bees to begin foraging earlier in the year, and urban bees are less exposed to some of the pesticides used in intensive agriculture. Several studies have found that city hives produce more honey on average than rural ones, although the difference varies greatly from year to year.

D| Yet the rapid growth of urban beekeeping has begun to worry ecologists. The honeybee is just one of many bee species; Britain alone has around 270, most of which live alone rather than in colonies and receive far less public attention. These wild bees play a vital role in pollinating both wild plants and crops, and many of them are in serious decline. The difficulty is that honeybees and wild bees feed on the same flowers. A single hive may contain 50,000 bees at the height of summer, and where hives are densely packed, as they now are in parts of central London, there may simply not be enough nectar and pollen to go round. One study published in 2020 calculated that in some districts of the capital the number of hives had grown faster than the supply of flowers, and warned that wild bees could be losing out.

E| There are also worries about disease. Honeybees can carry viruses and parasites, and there is evidence that some of these can pass to wild bees when they visit the same flowers. Experienced beekeepers monitor their colonies closely and treat problems as they arise, but not every newcomer has the knowledge or the time to do so, and some critics argue that a hive kept by an enthusiastic but poorly trained amateur may do more harm than good. Swarming presents another issue. When a colony becomes overcrowded, around half the bees leave with the old queen in search of a new home, and a swarm settling on a parked car or a café table can cause understandable alarm among the public.

F| None of this means that cities should be cleared of hives, and few ecologists would suggest it. Most argue instead that the emphasis should shift from adding bees to adding flowers. Planting wildflower verges, leaving areas of grass uncut and choosing nectar-rich plants for parks and gardens benefits honeybees and wild bees alike, as well as butterflies and many other insects. Some cities have gone further. One Dutch city, for example, has covered the roofs of hundreds of its bus shelters with low-growing plants, creating a network of small "bee stops". Elsewhere, organisations that once encouraged companies to install hives now offer to help them create gardens instead.

G| Beekeeping associations have also responded. Many now recommend that anyone interested in keeping bees should first complete a course and spend at least a season helping an experienced beekeeper before acquiring a colony of their own. Some run "adopt a hive" schemes, in which members of the public pay a small annual fee to support an existing colony and receive a jar of its honey in return, giving people a connection with bees without increasing the number of hives. In several cities, associations have also produced maps showing where hives are concentrated, so that new beekeepers can choose locations where competition for food is lower.

H| Perhaps the greatest contribution of urban beekeeping has been educational. Thousands of schoolchildren have now watched bees at work through the glass panels of observation hives, and many adults who began keeping bees out of concern for the honeybee have gone on to learn about the far wider range of insects that depend on urban green spaces. As one London beekeeper put it, "I started out thinking I was saving the bees. I ended up realising that what I was really doing was learning to notice everything else." If the result is cities that are greener and richer in flowers, the rooftop hive may yet prove to have done its job.`,
        groups: [
          {
            id: 'm5-r-g5',
            type: 'mcq',
            instructions: 'Choose the correct letter, A, B, C or D.',
            questions: [
              {
                id: 'm5-r-q28', number: 28, prompt: 'According to paragraph B, what first led many people to start keeping bees in cities?',
                options: [
                  { key: 'A', text: 'a wish to produce their own honey' },
                  { key: 'B', text: 'reports that honeybee colonies were dying' },
                  { key: 'C', text: 'encouragement from their employers' },
                  { key: 'D', text: 'a need to reduce stress' },
                ],
                answer: ['B'], explanation: `Paragraph B: "the starting point was concern... newspapers began to report alarming losses of honeybee colonies". Relaxation (D) is a reason given by "others".`,
              },
              {
                id: 'm5-r-q29', number: 29, prompt: 'What does the writer say about food for bees in the countryside?',
                options: [
                  { key: 'A', text: 'It is more varied than in cities.' },
                  { key: 'B', text: 'It may be plentiful only for short periods.' },
                  { key: 'C', text: 'It is found mainly along railway lines.' },
                  { key: 'D', text: 'It has increased since pesticide use fell.' },
                ],
                answer: ['B'], explanation: `Paragraph C: a single crop "offers an abundance of food for a few weeks and then very little."`,
              },
              {
                id: 'm5-r-q30', number: 30, prompt: 'The 2020 study mentioned in paragraph D found that in parts of London',
                options: [
                  { key: 'A', text: 'several wild bee species had disappeared.' },
                  { key: 'B', text: 'hive numbers had risen faster than flower numbers.' },
                  { key: 'C', text: 'honeybees were producing less honey than before.' },
                  { key: 'D', text: 'new flowers had been planted to support the hives.' },
                ],
                answer: ['B'], explanation: `Paragraph D: "the number of hives had grown faster than the supply of flowers". It only warns that wild bees "could be losing out" (not A).`,
              },
              {
                id: 'm5-r-q31', number: 31, prompt: 'What is the writer\'s main point in paragraph F?',
                options: [
                  { key: 'A', text: 'Hives should be removed from city centres.' },
                  { key: 'B', text: 'Bus shelters are the best place for new gardens.' },
                  { key: 'C', text: 'Providing more flowers is more useful than adding more hives.' },
                  { key: 'D', text: 'Companies have lost interest in environmental projects.' },
                ],
                answer: ['C'], explanation: `Paragraph F: "the emphasis should shift from adding bees to adding flowers." It says few would suggest clearing hives (not A).`,
              },
            ],
          },
          {
            id: 'm5-r-g6',
            type: 'matching',
            instructions: `Complete each sentence with the correct ending, A–G, below.

Choose the correct letter, A–G.`,
            options: [
              { key: 'A', text: 'allow people to support bees without adding more colonies.' },
              { key: 'B', text: 'often paid specialists to look after them.' },
              { key: 'C', text: 'allow bees to begin feeding earlier in the year.' },
              { key: 'D', text: 'may cause more problems than they solve.' },
              { key: 'E', text: 'make it easier to identify diseases in wild bees.' },
              { key: 'F', text: 'are mainly intended to raise money for research.' },
              { key: 'G', text: 'reduce the amount of honey produced in summer.' },
            ],
            questions: [
              { id: 'm5-r-q32', number: 32, prompt: 'Businesses that installed hives on their roofs', answer: ['B'], explanation: `Paragraph B: businesses installed colonies, "often paying specialist companies to look after them."` },
              { id: 'm5-r-q33', number: 33, prompt: 'The higher temperatures found in cities', answer: ['C'], explanation: `Paragraph C: cities are warmer, "which allows bees to begin foraging earlier in the year".` },
              { id: 'm5-r-q34', number: 34, prompt: 'Hives kept by poorly trained amateurs', answer: ['D'], explanation: `Paragraph E: such a hive "may do more harm than good."` },
              { id: 'm5-r-q35', number: 35, prompt: '"Adopt a hive" schemes', answer: ['A'], explanation: `Paragraph G: they give people "a connection with bees without increasing the number of hives."` },
            ],
          },
          {
            id: 'm5-r-g7',
            type: 'completion',
            instructions: `Complete the summary below.

Choose ONE WORD ONLY from the passage for each answer.`,
            maxWords: 1,
            title: 'Problems and responses',
            content: `Ecologists point out that most of Britain's bee species live {{36}} rather than in colonies. Honeybees compete with these wild bees for food, and may also pass on viruses and {{37}} to them. In addition, when a colony becomes overcrowded, a {{38}} may form, which can alarm members of the public. Beekeeping associations now advise people to take a {{39}} before keeping bees, and some have published {{40}} showing where hives are concentrated.`,
            questions: [
              { id: 'm5-r-q36', number: 36, prompt: '', answer: ['alone'], explanation: `Paragraph D: "most of which live alone rather than in colonies".` },
              { id: 'm5-r-q37', number: 37, prompt: '', answer: ['parasites'], explanation: `Paragraph E: "Honeybees can carry viruses and parasites... some of these can pass to wild bees".` },
              { id: 'm5-r-q38', number: 38, prompt: '', answer: ['swarm'], explanation: `Paragraph E: "a swarm settling on a parked car or a café table can cause understandable alarm among the public."` },
              { id: 'm5-r-q39', number: 39, prompt: '', answer: ['course'], explanation: `Paragraph G: "anyone interested in keeping bees should first complete a course".` },
              { id: 'm5-r-q40', number: 40, prompt: '', answer: ['maps'], explanation: `Paragraph G: "associations have also produced maps showing where hives are concentrated".` },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================ WRITING
  writing: {
    tasks: [
      {
        id: 'm5-w-t1',
        number: 1,
        kind: 'letter',
        prompt: `A friend who lives in another country has said they would like to visit the area where you live.\n\nWrite a letter to your friend. In your letter\n• invite your friend to come and stay with you\n• suggest a good time of year to visit and explain why\n• describe some of the things you could do together\n\nWrite at least 150 words.\n\nYou do NOT need to write any addresses.\n\nBegin your letter as follows:\n\nDear ...,`,
        minWords: 150,
        minutes: 20,
        sample: `Dear Hannah,

It was so lovely to get your message last week, and I couldn't believe it when you said you'd like to come and see where I live. Well, consider this your official invitation! I've got a spare room, so you're more than welcome to stay with me for as long as you like.

If I were you, I'd come in late September. The summer crowds have gone by then, but it's still warm enough to sit outside in the evenings, and the hills around the town turn the most incredible shades of red and gold.

There's plenty for us to do. We could hire bikes and follow the old railway path along the river, which ends at a tiny café that does the best apple cake I've ever tasted. I'd also love to take you to the lake for a swim, and one evening we could go into the city to see a show.

Let me know what you think, and I'll start planning!

Lots of love,
Maya`,
      },
      {
        id: 'm5-w-t2',
        number: 2,
        kind: 'essay',
        prompt: `In many countries, more and more people are now working from home instead of travelling to an office or workplace every day.\n\nDo the advantages of this development outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.`,
        minWords: 250,
        minutes: 40,
        sample: `Over the past few years, working from home has gone from being an unusual privilege to an everyday reality for millions of employees. While this shift brings some genuine drawbacks, I believe that, on balance, its benefits are greater.

The most obvious advantage is the time and money saved by not commuting. In large cities, workers may spend two hours a day on crowded trains or in traffic, and that time can instead be used for exercise, family life or simply rest. Fewer journeys also mean less congestion and lower carbon emissions, which benefits society as a whole. Furthermore, many people find that they concentrate better at home, away from the constant interruptions of an open-plan office, and employers have reported that productivity has remained stable or even improved.

There are, however, real disadvantages. Working alone can be isolating, particularly for young employees who live in shared flats and rely on the workplace for social contact. Junior staff may also miss out on the informal learning that happens when they sit beside experienced colleagues and overhear how problems are solved. In addition, the boundary between work and private life can become blurred, so that some people find themselves answering emails late into the evening.

Nevertheless, these problems can largely be managed. Many organisations now adopt a hybrid model, in which staff come into the office two or three days a week for meetings, training and teamwork, while doing focused tasks at home. Clear policies on working hours can also protect employees from burnout.

In conclusion, although home working poses challenges for social connection and professional development, these can be reduced through sensible planning, whereas the gains in time, wellbeing and environmental impact are substantial. For this reason, I consider the advantages to outweigh the disadvantages.`,
      },
    ],
  },

  // ================================================================ SPEAKING
  speaking: {
    part1: {
      topics: [
        {
          topic: 'Work or studies',
          questions: [
            'Do you work or are you a student?',
            'What do you find most interesting about your job / course?',
            'How do you usually spend a typical working or study day?',
            'Would you like to change your job or subject in the future? Why?',
          ],
        },
        {
          topic: 'Reading',
          questions: [
            'Do you enjoy reading?',
            'What kinds of things do you usually read?',
            'Do you prefer reading on paper or on a screen?',
            'Did you read a lot when you were a child?',
          ],
        },
        {
          topic: 'The sky and stars',
          questions: [
            'Do you often look at the sky?',
            'Can you see the stars clearly where you live?',
            'Have you ever been somewhere special to watch the night sky?',
            'Would you like to learn more about the stars and planets? Why or why not?',
          ],
        },
      ],
    },
    part2: {
      topic: "Describe a piece of technology you couldn't live without",
      bullets: ['what it is', 'when you got it', 'how often you use it and what you use it for'],
      closing: 'and explain why it is so important to you.',
      roundOff: ['Do you think you rely on it too much?', 'Would your parents say the same about this technology?'],
      sample: `I suppose the obvious answer would be my phone, but actually the thing I really couldn't do without is a pair of noise-cancelling headphones that I bought about two years ago, just before I started my master's degree.

At the time I was living in a shared flat right above a busy road, and honestly, I was finding it almost impossible to concentrate. There were buses going past every few minutes, my flatmates had friends round most nights, and I was falling behind with my reading. A friend of mine lent me her headphones for a weekend, and the difference was incredible, so I saved up for a month and bought my own.

These days I use them pretty much every single day. Obviously I listen to music and podcasts on them, but mostly I use them for studying, sometimes without any sound at all, just to block out the noise. I also wear them on the train when I'm travelling home to see my family, which is about a four-hour journey, and it makes it far less tiring.

The reason they matter so much to me is that they basically give me a quiet space wherever I am. I'm quite easily distracted, so being able to shut the world out for a couple of hours has made a huge difference to how productive I am. I'd go as far as to say they helped me get through my degree. If I lost them tomorrow, I think I'd be in the shop buying a new pair the same afternoon.`,
    },
    part3: {
      theme: 'Technology and society',
      questions: [
        'How has technology changed the way people communicate with their families?',
        'Do you think older people are at a disadvantage in a society that relies so heavily on technology?',
        'Some people say that modern technology makes us less patient. Do you agree?',
        'Should governments do more to control how technology companies use personal data?',
        'In what ways might technology change the kind of jobs people do in the next twenty years?',
        'Is it possible for a society to become too dependent on technology? What could the consequences be?',
      ],
    },
  },
}
