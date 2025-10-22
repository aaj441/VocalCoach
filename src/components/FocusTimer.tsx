import React, { useEffect } from 'react';
import { Timer, Play, Pause, StopCircle, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTime } from '../utils/helpers';

export function FocusTimer() {
  const {
    focusTimer,
    startFocusTimer,
    pauseFocusTimer,
    resumeFocusTimer,
    stopFocusTimer,
    tickFocusTimer,
  } = useStore();

  useEffect(() => {
    let interval: number | null = null;

    if (focusTimer.isActive && !focusTimer.isPaused) {
      interval = window.setInterval(() => {
        tickFocusTimer();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isActive, focusTimer.isPaused, tickFocusTimer]);

  const handleStart = () => {
    const duration = 25 * 60; // 25 minutes
    const breakDuration = 5 * 60; // 5 minutes
    startFocusTimer(duration, breakDuration);
  };

  const progress = ((focusTimer.duration - focusTimer.timeRemaining) / focusTimer.duration) * 100;
  const isBreakTime = focusTimer.sessionsCompleted > 0 && focusTimer.timeRemaining <= focusTimer.breakDuration;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Focus Timer</h2>
        <Timer className="w-8 h-8 text-primary-500" />
      </div>

      <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">ADHD-Friendly Practice Timer</h3>
        <p className="opacity-90">
          Use the Pomodoro technique: 25 minutes of focused practice followed by a 5-minute break.
          This helps maintain concentration and prevents burnout!
        </p>
      </div>

      {/* Timer Display */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-600 mb-2">
            {isBreakTime ? 'BREAK TIME' : 'FOCUS TIME'}
          </div>
          <div className="relative inline-block">
            {/* Circular Progress */}
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke={isBreakTime ? '#10b981' : '#3b82f6'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className="transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-6xl font-bold text-gray-800">
                  {formatTime(focusTimer.timeRemaining)}
                </div>
                {focusTimer.isActive && !focusTimer.isPaused && (
                  <div className="text-sm text-gray-500 mt-2 text-center animate-pulse">
                    {isBreakTime ? 'Relax...' : 'Stay focused...'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{focusTimer.sessionsCompleted}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatTime(focusTimer.duration)}</div>
            <div className="text-sm text-gray-600">Focus Time</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{formatTime(focusTimer.breakDuration)}</div>
            <div className="text-sm text-gray-600">Break Time</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!focusTimer.isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Play className="w-6 h-6" />
              <span>Start Session</span>
            </button>
          ) : (
            <>
              {focusTimer.isPaused ? (
                <button
                  onClick={resumeFocusTimer}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="w-6 h-6" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={pauseFocusTimer}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Pause className="w-6 h-6" />
                  <span>Pause</span>
                </button>
              )}
              <button
                onClick={stopFocusTimer}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <StopCircle className="w-6 h-6" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-500" />
          Focus Timer Tips
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>Set a specific goal for each 25-minute session</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>Eliminate distractions before starting</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>Take your breaks seriously - stretch, hydrate, relax</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>After 4 sessions, take a longer 15-30 minute break</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>Track your progress and celebrate completed sessions</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
