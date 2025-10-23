
import { Home, Music, Gamepad2, TrendingUp, Star, Settings, Heart, Timer } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getXPProgress } from '../utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user } = useStore();
  const xpProgress = getXPProgress(user.xp, user.level);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'songs', icon: Music, label: 'Songs' },
    { id: 'games', icon: Gamepad2, label: 'Games' },
    { id: 'progress', icon: TrendingUp, label: 'Progress' },
    { id: 'avatar', icon: Star, label: 'Avatar' },
    { id: 'timer', icon: Timer, label: 'Focus' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
      {/* Top Bar - ADHD-friendly: Clear, visible, always accessible */}
      <header className="bg-white shadow-md border-b-4 border-primary-500">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                🎤 VocalCoach
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              {/* Streak Counter - Gamification */}
              <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-orange-600">{user.streak} day streak</span>
              </div>

              {/* Level Progress */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs text-gray-600">Level {user.level}</div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{Math.round(xpProgress)}% to next level</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation - ADHD-friendly: Large, clear buttons with icons */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 min-w-[80px] ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
