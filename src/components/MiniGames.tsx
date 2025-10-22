import React from 'react';
import { Gamepad2, Trophy, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { MiniGame } from '../types';
import { getDifficultyColor } from '../utils/helpers';

interface MiniGamesProps {
  onSelectGame: (game: MiniGame) => void;
}

export function MiniGames({ onSelectGame }: MiniGamesProps) {
  const { miniGames } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vocal Mini-Games</h2>
        <Gamepad2 className="w-8 h-8 text-primary-500" />
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">🎮 Level Up Through Play!</h3>
        <p className="opacity-90">
          Practice your vocal skills through fun, engaging mini-games. Each game targets specific
          vocal abilities and rewards you with XP and badges!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {miniGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
          >
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-6 text-white">
              <div className="text-6xl mb-4">{game.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
              <p className="opacity-90">{game.description}</p>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Difficulty</span>
                  <span className={`font-semibold capitalize ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="font-semibold capitalize">{game.type.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Best Score</span>
                  <span className="font-bold text-primary-600 text-lg">
                    {game.bestScore > 0 ? game.bestScore : '--'}
                  </span>
                </div>
              </div>

              {game.bestScore > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Personal Best: {game.bestScore}
                  </span>
                </div>
              )}

              <button
                onClick={() => onSelectGame(game)}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
