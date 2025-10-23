import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Database, Info } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Settings() {
  const { user, updateUser } = useStore();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    updateUser({ name, email });
    alert('Settings saved!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <SettingsIcon className="w-8 h-8 text-primary-500" />
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <User className="w-6 h-6 mr-2 text-primary-500" />
          Profile
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-primary-500" />
          Notifications
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Daily Challenge Reminders</span>
            <input type="checkbox" className="w-5 h-5 text-primary-500" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Practice Streak Alerts</span>
            <input type="checkbox" className="w-5 h-5 text-primary-500" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Achievement Unlocks</span>
            <input type="checkbox" className="w-5 h-5 text-primary-500" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Focus Timer Alerts</span>
            <input type="checkbox" className="w-5 h-5 text-primary-500" defaultChecked />
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Database className="w-6 h-6 mr-2 text-primary-500" />
          Data Management
        </h3>
        <div className="space-y-3">
          <p className="text-gray-600 text-sm">
            Your data is stored locally in your browser. Use these options to manage your data.
          </p>
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2 text-primary-500" />
          About VocalCoach
        </h3>
        <div className="space-y-3 text-gray-600">
          <p>
            <strong className="text-gray-900">Version:</strong> 1.0.0
          </p>
          <p>
            VocalCoach is an AI-powered gamified vocal coaching platform designed to help busy
            professionals improve their voice through interactive practice and real-time feedback.
          </p>
          <p>
            <strong className="text-gray-900">Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Real-time pitch and vocal analysis</li>
            <li>Gamified learning with levels and badges</li>
            <li>ADHD-friendly focus timers</li>
            <li>Interactive song-based practice</li>
            <li>Engaging vocal mini-games</li>
            <li>Comprehensive progress tracking</li>
          </ul>
          <p className="text-sm pt-4 border-t border-gray-200">
            Built with React, TypeScript, and Web Audio API
          </p>
        </div>
      </div>
    </div>
  );
}
