import type { ReadingSection } from '../../lib/types'

const TFNG_INSTRUCTIONS = `Do the following statements agree with the information given in the text?

Write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this`

export const generalReadingSections: ReadingSection[] = [
  // ---------------------------------------------------------------- Section 1
  {
    id: 'gr-s1',
    title: 'Section 1',
    passageTitle: 'Fitness centres in Ashford / Ashford Community Library: changes to services',
    passage: `## Fitness centres in Ashford

A| Peak Performance Studio
Located on the first floor above the Market Street pharmacy, Peak Performance offers circuit training and strength classes with a maximum of eight people per session, so every member gets proper attention from the instructor. Membership costs £34 a month with no joining fee, and your first month includes two one-to-one sessions with a personal trainer. Open 6 am to 10 pm on weekdays and 8 am to 4 pm on Saturdays. Closed on Sundays.

B| Riverside Leisure Centre
Run by Ashford Borough Council, Riverside has a 25-metre swimming pool, a sauna and a fully equipped gym. There is no need to take out a membership: simply pay £5 each time you visit. Children's swimming lessons run every Saturday morning and must be booked at reception. Visitors can park free of charge for up to three hours.

C| CoreFit 24
Train whenever it suits you. CoreFit 24 never closes, and members enter the building using a personal key fob. Our friendly staff are on site from 9 am to 5 pm every day; outside these hours the gym is monitored by CCTV. Membership is just £19.99 a month on a minimum twelve-month contract. The usual £25 joining fee is waived for anyone who signs up in January.

D| The Willow Centre
A calm space for yoga and Pilates, with classes for complete beginners as well as experienced students. Mats and blocks are provided, so you only need to bring comfortable clothes. Customers aged 60 and over pay half price for all Tuesday morning classes. Parents of children under five can leave them in our supervised crèche while they attend a class.

E| Harbour Boxing Club
Get fit the boxer's way with skipping, pad work and bag training. Beginners never take part in sparring, so there is no physical contact until you are ready. Gloves and hand wraps can be hired at the front desk for £2 per session. Family memberships are available, and students with a valid student card receive 20% off all membership prices.

## Ashford Community Library: changes to services

From 1 March, the library will open on Sundays from 10 am to 2 pm. This is a trial arrangement which will run for six months, after which we will review how many people have used the service.

To make Sunday opening possible, weekday hours will change. From Monday to Friday the library will now close at 7 pm instead of 8 pm. Saturday hours are not affected.

Fines will no longer be charged on children's books that are returned late. Fines on adult books will remain at 20p per day.

Computers must now be booked in advance, either online or at the main desk. Each session lasts one hour, although users may continue for longer if nobody else is waiting. Printing charges are as follows: black and white 10p per page, colour 50p per page.

The meeting room, which until now has been free for all community groups, will be charged at £8 per hour. Registered charities will still be able to use it at no cost.

Please note that the library café will close for refurbishment during April.`,
    groups: [
      {
        id: 'gr-g1',
        type: 'matching',
        instructions: `Look at the five advertisements for fitness centres, A–E.

For which fitness centre are the following statements true?

Choose the correct letter, A–E.

NB You may use any letter more than once.`,
        options: [
          { key: 'A', text: 'Peak Performance Studio' },
          { key: 'B', text: 'Riverside Leisure Centre' },
          { key: 'C', text: 'CoreFit 24' },
          { key: 'D', text: 'The Willow Centre' },
          { key: 'E', text: 'Harbour Boxing Club' },
        ],
        questions: [
          { id: 'gr-q1', number: 1, prompt: 'It offers reduced prices for older people.', answer: ['D'], explanation: 'D: "Customers aged 60 and over pay half price for all Tuesday morning classes."' },
          { id: 'gr-q2', number: 2, prompt: 'It can be used without becoming a member.', answer: ['B'], explanation: 'B: "There is no need to take out a membership: simply pay £5 each time you visit."' },
          { id: 'gr-q3', number: 3, prompt: 'Customers must agree to pay for a whole year.', answer: ['C'], explanation: 'C: "Membership is just £19.99 a month on a minimum twelve-month contract."' },
          { id: 'gr-q4', number: 4, prompt: 'Young children can be looked after while their parents exercise.', answer: ['D'], explanation: 'D: "Parents of children under five can leave them in our supervised crèche while they attend a class." (B mentions children\'s lessons, but that is not childcare for parents.)' },
          { id: 'gr-q5', number: 5, prompt: 'People in education can get a discount.', answer: ['E'], explanation: 'E: "students with a valid student card receive 20% off all membership prices."' },
          { id: 'gr-q6', number: 6, prompt: 'Classes are restricted to a small number of people.', answer: ['A'], explanation: 'A: "a maximum of eight people per session, so every member gets proper attention."' },
          { id: 'gr-q7', number: 7, prompt: 'Customers can pay to borrow equipment.', answer: ['E'], explanation: 'E: "Gloves and hand wraps can be hired at the front desk for £2 per session." (At D mats are provided free.)' },
          { id: 'gr-q8', number: 8, prompt: 'There are times when no staff are present.', answer: ['C'], explanation: 'C: staff are on site "from 9 am to 5 pm"; "outside these hours the gym is monitored by CCTV", although it never closes.' },
        ],
      },
      {
        id: 'gr-g2',
        type: 'tfng',
        instructions: `Look at the notice "Ashford Community Library: changes to services".

${TFNG_INSTRUCTIONS}`,
        questions: [
          { id: 'gr-q9', number: 9, prompt: 'From March, the library will open on Sundays on a permanent basis.', answer: ['FALSE'], explanation: '"This is a trial arrangement which will run for six months" — so it is not permanent.' },
          { id: 'gr-q10', number: 10, prompt: 'The library will close earlier on weekdays than it did previously.', answer: ['TRUE'], explanation: '"From Monday to Friday the library will now close at 7 pm instead of 8 pm."' },
          { id: 'gr-q11', number: 11, prompt: 'Adults will no longer have to pay if they return books late.', answer: ['FALSE'], explanation: '"Fines on adult books will remain at 20p per day." Only children\'s books are fine-free.' },
          { id: 'gr-q12', number: 12, prompt: 'It is sometimes possible to use a computer for more than one hour.', answer: ['TRUE'], explanation: '"users may continue for longer if nobody else is waiting."' },
          { id: 'gr-q13', number: 13, prompt: 'The cost of colour printing has increased.', answer: ['NOT GIVEN'], explanation: 'The notice only gives the current price (50p per page); it says nothing about what colour printing cost before.' },
          { id: 'gr-q14', number: 14, prompt: 'Every community group will now have to pay to use the meeting room.', answer: ['FALSE'], explanation: '"Registered charities will still be able to use it at no cost."' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Section 2
  {
    id: 'gr-s2',
    title: 'Section 2',
    passageTitle: 'Holidays and absence / Health and safety training at Delmont Logistics',
    passage: `## Holidays and absence: extract from the Delmont Logistics staff handbook

Annual leave
Full-time employees are entitled to 25 days of paid annual leave each year in addition to public holidays. The leave year runs from 1 April to 31 March. Part-time employees receive leave on a pro rata basis, so the number of days depends on the hours stated in their contract. Employees who have completed more than five years of continuous service receive two extra days of leave per year.

All requests for leave must be submitted through the online HR portal at least two weeks before the first day of absence. Where an employee wishes to take more than five consecutive working days, at least four weeks' notice is required, and the request must be approved by the department manager rather than the employee's immediate supervisor. Requests are dealt with in the order in which they are received, and during busy periods, particularly December, not all requests can be granted.

We encourage staff to take their full entitlement within the leave year. However, up to five unused days may be carried over into the following year, provided they are taken by the end of June. Any days still unused after that date will be lost.

Sickness absence
If you are unable to come to work because of illness, you must telephone your line manager before 9.30 am on the first day of absence. Text messages and emails are not acceptable. For absences of up to seven calendar days you will be asked to complete a self-certification form on your return. If you are absent for longer than this, you must provide a fit note from your doctor.

## Health and safety training: guidance for all staff

A| Every new employee must complete our induction safety course during their first week. Until the course has been completed and signed off by a supervisor, new staff may not operate any vehicle or machinery in the warehouse, including hand-operated pallet trucks. Office-based staff complete a shorter version of the course, which focuses on fire safety and the correct set-up of computer workstations.

B| Training is delivered in a number of different ways. Some modules, such as manual handling theory, are completed online and can be done at any time during working hours. Practical skills, such as the use of fire extinguishers, are taught in small groups by qualified trainers. In addition, supervisors hold short "toolbox talks" at the start of shifts, which deal with a single topic in about ten minutes.

C| All training is recorded on the company's learning system, and certificates are stored there electronically. Most safety certificates are valid for two years, after which a refresher course is required. The system automatically notifies both the employee and their manager when a certificate is due to expire, and managers are expected to arrange refresher training before that date.

D| Staff must report not only accidents but also "near misses" — events in which nobody was hurt but someone could have been. A box falling from a shelf into an empty aisle is a typical example. Reports should be made within 24 hours using the incident form. The health and safety team reviews all reports each month, and the lessons learned are often used to update our training materials.

E| Each department has at least two fire wardens. These are employees who have offered to take on the role in addition to their normal job. Wardens receive an extra day of training each year and are responsible for checking that everyone has left the building during an evacuation. In recognition of this, they are paid a small monthly allowance.

F| Contractors and visitors must sign in at reception, where they will be given a short safety briefing and a visitor badge. They must be accompanied by a member of staff at all times while in operational areas. Contractors carrying out maintenance work must also show evidence of their own company's safety training before work begins.`,
    groups: [
      {
        id: 'gr-g3',
        type: 'completion',
        instructions: `Complete the notes below.

Choose NO MORE THAN THREE WORDS AND/OR A NUMBER from the text for each answer.`,
        maxWords: 3,
        allowNumber: true,
        title: 'Holidays and absence',
        content: `## Annual leave
- The leave year starts on {{15}}.
- Leave for part-time staff is calculated on a {{16}} basis.
- Staff must make all leave requests using the {{17}}.
- For more than five days in a row, permission is needed from the {{18}}.
- Up to five days can be carried over but must be used before the end of {{19}}.
- Long-serving staff receive {{20}} additional days each year.

## Sickness
- Absences of over seven days require a {{21}} from a doctor.`,
        questions: [
          { id: 'gr-q15', number: 15, prompt: '', answer: ['1 April', '1st April', 'April 1', 'April 1st', 'first April', 'first of April', '1st of April'], explanation: '"The leave year runs from 1 April to 31 March."' },
          { id: 'gr-q16', number: 16, prompt: '', answer: ['pro rata', 'pro-rata'], explanation: '"Part-time employees receive leave on a pro rata basis."' },
          { id: 'gr-q17', number: 17, prompt: '', answer: ['online HR portal', 'HR portal'], explanation: '"All requests for leave must be submitted through the online HR portal."' },
          { id: 'gr-q18', number: 18, prompt: '', answer: ['department manager'], explanation: '"the request must be approved by the department manager rather than the employee\'s immediate supervisor."' },
          { id: 'gr-q19', number: 19, prompt: '', answer: ['June'], explanation: '"up to five unused days may be carried over ... provided they are taken by the end of June."' },
          { id: 'gr-q20', number: 20, prompt: '', answer: ['two', '2'], explanation: '"Employees who have completed more than five years of continuous service receive two extra days of leave per year."' },
          { id: 'gr-q21', number: 21, prompt: '', answer: ['fit note'], explanation: '"If you are absent for longer than this, you must provide a fit note from your doctor."' },
        ],
      },
      {
        id: 'gr-g4',
        type: 'matching',
        instructions: `The text "Health and safety training: guidance for all staff" has six sections, A–F.

Choose the correct heading for each section from the list of headings below.

Choose the correct number, i–ix.`,
        options: [
          { key: 'i', text: 'Rules for people who are not employees' },
          { key: 'ii', text: 'The cost of providing training' },
          { key: 'iii', text: 'Learning from incidents that almost happened' },
          { key: 'iv', text: 'What must be done before starting certain work' },
          { key: 'v', text: 'Consequences for staff who miss training sessions' },
          { key: 'vi', text: 'A range of training methods' },
          { key: 'vii', text: 'Choosing suitable protective clothing' },
          { key: 'viii', text: 'Staff who volunteer for additional duties' },
          { key: 'ix', text: 'Making sure qualifications remain valid' },
        ],
        questions: [
          { id: 'gr-q22', number: 22, prompt: 'Section A', answer: ['iv'], explanation: 'A: new staff "may not operate any vehicle or machinery" until the induction course "has been completed and signed off".' },
          { id: 'gr-q23', number: 23, prompt: 'Section B', answer: ['vi'], explanation: 'B: "Training is delivered in a number of different ways" — online modules, small-group practical sessions and toolbox talks.' },
          { id: 'gr-q24', number: 24, prompt: 'Section C', answer: ['ix'], explanation: 'C: certificates "are valid for two years, after which a refresher course is required"; the system warns when one "is due to expire".' },
          { id: 'gr-q25', number: 25, prompt: 'Section D', answer: ['iii'], explanation: 'D: staff must report "near misses — events in which nobody was hurt but someone could have been", and "the lessons learned" update training.' },
          { id: 'gr-q26', number: 26, prompt: 'Section E', answer: ['viii'], explanation: 'E: fire wardens "have offered to take on the role in addition to their normal job".' },
          { id: 'gr-q27', number: 27, prompt: 'Section F', answer: ['i'], explanation: 'F: describes what "Contractors and visitors" must do (sign in, briefing, be accompanied).' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Section 3
  {
    id: 'gr-s3',
    title: 'Section 3',
    passageTitle: 'Under Cover: A Short History of the Umbrella',
    passage: `A| Few everyday objects are taken for granted as completely as the umbrella. Most of us own several, lose them regularly and replace them without a second thought. Yet the umbrella has a history stretching back at least three thousand years, and for most of that time it had very little to do with rain. The earliest examples, which appear in carvings and paintings from ancient Egypt, Assyria and China, were designed to provide shade from the sun. They were also powerful symbols. In Assyria, only the king was permitted to have a parasol held over his head, and the task of carrying it was given to a servant walking close behind him. To be shaded, in other words, was a sign that one stood above ordinary people.

B| The idea of using a canopy to keep off rain is usually credited to China. According to one widely repeated account, Chinese craftsmen began coating paper or silk canopies with wax and lacquer, producing a covering that water could not easily penetrate. These umbrellas were fitted to frames of split bamboo which could be opened and closed, a design that was remarkably close to the modern one. Historians, however, disagree about when this happened, with estimates ranging over several centuries, and much of the evidence comes from later writers rather than from the period itself. What is clear is that oiled-paper umbrellas later spread to Korea and Japan, where they are still made by hand today.

C| In ancient Greece and Rome, the parasol was used mainly by women, and a man seen carrying one was likely to be laughed at for being unmanly. Wealthy Roman women had their parasols carried by slaves, and the objects became fashion accessories, made in bright colours and fine materials. There is some evidence that Romans occasionally treated leather covers with oil so that they could be used in wet weather, particularly by spectators at outdoor entertainments, but this does not seem to have been common.

D| After the collapse of the Roman Empire, the umbrella almost disappeared from everyday life in Europe. It survived mainly in religious ceremonies, where a canopy was held above popes and bishops in processions as a mark of honour. It was not until the sixteenth and seventeenth centuries that the umbrella returned to the streets of Italy and France, largely thanks to travellers who had seen parasols in Asia and the Middle East and brought examples home. Once again, it was used principally by fashionable women to protect their skin from the sun.

E| In Britain, the umbrella's acceptance as an object for men is often linked to one person: Jonas Hanway, a merchant and founder of several charities, who is said to have carried an umbrella through the streets of London for about thirty years from the 1750s. Hanway was not the first Londoner to own one — some coffee houses already kept an umbrella to escort customers to their carriages on wet days — but he was among the first men to use one regularly in public. He was frequently insulted by the drivers of hired coaches, who depended on bad weather for much of their trade and feared that umbrellas would persuade people to walk instead. By the time of Hanway's death, however, umbrellas had become a familiar sight, and for a while they were even known as "Hanways".

F| Early European umbrellas were heavy and awkward. Their ribs were usually made of whalebone, their covers of oiled canvas or silk, and their shafts of wood, and a large model could easily weigh well over a kilogram. The decisive improvement came in 1852, when an English manufacturer named Samuel Fox introduced a frame with steel ribs. Fox's company already made steel supports for women's corsets, and he realised that the same material, shaped into ribs with a U-shaped cross-section, would produce a frame that was both lighter and stronger than anything available. His design proved so successful that the basic structure of most umbrellas sold today is essentially the same. Covers changed too: silk gave way to cotton, and after the Second World War, to nylon and other synthetic fabrics.

G| The twentieth century brought the compact umbrella, which could be folded small enough to fit into a pocket or handbag. Telescopic shafts and hinged ribs made this possible, and by the 1960s folding umbrellas were widely available. At the same time, mass production, increasingly concentrated in a small number of factories in Asia, caused prices to fall sharply. The result is that umbrellas are now often treated as disposable items, bought at a station kiosk during a sudden shower and abandoned soon afterwards. Because they combine metal, plastic and fabric, which are difficult to separate, very few are recycled, and millions end up in landfill every year.

H| Designers continue to experiment. Some modern umbrellas have vented canopies that allow strong gusts to pass through instead of turning the umbrella inside out; others fold inwards so that the wet surface is kept away from the user. Several cities have tried umbrella-sharing schemes, although many of these have struggled because users fail to return the umbrellas. Despite such efforts, the umbrella most people carry would still be easily recognised by Samuel Fox. Whether this means that the design was already close to perfect, or simply that consumers prefer something cheap and familiar, remains an open question.`,
    groups: [
      {
        id: 'gr-g5',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B, C or D.',
        questions: [
          {
            id: 'gr-q28',
            number: 28,
            prompt: 'According to the writer, in ancient Assyria the parasol',
            options: [
              { key: 'A', text: 'was used mainly by women.' },
              { key: 'B', text: 'indicated that the person beneath it was important.' },
              { key: 'C', text: 'was intended to protect people from rain.' },
              { key: 'D', text: 'was usually carried by the king himself.' },
            ],
            answer: ['B'],
            explanation: 'Paragraph A: "only the king was permitted to have a parasol held over his head ... To be shaded ... was a sign that one stood above ordinary people." A servant carried it, so D is wrong.',
          },
          {
            id: 'gr-q29',
            number: 29,
            prompt: 'What does the writer say about the invention of the waterproof umbrella in China?',
            options: [
              { key: 'A', text: 'It is described in detail in documents from the time.' },
              { key: 'B', text: 'It was based on designs brought from Japan.' },
              { key: 'C', text: 'It depended on the use of metal frames.' },
              { key: 'D', text: 'Experts do not agree on when it took place.' },
            ],
            answer: ['D'],
            explanation: 'Paragraph B: "Historians, however, disagree about when this happened, with estimates ranging over several centuries." Evidence comes "from later writers" (not A); the frames were bamboo (not C); umbrellas spread to Japan later (not B).',
          },
          {
            id: 'gr-q30',
            number: 30,
            prompt: 'Why did coach drivers insult Jonas Hanway?',
            options: [
              { key: 'A', text: 'They thought umbrellas might reduce their business.' },
              { key: 'B', text: 'They believed umbrellas were only suitable for women.' },
              { key: 'C', text: 'His umbrella made it difficult for them to drive.' },
              { key: 'D', text: 'They disliked his work for charities.' },
            ],
            answer: ['A'],
            explanation: 'Paragraph E: the drivers "depended on bad weather for much of their trade and feared that umbrellas would persuade people to walk instead."',
          },
          {
            id: 'gr-q31',
            number: 31,
            prompt: "Samuel Fox's umbrella frame was significant because",
            options: [
              { key: 'A', text: 'it was the first frame that could be folded.' },
              { key: 'B', text: 'it allowed covers to be made of nylon.' },
              { key: 'C', text: 'it was lighter and stronger than earlier frames.' },
              { key: 'D', text: 'it was cheaper to make than whalebone frames.' },
            ],
            answer: ['C'],
            explanation: 'Paragraph F: the steel ribs "would produce a frame that was both lighter and stronger than anything available." Cost is not mentioned; folding frames already existed in China (paragraph B).',
          },
        ],
      },
      {
        id: 'gr-g6',
        type: 'matching',
        instructions: `Complete the summary using the list of words, A–J, below.

Choose the correct letter, A–J.`,
        title: 'The umbrella in Europe',
        options: [
          { key: 'A', text: 'women' },
          { key: 'B', text: 'soldiers' },
          { key: 'C', text: 'religious' },
          { key: 'D', text: 'travellers' },
          { key: 'E', text: 'merchants' },
          { key: 'F', text: 'compact' },
          { key: 'G', text: 'expensive' },
          { key: 'H', text: 'disposable' },
          { key: 'I', text: 'royal' },
          { key: 'J', text: 'children' },
        ],
        content: `In ancient Greece and Rome, parasols were carried mostly by {{32}}, and men who used them risked being mocked. After the Roman Empire ended, umbrellas were rarely seen in Europe except at {{33}} events, where they were held over important figures. They came back into use in Italy and France several centuries later, introduced by {{34}} who had encountered them in other parts of the world. In the twentieth century the {{35}} umbrella appeared, small enough to be carried in a pocket. As prices fell, umbrellas came to be regarded as {{36}} objects, and very few of them are recycled today.`,
        questions: [
          { id: 'gr-q32', number: 32, prompt: '', answer: ['A'], explanation: 'Paragraph C: "the parasol was used mainly by women, and a man seen carrying one was likely to be laughed at."' },
          { id: 'gr-q33', number: 33, prompt: '', answer: ['C'], explanation: 'Paragraph D: "It survived mainly in religious ceremonies, where a canopy was held above popes and bishops."' },
          { id: 'gr-q34', number: 34, prompt: '', answer: ['D'], explanation: 'Paragraph D: "largely thanks to travellers who had seen parasols in Asia and the Middle East and brought examples home."' },
          { id: 'gr-q35', number: 35, prompt: '', answer: ['F'], explanation: 'Paragraph G: "The twentieth century brought the compact umbrella, which could be folded small enough to fit into a pocket."' },
          { id: 'gr-q36', number: 36, prompt: '', answer: ['H'], explanation: 'Paragraph G: "umbrellas are now often treated as disposable items."' },
        ],
      },
      {
        id: 'gr-g7',
        type: 'tfng',
        instructions: `Do the following statements agree with the information given in the reading passage?

Write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this`,
        questions: [
          { id: 'gr-q37', number: 37, prompt: 'Jonas Hanway was the first person in London to own an umbrella.', answer: ['FALSE'], explanation: 'Paragraph E: "Hanway was not the first Londoner to own one — some coffee houses already kept an umbrella."' },
          { id: 'gr-q38', number: 38, prompt: "Samuel Fox's company produced goods other than umbrellas.", answer: ['TRUE'], explanation: 'Paragraph F: "Fox\'s company already made steel supports for women\'s corsets."' },
          { id: 'gr-q39', number: 39, prompt: 'Nylon umbrella covers last longer than silk ones.', answer: ['NOT GIVEN'], explanation: 'Paragraph F only says covers changed from silk to cotton and then nylon; durability is not compared.' },
          { id: 'gr-q40', number: 40, prompt: 'The basic structure of most umbrellas has changed considerably since the 1850s.', answer: ['FALSE'], explanation: 'Paragraph F: "the basic structure of most umbrellas sold today is essentially the same"; paragraph H: it "would still be easily recognised by Samuel Fox."' },
        ],
      },
    ],
  },
]
