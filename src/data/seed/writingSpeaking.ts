import type { WritingTask, SpeakingPart1, SpeakingPart2, SpeakingPart3 } from '../../lib/types'

const TASK1_TAIL =
  'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.'
const TASK2_TAIL =
  'Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.'

export const academicWritingTasks: WritingTask[] = [
  {
    id: 'aw-t1',
    number: 1,
    kind: 'chart',
    prompt: `The line graph below shows the number of visits made to three types of visitor attraction in one European country between 1995 and 2020.\n\n${TASK1_TAIL}`,
    chart: {
      kind: 'line',
      title: 'Visits to three types of visitor attraction, 1995–2020',
      categories: ['1995', '2000', '2005', '2010', '2015', '2020'],
      series: [
        { name: 'Museums and galleries', values: [12.4, 13.1, 15.8, 18.2, 21.5, 19.0] },
        { name: 'Theme parks', values: [8.6, 10.2, 11.9, 11.4, 12.7, 14.3] },
        { name: 'National parks', values: [15.1, 14.6, 13.2, 13.8, 16.4, 22.9] },
      ],
      unit: 'millions',
      xLabel: 'Year',
      yLabel: 'Visits (millions)',
    },
    visualDescription: `Line graph: visits (millions) to three types of attraction in one European country, 1995, 2000, 2005, 2010, 2015, 2020.
Museums and galleries: 12.4, 13.1, 15.8, 18.2, 21.5, 19.0 (steady rise to a peak of 21.5m in 2015, then a fall to 19.0m).
Theme parks: 8.6, 10.2, 11.9, 11.4, 12.7, 14.3 (lowest throughout; gradual rise with a small dip in 2010).
National parks: 15.1, 14.6, 13.2, 13.8, 16.4, 22.9 (highest in 1995, declined to 13.2m in 2005, then rose sharply to become the highest again at 22.9m in 2020).
Museums overtook national parks around 2005 and stayed higher until 2015; national parks were highest again in 2020.`,
    sample: `The line graph illustrates how many visits were made to three types of visitor attraction in a European country between 1995 and 2020.

Overall, visits to all three types of attraction increased over the period. Theme parks were consistently the least visited, while national parks, after a decade of decline, ended the period as the most popular choice.

In 1995, national parks attracted 15.1 million visits, compared with 12.4 million for museums and galleries. However, national park visits fell to a low of 13.2 million in 2005, by which time museums had overtaken them with 15.8 million. Museum attendance kept rising, peaking at 21.5 million in 2015, before dropping back to 19 million in 2020.

National parks, by contrast, recovered strongly after 2005. Visits rose to 16.4 million in 2015 and then surged by 6.5 million in just five years to reach 22.9 million, the highest figure on the graph.

Theme parks grew more modestly, from 8.6 million in 1995 to 11.9 million in 2005. After a slight dip to 11.4 million in 2010, they rose again to 14.3 million by 2020, still well below the other two categories.`,
    minWords: 150,
    minutes: 20,
  },
  {
    id: 'aw-t2',
    number: 2,
    kind: 'essay',
    prompt: `Some people believe that universities should focus on providing students with skills that employers want. Others think that the main purpose of a university education is to develop knowledge and critical thinking for its own sake.\n\nDiscuss both these views and give your own opinion.\n\n${TASK2_TAIL}`,
    sample: `It is often argued that universities should equip students with the practical skills that employers are looking for, while others maintain that higher education exists to cultivate knowledge and independent thought as ends in themselves. In my view, these aims are not opposed, but a university that sacrifices intellectual depth for short-term employability ultimately serves neither students nor employers well.

Those who favour a vocational focus make a reasonable case. Tuition fees are high, and graduates who leave without marketable skills may struggle to repay loans or find secure work. Degrees in fields such as nursing, engineering or accountancy show that close links with industry can produce graduates who are productive from their first day, which benefits both the individual and the wider economy.

On the other hand, the skills employers value most today may be obsolete within a decade. Software, regulations and entire industries change rapidly, so training narrowly for current vacancies risks producing graduates whose expertise has a short shelf life. The ability to analyse evidence, construct an argument and question assumptions, however, is durable and transferable. A history graduate who has learned to weigh conflicting sources, for instance, can apply that habit of mind in law, journalism or policy-making.

Furthermore, universities have a role beyond the labour market. They preserve and extend human knowledge, and research that once seemed to have no practical application, such as early work in number theory, later underpinned technologies like online encryption.

In conclusion, while universities should certainly help students prepare for employment, I believe their central purpose should remain the development of knowledge and critical thinking. Paradoxically, it is precisely these qualities that make graduates most valuable to employers in the long run.`,
    minWords: 250,
    minutes: 40,
  },
]

const PROCESS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Arial, sans-serif" font-size="13">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#222"/>
    </marker>
  </defs>
  <rect width="640" height="360" fill="#fff"/>
  <text x="320" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#111">How glass bottles are recycled</text>
  <g fill="#fff" stroke="#222" stroke-width="1.5">
    <rect x="30" y="60" width="120" height="60" rx="6"/>
    <rect x="185" y="60" width="120" height="60" rx="6"/>
    <rect x="340" y="60" width="120" height="60" rx="6"/>
    <rect x="495" y="60" width="120" height="60" rx="6"/>
    <rect x="495" y="240" width="120" height="60" rx="6"/>
    <rect x="340" y="240" width="120" height="60" rx="6"/>
    <rect x="185" y="240" width="120" height="60" rx="6"/>
    <rect x="30" y="240" width="120" height="60" rx="6"/>
  </g>
  <g fill="#111" text-anchor="middle">
    <text x="90" y="86">1. Collected from<tspan x="90" dy="16">bottle banks</tspan></text>
    <text x="245" y="86">2. Taken by lorry<tspan x="245" dy="16">to recycling plant</tspan></text>
    <text x="400" y="86">3. Sorted by colour<tspan x="400" dy="16">(clear/green/brown)</tspan></text>
    <text x="555" y="86">4. Washed to remove<tspan x="555" dy="16">labels and dirt</tspan></text>
    <text x="555" y="266">5. Crushed into<tspan x="555" dy="16">small pieces (cullet)</tspan></text>
    <text x="400" y="266">6. Melted in furnace<tspan x="400" dy="16">at 1,500°C</tspan></text>
    <text x="245" y="266">7. Moulded into<tspan x="245" dy="16">new bottles</tspan></text>
    <text x="90" y="266">8. Filled and<tspan x="90" dy="16">delivered to shops</tspan></text>
  </g>
  <g stroke="#222" stroke-width="2" marker-end="url(#arr)">
    <line x1="150" y1="90" x2="183" y2="90"/>
    <line x1="305" y1="90" x2="338" y2="90"/>
    <line x1="460" y1="90" x2="493" y2="90"/>
    <line x1="555" y1="120" x2="555" y2="238"/>
    <line x1="495" y1="270" x2="462" y2="270"/>
    <line x1="340" y1="270" x2="307" y2="270"/>
    <line x1="185" y1="270" x2="152" y2="270"/>
    <path d="M90,240 L90,180 M90,180 L90,122" fill="none" stroke-dasharray="5 4"/>
  </g>
  <text x="100" y="185" fill="#444" font-size="12">bottles reused</text>
  <text x="100" y="200" fill="#444" font-size="12">and returned</text>
</svg>`

export const academicExtraTask1: WritingTask[] = [
  {
    id: 'aw-x1',
    number: 1,
    kind: 'chart',
    prompt: `The pie charts below show the sources used to generate electricity in one country in 2000 and 2020.\n\n${TASK1_TAIL}`,
    chart: {
      kind: 'pie',
      title: 'Sources of electricity generation, 2000 and 2020',
      categories: ['Coal', 'Natural gas', 'Nuclear', 'Hydroelectric', 'Wind and solar', 'Other'],
      series: [
        { name: '2000', values: [41, 27, 18, 9, 2, 3] },
        { name: '2020', values: [19, 33, 15, 10, 20, 3] },
      ],
      unit: '%',
    },
    visualDescription: `Two pie charts: share of electricity generation by source (%), one country.
2000: Coal 41, Natural gas 27, Nuclear 18, Hydroelectric 9, Wind and solar 2, Other 3.
2020: Coal 19, Natural gas 33, Nuclear 15, Hydroelectric 10, Wind and solar 20, Other 3.
Coal fell from the largest source (41%) to 19%; natural gas became the largest (33%); wind and solar rose tenfold from 2% to 20%; nuclear fell slightly; hydro and other almost unchanged.`,
    sample: `The two pie charts compare the proportion of electricity generated from six different sources in one country in 2000 and 2020.

Overall, the country's energy mix shifted markedly away from coal and towards natural gas and renewable sources over the two decades. While coal was the dominant source in 2000, natural gas had taken its place by 2020, and wind and solar power had become a major contributor.

In 2000, coal accounted for 41% of electricity generation, well ahead of natural gas at 27% and nuclear power at 18%. Hydroelectric power provided 9%, whereas wind and solar made up a mere 2%, less than the 3% generated from other sources.

By 2020, the share of coal had more than halved to 19%. Natural gas rose by six percentage points to 33%, making it the largest single source. The most dramatic change, however, was in wind and solar power, whose contribution increased tenfold to 20%, overtaking both nuclear power and coal. Nuclear declined slightly to 15%, while hydroelectric power edged up to 10% and other sources remained unchanged at 3%.`,
    minWords: 150,
    minutes: 20,
  },
  {
    id: 'aw-x2',
    number: 1,
    kind: 'chart',
    prompt: `The table below shows the percentage of commuters using four different methods of travel to work in four cities in 2022.\n\n${TASK1_TAIL}`,
    chart: {
      kind: 'table',
      title: 'Method of travel to work by city, 2022 (% of commuters)',
      categories: ['Hartwell', 'Lindmoor', 'Port Avery', 'Selbury'],
      series: [
        { name: 'Car', values: [52, 34, 61, 23] },
        { name: 'Public transport', values: [28, 41, 22, 38] },
        { name: 'Bicycle', values: [8, 14, 3, 27] },
        { name: 'Walking', values: [12, 11, 14, 12] },
      ],
      unit: '%',
    },
    visualDescription: `Table: % of commuters by method of travel to work, four cities, 2022 (each row totals 100).
Hartwell: Car 52, Public transport 28, Bicycle 8, Walking 12.
Lindmoor: Car 34, Public transport 41, Bicycle 14, Walking 11.
Port Avery: Car 61, Public transport 22, Bicycle 3, Walking 14.
Selbury: Car 23, Public transport 38, Bicycle 27, Walking 12.
Car is the main method in Hartwell and Port Avery; public transport leads in Lindmoor and Selbury; cycling is far higher in Selbury (27%) than elsewhere; walking is similar everywhere (11–14%).`,
    sample: `The table shows the percentage of commuters in four cities who travelled to work by car, public transport, bicycle or on foot in 2022.

Overall, the car was the most common way of commuting in Hartwell and Port Avery, whereas public transport was the leading choice in Lindmoor and Selbury. Cycling varied considerably between the cities, while the proportion of people walking was remarkably consistent.

Port Avery was the most car-dependent city, with 61% of commuters driving to work, followed by Hartwell at 52%. In both cities, public transport was the second most popular option, at 22% and 28% respectively. By contrast, only 34% of commuters in Lindmoor and 23% in Selbury used a car.

Public transport was most popular in Lindmoor, accounting for 41% of journeys, and in Selbury, at 38%. Selbury also stood out for cycling: 27% of its commuters went by bicycle, almost twice the figure for Lindmoor (14%) and nine times that of Port Avery, where just 3% cycled. Hartwell's figure was 8%.

Walking, meanwhile, accounted for between 11% and 14% of commutes in every city, with Port Avery recording the highest share.`,
    minWords: 150,
    minutes: 20,
  },
  {
    id: 'aw-x3',
    number: 1,
    kind: 'process',
    prompt: `The diagram below shows how glass bottles are recycled.\n\n${TASK1_TAIL}`,
    svg: PROCESS_SVG,
    visualDescription: `Process diagram, "How glass bottles are recycled", 8 stages in a cycle:
1. Used bottles are collected from bottle banks.
2. They are taken by lorry to a recycling plant.
3. They are sorted by colour (clear, green, brown).
4. They are washed to remove labels and dirt.
5. They are crushed into small pieces called cullet.
6. The cullet is melted in a furnace at 1,500°C.
7. The molten glass is moulded into new bottles.
8. The new bottles are filled and delivered to shops.
A dashed arrow from stage 8 back to stage 1 shows that bottles are used and returned, making the process a continuous cycle.`,
    sample: `The diagram illustrates the process by which used glass bottles are recycled and made into new bottles.

Overall, the process consists of eight stages, beginning with the collection of used bottles and ending with the delivery of new, filled bottles to shops. Because these bottles are later used and returned, the process forms a continuous cycle.

To begin with, used bottles are collected from bottle banks and transported by lorry to a recycling plant. Once there, they are sorted according to their colour into clear, green and brown glass. The bottles are then washed so that any labels and dirt are removed.

In the next stage, the clean glass is crushed into small pieces, known as cullet. This cullet is subsequently melted in a furnace at a temperature of 1,500°C, after which the molten glass is moulded into new bottles.

Finally, the new bottles are filled and delivered to shops. Once they have been used, they are returned to bottle banks, and the whole cycle begins again.`,
    minWords: 150,
    minutes: 20,
  },
]

export const generalWritingTasks: WritingTask[] = [
  {
    id: 'gw-t1',
    number: 1,
    kind: 'letter',
    prompt: `You recently stayed at a hotel for a weekend, and when you got home you realised you had left a valuable item in your room.\n\nWrite a letter to the hotel manager. In your letter\n• give details of your stay\n• describe the item you left behind and say why it is important to you\n• explain how you would like the item to be returned\n\nWrite at least 150 words.\n\nYou do NOT need to write any addresses.\n\nBegin your letter as follows:\n\nDear Sir or Madam,`,
    sample: `Dear Sir or Madam,

I am writing regarding my stay at your hotel from Friday 8th to Sunday 10th November, when I occupied Room 314 under the name of Daniel Hughes. Unfortunately, I left a valuable item behind and would be grateful for your help in recovering it.

The item is a silver wristwatch with a black leather strap and a short engraving on the back. I believe I left it on the bedside table on the morning I checked out. Although the watch has some financial value, it matters far more to me for sentimental reasons, as it was a gift from my late grandfather and I have worn it almost every day for ten years.

If it has been found, I would appreciate it if you could send it to me by recorded delivery, so that it can be tracked and signed for. I am happy to cover the postage; please let me know the cost and how you would like me to pay.

Thank you for your assistance. I look forward to hearing from you.

Yours faithfully,
Daniel Hughes`,
    minWords: 150,
    minutes: 20,
  },
  {
    id: 'gw-t2',
    number: 2,
    kind: 'essay',
    prompt: `In many cities, young adults are finding it increasingly difficult to afford a home of their own.\n\nWhat are the causes of this problem? What measures could be taken to solve it?\n\n${TASK2_TAIL}`,
    sample: `In many cities around the world, owning a home has become an increasingly distant prospect for young adults. This essay will examine the main reasons for this trend and suggest some measures that governments could take to address it.

The most fundamental cause is a mismatch between supply and demand. As jobs become concentrated in major cities, more people move there, yet the construction of new housing has failed to keep pace, often because of slow planning procedures and a shortage of available land. A second factor is that property is increasingly treated as an investment. Wealthy individuals and companies buy flats to rent out or simply to hold as assets, which pushes prices further beyond the reach of first-time buyers. At the same time, wages for young workers have risen far more slowly than house prices, making it extremely difficult to save for a deposit while paying high rents.

Several measures could ease the situation. Firstly, governments should increase the supply of homes by simplifying planning rules and releasing unused public land, especially brownfield sites, for residential development. Secondly, they could discourage speculative buying, for example by imposing higher taxes on second homes and on properties left empty. Thirdly, the state could support young buyers directly through shared-ownership schemes, in which they purchase part of a property and rent the remainder, or by investing in high-quality social housing with affordable, long-term tenancies.

In conclusion, the housing crisis facing young adults stems mainly from insufficient supply, investment-driven demand and stagnant earnings. While no single policy will solve it, a combination of more construction, measures against speculation and targeted support for first-time buyers could make home ownership a realistic goal once again.`,
    minWords: 250,
    minutes: 40,
  },
]

export const speakingSetA: { part1: SpeakingPart1; part2: SpeakingPart2; part3: SpeakingPart3 } = {
  part1: {
    topics: [
      {
        topic: 'Work or studies',
        questions: [
          'Do you work or are you a student?',
          'Why did you choose that job / subject?',
          'What do you like most about it?',
          'Is there anything you would like to change about your work or studies?',
        ],
      },
      {
        topic: 'Weather',
        questions: [
          'What kind of weather do you like best?',
          'Does the weather affect your mood?',
          'What is the weather usually like where you live?',
          'Do you ever check the weather forecast? Why or why not?',
        ],
      },
      {
        topic: 'Photographs',
        questions: [
          'Do you like taking photographs?',
          'What do you usually take photos of?',
          'Do you prefer to keep photos on your phone or print them out?',
          'Is there a photo in your home that is special to you?',
        ],
      },
    ],
  },
  part2: {
    topic: 'Describe a time when you helped someone',
    bullets: ['who you helped', 'when and where it happened', 'what you did to help them'],
    closing: 'and explain how you felt about helping this person.',
    sample: `I'd like to talk about a time I helped an elderly neighbour of mine, a lady called Mrs Patel, who lives in the flat just below ours.

This happened last winter, I think around the middle of January, during a really cold spell when we had quite a lot of snow, which is fairly unusual where I live. One morning I was heading out to work and I noticed her standing at the bottom of the stairs looking a bit lost. It turned out she'd run out of her medication, and the pharmacy was about a fifteen-minute walk away, but the pavements were covered in ice and she was, understandably, terrified of slipping.

So what I did was, first of all, I offered to pick up her prescription for her. I rang my manager to say I'd be a little late, walked down to the chemist and collected everything. And then, because I'd realised she was probably struggling with other things as well, I popped into the supermarket and got her some bread, milk and a few tins of soup. For the rest of that week, I checked in on her every evening, just to make sure she was alright.

As for how I felt, honestly, it was incredibly rewarding. It didn't take much effort on my part, but she was so grateful that it really made my day. It also made me realise how isolated older people can be, especially in bad weather, and since then we've actually become quite good friends.`,
    roundOff: ['Do you often help other people?', 'Did the person thank you?'],
  },
  part3: {
    theme: 'Helping others and community',
    questions: [
      'What kinds of things do people in your country do to help their neighbours?',
      'Do you think people are less willing to help strangers than they were in the past? Why?',
      'Should children be taught at school to volunteer in their community?',
      'Some people say that helping others is the responsibility of the government, not individuals. What do you think?',
      'How might technology change the ways in which people support each other in the future?',
      'Is there a difference between helping someone because you want to and helping because you feel obliged to?',
    ],
  },
}

export const speakingSetB: { part1: SpeakingPart1; part2: SpeakingPart2; part3: SpeakingPart3 } = {
  part1: {
    topics: [
      {
        topic: 'Your hometown',
        questions: [
          'Where is your hometown?',
          'What do you like about living there?',
          'Has your hometown changed much since you were a child?',
          'Would you recommend your hometown as a place for tourists to visit?',
        ],
      },
      {
        topic: 'Music',
        questions: [
          'What kind of music do you enjoy listening to?',
          'When do you usually listen to music?',
          'Did you learn to play a musical instrument when you were younger?',
          'Has the type of music you like changed over the years?',
        ],
      },
      {
        topic: 'Cooking',
        questions: [
          'Do you enjoy cooking?',
          'Who usually cooks in your home?',
          'What was the last meal you cooked?',
          'Do you think it is important for young people to learn how to cook?',
        ],
      },
    ],
  },
  part2: {
    topic: 'Describe a skill you learned that took a long time to master',
    bullets: ['what the skill was', 'when you started learning it', 'how you learned it', 'what difficulties you had'],
    closing: 'and explain why you decided to keep going until you mastered it.',
    sample: `The skill I'm going to describe is playing the guitar, which took me far longer to get the hang of than I'd ever expected.

I first picked one up when I was about fourteen. My uncle had an old acoustic guitar that he no longer played, and he gave it to me for my birthday.

In terms of how I learned, I didn't have formal lessons at the beginning, mainly because they were quite expensive. Instead, I relied on online tutorials and chord charts, and I'd spend maybe half an hour every evening practising simple songs. Later on, when I was about seventeen, I took lessons with a local teacher for a year or so, and that made a huge difference, because she corrected a lot of bad habits I'd picked up.

As for the difficulties, there were plenty. At first my fingertips were really sore, and I just couldn't press the strings down hard enough to get a clean sound. Certain chords, particularly F major, seemed almost impossible, and I remember feeling incredibly frustrated for months. Keeping a steady rhythm while singing at the same time was another challenge altogether.

So why did I keep going? Partly it was sheer stubbornness, because I didn't want to admit defeat. But more importantly, every now and then I'd manage to play a whole song from start to finish, and that sense of progress was so satisfying that it kept me motivated. Now I can play pretty much anything I want, so I'm really glad I stuck with it.`,
    roundOff: ['Do you still use this skill today?'],
  },
  part3: {
    theme: 'Learning and skills',
    questions: [
      'What practical skills do you think every adult should have?',
      'Is it better to learn a new skill from a teacher or by yourself, for example using online videos?',
      'Why do some people give up when learning something new while others continue?',
      'Do you think schools focus too much on academic subjects and not enough on practical skills?',
      'How has the internet changed the way people acquire new skills?',
      'Some say that in the future, machines will make many human skills unnecessary. To what extent do you agree?',
    ],
  },
}
