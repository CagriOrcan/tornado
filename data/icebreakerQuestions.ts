export interface IcebreakerQuestion {
  id: string;
  question: string;
  category: IcebreakerCategory;
  tone: 'fun' | 'deep' | 'creative' | 'personal' | 'random';
}

export type IcebreakerCategory = 
  | 'getting_started'
  | 'fun_random' 
  | 'would_you_rather'
  | 'personal_growth'
  | 'dreams_goals'
  | 'quirky_fun'
  | 'travel_adventure'
  | 'food_lifestyle'
  | 'creative_imagination';

export const ICEBREAKER_QUESTIONS: IcebreakerQuestion[] = [
  // Getting Started (Easy conversation starters)
  {
    id: 'gs1',
    question: "What's the best part of your day so far?",
    category: 'getting_started',
    tone: 'fun'
  },
  {
    id: 'gs2',
    question: "If you could have coffee with anyone (alive or dead), who would it be?",
    category: 'getting_started',
    tone: 'personal'
  },
  {
    id: 'gs3',
    question: "What's something you're really passionate about?",
    category: 'getting_started',
    tone: 'personal'
  },
  {
    id: 'gs4',
    question: "What's your go-to karaoke song?",
    category: 'getting_started',
    tone: 'fun'
  },
  {
    id: 'gs5',
    question: "What's the most interesting place you've visited recently?",
    category: 'getting_started',
    tone: 'personal'
  },

  // Fun & Random
  {
    id: 'fr1',
    question: "If you were a superhero, what would your power be?",
    category: 'fun_random',
    tone: 'creative'
  },
  {
    id: 'fr2',
    question: "What's the weirdest food combination you actually enjoy?",
    category: 'fun_random',
    tone: 'fun'
  },
  {
    id: 'fr3',
    question: "If animals could talk, which one would be the rudest?",
    category: 'fun_random',
    tone: 'fun'
  },
  {
    id: 'fr4',
    question: "What's your most useless talent?",
    category: 'fun_random',
    tone: 'fun'
  },
  {
    id: 'fr5',
    question: "If you could be any fictional character for a day, who would you choose?",
    category: 'fun_random',
    tone: 'creative'
  },

  // Would You Rather
  {
    id: 'wyr1',
    question: "Would you rather always have to sing instead of speak or dance everywhere you go?",
    category: 'would_you_rather',
    tone: 'fun'
  },
  {
    id: 'wyr2',
    question: "Would you rather be able to fly or be invisible?",
    category: 'would_you_rather',
    tone: 'creative'
  },
  {
    id: 'wyr3',
    question: "Would you rather live in the mountains or by the ocean?",
    category: 'would_you_rather',
    tone: 'personal'
  },
  {
    id: 'wyr4',
    question: "Would you rather always be 10 minutes late or 20 minutes early?",
    category: 'would_you_rather',
    tone: 'fun'
  },
  {
    id: 'wyr5',
    question: "Would you rather have the ability to time travel or read minds?",
    category: 'would_you_rather',
    tone: 'creative'
  },

  // Personal Growth
  {
    id: 'pg1',
    question: "What's something you've learned about yourself recently?",
    category: 'personal_growth',
    tone: 'deep'
  },
  {
    id: 'pg2',
    question: "What's a skill you'd love to master?",
    category: 'personal_growth',
    tone: 'personal'
  },
  {
    id: 'pg3',
    question: "What's the best advice you've ever received?",
    category: 'personal_growth',
    tone: 'deep'
  },
  {
    id: 'pg4',
    question: "What's something that always makes you feel better when you're down?",
    category: 'personal_growth',
    tone: 'personal'
  },
  {
    id: 'pg5',
    question: "What's a challenge you've overcome that you're proud of?",
    category: 'personal_growth',
    tone: 'deep'
  },

  // Dreams & Goals
  {
    id: 'dg1',
    question: "If money wasn't a factor, what would you spend your time doing?",
    category: 'dreams_goals',
    tone: 'deep'
  },
  {
    id: 'dg2',
    question: "What's on your bucket list for this year?",
    category: 'dreams_goals',
    tone: 'personal'
  },
  {
    id: 'dg3',
    question: "Where do you see yourself in 5 years?",
    category: 'dreams_goals',
    tone: 'deep'
  },
  {
    id: 'dg4',
    question: "What's a dream you had as a kid that you still think about?",
    category: 'dreams_goals',
    tone: 'personal'
  },
  {
    id: 'dg5',
    question: "What's something you want to be remembered for?",
    category: 'dreams_goals',
    tone: 'deep'
  },

  // Quirky & Fun
  {
    id: 'qf1',
    question: "What's the strangest compliment you've ever received?",
    category: 'quirky_fun',
    tone: 'fun'
  },
  {
    id: 'qf2',
    question: "If you could have any animal as a pet (legal or not), what would it be?",
    category: 'quirky_fun',
    tone: 'creative'
  },
  {
    id: 'qf3',
    question: "What's something everyone seems to love but you just don't get?",
    category: 'quirky_fun',
    tone: 'fun'
  },
  {
    id: 'qf4',
    question: "What's the most random thing in your bag/backpack right now?",
    category: 'quirky_fun',
    tone: 'fun'
  },
  {
    id: 'qf5',
    question: "If you could rename yourself, what name would you choose?",
    category: 'quirky_fun',
    tone: 'creative'
  },

  // Travel & Adventure
  {
    id: 'ta1',
    question: "What's the most spontaneous thing you've ever done?",
    category: 'travel_adventure',
    tone: 'personal'
  },
  {
    id: 'ta2',
    question: "If you could teleport anywhere right now, where would you go?",
    category: 'travel_adventure',
    tone: 'creative'
  },
  {
    id: 'ta3',
    question: "What's your ideal way to spend a weekend?",
    category: 'travel_adventure',
    tone: 'personal'
  },
  {
    id: 'ta4',
    question: "What's the most beautiful place you've ever seen?",
    category: 'travel_adventure',
    tone: 'personal'
  },
  {
    id: 'ta5',
    question: "Beach vacation or mountain adventure?",
    category: 'travel_adventure',
    tone: 'fun'
  },

  // Food & Lifestyle
  {
    id: 'fl1',
    question: "What's your comfort food?",
    category: 'food_lifestyle',
    tone: 'fun'
  },
  {
    id: 'fl2',
    question: "Are you a morning person or a night owl?",
    category: 'food_lifestyle',
    tone: 'personal'
  },
  {
    id: 'fl3',
    question: "What's the best meal you've ever had?",
    category: 'food_lifestyle',
    tone: 'personal'
  },
  {
    id: 'fl4',
    question: "Coffee or tea? And how do you take it?",
    category: 'food_lifestyle',
    tone: 'fun'
  },
  {
    id: 'fl5',
    question: "What's your guilty pleasure TV show or movie?",
    category: 'food_lifestyle',
    tone: 'fun'
  },

  // Creative & Imagination
  {
    id: 'ci1',
    question: "If you could live in any movie or book universe, which would you choose?",
    category: 'creative_imagination',
    tone: 'creative'
  },
  {
    id: 'ci2',
    question: "What would your autobiography be called?",
    category: 'creative_imagination',
    tone: 'creative'
  },
  {
    id: 'ci3',
    question: "If you could add one rule to society that everyone had to follow, what would it be?",
    category: 'creative_imagination',
    tone: 'creative'
  },
  {
    id: 'ci4',
    question: "What's something that doesn't exist yet but should?",
    category: 'creative_imagination',
    tone: 'creative'
  },
  {
    id: 'ci5',
    question: "If you could have dinner with your future self, what would you ask?",
    category: 'creative_imagination',
    tone: 'deep'
  },
];

export const CATEGORY_INFO: Record<IcebreakerCategory, { name: string; emoji: string; description: string }> = {
  getting_started: {
    name: 'Getting Started',
    emoji: '👋',
    description: 'Easy conversation starters'
  },
  fun_random: {
    name: 'Fun & Random',
    emoji: '🎲',
    description: 'Silly and unexpected questions'
  },
  would_you_rather: {
    name: 'Would You Rather',
    emoji: '🤔',
    description: 'Choose between interesting options'
  },
  personal_growth: {
    name: 'Personal Growth',
    emoji: '🌱',
    description: 'Deeper questions about self-discovery'
  },
  dreams_goals: {
    name: 'Dreams & Goals',
    emoji: '⭐',
    description: 'Future aspirations and ambitions'
  },
  quirky_fun: {
    name: 'Quirky & Fun',
    emoji: '🤪',
    description: 'Weird and wonderful questions'
  },
  travel_adventure: {
    name: 'Travel & Adventure',
    emoji: '✈️',
    description: 'Wanderlust and experiences'
  },
  food_lifestyle: {
    name: 'Food & Lifestyle',
    emoji: '🍕',
    description: 'Daily life and preferences'
  },
  creative_imagination: {
    name: 'Creative & Imagination',
    emoji: '🎨',
    description: 'Creative and thought-provoking'
  },
};

// Utility functions
export const getRandomQuestion = (excludeIds: string[] = []): IcebreakerQuestion => {
  const availableQuestions = ICEBREAKER_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
};

export const getQuestionsByCategory = (category: IcebreakerCategory): IcebreakerQuestion[] => {
  return ICEBREAKER_QUESTIONS.filter(q => q.category === category);
};

export const getQuestionsByTone = (tone: 'fun' | 'deep' | 'creative' | 'personal' | 'random'): IcebreakerQuestion[] => {
  return ICEBREAKER_QUESTIONS.filter(q => q.tone === tone);
};

export const getRandomQuestionByTone = (tone: 'fun' | 'deep' | 'creative' | 'personal' | 'random', excludeIds: string[] = []): IcebreakerQuestion => {
  const availableQuestions = getQuestionsByTone(tone).filter(q => !excludeIds.includes(q.id));
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
};