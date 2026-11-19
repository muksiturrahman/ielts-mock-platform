import type { ReadingSection } from '../../lib/types'

// Original content written for this app — not taken from any published IELTS material.

const letters = (...keys: string[]) => keys.map((k) => ({ key: k, text: `Paragraph ${k}` }))

export const academicReadingSections: ReadingSection[] = [
  // ───────────────────────────── Passage 1 ─────────────────────────────
  {
    id: 'ar-s1',
    title: 'Passage 1',
    passageTitle: 'The Ship Beneath the Salt Marsh',
    passage: `A| In the spring of 2019, a team of engineers reinforcing a flood embankment at Hollin Fen, a stretch of reclaimed salt marsh on the eastern coast of England, struck a layer of blackened timber some four metres below the surface. Work was halted within the hour and the county archaeologist was called. What first appeared to be the remains of a collapsed jetty turned out, over the following weeks, to be the lower hull of a wooden vessel almost seventeen metres long — the most complete early medieval trading ship yet recovered in the region.

B| The ship owed its survival to the peculiar chemistry of the marsh. Wood normally decays because fungi and bacteria break down its cellulose, a process that requires oxygen. At Hollin Fen, however, the hull had been sealed beneath successive layers of fine estuarine clay, which shut out the air almost completely. In these waterlogged, oxygen-free conditions, the microbes responsible for decay could not survive in significant numbers, and the oak planks remained recognisable down to the marks left by the shipwright's axe. Even so, the timber was far from sound. Over the centuries, water had gradually replaced much of the wood's internal structure, so that some planks had the consistency of wet cardboard and would have crumbled if they had been allowed to dry out.

C| Establishing the age of the vessel was the first priority. Radiocarbon dating of a hazel twig wedged between two planks suggested a date somewhere in the eighth or ninth century, but the margin of error was too wide to be of much use to historians. A far more precise answer came from dendrochronology, the study of tree rings. Because the width of each annual ring varies with growing conditions, a long sequence of rings forms a pattern that can be matched against master chronologies built up from thousands of dated samples. Samples taken from eleven of the hull planks showed that the oaks had been felled in the winter of 846 or the following spring. Moreover, the ring patterns most closely resembled those of trees from south-west Norway rather than from England, indicating that the ship had been built far from where it eventually came to rest.

D| The contents of the hull told a story of long-distance commerce. Excavators recovered twenty-three quernstones — circular stones used for grinding grain — cut from a distinctive volcanic rock found in the Rhineland, along with fragments of glass drinking vessels and a small leather pouch holding unworked lumps of Baltic amber. Perhaps the most revealing finds, however, were the least spectacular: dozens of fish bones from the bilge, which analysis identified as cod. Cod were not caught in quantity in the waters off eastern England at this date, so the bones are thought to be the remains of dried fish carried as provisions for the crew.

E| Less obvious evidence came from the clay itself. Pollen grains, which are extremely resistant to decay, were extracted from sediment samples taken immediately above and below the hull. Beneath the ship, the pollen was dominated by grasses and salt-tolerant plants typical of an open tidal creek. In the layers directly above, cereal pollen became increasingly common, suggesting that within a few generations of the ship's arrival the surrounding land had been drained and brought under cultivation. The vessel, in other words, had come to rest at a moment when the landscape around it was undergoing rapid change.

F| Why the ship was left where it lay remains disputed. One group of researchers argues that it was simply wrecked: a storm surge could have driven it up the creek and stranded it on a mudbank, where it was too badly damaged to refloat. Others point out that the mast, the steering oar and most of the fittings of any value are missing, and that several planks show clean saw cuts rather than the jagged breaks that storm damage would be expected to produce. In their view, the vessel was deliberately abandoned at the end of its working life, and anything reusable was stripped from it before the tide was allowed to cover the remains. The presence of the quernstones, which would have been valuable, is difficult to reconcile with this second interpretation, although its supporters suggest that the stones may simply have been too heavy to move once the ship's own lifting gear had been removed.

G| Raising the hull presented problems of its own. Because waterlogged wood shrinks and cracks as soon as it dries, every timber had to be kept wet from the moment it was exposed. The planks were lifted one at a time, recorded with a three-dimensional laser scanner and transferred to tanks of polyethylene glycol, a wax-like chemical that slowly penetrates the wood and takes the place of the water within its cells. This stage alone is expected to last between three and four years, after which the timbers will be freeze-dried to remove any remaining moisture. Only then can the ship be reassembled for public display — a process its conservators estimate will not be complete until the end of the decade.`,
    groups: [
      {
        id: 'ar-g1',
        type: 'matching',
        instructions:
          'Reading Passage 1 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G. NB You may use any letter more than once.',
        options: letters('A', 'B', 'C', 'D', 'E', 'F', 'G'),
        questions: [
          {
            id: 'ar-q1',
            number: 1,
            prompt: 'a comparison between two methods of dating the vessel',
            answer: ['C'],
            explanation:
              'Paragraph C contrasts radiocarbon dating ("the margin of error was too wide") with dendrochronology ("A far more precise answer came from dendrochronology").',
          },
          {
            id: 'ar-q2',
            number: 2,
            prompt: 'evidence of the food eaten by those on board',
            answer: ['D'],
            explanation:
              'Paragraph D: the cod bones "are thought to be the remains of dried fish carried as provisions for the crew."',
          },
          {
            id: 'ar-q3',
            number: 3,
            prompt: 'a reference to an initial misidentification of the find',
            answer: ['A'],
            explanation:
              'Paragraph A: "What first appeared to be the remains of a collapsed jetty turned out ... to be the lower hull of a wooden vessel."',
          },
          {
            id: 'ar-q4',
            number: 4,
            prompt: 'an explanation of why the hull did not decay',
            answer: ['B'],
            explanation:
              'Paragraph B: the clay "shut out the air almost completely", so "the microbes responsible for decay could not survive in significant numbers."',
          },
          {
            id: 'ar-q5',
            number: 5,
            prompt: "a piece of evidence that is hard to explain using one theory of the ship's fate",
            answer: ['F'],
            explanation:
              'Paragraph F: "The presence of the quernstones, which would have been valuable, is difficult to reconcile with this second interpretation."',
          },
        ],
      },
      {
        id: 'ar-g2',
        type: 'tfng',
        instructions:
          'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.',
        questions: [
          {
            id: 'ar-q6',
            number: 6,
            prompt: 'The ship was discovered during work to improve flood defences.',
            answer: ['TRUE'],
            explanation:
              'Paragraph A: the timber was struck by "a team of engineers reinforcing a flood embankment".',
          },
          {
            id: 'ar-q7',
            number: 7,
            prompt: "Radiocarbon dating provided historians with a precise date for the ship's construction.",
            answer: ['FALSE'],
            explanation:
              'Paragraph C: radiocarbon dating gave only "the eighth or ninth century" and "the margin of error was too wide to be of much use to historians."',
          },
          {
            id: 'ar-q8',
            number: 8,
            prompt: 'The oak used to build the ship came from trees that grew in England.',
            answer: ['FALSE'],
            explanation:
              'Paragraph C: the ring patterns "most closely resembled those of trees from south-west Norway rather than from England".',
          },
          {
            id: 'ar-q9',
            number: 9,
            prompt: 'The quernstones were the most valuable items found on the ship.',
            answer: ['NOT GIVEN'],
            explanation:
              'Paragraph F says only that the quernstones "would have been valuable". Their value is never compared with the glass or the amber, so the passage does not say they were the most valuable.',
          },
          {
            id: 'ar-q10',
            number: 10,
            prompt: 'Pollen evidence suggests that farming began near the site after the ship arrived.',
            answer: ['TRUE'],
            explanation:
              'Paragraph E: above the hull "cereal pollen became increasingly common", suggesting that "within a few generations of the ship\'s arrival the surrounding land had been drained and brought under cultivation."',
          },
        ],
      },
      {
        id: 'ar-g3',
        type: 'completion',
        instructions: 'Complete the table below. Choose ONE WORD ONLY from the passage for each answer.',
        maxWords: 1,
        title: 'Conserving the Hollin Fen ship',
        content: `| Stage | Process | Notes |
| Lifting | planks raised one at a time and recorded with a three-dimensional {{11}} scanner | wood kept wet throughout |
| Treatment | timbers placed in tanks of polyethylene glycol | the chemical takes the place of the {{12}} within the wood's cells |
| Drying | timbers are {{13}} | final stage before reassembly for display |`,
        questions: [
          {
            id: 'ar-q11',
            number: 11,
            prompt: '',
            answer: ['laser'],
            explanation: 'Paragraph G: the planks were "recorded with a three-dimensional laser scanner".',
          },
          {
            id: 'ar-q12',
            number: 12,
            prompt: '',
            answer: ['water'],
            explanation:
              'Paragraph G: polyethylene glycol "takes the place of the water within its cells".',
          },
          {
            id: 'ar-q13',
            number: 13,
            prompt: '',
            answer: ['freeze-dried'], // "freeze dried" is two words — over the ONE WORD limit
            explanation:
              'Paragraph G: "the timbers will be freeze-dried to remove any remaining moisture." Only then can the ship be reassembled.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── Passage 2 ─────────────────────────────
  {
    id: 'ar-s2',
    title: 'Passage 2',
    passageTitle: 'Why Do Birds Sing at Dawn?',
    passage: `A| Anyone who has woken early on a spring morning near a wood or a large garden will be familiar with the dawn chorus: the sudden burst of birdsong that begins in the half-light before sunrise, swells to a peak and then subsides within an hour or two. In temperate regions the chorus is most intense from late winter to early summer, and it may involve dozens of species singing at once. For a phenomenon so widespread, it is surprisingly poorly understood. Song is not free. It consumes energy, occupies time that could otherwise be spent feeding, and may reveal the singer's position to predators. Why, then, should so many birds concentrate such effort into the first moments of the day, rather than spreading it more evenly from dawn to dusk?

B| The earliest scientific explanation looked not at the birds but at the air. In the early morning, wind speeds are usually at their lowest, and the layer of air nearest the ground is often cooler than the air above it. Under these conditions, sound waves are less scattered by turbulence and may even be bent back towards the earth, so that a song travels further and arrives more clearly. The acoustician Marta Lindqvist broadcast recorded song through loudspeakers at different times of day and found that, on calm mornings, it remained recognisable at roughly twice the distance it did at midday. The idea was attractive, but later work cast doubt on its generality. When Daniel Okafor repeated similar experiments in a lowland tropical forest, where humidity and temperature change little through the night, he found no measurable advantage to singing at dawn at all — yet the birds there still sang most intensely at first light.

C| A second explanation concerns not what dawn offers but what it denies. In the first hour of daylight, light levels are low, insects are often still inactive in the cool air, and searching for food is therefore inefficient. If a bird cannot feed profitably, it may as well use the time to sing. This 'inefficient foraging' hypothesis predicts that a species should begin singing at the moment when light is sufficient for it to move about safely but not yet sufficient for it to find food. Hiroshi Tanabe tested this by comparing the start times of song among more than fifty woodland species. He found that birds with relatively large eyes, which are able to see in dimmer light, consistently started singing earlier than those with smaller eyes — exactly the pattern the hypothesis predicts.

D| Other researchers have emphasised what song communicates to those who hear it. A small songbird may lose up to a tenth of its body weight on a cold night simply keeping warm. A male that can nevertheless sing loudly and continuously at dawn is therefore advertising, in a way that cannot easily be faked, that he has energy to spare. Rivals may take this as a warning, and females as evidence of a healthy partner. Clare Hensley put the idea to the test by providing extra food to some males on the evening before their song was recorded. The following morning, these birds began singing earlier and sang for longer than unfed males in neighbouring territories, suggesting that song output really does reflect a bird's condition.

E| A further group of explanations links the chorus to reproduction. In many species, females lay their eggs shortly after sunrise and are most likely to be fertile in the early morning. A male that sings at this time may be guarding his mate, warning other males away at the very moment when she might otherwise be approached by them. Pieter van Aalst monitored song in a population of nest-box birds over three breeding seasons. He found that the males' dawn singing reached its highest level during their partners' fertile period and declined sharply once the females began incubating their eggs.

F| Today, few researchers believe that any one of these theories can account for the dawn chorus on its own. The hypotheses are not mutually exclusive, and their relative importance probably differs between species, between habitats and even between individual birds. Meanwhile, human activity is altering the chorus in ways that may help to separate the competing explanations. In cities, persistent traffic noise can mask song, and some urban birds have begun to sing earlier, before the morning rush hour begins. Artificial light from street lamps appears to have a similar effect, prompting birds to start singing while it is still fully dark. Okafor has argued that such urban populations should be treated as natural experiments, since they allow scientists to observe what happens when a single factor, such as light or noise, changes while the others remain the same.`,
    groups: [
      {
        id: 'ar-g4',
        type: 'matching',
        instructions:
          'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–x.',
        title: 'List of Headings',
        options: [
          { key: 'i', text: 'The danger of attracting predators' },
          { key: 'ii', text: 'Making use of time when feeding is difficult' },
          { key: 'iii', text: 'A possible connection with breeding' },
          { key: 'iv', text: 'A puzzling use of energy' },
          { key: 'v', text: 'Why recorded song gives unreliable results' },
          { key: 'vi', text: 'An advantage provided by atmospheric conditions' },
          { key: 'vii', text: 'Moving towards a combined view' },
          { key: 'viii', text: 'How cities are silencing birdsong' },
          { key: 'ix', text: "A sign of a bird's physical state" },
          { key: 'x', text: 'Differences between tropical and temperate species' },
        ],
        questions: [
          {
            id: 'ar-q14',
            number: 14,
            prompt: 'Paragraph A',
            answer: ['iv'],
            explanation:
              'Paragraph A stresses that "Song is not free" — it costs energy and time — and asks why birds "concentrate such effort" at dawn. Predators (i) are mentioned only as one cost.',
          },
          {
            id: 'ar-q15',
            number: 15,
            prompt: 'Paragraph B',
            answer: ['vi'],
            explanation:
              'Paragraph B: low wind and cool air near the ground mean "a song travels further and arrives more clearly." The tropical forest (x) is a single counter-example, not the main idea.',
          },
          {
            id: 'ar-q16',
            number: 16,
            prompt: 'Paragraph C',
            answer: ['ii'],
            explanation:
              'Paragraph C: "searching for food is therefore inefficient. If a bird cannot feed profitably, it may as well use the time to sing."',
          },
          {
            id: 'ar-q17',
            number: 17,
            prompt: 'Paragraph D',
            answer: ['ix'],
            explanation:
              'Paragraph D: dawn song advertises "that he has energy to spare"; Hensley\'s results suggest "song output really does reflect a bird\'s condition."',
          },
          {
            id: 'ar-q18',
            number: 18,
            prompt: 'Paragraph E',
            answer: ['iii'],
            explanation:
              'Paragraph E: "A further group of explanations links the chorus to reproduction" — fertility, egg-laying and mate guarding.',
          },
          {
            id: 'ar-q19',
            number: 19,
            prompt: 'Paragraph F',
            answer: ['vii'],
            explanation:
              'Paragraph F: "few researchers believe that any one of these theories can account for the dawn chorus on its own. The hypotheses are not mutually exclusive." Cities make birds sing earlier, not fall silent, so viii is wrong.',
          },
        ],
      },
      {
        id: 'ar-g5',
        type: 'matching',
        instructions:
          'Look at the following findings (Questions 20–23) and the list of researchers below. Match each finding with the correct researcher, A–E. Write the correct letter, A–E.',
        title: 'List of Researchers',
        options: [
          { key: 'A', text: 'Marta Lindqvist' },
          { key: 'B', text: 'Daniel Okafor' },
          { key: 'C', text: 'Hiroshi Tanabe' },
          { key: 'D', text: 'Clare Hensley' },
          { key: 'E', text: 'Pieter van Aalst' },
        ],
        questions: [
          {
            id: 'ar-q20',
            number: 20,
            prompt: 'The acoustic benefit of singing at dawn was absent in one type of habitat.',
            answer: ['B'],
            explanation:
              'Paragraph B: in a lowland tropical forest, Okafor "found no measurable advantage to singing at dawn at all". Lindqvist (A) found the benefit, not its absence.',
          },
          {
            id: 'ar-q21',
            number: 21,
            prompt: 'An increase in available food changed the way birds sang.',
            answer: ['D'],
            explanation:
              'Paragraph D: Hensley gave extra food to some males, and "these birds began singing earlier and sang for longer".',
          },
          {
            id: 'ar-q22',
            number: 22,
            prompt: 'A physical feature of a species is related to when its song begins.',
            answer: ['C'],
            explanation:
              'Paragraph C: Tanabe found that "birds with relatively large eyes ... consistently started singing earlier".',
          },
          {
            id: 'ar-q23',
            number: 23,
            prompt: "Singing decreased after a change in the female's behaviour.",
            answer: ['E'],
            explanation:
              'Paragraph E: van Aalst found that dawn singing "declined sharply once the females began incubating their eggs."',
          },
        ],
      },
      {
        id: 'ar-g6',
        type: 'completion',
        instructions:
          'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
        maxWords: 2,
        title: 'Birdsong in cities',
        content: `In urban areas, birds have to compete with {{24}}, and some have responded by singing before the morning rush hour. Light from street lamps, a form of {{25}}, also seems to make birds start singing while it is still completely dark. According to Okafor, these urban populations can be regarded as {{26}}, because they show what happens when only one factor changes.`,
        questions: [
          {
            id: 'ar-q24',
            number: 24,
            prompt: '',
            answer: ['traffic noise'],
            explanation: 'Paragraph F: "In cities, persistent traffic noise can mask song".',
          },
          {
            id: 'ar-q25',
            number: 25,
            prompt: '',
            answer: ['artificial light'],
            explanation:
              'Paragraph F: "Artificial light from street lamps appears to have a similar effect, prompting birds to start singing while it is still fully dark."',
          },
          {
            id: 'ar-q26',
            number: 26,
            prompt: '',
            answer: ['natural experiments', 'natural experiment'],
            explanation:
              'Paragraph F: "Okafor has argued that such urban populations should be treated as natural experiments".',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── Passage 3 ─────────────────────────────
  {
    id: 'ar-s3',
    title: 'Passage 3',
    passageTitle: 'Counting What Counts: The Hidden Costs of Performance Targets',
    passage: `Over the past forty years, governments in many countries have come to rely on numerical targets as a means of managing public services. Hospitals are judged on how long patients wait for treatment, schools on the proportion of pupils who pass examinations, and police forces on the volume of recorded crime. The appeal of this approach is easy to understand. Numbers appear objective; they allow one institution to be compared with another; and they promise taxpayers a clear view of what their money is buying. Let me be clear from the outset that I am not arguing that measurement is worthless. A health service that had no idea how long its patients waited would be failing in a basic duty. My concern is with what happens when a measure ceases to be a source of information and becomes a target, with rewards attached to hitting it and penalties for missing it.

The problem was captured in an observation usually attributed to the economist Charles Goodhart: once a measure is made into a target, it tends to lose its value as a measure. The reason is that people under pressure to meet a number will look for the easiest way of doing so, and the easiest way is not always to improve the underlying service. There have been numerous reports of hospitals in which patients were kept waiting in ambulances outside the emergency department, because the official clock measuring waiting time did not start until they passed through the door. The figures improved; the patients' experience did not.

Such manipulation, usually called 'gaming', attracts most of the public criticism of targets, but in my view it is not the most serious problem. Gaming is at least visible once it is discovered, and it can be punished. Far more damaging, because it is harder to detect, is the way in which targets draw attention away from everything that is not counted. Consider a school whose standing depends on the percentage of pupils who achieve a particular grade. Its teachers face a powerful incentive to concentrate their efforts on pupils just below that grade, for whom a little extra help may tip the balance, while giving less attention both to the most able, who will pass anyway, and to those who are struggling most, whom no reasonable effort will lift over the line in time. No rule has been broken, and the published results may look excellent. Yet the education of a large number of children has quietly been made worse.

The usual response from supporters of targets is that these distortions reflect poor design rather than any fundamental flaw. If schools neglect their strongest pupils, add a measure of top grades; if hospitals delay admissions, measure the time from the ambulance's arrival. I find this reasoning unconvincing. Each new indicator creates new opportunities for distortion, which in turn prompt further indicators, in a process with no obvious end. Meanwhile, the burden of recording all this information falls on the very people whose work it is supposed to improve. A survey of community nurses in one region found that they were spending close to a third of their working hours on documentation — time that was not, by definition, spent with patients.

There is also a subtler cost. Most people who become teachers, nurses or social workers do so at least partly out of a sense of vocation. A system that assumes they will perform well only if they are rewarded for doing so risks undermining the very motivation it takes for granted. Psychologists have shown in laboratory studies that offering people a reward for an activity they already find satisfying can reduce their interest in it once the reward is removed. It must be admitted that the evidence from real workplaces is considerably less clear-cut than that from the laboratory, and I would not wish to overstate the case. Nevertheless, the many professionals who report feeling that they now work for the spreadsheet rather than for the people they serve should not be dismissed lightly.

What, then, is the alternative? It is not to abandon numbers, which remain indispensable, but to change the way they are used. Data should function as a thermometer rather than a thermostat: a reading that tells managers where to look and what questions to ask, rather than a device that automatically triggers a reward or a penalty. A hospital with unusually long waiting times should be visited by experienced practitioners who can talk to staff, observe the work and judge whether the figures reflect poor management, an unusually demanding local population or something else entirely. Such a system is undoubtedly more expensive than a league table, and it is less transparent, since it depends on the judgement of individuals rather than on a single published figure. I accept both criticisms, but I believe the price is worth paying.

Ultimately, what the public wants is good schools and hospitals, not good statistics about them. The two are related, but they are not the same thing, and a system that confuses them will eventually deliver the second at the expense of the first. Whether politicians, who have come to depend on the reassurance that a simple ranking provides, will be willing to give it up is, of course, another matter.`,
    groups: [
      {
        id: 'ar-g7',
        type: 'mcq',
        instructions: 'Choose the correct letter, A, B, C or D.',
        questions: [
          {
            id: 'ar-q27',
            number: 27,
            prompt: 'What point does the writer make in the first paragraph?',
            options: [
              { key: 'A', text: 'Numerical targets were introduced too quickly.' },
              { key: 'B', text: 'Taxpayers are suspicious of performance figures.' },
              { key: 'C', text: 'Measurement can serve a useful purpose.' },
              { key: 'D', text: 'Public services cannot be compared fairly.' },
            ],
            answer: ['C'],
            explanation:
              'Paragraph 1: "I am not arguing that measurement is worthless. A health service that had no idea how long its patients waited would be failing in a basic duty."',
          },
          {
            id: 'ar-q28',
            number: 28,
            prompt: 'The writer mentions patients waiting in ambulances in order to show',
            options: [
              { key: 'A', text: 'how a target could be met without the service improving.' },
              { key: 'B', text: 'that hospitals did not have enough emergency staff.' },
              { key: 'C', text: 'why waiting times are difficult to measure accurately.' },
              { key: 'D', text: 'that ambulance services were also given targets.' },
            ],
            answer: ['A'],
            explanation:
              'Paragraph 2: the clock "did not start until they passed through the door. The figures improved; the patients\' experience did not."',
          },
          {
            id: 'ar-q29',
            number: 29,
            prompt:
              'According to the writer, why is the neglect of some pupils more damaging than gaming?',
            options: [
              { key: 'A', text: 'It affects a larger number of schools.' },
              { key: 'B', text: 'It breaks official rules.' },
              { key: 'C', text: 'It is deliberately hidden by teachers.' },
              { key: 'D', text: 'It is less likely to be noticed.' },
            ],
            answer: ['D'],
            explanation:
              'Paragraph 3: "Far more damaging, because it is harder to detect, is the way in which targets draw attention away from everything that is not counted." B is contradicted by "No rule has been broken".',
          },
          {
            id: 'ar-q30',
            number: 30,
            prompt:
              'What does the writer mean by saying that data should be "a thermometer rather than a thermostat"?',
            options: [
              { key: 'A', text: 'Figures should be collected more frequently.' },
              { key: 'B', text: 'Data should lead to investigation rather than automatic consequences.' },
              { key: 'C', text: 'Managers should rely on instinct rather than statistics.' },
              { key: 'D', text: 'Targets should be adjusted to suit local conditions.' },
            ],
            answer: ['B'],
            explanation:
              'Paragraph 6: data should be "a reading that tells managers where to look and what questions to ask, rather than a device that automatically triggers a reward or a penalty."',
          },
        ],
      },
      {
        id: 'ar-g8',
        type: 'ynng',
        instructions:
          'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.',
        questions: [
          {
            id: 'ar-q31',
            number: 31,
            prompt: 'Numerical targets were used in hospitals before they were applied to schools.',
            answer: ['NOT GIVEN'],
            explanation:
              'Paragraph 1 lists hospitals, schools and police forces as examples but says nothing about which sector adopted targets first.',
          },
          {
            id: 'ar-q32',
            number: 32,
            prompt: 'Deliberate manipulation of figures is the most harmful effect of targets.',
            answer: ['NO'],
            explanation:
              'Paragraph 3: gaming "attracts most of the public criticism of targets, but in my view it is not the most serious problem."',
          },
          {
            id: 'ar-q33',
            number: 33,
            prompt: 'Introducing additional indicators is an effective way of preventing distortion.',
            answer: ['NO'],
            explanation:
              'Paragraph 4: "I find this reasoning unconvincing. Each new indicator creates new opportunities for distortion".',
          },
          {
            id: 'ar-q34',
            number: 34,
            prompt:
              'The evidence about rewards and motivation is stronger from laboratory studies than from workplaces.',
            answer: ['YES'],
            explanation:
              'Paragraph 5: "the evidence from real workplaces is considerably less clear-cut than that from the laboratory".',
          },
          {
            id: 'ar-q35',
            number: 35,
            prompt: 'The approach the writer recommends has some disadvantages.',
            answer: ['YES'],
            explanation:
              'Paragraph 6: the system "is undoubtedly more expensive than a league table, and it is less transparent ... I accept both criticisms".',
          },
        ],
      },
      {
        id: 'ar-g9',
        type: 'matching',
        instructions:
          'Complete each sentence with the correct ending, A–G, below. Write the correct letter, A–G.',
        options: [
          { key: 'A', text: 'can reduce the time professionals spend on their main responsibilities.' },
          { key: 'B', text: 'it gives taxpayers a clearer picture of public spending.' },
          { key: 'C', text: 'it tends to become less useful as a source of information.' },
          { key: 'D', text: 'they have come to rely on the comfort of simple rankings.' },
          { key: 'E', text: 'will eventually make inspections unnecessary.' },
          { key: 'F', text: 'may favour pupils who are close to a key grade.' },
          { key: 'G', text: 'may weaken the commitment that led people to choose their careers.' },
        ],
        questions: [
          {
            id: 'ar-q36',
            number: 36,
            prompt: 'When a measure is turned into a target,',
            answer: ['C'],
            explanation:
              'Paragraph 2: "once a measure is made into a target, it tends to lose its value as a measure."',
          },
          {
            id: 'ar-q37',
            number: 37,
            prompt: 'A school judged on the percentage of pupils reaching a particular grade',
            answer: ['F'],
            explanation:
              'Paragraph 3: teachers have "a powerful incentive to concentrate their efforts on pupils just below that grade".',
          },
          {
            id: 'ar-q38',
            number: 38,
            prompt: 'Adding more indicators to a performance system',
            answer: ['A'],
            explanation:
              'Paragraph 4: the recording burden meant nurses spent "close to a third of their working hours on documentation — time that was not ... spent with patients."',
          },
          {
            id: 'ar-q39',
            number: 39,
            prompt: 'Assuming that professionals will work well only if they are rewarded',
            answer: ['G'],
            explanation:
              'Paragraph 5: such a system "risks undermining the very motivation it takes for granted" — the "sense of vocation" that led people into the job.',
          },
          {
            id: 'ar-q40',
            number: 40,
            prompt: "Politicians may be unwilling to accept the writer's proposals because",
            answer: ['D'],
            explanation:
              'Final paragraph: politicians "have come to depend on the reassurance that a simple ranking provides".',
          },
        ],
      },
    ],
  },
]
