import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, User, PracticeSession, VocalStats } from '../types';
import { generateDailyChallenges, generateInitialBadges, generateInitialSongs, generateInitialExercises, generateInitialMiniGames } from '../utils/gameData';

interface StoreState extends AppState {
  // User actions
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  updateAvatar: (updates: Partial<User['avatar']>) => void;
  incrementStreak: () => void;

  // Stats actions
  updateVocalStats: (updates: Partial<VocalStats>) => void;

  // Session actions
  addSession: (session: PracticeSession) => void;

  // Challenge actions
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  refreshDailyChallenges: () => void;

  // Badge actions
  unlockBadge: (badgeId: string) => void;

  // Favorites actions
  toggleSongFavorite: (songId: string) => void;
  toggleExerciseFavorite: (exerciseId: string) => void;

  // Mini-game actions
  updateMiniGameScore: (gameId: string, score: number) => void;

  // Focus timer actions
  startFocusTimer: (duration: number, breakDuration: number) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  stopFocusTimer: () => void;
  tickFocusTimer: () => void;
}

const initialUser: User = {
  id: '1',
  name: 'Vocal Champion',
  email: 'user@example.com',
  avatar: {
    skin: 'light',
    hair: 'short-brown',
    outfit: 'casual',
    accessory: 'none',
    unlocked: ['light', 'short-brown', 'casual', 'none'],
  },
  level: 1,
  xp: 0,
  totalPoints: 0,
  streak: 0,
  lastPracticeDate: null,
};

const initialVocalStats: VocalStats = {
  pitchAccuracy: 50,
  resonance: 50,
  clarity: 50,
  volumeControl: 50,
  range: {
    lowest: 196, // G3
    highest: 392, // G4
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: initialUser,
      vocalStats: initialVocalStats,
      sessions: [],
      challenges: generateDailyChallenges(),
      badges: generateInitialBadges(),
      songs: generateInitialSongs(),
      exercises: generateInitialExercises(),
      miniGames: generateInitialMiniGames(),
      focusTimer: {
        duration: 25 * 60,
        breakDuration: 5 * 60,
        sessionsCompleted: 0,
        isActive: false,
        isPaused: false,
        timeRemaining: 25 * 60,
      },
      leaderboard: {
        period: 'weekly',
        entries: [],
      },

      // User actions
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.user.xp + amount;
          const xpPerLevel = 1000;
          const newLevel = Math.floor(newXP / xpPerLevel) + 1;
          // const leveledUp = newLevel > state.user.level;

          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
              totalPoints: state.user.totalPoints + amount,
            },
            // Show level up notification (handled by UI)
          };
        }),

      updateAvatar: (updates) =>
        set((state) => ({
          user: {
            ...state.user,
            avatar: { ...state.user.avatar, ...updates },
          },
        })),

      incrementStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const lastPractice = state.user.lastPracticeDate
            ? new Date(state.user.lastPracticeDate).toDateString()
            : null;

          if (lastPractice === today) {
            return state;
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = lastPractice === yesterday.toDateString();

          return {
            user: {
              ...state.user,
              streak: wasYesterday ? state.user.streak + 1 : 1,
              lastPracticeDate: today,
            },
          };
        }),

      // Stats actions
      updateVocalStats: (updates) =>
        set((state) => ({
          vocalStats: { ...state.vocalStats, ...updates },
        })),

      // Session actions
      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, 100), // Keep last 100 sessions
        })),

      // Challenge actions
      updateChallengeProgress: (challengeId, progress) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === challengeId ? { ...c, progress: Math.min(progress, c.goal) } : c
          ),
        })),

      completeChallenge: (challengeId) =>
        set((state) => {
          const challenge = state.challenges.find((c) => c.id === challengeId);
          if (!challenge || challenge.completed) return state;

          // Award XP
          const xpReward = challenge.reward.type === 'xp' ? challenge.reward.value as number : 0;
          get().addXP(xpReward);

          return {
            challenges: state.challenges.map((c) =>
              c.id === challengeId ? { ...c, completed: true, progress: c.goal } : c
            ),
          };
        }),

      refreshDailyChallenges: () =>
        set((state) => {
          const today = new Date().toDateString();
          const needsRefresh = state.challenges.some(
            (c) => c.type === 'daily' && c.expiresAt && new Date(c.expiresAt).toDateString() !== today
          );

          if (!needsRefresh) return state;

          return {
            challenges: [
              ...state.challenges.filter((c) => c.type !== 'daily'),
              ...generateDailyChallenges(),
            ],
          };
        }),

      // Badge actions
      unlockBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId && !b.earnedAt
              ? { ...b, earnedAt: new Date().toISOString() }
              : b
          ),
        })),

      // Favorites actions
      toggleSongFavorite: (songId) =>
        set((state) => ({
          songs: state.songs.map((s) =>
            s.id === songId ? { ...s, favorite: !s.favorite } : s
          ),
        })),

      toggleExerciseFavorite: (exerciseId) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === exerciseId ? { ...e, favorite: !e.favorite } : e
          ),
        })),

      // Mini-game actions
      updateMiniGameScore: (gameId, score) =>
        set((state) => ({
          miniGames: state.miniGames.map((g) =>
            g.id === gameId ? { ...g, bestScore: Math.max(g.bestScore, score) } : g
          ),
        })),

      // Focus timer actions
      startFocusTimer: (duration, breakDuration) =>
        set({
          focusTimer: {
            duration,
            breakDuration,
            sessionsCompleted: 0,
            isActive: true,
            isPaused: false,
            timeRemaining: duration,
          },
        }),

      pauseFocusTimer: () =>
        set((state) => ({
          focusTimer: { ...state.focusTimer, isPaused: true },
        })),

      resumeFocusTimer: () =>
        set((state) => ({
          focusTimer: { ...state.focusTimer, isPaused: false },
        })),

      stopFocusTimer: () =>
        set((state) => ({
          focusTimer: {
            ...state.focusTimer,
            isActive: false,
            isPaused: false,
            timeRemaining: state.focusTimer.duration,
          },
        })),

      tickFocusTimer: () =>
        set((state) => {
          if (!state.focusTimer.isActive || state.focusTimer.isPaused) {
            return state;
          }

          const newTimeRemaining = state.focusTimer.timeRemaining - 1;

          if (newTimeRemaining <= 0) {
            // Session completed
            return {
              focusTimer: {
                ...state.focusTimer,
                sessionsCompleted: state.focusTimer.sessionsCompleted + 1,
                timeRemaining: state.focusTimer.breakDuration,
                // Auto-pause after completion
                isPaused: true,
              },
            };
          }

          return {
            focusTimer: {
              ...state.focusTimer,
              timeRemaining: newTimeRemaining,
            },
          };
        }),
    }),
    {
      name: 'vocal-coach-storage',
    }
  )
);
