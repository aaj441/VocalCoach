// Core Types for Vocal Coach App

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: AvatarConfig;
  level: number;
  xp: number;
  totalPoints: number;
  streak: number;
  lastPracticeDate: string | null;
}

export interface AvatarConfig {
  skin: string;
  hair: string;
  outfit: string;
  accessory: string;
  unlocked: string[];
}

export interface VocalStats {
  pitchAccuracy: number;
  resonance: number;
  clarity: number;
  volumeControl: number;
  range: {
    lowest: number;
    highest: number;
  };
}

export interface PracticeSession {
  id: string;
  date: string;
  duration: number;
  type: 'song' | 'exercise' | 'challenge' | 'mini-game';
  score: number;
  stats: VocalStats;
  improvements: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  difficulty: 'easy' | 'medium' | 'hard';
  goal: number;
  progress: number;
  reward: Reward;
  expiresAt: string | null;
  completed: boolean;
}

export interface Reward {
  type: 'xp' | 'badge' | 'avatar-item' | 'points';
  value: number | string;
  name: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string | null;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  targetSkills: string[];
  pitchData: number[];
  lyrics: LyricLine[];
  audioUrl?: string;
  favorite: boolean;
}

export interface LyricLine {
  startTime: number;
  endTime: number;
  text: string;
  targetPitch: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: 'pitch' | 'resonance' | 'clarity' | 'volume';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  instructions: string[];
  favorite: boolean;
}

export interface MiniGame {
  id: string;
  name: string;
  description: string;
  type: 'pitch-target' | 'articulation' | 'volume-control' | 'rhythm';
  difficulty: 'easy' | 'medium' | 'hard';
  bestScore: number;
  icon: string;
}

export interface FocusTimer {
  duration: number;
  breakDuration: number;
  sessionsCompleted: number;
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'all-time';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: AvatarConfig;
  score: number;
  level: number;
}

export interface AnalysisResult {
  timestamp: number;
  pitch: number;
  frequency: number;
  volume: number;
  clarity: number;
  resonance: number;
  isOnPitch: boolean;
  targetPitch?: number;
}

export interface AppState {
  user: User;
  vocalStats: VocalStats;
  sessions: PracticeSession[];
  challenges: Challenge[];
  badges: Badge[];
  songs: Song[];
  exercises: Exercise[];
  miniGames: MiniGame[];
  focusTimer: FocusTimer;
  leaderboard: Leaderboard;
}
