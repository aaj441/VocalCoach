import React, { useState, useEffect, useRef } from 'react';
import { Target, ArrowLeft, Trophy } from 'lucide-react';
import { audioAnalyzer } from '../utils/audioAnalyzer';
import { useStore } from '../store/useStore';
import type { MiniGame } from '../types';
import { frequencyToNoteName, midiNoteToFrequency } from '../utils/helpers';

interface PitchTargetGameProps {
  game: MiniGame;
  onBack: () => void;
}

export function PitchTargetGame({ game, onBack }: PitchTargetGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [targetNote, setTargetNote] = useState(60); // Middle C
  const [currentPitch, setCurrentPitch] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);

  const { updateMiniGameScore, addXP } = useStore();
  const gameIntervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopGame();
    };
  }, []);

  const startGame = async () => {
    try {
      if (!audioAnalyzer.isInitialized()) {
        await audioAnalyzer.initialize();
      }

      setIsPlaying(true);
      setScore(0);
      setHits(0);
      setStreak(0);
      setTimeLeft(60);
      generateNewTarget();

      // Game loop
      gameIntervalRef.current = window.setInterval(() => {
        const analysis = audioAnalyzer.getAnalysis();
        if (analysis && analysis.pitch > 0) {
          setCurrentPitch(analysis.pitch);
          checkHit(analysis.pitch);
        }
      }, 100);

      // Timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Please allow microphone access to play');
    }
  };

  const generateNewTarget = () => {
    // Generate random note between C3 (48) and C5 (72)
    const newTarget = Math.floor(Math.random() * 24) + 48;
    setTargetNote(newTarget);
  };

  const checkHit = (pitch: number) => {
    const difference = Math.abs(pitch - targetNote);
    if (difference < 0.5) {
      // Direct hit!
      const points = 100 + streak * 10;
      setScore((prev) => prev + points);
      setHits((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      generateNewTarget();
    } else if (difference < 1) {
      // Close hit
      const points = 50;
      setScore((prev) => prev + points);
      setHits((prev) => prev + 1);
      setStreak(0);
      generateNewTarget();
    }
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    audioAnalyzer.stop();
  };

  const endGame = () => {
    stopGame();
    updateMiniGameScore(game.id, score);
    addXP(Math.floor(score / 10));
  };

  const pitchDifference = currentPitch - targetNote;
  const isClose = Math.abs(pitchDifference) < 2;
  const isHit = Math.abs(pitchDifference) < 0.5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </button>
        {game.bestScore > 0 && (
          <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-800">Best: {game.bestScore}</span>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">{game.icon} {game.name}</h2>
        <p className="opacity-90">Hit the target pitches as quickly as you can!</p>
      </div>

      {!isPlaying && timeLeft === 60 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-primary-500" />
          <h3 className="text-xl font-bold mb-4">How to Play</h3>
          <ul className="text-left space-y-2 mb-6 max-w-md mx-auto">
            <li className="flex items-start">
              <span className="mr-2">🎯</span>
              <span>Sing the target note displayed on screen</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⚡</span>
              <span>Hit notes accurately for bonus points</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔥</span>
              <span>Build streaks for multiplier bonuses</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⏱️</span>
              <span>Score as many points as possible in 60 seconds</span>
            </li>
          </ul>
          <button
            onClick={startGame}
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          {/* Game Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{hits}</div>
              <div className="text-sm text-gray-600">Hits</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-gray-600">Streak</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{timeLeft}s</div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
          </div>

          {/* Target Display */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">TARGET NOTE</div>
              <div className="text-6xl font-bold text-primary-600 mb-4">
                {frequencyToNoteName(midiNoteToFrequency(targetNote))}
              </div>
            </div>

            {/* Visual Pitch Indicator */}
            <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {/* Target line */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-primary-500 transform -translate-y-1/2 z-10" />

              {/* Current pitch indicator */}
              {currentPitch > 0 && (
                <div
                  className={`absolute left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 transition-all duration-100 ${
                    isHit ? 'bg-green-500 scale-150' : isClose ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{
                    top: `${50 - (pitchDifference * 5)}%`,
                  }}
                />
              )}
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">YOUR PITCH</div>
              <div className={`text-2xl font-bold ${isHit ? 'text-green-600' : isClose ? 'text-yellow-600' : 'text-gray-600'}`}>
                {currentPitch > 0 ? frequencyToNoteName(midiNoteToFrequency(currentPitch)) : '--'}
              </div>
            </div>
          </div>

          {timeLeft === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
              <div className="text-4xl font-bold text-primary-600 mb-2">{score}</div>
              <div className="text-gray-600 mb-6">Final Score</div>
              {score > game.bestScore && (
                <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <div className="font-bold text-yellow-800">New Personal Best!</div>
                </div>
              )}
              <button
                onClick={() => {
                  setTimeLeft(60);
                  startGame();
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
