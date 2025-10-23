
import { TrendingUp, Award, Calendar, Share2, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDate, shareProgress, downloadProgressReport } from '../utils/helpers';

export function Progress() {
  const { user, vocalStats, sessions, badges } = useStore();

  const earnedBadges = badges.filter((b) => b.earnedAt !== null);
  const recentSessions = sessions.slice(0, 10);

  // Calculate progress over time
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const sessionsPerDay = last7Days.map((date) => {
    const count = sessions.filter((s) => s.date.startsWith(date)).length;
    return { date, count };
  });

  const handleShare = () => {
    const text = `I'm level ${user.level} on VocalCoach! 🎤\n` +
      `${user.streak} day streak 🔥\n` +
      `${earnedBadges.length} badges earned 🏆\n` +
      `Check out my vocal progress!`;
    shareProgress(text);
  };

  const handleDownload = () => {
    const report = {
      user: {
        name: user.name,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
      },
      stats: vocalStats,
      sessions: recentSessions,
      badges: earnedBadges,
      generatedAt: new Date().toISOString(),
    };
    downloadProgressReport(report, `vocal-coach-progress-${Date.now()}.json`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-90 mb-1">Level</div>
          <div className="text-4xl font-bold mb-2">{user.level}</div>
          <div className="text-sm opacity-75">{user.xp.toLocaleString()} XP</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-90 mb-1">Streak</div>
          <div className="text-4xl font-bold mb-2">{user.streak}</div>
          <div className="text-sm opacity-75">days in a row 🔥</div>
        </div>

        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-90 mb-1">Sessions</div>
          <div className="text-4xl font-bold mb-2">{sessions.length}</div>
          <div className="text-sm opacity-75">total practices</div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-90 mb-1">Badges</div>
          <div className="text-4xl font-bold mb-2">{earnedBadges.length}</div>
          <div className="text-sm opacity-75">of {badges.length} earned</div>
        </div>
      </div>

      {/* Vocal Skills Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary-500" />
          Vocal Skills
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Pitch Accuracy</span>
              <span className="font-bold text-primary-600">{Math.round(vocalStats.pitchAccuracy)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                style={{ width: `${vocalStats.pitchAccuracy}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Clarity</span>
              <span className="font-bold text-accent-600">{Math.round(vocalStats.clarity)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-accent-600 transition-all duration-500"
                style={{ width: `${vocalStats.clarity}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Resonance</span>
              <span className="font-bold text-teal-600">{Math.round(vocalStats.resonance)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500"
                style={{ width: `${vocalStats.resonance}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Volume Control</span>
              <span className="font-bold text-orange-600">{Math.round(vocalStats.volumeControl)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                style={{ width: `${vocalStats.volumeControl}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-primary-500" />
          Last 7 Days Activity
        </h3>
        <div className="flex items-end justify-between h-40 space-x-2">
          {sessionsPerDay.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex-1 flex items-end w-full">
                <div
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
                  style={{ height: `${Math.max(day.count * 20, 5)}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-xs font-bold text-primary-600">{day.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-primary-500" />
          Badges ({earnedBadges.length}/{badges.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`text-center p-4 rounded-lg border-2 transition-all ${
                badge.earnedAt
                  ? 'border-yellow-400 bg-yellow-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="text-sm font-bold">{badge.name}</div>
              <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
              {badge.earnedAt && (
                <div className="text-xs text-green-600 mt-2">
                  ✓ {formatDate(badge.earnedAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {session.type === 'song' ? '🎵' : session.type === 'mini-game' ? '🎮' : '🎯'}
                  </span>
                  <div>
                    <div className="font-semibold capitalize">{session.type}</div>
                    <div className="text-sm text-gray-600">{formatDate(session.date)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{session.score}</div>
                  <div className="text-xs text-gray-600">score</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <div className="text-gray-600">Pitch</div>
                  <div className="font-semibold">{Math.round(session.stats.pitchAccuracy)}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Clarity</div>
                  <div className="font-semibold">{Math.round(session.stats.clarity)}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Resonance</div>
                  <div className="font-semibold">{Math.round(session.stats.resonance)}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Volume</div>
                  <div className="font-semibold">{Math.round(session.stats.volumeControl)}%</div>
                </div>
              </div>
            </div>
          ))}
          {recentSessions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No practice sessions yet</p>
              <p className="text-sm">Start practicing to see your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
