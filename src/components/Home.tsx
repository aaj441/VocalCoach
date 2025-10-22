import React from 'react';
import { Trophy, Target, TrendingUp, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTime, getDifficultyColor } from '../utils/helpers';

interface HomeProps {
  onNavigate: (view: string, data?: unknown) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { user, challenges, vocalStats, sessions } = useStore();

  const dailyChallenges = challenges.filter((c) => c.type === 'daily' && !c.completed);
  const recentSession = sessions[0];

  const stats = [
    { label: 'Pitch', value: vocalStats.pitchAccuracy, color: 'bg-blue-500' },
    { label: 'Clarity', value: vocalStats.clarity, color: 'bg-green-500' },
    { label: 'Resonance', value: vocalStats.resonance, color: 'bg-purple-500' },
    { label: 'Volume', value: vocalStats.volumeControl, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
        <p className="text-lg opacity-90">Ready to level up your voice today?</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <div className="text-sm opacity-90">Total XP</div>
            <div className="text-2xl font-bold">{user.totalPoints.toLocaleString()}</div>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <div className="text-sm opacity-90">Sessions</div>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions - ADHD-friendly: Big, clear action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('songs')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎵 Practice Songs</h3>
              <p className="text-blue-100">Sing along and improve</p>
            </div>
            <Zap className="w-12 h-12 opacity-80" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('games')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎮 Mini-Games</h3>
              <p className="text-purple-100">Fun vocal challenges</p>
            </div>
            <Trophy className="w-12 h-12 opacity-80" />
          </div>
        </button>
      </div>

      {/* Daily Challenges - Gamification */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Target className="w-6 h-6 mr-2 text-primary-500" />
            Daily Challenges
          </h3>
          <span className="text-sm text-gray-500">Refreshes daily</span>
        </div>
        <div className="space-y-3">
          {dailyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{challenge.progress}/{challenge.goal}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-primary-600 font-medium">
                  🎁 Reward: {challenge.reward.name}
                </div>
              </div>
            </div>
          ))}
          {dailyChallenges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>All daily challenges completed!</p>
              <p className="text-sm">Come back tomorrow for new challenges</p>
            </div>
          )}
        </div>
      </div>

      {/* Vocal Stats Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary-500" />
          Your Vocal Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-gray-800">{Math.round(stat.value)}%</div>
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color} transition-all duration-300`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Session */}
      {recentSession && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Last Session</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Type</div>
              <div className="font-semibold capitalize">{recentSession.type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-semibold">{formatTime(recentSession.duration)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Score</div>
              <div className="font-semibold text-primary-600">{recentSession.score}/100</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Date</div>
              <div className="font-semibold">{new Date(recentSession.date).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
