/**
 * 10-LEVEL VOCAL COACHING PROGRESSION SYSTEM
 *
 * Comprehensive, ADHD-friendly gamified progression system
 * with detailed exercises, badges, and analytics tracking
 */

export interface LevelConfig {
  level: number;
  name: string;
  category: string;
  description: string;
  xpRequired: number;
  durationMin: number;
  durationMax: number;
  exercises: Exercise[];
  badge: Badge;
  unlocks: string[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  instructions: string[];
  targetMetrics: {
    pitchAccuracy?: number;
    resonance?: number;
    clarity?: number;
    volumeControl?: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  microSessions: MicroSession[];
}

export interface MicroSession {
  name: string;
  duration: number; // 2-5 minutes
  steps: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/**
 * 10-LEVEL PROGRESSION SYSTEM
 */
export const PROGRESSION_LEVELS: LevelConfig[] = [
  // ==================== LEVEL 1 ====================
  {
    level: 1,
    name: 'VOCAL FOUNDATION',
    category: 'Breath & Posture',
    description: 'Master the fundamentals of breath control and proper vocal posture',
    xpRequired: 100,
    durationMin: 5,
    durationMax: 10,
    badge: {
      id: 'basic_breathing',
      name: 'Basic Breathing Badge',
      description: 'Mastered diaphragmatic breathing',
      icon: '🌬️',
      rarity: 'common',
    },
    unlocks: ['Breathing exercises', 'Posture guide'],
    exercises: [
      {
        id: 'diaphragmatic_breathing',
        name: 'Diaphragmatic Breathing',
        description: 'Learn to breathe from your diaphragm for better vocal support',
        duration: 300,
        difficulty: 'beginner',
        instructions: [
          'Place one hand on your chest, one on your belly',
          'Breathe in slowly through your nose for 4 counts',
          'Feel your belly expand, chest stays still',
          'Hold for 4 counts',
          'Exhale slowly for 6 counts',
          'Repeat 5 times',
        ],
        targetMetrics: {
          volumeControl: 60,
        },
        microSessions: [
          {
            name: 'Quick Breath Check',
            duration: 120,
            steps: ['2 minutes of mindful breathing', 'Focus on belly expansion'],
          },
          {
            name: 'Breath Capacity',
            duration: 180,
            steps: ['Inhale for 5 seconds', 'Hold for 5', 'Exhale for 8', 'Repeat 5 times'],
          },
        ],
      },
      {
        id: 'posture_alignment',
        name: 'Posture Alignment',
        description: 'Establish proper singing posture',
        duration: 240,
        difficulty: 'beginner',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Keep shoulders relaxed, not hunched',
          'Chin parallel to floor',
          'Imagine a string pulling you up from the crown',
          'Practice standing tall for 2 minutes',
        ],
        targetMetrics: {
          clarity: 55,
        },
        microSessions: [
          {
            name: 'Posture Reset',
            duration: 120,
            steps: ['Check your alignment', 'Roll shoulders back', 'Stand tall'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 2 ====================
  {
    level: 2,
    name: 'TONE DISCOVERY',
    category: 'Finding Your Voice',
    description: 'Discover and develop your natural vocal tone',
    xpRequired: 200,
    durationMin: 10,
    durationMax: 15,
    badge: {
      id: 'tone_explorer',
      name: 'Tone Explorer Badge',
      description: 'Found your unique voice',
      icon: '🎵',
      rarity: 'common',
    },
    unlocks: ['Pitch matching', 'Vowel exercises'],
    exercises: [
      {
        id: 'pitch_matching',
        name: 'Pitch Matching (C4-G4)',
        description: 'Match pitches in your comfortable range',
        duration: 420,
        difficulty: 'beginner',
        instructions: [
          'Listen to C4 (middle C) and match the pitch',
          'Sing "Ahhh" on each note',
          'Move up by half steps: C4, C#4, D4, D#4, E4, F4, F#4, G4',
          'Hold each note for 3 seconds',
          'Focus on matching the exact pitch',
        ],
        targetMetrics: {
          pitchAccuracy: 65,
        },
        microSessions: [
          {
            name: 'Quick Pitch Check',
            duration: 180,
            steps: ['Match 5 pitches', 'C4 to G4 range'],
          },
          {
            name: 'Vowel Sound Practice',
            duration: 240,
            steps: ['Sing Ah, Eh, Ee, Oh, Oo', 'On one comfortable pitch'],
          },
        ],
      },
      {
        id: 'humming_resonance',
        name: 'Humming Resonance',
        description: 'Explore vocal resonance through humming',
        duration: 300,
        difficulty: 'beginner',
        instructions: [
          'Hum with lips closed gently',
          'Feel vibration in your face and chest',
          'Start low, slide up and down',
          'Find your most resonant hum',
        ],
        targetMetrics: {
          resonance: 60,
        },
        microSessions: [
          {
            name: 'Resonance Check',
            duration: 150,
            steps: ['Hum for 2.5 minutes', 'Feel the buzz'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 3 ====================
  {
    level: 3,
    name: 'RANGE EXPANSION',
    category: 'Lower Register',
    description: 'Develop strength in your lower vocal range',
    xpRequired: 300,
    durationMin: 15,
    durationMax: 20,
    badge: {
      id: 'low_note_master',
      name: 'Low Note Master Badge',
      description: 'Conquered your chest voice',
      icon: '🎸',
      rarity: 'rare',
    },
    unlocks: ['Chest voice exercises', 'Scale practice'],
    exercises: [
      {
        id: 'chest_voice_strengthening',
        name: 'Chest Voice Strengthening (C3-C4)',
        description: 'Build power in your lower register',
        duration: 600,
        difficulty: 'intermediate',
        instructions: [
          'Start at C4 and work down to C3',
          'Use "Oh" vowel for warmth',
          'Feel vibration in your chest',
          'Maintain steady volume',
          'Don\'t strain - stay comfortable',
        ],
        targetMetrics: {
          pitchAccuracy: 70,
          resonance: 65,
        },
        microSessions: [
          {
            name: 'Low Note Warm-up',
            duration: 180,
            steps: ['Gentle low notes', 'C3 to F3'],
          },
          {
            name: 'Sustained Low Notes',
            duration: 240,
            steps: ['Hold each note for 5 seconds', 'Focus on quality'],
          },
        ],
      },
      {
        id: 'major_scales',
        name: 'Major Scale Exercises',
        description: 'Practice major scales to develop range',
        duration: 480,
        difficulty: 'intermediate',
        instructions: [
          'Start on C3: Do Re Mi Fa Sol La Ti Do',
          'Sing ascending and descending',
          'Use "La" syllable',
          'Keep tempo steady',
        ],
        targetMetrics: {
          pitchAccuracy: 72,
          clarity: 65,
        },
        microSessions: [
          {
            name: 'Quick Scale',
            duration: 150,
            steps: ['One scale up and down', 'Focus on pitch'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 4 ====================
  {
    level: 4,
    name: 'ARTICULATION MASTERY',
    category: 'Diction & Clarity',
    description: 'Perfect your articulation and diction',
    xpRequired: 400,
    durationMin: 15,
    durationMax: 20,
    badge: {
      id: 'clear_speaker',
      name: 'Clear Speaker Badge',
      description: 'Mastered crystal-clear articulation',
      icon: '🗣️',
      rarity: 'rare',
    },
    unlocks: ['Tongue twisters', 'Consonant drills'],
    exercises: [
      {
        id: 'consonant_precision',
        name: 'Consonant Precision Drills',
        description: 'Sharpen consonant articulation',
        duration: 540,
        difficulty: 'intermediate',
        instructions: [
          'Practice: T-D-K-G-P-B consonants',
          'Tip of tongue: T, D, N, L',
          'Back of tongue: K, G',
          'Lips: P, B, M',
          'Exaggerate each sound',
        ],
        targetMetrics: {
          clarity: 75,
        },
        microSessions: [
          {
            name: 'Consonant Quick Drill',
            duration: 180,
            steps: ['T-D-K-G-P-B rapid fire', '30 seconds each'],
          },
        ],
      },
      {
        id: 'tongue_twisters',
        name: 'Tongue Twisters for Agility',
        description: 'Improve articulatory speed and precision',
        duration: 600,
        difficulty: 'intermediate',
        instructions: [
          'Peter Piper picked a peck of pickled peppers',
          'She sells seashells by the seashore',
          'Red leather yellow leather',
          'Start slow, gradually speed up',
          'Maintain clarity at all speeds',
        ],
        targetMetrics: {
          clarity: 78,
        },
        microSessions: [
          {
            name: 'Quick Twister',
            duration: 150,
            steps: ['One tongue twister', '5 times slow, 5 times fast'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 5 ====================
  {
    level: 5,
    name: 'MIDDLE VOICE INTEGRATION',
    category: 'Mix & Blend',
    description: 'Master the art of blending vocal registers',
    xpRequired: 500,
    durationMin: 20,
    durationMax: 25,
    badge: {
      id: 'voice_blender',
      name: 'Voice Blender Badge',
      description: 'Seamlessly blend registers',
      icon: '🌈',
      rarity: 'epic',
    },
    unlocks: ['Mixed voice training', 'Dynamic control'],
    exercises: [
      {
        id: 'mixed_voice_training',
        name: 'Mixed Voice Training (C4-G4)',
        description: 'Develop your mixed voice',
        duration: 720,
        difficulty: 'intermediate',
        instructions: [
          'Start in chest voice at C4',
          'Gradually lighten as you ascend',
          'Feel transition around E4-F4',
          'Keep tone connected, no breaks',
          'Use "Nay" or "Gee" syllables',
        ],
        targetMetrics: {
          pitchAccuracy: 75,
          resonance: 70,
        },
        microSessions: [
          {
            name: 'Register Blend',
            duration: 240,
            steps: ['C4 to G4 smooth transition', 'No vocal breaks'],
          },
        ],
      },
      {
        id: 'dynamic_control',
        name: 'Dynamic Control (Soft to Loud)',
        description: 'Control volume with precision',
        duration: 600,
        difficulty: 'advanced',
        instructions: [
          'Sing one sustained note',
          'Start very soft (pianissimo)',
          'Gradually crescendo to loud (fortissimo)',
          'Decrescendo back to soft',
          'Maintain pitch throughout',
        ],
        targetMetrics: {
          volumeControl: 75,
          pitchAccuracy: 73,
        },
        microSessions: [
          {
            name: 'Volume Control',
            duration: 180,
            steps: ['Soft-loud-soft on one note', 'Maintain quality'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 6 ====================
  {
    level: 6,
    name: 'UPPER REGISTER DEVELOPMENT',
    category: 'Head Voice',
    description: 'Develop your head voice and upper range',
    xpRequired: 600,
    durationMin: 20,
    durationMax: 25,
    badge: {
      id: 'high_flyer',
      name: 'High Flyer Badge',
      description: 'Soaring in your head voice',
      icon: '🦅',
      rarity: 'epic',
    },
    unlocks: ['Head voice exercises', 'Falsetto control'],
    exercises: [
      {
        id: 'head_voice_development',
        name: 'Head Voice Exercises (G4-C5)',
        description: 'Build strength in your upper register',
        duration: 750,
        difficulty: 'advanced',
        instructions: [
          'Start with light "Hoo" sound',
          'Feel resonance in your head/face',
          'Don\'t push - stay light and easy',
          'Gradually strengthen over time',
          'Practice G4, A4, B4, C5',
        ],
        targetMetrics: {
          pitchAccuracy: 78,
          resonance: 72,
        },
        microSessions: [
          {
            name: 'High Note Touch',
            duration: 200,
            steps: ['Light touches on high notes', 'G4 to C5'],
          },
        ],
      },
      {
        id: 'falsetto_control',
        name: 'Falsetto Control and Strength',
        description: 'Master falsetto technique',
        duration: 660,
        difficulty: 'advanced',
        instructions: [
          'Access falsetto register',
          'Use "Hoo" or "Who" sounds',
          'Keep it light but supported',
          'Practice connecting falsetto to full voice',
        ],
        targetMetrics: {
          pitchAccuracy: 76,
          clarity: 70,
        },
        microSessions: [
          {
            name: 'Falsetto Touch',
            duration: 180,
            steps: ['Light falsetto slides', 'Feel the flip'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 7 ====================
  {
    level: 7,
    name: 'VOCAL AGILITY',
    category: 'Runs & Riffs',
    description: 'Develop fast, agile vocal runs and riffs',
    xpRequired: 700,
    durationMin: 25,
    durationMax: 30,
    badge: {
      id: 'agility_ace',
      name: 'Agility Ace Badge',
      description: 'Lightning-fast vocal runs',
      icon: '⚡',
      rarity: 'epic',
    },
    unlocks: ['Melismatic exercises', 'Interval training'],
    exercises: [
      {
        id: 'melismatic_runs',
        name: 'Melismatic Exercises',
        description: 'Practice singing multiple notes on one syllable',
        duration: 840,
        difficulty: 'advanced',
        instructions: [
          'Start with 3-note patterns: Do-Re-Mi',
          'Sing on single vowel "Ah"',
          'Keep notes connected and even',
          'Gradually increase speed',
          'Practice 5-note, 7-note, octave runs',
        ],
        targetMetrics: {
          pitchAccuracy: 80,
          clarity: 75,
        },
        microSessions: [
          {
            name: 'Quick Runs',
            duration: 240,
            steps: ['3 simple runs', 'Slow to fast'],
          },
        ],
      },
      {
        id: 'interval_jumping',
        name: 'Interval Jumping',
        description: 'Master jumping between intervals',
        duration: 900,
        difficulty: 'advanced',
        instructions: [
          'Practice 3rds: Do-Mi-Do',
          'Practice 4ths: Do-Fa-Do',
          'Practice 5ths: Do-Sol-Do',
          'Practice octaves: Do-Do',
          'Jump cleanly, no scooping',
        ],
        targetMetrics: {
          pitchAccuracy: 82,
        },
        microSessions: [
          {
            name: 'Interval Practice',
            duration: 240,
            steps: ['3rds and 5ths', 'Clean jumps'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 8 ====================
  {
    level: 8,
    name: 'EXPRESSION & EMOTION',
    category: 'Performance Skills',
    description: 'Bring emotion and storytelling to your voice',
    xpRequired: 800,
    durationMin: 25,
    durationMax: 30,
    badge: {
      id: 'expressive_artist',
      name: 'Expressive Artist Badge',
      description: 'Master of emotional expression',
      icon: '🎭',
      rarity: 'legendary',
    },
    unlocks: ['Emotional techniques', 'Vibrato control'],
    exercises: [
      {
        id: 'emotional_color',
        name: 'Dynamic Storytelling Through Voice',
        description: 'Add emotional depth to your singing',
        duration: 960,
        difficulty: 'advanced',
        instructions: [
          'Sing a simple phrase with different emotions',
          'Try: happy, sad, angry, hopeful',
          'Use dynamics: loud for anger, soft for sadness',
          'Change tone color for each emotion',
          'Tell a story with your voice',
        ],
        targetMetrics: {
          clarity: 78,
          resonance: 75,
        },
        microSessions: [
          {
            name: 'Emotion Switch',
            duration: 240,
            steps: ['One phrase, three emotions', 'Feel the difference'],
          },
        ],
      },
      {
        id: 'vibrato_control',
        name: 'Vibrato Control Exercises',
        description: 'Develop natural, controlled vibrato',
        duration: 840,
        difficulty: 'advanced',
        instructions: [
          'Sing a sustained note with no vibrato',
          'Allow natural vibrato to emerge',
          'Practice adding and removing vibrato',
          'Control speed and width of vibrato',
        ],
        targetMetrics: {
          resonance: 78,
          pitchAccuracy: 80,
        },
        microSessions: [
          {
            name: 'Vibrato Practice',
            duration: 240,
            steps: ['Straight tone to vibrato', 'Control the wave'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 9 ====================
  {
    level: 9,
    name: 'STYLE SPECIALIZATION',
    category: 'Genre Mastery',
    description: 'Master the techniques of your chosen genre',
    xpRequired: 900,
    durationMin: 30,
    durationMax: 40,
    badge: {
      id: 'style_master',
      name: 'Style Master Badge',
      description: 'Genre specialist',
      icon: '🎼',
      rarity: 'legendary',
    },
    unlocks: ['Genre-specific techniques', 'Backing tracks'],
    exercises: [
      {
        id: 'pop_techniques',
        name: 'Pop Style Techniques',
        description: 'Master contemporary pop vocal style',
        duration: 1200,
        difficulty: 'advanced',
        instructions: [
          'Learn pop phrasing and rhythm',
          'Practice vocal runs and riffs',
          'Study belt technique for powerful choruses',
          'Work on breathy vs. full voice',
          'Practice with backing tracks',
        ],
        targetMetrics: {
          pitchAccuracy: 85,
          clarity: 80,
          resonance: 78,
        },
        microSessions: [
          {
            name: 'Pop Riff',
            duration: 300,
            steps: ['One pop-style riff', 'Practice with metronome'],
          },
        ],
      },
      {
        id: 'genre_ornaments',
        name: 'Stylistic Ornaments',
        description: 'Add genre-appropriate vocal ornaments',
        duration: 1080,
        difficulty: 'advanced',
        instructions: [
          'Learn runs, riffs, and melismas',
          'Study scoops, falls, and bends',
          'Practice vibrato variations',
          'Add stylistic nuances',
        ],
        targetMetrics: {
          clarity: 82,
          pitchAccuracy: 83,
        },
        microSessions: [
          {
            name: 'Ornament Practice',
            duration: 300,
            steps: ['Add ornaments to simple melody', 'Stay stylistic'],
          },
        ],
      },
    ],
  },

  // ==================== LEVEL 10 ====================
  {
    level: 10,
    name: 'PROFESSIONAL PERFORMANCE',
    category: 'Stage Ready',
    description: 'Complete your journey as a professional vocalist',
    xpRequired: 1000,
    durationMin: 40,
    durationMax: 60,
    badge: {
      id: 'pro_vocalist',
      name: 'PRO VOCALIST Badge + Certificate',
      description: 'Professional-level vocalist',
      icon: '🏆',
      rarity: 'legendary',
    },
    unlocks: ['Full song assessments', 'Professional certification'],
    exercises: [
      {
        id: 'full_song_performance',
        name: 'Full Song Performance Assessment',
        description: 'Perform a complete song with professional quality',
        duration: 2400,
        difficulty: 'advanced',
        instructions: [
          'Choose a song in your style',
          'Warm up thoroughly',
          'Perform with full expression and technique',
          'Record and evaluate your performance',
          'Focus on consistency and professionalism',
        ],
        targetMetrics: {
          pitchAccuracy: 90,
          clarity: 85,
          resonance: 85,
          volumeControl: 85,
        },
        microSessions: [
          {
            name: 'Verse Practice',
            duration: 300,
            steps: ['Perfect one verse', 'Full technique'],
          },
          {
            name: 'Chorus Practice',
            duration: 300,
            steps: ['Master the chorus', 'Maximum impact'],
          },
        ],
      },
      {
        id: 'microphone_technique',
        name: 'Microphone Technique',
        description: 'Master professional mic technique',
        duration: 1800,
        difficulty: 'advanced',
        instructions: [
          'Learn proper mic distance',
          'Practice proximity effect',
          'Control plosives (P, B sounds)',
          'Work with different mic types',
        ],
        targetMetrics: {
          clarity: 88,
          volumeControl: 85,
        },
        microSessions: [
          {
            name: 'Mic Control',
            duration: 300,
            steps: ['Distance control practice', 'Soft/loud transitions'],
          },
        ],
      },
      {
        id: 'stage_presence',
        name: 'Stage Presence Training',
        description: 'Develop professional stage presence',
        duration: 1980,
        difficulty: 'advanced',
        instructions: [
          'Practice performing without inhibition',
          'Work on facial expressions',
          'Develop stage movement',
          'Connect with imaginary audience',
          'Balance technique with performance energy',
        ],
        targetMetrics: {
          clarity: 85,
          resonance: 82,
        },
        microSessions: [
          {
            name: 'Performance Confidence',
            duration: 300,
            steps: ['Perform with full energy', 'Be the artist'],
          },
        ],
      },
    ],
  },
];

/**
 * ADHD-FRIENDLY FEATURES
 */
export const ADHD_FEATURES = {
  microSessionsEnabled: true,
  immediateFeedback: true,
  visualProgressBars: true,
  focusModeAvailable: true,
  breakReminderInterval: 15 * 60, // 15 minutes in seconds
  streakRewardInterval: 3, // days
  gamificationEnabled: true,
  customizableReminders: true,
  quickWinChallenges: true,
  progressVisualization: true,
};

/**
 * Get level config by level number
 */
export function getLevelConfig(level: number): LevelConfig | undefined {
  return PROGRESSION_LEVELS.find((l) => l.level === level);
}

/**
 * Get next level info
 */
export function getNextLevel(currentLevel: number): LevelConfig | undefined {
  return PROGRESSION_LEVELS.find((l) => l.level === currentLevel + 1);
}

/**
 * Calculate progress to next level
 */
export function calculateProgressToNextLevel(
  currentXP: number,
  currentLevel: number
): { percentage: number; xpNeeded: number; xpRemaining: number } {
  const nextLevel = getNextLevel(currentLevel);
  if (!nextLevel) {
    return { percentage: 100, xpNeeded: 0, xpRemaining: 0 };
  }

  const currentLevelConfig = getLevelConfig(currentLevel);
  const currentLevelXP = currentLevelConfig?.xpRequired || 0;
  const nextLevelXP = nextLevel.xpRequired;

  const xpNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = currentXP - currentLevelXP;
  const percentage = Math.min((xpProgress / xpNeeded) * 100, 100);
  const xpRemaining = Math.max(nextLevelXP - currentXP, 0);

  return { percentage, xpNeeded, xpRemaining };
}

/**
 * Get recommended exercise for user's current level
 */
export function getRecommendedExercise(
  level: number,
  weakestSkill: 'pitch' | 'resonance' | 'clarity' | 'volume'
): Exercise | undefined {
  const levelConfig = getLevelConfig(level);
  if (!levelConfig) return undefined;

  // Find exercise that targets the weakest skill
  const matchingExercise = levelConfig.exercises.find((ex) => {
    if (weakestSkill === 'pitch') return ex.targetMetrics.pitchAccuracy;
    if (weakestSkill === 'resonance') return ex.targetMetrics.resonance;
    if (weakestSkill === 'clarity') return ex.targetMetrics.clarity;
    if (weakestSkill === 'volume') return ex.targetMetrics.volumeControl;
    return false;
  });

  return matchingExercise || levelConfig.exercises[0];
}

/**
 * Get all badges
 */
export function getAllBadges(): Badge[] {
  return PROGRESSION_LEVELS.map((level) => level.badge);
}
