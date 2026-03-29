import type { Course, TopicTag } from '../types'

export const TOPIC_LABELS: Record<TopicTag, string> = {
  anxiety: 'Anxiety',
  depression: 'Depression',
  bipolar: 'Bipolar Disorder',
  schizophrenia: 'Schizophrenia',
  stigma: 'Stigma Busting',
  wellbeing: 'Everyday Wellbeing',
}

export const courses: Course[] = [
  {
    id: 'anxiety-101',
    title: 'Anxiety 101: What Is Happening in the Brain?',
    topic: 'anxiety',
    level: 'Beginner',
    duration: '18 min',
    summary:
      'Understand common anxiety symptoms, school triggers, and practical calming techniques students can use quickly.',
    whyItMatters:
      'Students often think anxiety means weakness. Understanding the biology reduces blame and encourages healthy coping.',
    videoEmbedUrl: 'https://www.youtube.com/embed/WuyPuH9ojCE',
    myths: [
      {
        myth: 'Anxiety is just overthinking and can be ignored.',
        fact: 'Anxiety has real body responses and improves with skills, support, and treatment when needed.',
      },
      {
        myth: 'Only adults get anxiety problems.',
        fact: 'Teenagers and children can experience anxiety, especially during exams and social pressure.',
      },
    ],
    activities: [
      '2-minute breathing reset before class.',
      'Trigger mapping worksheet for exam week.',
      'Peer support phrase practice: "I am here for you."',
    ],
    assignments: [
      {
        id: 'anxiety-breathing-plan',
        title: 'Create Your Exam-Week Calm Plan',
        instructions:
          'Write your top 3 anxiety triggers and pair each trigger with one quick calming action you can do in school.',
        deliverable: 'A one-page calm plan with 3 trigger-action pairs.',
        estimatedMinutes: 20,
      },
    ],
    game: {
      title: 'Signal vs Story',
      question: 'Which response best supports a classmate with panic symptoms?',
      options: [
        {
          id: 'a1',
          label: 'Tell them to stop overreacting and focus.',
          correct: false,
          feedback: 'Invalidating language increases shame and panic intensity.',
        },
        {
          id: 'a2',
          label: 'Guide slow breathing and move to a quiet place.',
          correct: true,
          feedback: 'Correct. Calm structure and safety cues help the nervous system settle.',
        },
        {
          id: 'a3',
          label: 'Film them to show later as a lesson.',
          correct: false,
          feedback: 'This harms trust and reinforces stigma.',
        },
      ],
    },
    resources: [
      {
        title: 'NIMH Anxiety Basics',
        description: 'Student-friendly overview of anxiety disorders.',
        url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
      },
      {
        title: 'Mindfulness for Teens',
        description: 'Simple calming practices for school settings.',
        url: 'https://www.mindful.org/mindfulness-for-kids/',
      },
    ],
  },
  {
    id: 'depression-awareness',
    title: 'Depression Awareness for School Communities',
    topic: 'depression',
    level: 'Beginner',
    duration: '20 min',
    summary:
      'Learn to recognize depression signs, separate myths from facts, and respond with empathy and referral.',
    whyItMatters:
      'Many students hide symptoms due to fear of judgment. Early recognition can prevent crisis.',
    videoEmbedUrl: 'https://www.youtube.com/embed/z-IR48Mb3W0',
    myths: [
      {
        myth: 'Depression is laziness.',
        fact: 'Depression is a health condition that affects mood, sleep, energy, and concentration.',
      },
      {
        myth: 'If someone smiles, they cannot be depressed.',
        fact: 'People may hide symptoms. Listening without judgment is important.',
      },
    ],
    activities: [
      'Mood journal challenge for one week.',
      'Classroom empathy language rewrite exercise.',
      'Help-seeking role-play with counselor referral.',
    ],
    assignments: [
      {
        id: 'depression-support-script',
        title: 'Empathy Conversation Script',
        instructions:
          'Draft a short supportive script for talking to a friend who may be struggling with low mood without being judgmental.',
        deliverable: 'A 6-8 line support script using validating language.',
        estimatedMinutes: 18,
      },
    ],
    game: {
      title: 'Stigma Decoder',
      question: 'Which statement reduces stigma the most?',
      options: [
        {
          id: 'd1',
          label: 'Just think positive and stop being dramatic.',
          correct: false,
          feedback: 'This increases shame and discourages help-seeking.',
        },
        {
          id: 'd2',
          label: 'Your feelings are real. Want help finding support?',
          correct: true,
          feedback: 'Correct. Validation plus practical support is anti-stigma communication.',
        },
        {
          id: 'd3',
          label: 'Keep this secret so others do not judge you.',
          correct: false,
          feedback: 'Secrecy often delays care and increases isolation.',
        },
      ],
    },
    resources: [
      {
        title: 'WHO Depression Guide',
        description: 'Overview, warning signs, and treatment pathways.',
        url: 'https://www.who.int/news-room/fact-sheets/detail/depression',
      },
      {
        title: 'Mental Health America Screening',
        description: 'A self-check tool to encourage early support conversations.',
        url: 'https://screening.mhanational.org/screening-tools/depression/',
      },
    ],
  },
  {
    id: 'bipolar-basics',
    title: 'Bipolar Disorder: Beyond Stereotypes',
    topic: 'bipolar',
    level: 'Intermediate',
    duration: '22 min',
    summary:
      'Understand mood episodes, treatment myths, and respectful ways to support students living with bipolar disorder.',
    whyItMatters:
      'Bipolar disorder is often reduced to labels such as unstable. Accurate education replaces fear with support.',
    videoEmbedUrl: 'https://www.youtube.com/embed/RrWBhVlD1H8',
    myths: [
      {
        myth: 'Bipolar means mood changes every few minutes.',
        fact: 'Bipolar episodes generally last days to weeks and involve distinct patterns.',
      },
      {
        myth: 'People with bipolar disorder cannot succeed in school.',
        fact: 'With treatment and support, students can thrive academically and socially.',
      },
    ],
    activities: [
      'Trigger and routine planning template.',
      'Support boundary-setting practice for peers.',
      'Teacher response checklist for episode warning signs.',
    ],
    assignments: [
      {
        id: 'bipolar-routine-map',
        title: 'Mood Stability Routine Map',
        instructions:
          'Design a simple daily routine map (sleep, meals, study breaks, check-ins) that supports mood stability.',
        deliverable: 'A routine map with at least 4 daily stability anchors.',
        estimatedMinutes: 22,
      },
    ],
    game: {
      title: 'Episode Insight',
      question: 'What is the best first step when a friend reports rapid mood changes and sleep loss?',
      options: [
        {
          id: 'b1',
          label: 'Mock them for being unpredictable.',
          correct: false,
          feedback: 'Mocking intensifies stigma and harm.',
        },
        {
          id: 'b2',
          label: 'Encourage contacting a counselor or trusted adult quickly.',
          correct: true,
          feedback: 'Correct. Early professional support helps with stabilization.',
        },
        {
          id: 'b3',
          label: 'Tell them to hide symptoms from everyone.',
          correct: false,
          feedback: 'Hiding symptoms can delay timely support.',
        },
      ],
    },
    resources: [
      {
        title: 'NAMI Bipolar Overview',
        description: 'Family and school-friendly bipolar education.',
        url: 'https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Bipolar-Disorder',
      },
      {
        title: 'School Mental Health Toolkit',
        description: 'Supportive school practices for mental health accommodations.',
        url: 'https://www.nasponline.org/resources-and-publications/resources-and-podcasts/mental-health',
      },
    ],
  },
  {
    id: 'schizophrenia-awareness',
    title: 'Schizophrenia Awareness: Facts Over Fear',
    topic: 'schizophrenia',
    level: 'Intermediate',
    duration: '24 min',
    summary:
      'Separate media myths from reality and learn compassionate school responses to psychosis-related symptoms.',
    whyItMatters:
      'Stigma around schizophrenia can be severe. Fact-based education protects dignity and improves support.',
    videoEmbedUrl: 'https://www.youtube.com/embed/nEnklxGAmak',
    myths: [
      {
        myth: 'People with schizophrenia are always violent.',
        fact: 'Most are not violent and are more likely to be harmed than harm others.',
      },
      {
        myth: 'Schizophrenia means split personality.',
        fact: 'It is a psychotic disorder, not multiple personalities.',
      },
    ],
    activities: [
      'Media myth correction challenge.',
      'Respectful language role-play.',
      'Support pathway mapping for school counselors.',
    ],
    assignments: [
      {
        id: 'schizophrenia-myth-correction',
        title: 'Myth-to-Fact Media Rewrite',
        instructions:
          'Pick one harmful media stereotype and rewrite it into an evidence-based statement using person-first language.',
        deliverable: 'One corrected statement plus a short explanation of why it is more respectful.',
        estimatedMinutes: 20,
      },
    ],
    game: {
      title: 'Fact Shield',
      question: 'Which phrase is most respectful and accurate?',
      options: [
        {
          id: 's1',
          label: 'They are crazy and dangerous.',
          correct: false,
          feedback: 'This is stigmatizing and factually wrong.',
        },
        {
          id: 's2',
          label: 'They are a person with schizophrenia who deserves support.',
          correct: true,
          feedback: 'Correct. Person-first language reduces stigma.',
        },
        {
          id: 's3',
          label: 'Avoid them and ignore all symptoms.',
          correct: false,
          feedback: 'Avoidance increases isolation and delays support.',
        },
      ],
    },
    resources: [
      {
        title: 'NIMH Schizophrenia',
        description: 'Evidence-based schizophrenia information.',
        url: 'https://www.nimh.nih.gov/health/topics/schizophrenia',
      },
      {
        title: 'Early Psychosis Intervention',
        description: 'Guide to recognizing early signs and referral options.',
        url: 'https://www.nami.org/Your-Journey/Individuals-with-Mental-Illness/Understanding-Psychosis',
      },
    ],
  },
  {
    id: 'stigma-myth-buster',
    title: 'Myth Buster Lab: Stigma to Science',
    topic: 'stigma',
    level: 'Beginner',
    duration: '15 min',
    summary:
      'A gamified anti-stigma module that trains students to challenge harmful beliefs and replace them with evidence.',
    whyItMatters:
      'Stigma spreads through everyday language. Students can become active stigma-breakers in school culture.',
    videoEmbedUrl: 'https://www.youtube.com/embed/7cEyVj4YFds',
    myths: [
      {
        myth: 'Mental illness is rare and not relevant in schools.',
        fact: 'Mental health concerns are common among students and need open support.',
      },
      {
        myth: 'Talking about mental health creates problems.',
        fact: 'Open, safe conversations increase help-seeking and reduce stigma.',
      },
    ],
    activities: [
      'Stigma phrase rewrite sprint.',
      'Poster challenge: facts not fear.',
      'Peer ally pledge for inclusive language.',
    ],
    assignments: [
      {
        id: 'stigma-poster-brief',
        title: 'Anti-Stigma Poster Brief',
        instructions:
          'Create a short campaign brief for a classroom poster that challenges one myth with one clear fact and one action step.',
        deliverable: 'Poster brief with slogan, myth/fact, and call to action.',
        estimatedMinutes: 15,
      },
    ],
    game: {
      title: 'True or Stigma',
      question: 'Which response best challenges stigma in class?',
      options: [
        {
          id: 'm1',
          label: 'Stay silent when someone mocks therapy.',
          correct: false,
          feedback: 'Silence allows stigma to spread.',
        },
        {
          id: 'm2',
          label: 'Say therapy is a valid health support tool.',
          correct: true,
          feedback: 'Correct. Normalizing care is a powerful anti-stigma action.',
        },
        {
          id: 'm3',
          label: 'Laugh along to fit in.',
          correct: false,
          feedback: 'Joining stigma harms classmates who may be struggling.',
        },
      ],
    },
    resources: [
      {
        title: 'Time to Change School Ideas',
        description: 'Stigma reduction campaign concepts for students.',
        url: 'https://www.time-to-change.org.uk/',
      },
      {
        title: 'UNICEF Mental Health',
        description: 'Youth-focused materials for mental health literacy.',
        url: 'https://www.unicef.org/mental-health',
      },
    ],
  },
  {
    id: 'support-a-friend',
    title: 'How to Support a Friend Safely',
    topic: 'wellbeing',
    level: 'Beginner',
    duration: '16 min',
    summary:
      'Learn what to say, what not to say, and when to involve trusted adults or professionals.',
    whyItMatters:
      'Peers are often first responders in school settings. Safe support skills protect everyone.',
    videoEmbedUrl: 'https://www.youtube.com/embed/h9MzyXl4o4M',
    myths: [
      {
        myth: 'You must solve your friend’s problem alone.',
        fact: 'Support means listening and connecting them to appropriate help.',
      },
      {
        myth: 'Asking about self-harm plants ideas.',
        fact: 'Asking calmly can reduce risk and open life-saving conversation.',
      },
    ],
    activities: [
      'CARE model practice (Calm, Ask, Refer, Encourage).',
      'Boundary checklist for student supporters.',
      'Help-chain mapping: friend -> teacher -> counselor.',
    ],
    assignments: [
      {
        id: 'support-a-friend-safety-plan',
        title: 'Friend Support Safety Plan',
        instructions:
          'Write a step-by-step support plan for a friend in distress, including when to involve a trusted adult.',
        deliverable: 'A 5-step support-and-referral checklist.',
        estimatedMinutes: 16,
      },
    ],
    game: {
      title: 'Support Script Studio',
      question: 'Which script is safest if a friend says they feel hopeless?',
      options: [
        {
          id: 'f1',
          label: 'Keep it secret forever and never tell an adult.',
          correct: false,
          feedback: 'Safety comes first. Serious risk needs adult/professional support.',
        },
        {
          id: 'f2',
          label: 'Thank them for trusting you and offer to reach a counselor together.',
          correct: true,
          feedback: 'Correct. This validates feelings and routes toward qualified help.',
        },
        {
          id: 'f3',
          label: 'Say everyone feels that way, ignore it.',
          correct: false,
          feedback: 'Minimizing can stop someone from asking for help again.',
        },
      ],
    },
    resources: [
      {
        title: '988 Lifeline',
        description: 'Immediate crisis support and guidance.',
        url: 'https://988lifeline.org/',
      },
      {
        title: 'Crisis Text Line',
        description: 'Text-based support for urgent emotional distress.',
        url: 'https://www.crisistextline.org/',
      },
    ],
  },
]
