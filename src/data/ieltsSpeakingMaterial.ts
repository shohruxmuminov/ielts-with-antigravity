export interface SpeakingVocab {
  phrase: string;
  meaning: string;
}

export interface SpeakingMaterial {
  id: string;
  title: string;
  part: number;
  questions: string[];
  sampleAnswer: string;
  vocabulary: SpeakingVocab[];
}

export const ieltsSpeakingMaterials: SpeakingMaterial[] = [
  // PART 1
  {
    id: 'p1-hometown',
    title: 'Hometown',
    part: 1,
    questions: [
      'Can you describe your hometown?',
      'What do you like most about it?',
      'Has your hometown changed much over the years?'
    ],
    sampleAnswer: `I come from a fairly lively city, and what I appreciate most about it is the fact that it strikes a balance between modern development and traditional charm. On the one hand, there are new buildings, shopping centres, and better roads; on the other hand, people still maintain a strong sense of community. What really sets it apart is the atmosphere. It is not the kind of place where life feels overwhelmingly hectic, so I find it both practical and emotionally comforting. Over the years, it has definitely undergone a noticeable transformation, particularly in terms of infrastructure, but fortunately it has not entirely lost its identity.`,
    vocabulary: [
      { phrase: 'strikes a balance between', meaning: 'o‘rtasida muvozanat saqlaydi' },
      { phrase: 'traditional charm', meaning: 'an’anaviy joziba' },
      { phrase: 'sets it apart', meaning: 'uni boshqalardan ajratib turadi' },
      { phrase: 'overwhelmingly hectic', meaning: 'haddan tashqari shoshqin / juda gavjum' },
      { phrase: 'emotionally comforting', meaning: 'ruhiy jihatdan taskin beruvchi' },
      { phrase: 'undergone a noticeable transformation', meaning: 'sezilarli o‘zgarishni boshdan kechirdi' },
      { phrase: 'infrastructure', meaning: 'infratuzilma' },
      { phrase: 'lost its identity', meaning: 'o‘ziga xosligini yo‘qotgan' }
    ]
  },
  {
    id: 'p1-work-study',
    title: 'Work or Study',
    part: 1,
    questions: [
      'Do you work or are you a student?',
      'Why did you choose this field?',
      'What do you find most challenging about it?'
    ],
    sampleAnswer: `At the moment, I am a student, and I chose my field mainly because it aligns closely with my long-term aspirations. I have always been drawn to subjects that require both analytical thinking and persistence, so it felt like a natural fit. What I find most rewarding is that the learning process constantly pushes me out of my comfort zone. That said, it is not without difficulties. The workload can be quite demanding, especially when several deadlines pile up at once, but I believe that kind of pressure helps me develop discipline and resilience in the long run.`,
    vocabulary: [
      { phrase: 'aligns closely with my long-term aspirations', meaning: 'uzoq muddatli maqsadlarimga juda mos keladi' },
      { phrase: 'drawn to', meaning: 'qiziqib qolgan / moyil bo‘lgan' },
      { phrase: 'analytical thinking', meaning: 'tahliliy fikrlash' },
      { phrase: 'natural fit', meaning: 'juda mos keladigan tanlov' },
      { phrase: 'pushes me out of my comfort zone', meaning: 'meni qulay hududimdan chiqaradi' },
      { phrase: 'pile up at once', meaning: 'birdaniga yig‘ilib qolmoq' },
      { phrase: 'discipline and resilience', meaning: 'intizom va bardoshlilik' }
    ]
  },
  {
    id: 'p1-routine',
    title: 'Daily Routine',
    part: 1,
    questions: [
      'Do you usually follow the same routine every day?',
      'What part of your day do you enjoy the most?',
      'Would you like to change your routine in the future?'
    ],
    sampleAnswer: `To a large extent, yes, I do follow a fairly consistent routine because it helps me stay on top of my responsibilities. I usually begin the day by planning what needs to be done, which prevents me from feeling scattered. The part I enjoy most is probably the evening because it gives me a chance to wind down and reflect on the day. However, I would not say my routine is rigid. I try to leave a bit of room for spontaneity, since an overly repetitive lifestyle can become mentally draining after a while.`,
    vocabulary: [
      { phrase: 'stay on top of my responsibilities', meaning: 'majburiyatlarimni nazoratda ushlab turmoq' },
      { phrase: 'feeling scattered', meaning: 'chalg‘igan / tartibsiz holatda his qilish' },
      { phrase: 'wind down', meaning: 'bo‘shashmoq, dam olmoq' },
      { phrase: 'reflect on the day', meaning: 'kun haqida o‘ylab chiqmoq' },
      { phrase: 'rigid', meaning: 'qattiq, o‘zgarmas' },
      { phrase: 'leave room for spontaneity', meaning: 'spontanlik uchun joy qoldirmoq' },
      { phrase: 'mentally draining', meaning: 'aqliy jihatdan charchatadigan' }
    ]
  },
  {
    id: 'p1-books',
    title: 'Reading Books',
    part: 1,
    questions: [
      'Do you enjoy reading books?',
      'What kind of books do you usually read?',
      'Do you think reading is important for young people?'
    ],
    sampleAnswer: `Yes, absolutely. I think reading is one of the most effective ways to broaden one’s horizons. I tend to read books that are either educational or thought-provoking because I like material that adds depth to my understanding of the world. What I value most about reading is that it sharpens both language skills and concentration. For young people in particular, it can be immensely beneficial because it exposes them to new ideas and encourages them to think beyond their immediate surroundings.`,
    vocabulary: [
      { phrase: 'broaden one’s horizons', meaning: 'dunyoqarashni kengaytirmoq' },
      { phrase: 'thought-provoking', meaning: 'chuqur o‘ylashga undovchi' },
      { phrase: 'adds depth to my understanding', meaning: 'tushunchamni chuqurlashtiradi' },
      { phrase: 'sharpens language skills', meaning: 'til ko‘nikmalarini charxlaydi' },
      { phrase: 'immensely beneficial', meaning: 'nihoyatda foydali' },
      { phrase: 'immediate surroundings', meaning: 'yaqin atrof / bevosita muhit' }
    ]
  },
  {
    id: 'p1-technology',
    title: 'Technology',
    part: 1,
    questions: [
      'Do you use technology a lot in your daily life?',
      'What device do you use most often?',
      'Has technology improved your life?'
    ],
    sampleAnswer: `Yes, without a doubt, technology plays a central role in my daily life. The device I rely on most is probably my phone because it allows me to stay informed, manage tasks, and communicate efficiently. I would say technology has improved my life significantly, mainly because it has made information far more readily accessible. At the same time, I try to use it in a balanced way because excessive screen time can be counterproductive and distract me from more meaningful activities.`,
    vocabulary: [
      { phrase: 'plays a central role', meaning: 'asosiy rol o‘ynaydi' },
      { phrase: 'rely on', meaning: 'tayanmoq' },
      { phrase: 'readily accessible', meaning: 'oson kirish mumkin bo‘lgan' },
      { phrase: 'significantly', meaning: 'sezilarli darajada' },
      { phrase: 'counterproductive', meaning: 'teskari natija beruvchi / samarasiz' },
      { phrase: 'meaningful activities', meaning: 'mazmunli faoliyatlar' }
    ]
  },
  {
    id: 'p1-friends',
    title: 'Friends',
    part: 1,
    questions: [
      'Do you spend a lot of time with friends?',
      'What qualities do you value in a good friend?',
      'Is it easy for you to make friends?'
    ],
    sampleAnswer: `I would say I value quality over quantity when it comes to friendships. I may not have a huge social circle, but the friends I do have are people I can genuinely count on. The qualities I admire most are honesty, emotional maturity, and the ability to be supportive without being judgmental. As for making friends, I can do it when necessary, but I do not open up to people straight away. I usually prefer to get to know someone gradually before I place real trust in them.`,
    vocabulary: [
      { phrase: 'quality over quantity', meaning: 'sifat sonidan ustun' },
      { phrase: 'social circle', meaning: 'ijtimoiy doira' },
      { phrase: 'count on', meaning: 'ishonmoq, suyanmoq' },
      { phrase: 'emotional maturity', meaning: 'hissiy yetuklik' },
      { phrase: 'judgmental', meaning: 'tez hukm qiladigan' },
      { phrase: 'open up', meaning: 'ichini ochmoq, samimiylashmoq' },
      { phrase: 'gradually', meaning: 'asta-sekin' }
    ]
  },

  // PART 2
  {
    id: 'p2-person',
    title: 'Describe a Person Who Inspired You',
    part: 2,
    questions: [
      'Who this person is',
      'How you know this person',
      'What qualities this person has',
      'Explain why this person inspired you'
    ],
    sampleAnswer: `I would like to talk about a teacher of mine who had a profound impact on the way I see education and personal growth. I first met him a few years ago when he taught me an important subject at school. What made him stand out was not merely his knowledge, but the way he brought out the best in his students. He was exceptionally patient, highly articulate, and genuinely invested in our progress. Whenever we struggled, he never made us feel inadequate; instead, he encouraged us to view mistakes as part of the learning curve. I found that attitude incredibly inspiring because it shifted my mindset from fear of failure to a more constructive way of thinking. To this day, I still remember him as someone who did not simply teach lessons, but also left a lasting impression on my character.`,
    vocabulary: [
      { phrase: 'had a profound impact on', meaning: 'juda chuqur ta’sir ko‘rsatdi' },
      { phrase: 'stand out', meaning: 'ajralib turmoq' },
      { phrase: 'brought out the best in', meaning: 'eng yaxshi jihatlarini yuzaga chiqardi' },
      { phrase: 'highly articulate', meaning: 'fikrini juda ravon ifodalay oladigan' },
      { phrase: 'genuinely invested in our progress', meaning: 'bizning rivojimizga chin dildan qiziqqan' },
      { phrase: 'learning curve', meaning: 'o‘rganish jarayonidagi bosqichlar' },
      { phrase: 'left a lasting impression', meaning: 'uzoq saqlanadigan taassurot qoldirdi' }
    ]
  },
  {
    id: 'p2-place',
    title: 'Describe a Place You Enjoy Visiting',
    part: 2,
    questions: [
      'Where it is',
      'How often you go there',
      'What you do there',
      'Explain why you enjoy going there'
    ],
    sampleAnswer: `A place I genuinely enjoy visiting is a quiet park not too far from where I live. I do not go there every single day, but I try to visit it whenever I need a break from a busy routine. What appeals to me most is the peaceful atmosphere. It is one of those places where you can clear your head and regain a sense of balance. I usually walk around, listen to music, or simply sit on a bench and observe what is happening around me. In a world where people are constantly in a rush, having access to a calm environment like that feels nothing short of refreshing. I enjoy it not because it is spectacular in any dramatic sense, but because it gives me mental space, which I think is increasingly rare nowadays.`,
    vocabulary: [
      { phrase: 'appeals to me most', meaning: 'menga eng ko‘p yoqadigan jihati' },
      { phrase: 'clear your head', meaning: 'xayolni tozalamoq, tinchlanmoq' },
      { phrase: 'regain a sense of balance', meaning: 'muvozanat hissini qayta tiklamoq' },
      { phrase: 'in a rush', meaning: 'shoshqaloqlikda' },
      { phrase: 'nothing short of refreshing', meaning: 'nihoyatda tetiklashtiruvchi' },
      { phrase: 'mental space', meaning: 'ruhiy/aqliy bo‘shliq, xotirjam fikrlash imkoniyati' }
    ]
  },
  {
    id: 'p2-help',
    title: 'Describe a Time You Helped Someone',
    part: 2,
    questions: [
      'Who the person was',
      'What problem they had',
      'How you helped them',
      'Explain how you felt about it'
    ],
    sampleAnswer: `I remember helping one of my friends when he was going through a particularly stressful academic period. He had several assignments due at the same time and was clearly under a great deal of pressure. Since I had already dealt with a similar situation before, I tried to help him organise his work into manageable steps rather than seeing it as one overwhelming burden. I assisted him with planning, prioritising tasks, and reviewing some of his written work. What I found most meaningful about that experience was the fact that a relatively small effort on my part made a noticeable difference to someone else’s wellbeing. It reminded me that practical support, when offered at the right moment, can go a long way.`,
    vocabulary: [
      { phrase: 'going through', meaning: 'boshdan kechirayotgan' },
      { phrase: 'under a great deal of pressure', meaning: 'katta bosim ostida' },
      { phrase: 'manageable steps', meaning: 'boshqariladigan kichik bosqichlar' },
      { phrase: 'overwhelming burden', meaning: 'juda og‘ir yuk' },
      { phrase: 'wellbeing', meaning: 'ruhiy va jismoniy holatning yaxshiligi' },
      { phrase: 'go a long way', meaning: 'katta foyda bermoq / juda asqotmoq' }
    ]
  },
  {
    id: 'p2-tech',
    title: 'Describe a Useful Piece of Technology',
    part: 2,
    questions: [
      'What it is',
      'How often you use it',
      'What you use it for',
      'Explain why it is useful'
    ],
    sampleAnswer: `A piece of technology I find particularly useful is my laptop. It is something I use on a daily basis for studying, researching, writing, and even organising my schedule. What makes it so valuable is its versatility. Rather than serving just one function, it acts as a kind of all-in-one tool that helps me stay productive. For instance, I can attend online lessons, store important files, and work on long tasks without interruption. I also appreciate the fact that it enables me to work more efficiently and independently. In my view, its usefulness lies not only in convenience, but also in the opportunities it creates for learning and self-improvement.`,
    vocabulary: [
      { phrase: 'particularly useful', meaning: 'ayniqsa foydali' },
      { phrase: 'on a daily basis', meaning: 'har kuni' },
      { phrase: 'versatility', meaning: 'ko‘p qirrali foydalilik' },
      { phrase: 'all-in-one tool', meaning: 'hamma vazifani bajaruvchi vosita' },
      { phrase: 'without interruption', meaning: 'uzluksiz' },
      { phrase: 'work more efficiently and independently', meaning: 'yanada samarali va mustaqil ishlamoq' },
      { phrase: 'self-improvement', meaning: 'o‘zini rivojlantirish' }
    ]
  },

  // PART 3
  {
    id: 'p3-education',
    title: 'Education & Success',
    part: 3,
    questions: [
      'Do you think schools should focus more on practical skills?',
      'What makes a good teacher?',
      'Is academic success the only kind of success that matters?'
    ],
    sampleAnswer: `Yes, I do think schools should place greater emphasis on practical skills because academic knowledge alone is not always enough to prepare students for real-life challenges. Skills such as communication, time management, and problem-solving are equally indispensable. As for what makes a good teacher, I would say it is a combination of subject knowledge, patience, and the ability to motivate students. A truly effective teacher does more than deliver information; they cultivate curiosity and confidence. Regarding success, I strongly disagree with the idea that academic achievement is the only metric that matters. Success can take many forms, including personal growth, emotional intelligence, and the capacity to contribute meaningfully to society.`,
    vocabulary: [
      { phrase: 'place greater emphasis on', meaning: 'ko‘proq urg‘u bermoq' },
      { phrase: 'real-life challenges', meaning: 'haqiqiy hayotdagi qiyinchiliklar' },
      { phrase: 'equally indispensable', meaning: 'birdek zarur' },
      { phrase: 'cultivate curiosity', meaning: 'qiziqishni shakllantirmoq' },
      { phrase: 'metric', meaning: 'o‘lchov mezoni' },
      { phrase: 'emotional intelligence', meaning: 'hissiy intellekt' },
      { phrase: 'contribute meaningfully to society', meaning: 'jamiyatga mazmunli hissa qo‘shmoq' }
    ]
  },
  {
    id: 'p3-tech-society',
    title: 'Technology in Modern Life',
    part: 3,
    questions: [
      'Has technology made people closer or more isolated?',
      'Should children use digital devices from an early age?',
      'Will technology replace teachers in the future?'
    ],
    sampleAnswer: `I think technology has had a dual effect. On the one hand, it has made communication faster and more convenient, which can certainly bring people closer across long distances. On the other hand, excessive dependence on devices can lead to a form of social disconnection, even when people are physically in the same room. When it comes to children, I believe digital devices can be useful if their use is carefully monitored and age-appropriate. They can support learning, but overexposure may affect attention spans and social development. As for whether technology will replace teachers, I doubt it will do so entirely. Technology can assist education, but it cannot fully replicate human encouragement, empathy, and judgment.`,
    vocabulary: [
      { phrase: 'had a dual effect', meaning: 'ikki xil ta’sir ko‘rsatdi' },
      { phrase: 'social disconnection', meaning: 'ijtimoiy uzilish / aloqaning susayishi' },
      { phrase: 'carefully monitored', meaning: 'sinchiklab nazorat qilinadigan' },
      { phrase: 'age-appropriate', meaning: 'yoshga mos' },
      { phrase: 'overexposure', meaning: 'haddan tashqari ko‘p ta’sirga duch kelish' },
      { phrase: 'attention spans', meaning: 'diqqatni ushlab turish qobiliyati' },
      { phrase: 'replicate', meaning: 'to‘liq qayta yarata olmoq' }
    ]
  },
  {
    id: 'p3-cities',
    title: 'City Life vs Countryside',
    part: 3,
    questions: [
      'Why do many people move to cities?',
      'What problems do large cities face?',
      'Do you think rural areas will become more popular in the future?'
    ],
    sampleAnswer: `Many people are drawn to cities because urban areas tend to offer better employment prospects, educational opportunities, and access to services. In other words, cities are often seen as places where people can improve their standard of living. However, large cities also face serious challenges, including traffic congestion, pollution, overcrowding, and rising living costs. These issues can significantly reduce people’s quality of life. As for rural areas, I do think they may become more appealing in the future, particularly if remote work continues to expand. If people can earn a living without commuting daily, they may start to prioritise peace, space, and affordability over constant proximity to city centres.`,
    vocabulary: [
      { phrase: 'drawn to cities', meaning: 'shaharlarga intilmoq' },
      { phrase: 'employment prospects', meaning: 'ish imkoniyatlari' },
      { phrase: 'access to services', meaning: 'xizmatlarga kirish imkoniyati' },
      { phrase: 'improve their standard of living', meaning: 'turmush darajasini oshirmoq' },
      { phrase: 'traffic congestion', meaning: 'tirbandlik' },
      { phrase: 'overcrowding', meaning: 'ortiqcha gavjumlik' },
      { phrase: 'proximity to city centres', meaning: 'shahar markaziga yaqinlik' }
    ]
  },
  {
    id: 'p3-environment',
    title: 'Environment & Responsibility',
    part: 3,
    questions: [
      'Who should be more responsible for protecting the environment: individuals or governments?',
      'Why do some people ignore environmental problems?',
      'What can schools do to raise environmental awareness?'
    ],
    sampleAnswer: `I think responsibility should be shared, although governments arguably have a greater capacity to bring about large-scale change. They can introduce regulations, invest in sustainable infrastructure, and influence public behaviour. That said, individuals are not exempt from responsibility. Everyday choices, such as reducing waste or using resources more wisely, can collectively have a substantial impact. Some people ignore environmental issues because the consequences often seem distant or abstract, so they do not feel an immediate sense of urgency. Schools can play a crucial role by instilling environmentally responsible habits at an early age and showing students that their actions, however small, are part of a broader solution.`,
    vocabulary: [
      { phrase: 'shared responsibility', meaning: 'bo‘lingan mas’uliyat' },
      { phrase: 'bring about large-scale change', meaning: 'katta ko‘lamli o‘zgarish keltirib chiqarmoq' },
      { phrase: 'sustainable infrastructure', meaning: 'barqaror infratuzilma' },
      { phrase: 'not exempt from responsibility', meaning: 'mas’uliyatdan ozod emas' },
      { phrase: 'substantial impact', meaning: 'katta ta’sir' },
      { phrase: 'sense of urgency', meaning: 'shoshilinchlik hissi' },
      { phrase: 'instilling environmentally responsible habits', meaning: 'ekologik mas’uliyatli odatlarni singdirish' }
    ]
  }
];
