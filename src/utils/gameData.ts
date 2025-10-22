import type { Challenge, Badge, Song, Exercise, MiniGame } from '../types';

export function generateDailyChallenges(): Challenge[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return [
    {
      id: `daily-practice-${Date.now()}`,
      title: '15-Minute Practice',
      description: 'Practice for 15 minutes today',
      type: 'daily',
      difficulty: 'easy',
      goal: 15,
      progress: 0,
      reward: {
        type: 'xp',
        value: 100,
        name: '100 XP',
      },
      expiresAt: tomorrow.toISOString(),
      completed: false,
    },
    {
      id: `daily-pitch-${Date.now()}`,
      title: 'Pitch Perfect',
      description: 'Achieve 80% pitch accuracy in any song',
      type: 'daily',
      difficulty: 'medium',
      goal: 80,
      progress: 0,
      reward: {
        type: 'xp',
        value: 150,
        name: '150 XP',
      },
      expiresAt: tomorrow.toISOString(),
      completed: false,
    },
    {
      id: `daily-streak-${Date.now()}`,
      title: 'Keep the Streak',
      description: 'Practice today to maintain your streak',
      type: 'daily',
      difficulty: 'easy',
      goal: 1,
      progress: 0,
      reward: {
        type: 'xp',
        value: 50,
        name: '50 XP',
      },
      expiresAt: tomorrow.toISOString(),
      completed: false,
    },
  ];
}

export function generateInitialBadges(): Badge[] {
  return [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first practice session',
      icon: '🎤',
      rarity: 'common',
      earnedAt: null,
    },
    {
      id: 'pitch-master',
      name: 'Pitch Master',
      description: 'Achieve 90% pitch accuracy',
      icon: '🎯',
      rarity: 'rare',
      earnedAt: null,
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day practice streak',
      icon: '🔥',
      rarity: 'rare',
      earnedAt: null,
    },
    {
      id: 'vocal-virtuoso',
      name: 'Vocal Virtuoso',
      description: 'Reach level 10',
      icon: '⭐',
      rarity: 'epic',
      earnedAt: null,
    },
    {
      id: 'song-champion',
      name: 'Song Champion',
      description: 'Complete 50 songs',
      icon: '🏆',
      rarity: 'epic',
      earnedAt: null,
    },
    {
      id: 'legendary-voice',
      name: 'Legendary Voice',
      description: 'Achieve perfect scores on 10 songs',
      icon: '👑',
      rarity: 'legendary',
      earnedAt: null,
    },
  ];
}

export function generateInitialSongs(): Song[] {
  return [
    {
      id: 'song-1',
      title: 'Happy Birthday',
      artist: 'Traditional',
      difficulty: 'beginner',
      duration: 30,
      targetSkills: ['pitch', 'clarity'],
      pitchData: [262, 262, 294, 262, 349, 330], // C4, C4, D4, C4, F4, E4
      lyrics: [
        { startTime: 0, endTime: 2, text: 'Happy birthday to you', targetPitch: 262 },
        { startTime: 2, endTime: 4, text: 'Happy birthday to you', targetPitch: 262 },
        { startTime: 4, endTime: 6, text: 'Happy birthday dear friend', targetPitch: 294 },
        { startTime: 6, endTime: 8, text: 'Happy birthday to you', targetPitch: 262 },
      ],
      favorite: false,
    },
    {
      id: 'song-2',
      title: 'Scale Practice - Major',
      artist: 'Exercise',
      difficulty: 'beginner',
      duration: 45,
      targetSkills: ['pitch', 'range'],
      pitchData: [262, 294, 330, 349, 392, 440, 494, 523], // C major scale
      lyrics: [
        { startTime: 0, endTime: 1, text: 'Do', targetPitch: 262 },
        { startTime: 1, endTime: 2, text: 'Re', targetPitch: 294 },
        { startTime: 2, endTime: 3, text: 'Mi', targetPitch: 330 },
        { startTime: 3, endTime: 4, text: 'Fa', targetPitch: 349 },
        { startTime: 4, endTime: 5, text: 'Sol', targetPitch: 392 },
        { startTime: 5, endTime: 6, text: 'La', targetPitch: 440 },
        { startTime: 6, endTime: 7, text: 'Ti', targetPitch: 494 },
        { startTime: 7, endTime: 8, text: 'Do', targetPitch: 523 },
      ],
      favorite: false,
    },
    {
      id: 'song-3',
      title: 'Power Voice - Ah',
      artist: 'Exercise',
      difficulty: 'intermediate',
      duration: 60,
      targetSkills: ['resonance', 'volume'],
      pitchData: [330, 330, 330, 330],
      lyrics: [
        { startTime: 0, endTime: 15, text: 'Ahhhhh...', targetPitch: 330 },
        { startTime: 15, endTime: 30, text: 'Ahhhhh...', targetPitch: 330 },
        { startTime: 30, endTime: 45, text: 'Ahhhhh...', targetPitch: 330 },
        { startTime: 45, endTime: 60, text: 'Ahhhhh...', targetPitch: 330 },
      ],
      favorite: false,
    },
    {
      id: 'song-4',
      title: 'Clarity Exercise - Tongue Twisters',
      artist: 'Exercise',
      difficulty: 'intermediate',
      duration: 40,
      targetSkills: ['clarity', 'articulation'],
      pitchData: [294, 294, 294],
      lyrics: [
        { startTime: 0, endTime: 5, text: 'Peter Piper picked a peck', targetPitch: 294 },
        { startTime: 5, endTime: 10, text: 'Red leather yellow leather', targetPitch: 294 },
        { startTime: 10, endTime: 15, text: 'Unique New York', targetPitch: 294 },
      ],
      favorite: false,
    },
  ];
}

export function generateInitialExercises(): Exercise[] {
  return [
    {
      id: 'exercise-1',
      name: 'Breath Control',
      description: 'Master your breathing for vocal power',
      type: 'volume',
      difficulty: 'beginner',
      duration: 5,
      instructions: [
        'Stand up straight with shoulders relaxed',
        'Breathe in deeply through your nose for 4 counts',
        'Hold for 4 counts',
        'Exhale slowly through your mouth for 8 counts',
        'Repeat 5 times',
      ],
      favorite: false,
    },
    {
      id: 'exercise-2',
      name: 'Lip Trills',
      description: 'Warm up your voice with gentle vibrations',
      type: 'resonance',
      difficulty: 'beginner',
      duration: 3,
      instructions: [
        'Relax your lips and let them vibrate together',
        'Make a "brrr" sound while sliding up and down your range',
        'Keep the sound steady and continuous',
        'Repeat for 3 minutes',
      ],
      favorite: false,
    },
    {
      id: 'exercise-3',
      name: 'Sirens',
      description: 'Expand your vocal range smoothly',
      type: 'pitch',
      difficulty: 'intermediate',
      duration: 5,
      instructions: [
        'Start at your lowest comfortable note',
        'Glide smoothly to your highest note on "oo" sound',
        'Come back down smoothly',
        'Keep the sound connected throughout',
        'Repeat 5 times',
      ],
      favorite: false,
    },
    {
      id: 'exercise-4',
      name: 'Articulation Drills',
      description: 'Improve clarity and diction',
      type: 'clarity',
      difficulty: 'intermediate',
      duration: 5,
      instructions: [
        'Practice consonant sounds: P, T, K, B, D, G',
        'Say each clearly and precisely',
        'Combine with vowels: Pa, Ta, Ka, Ba, Da, Ga',
        'Speed up gradually while maintaining clarity',
        'Repeat for 5 minutes',
      ],
      favorite: false,
    },
  ];
}

export function generateInitialMiniGames(): MiniGame[] {
  return [
    {
      id: 'game-1',
      name: 'Pitch Target',
      description: 'Hit the target pitches as they appear',
      type: 'pitch-target',
      difficulty: 'easy',
      bestScore: 0,
      icon: '🎯',
    },
    {
      id: 'game-2',
      name: 'Tongue Twister Rush',
      description: 'Say tongue twisters clearly and quickly',
      type: 'articulation',
      difficulty: 'medium',
      bestScore: 0,
      icon: '👅',
    },
    {
      id: 'game-3',
      name: 'Volume Roller Coaster',
      description: 'Control your volume to match the pattern',
      type: 'volume-control',
      difficulty: 'medium',
      bestScore: 0,
      icon: '🎢',
    },
    {
      id: 'game-4',
      name: 'Rhythm Master',
      description: 'Match the rhythm patterns with your voice',
      type: 'rhythm',
      difficulty: 'hard',
      bestScore: 0,
      icon: '🥁',
    },
  ];
}
