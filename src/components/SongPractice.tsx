import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, StopCircle, Heart, ArrowLeft, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { audioAnalyzer } from '../utils/audioAnalyzer';
import type { Song, AnalysisResult, PracticeSession } from '../types';
import { calculateScore, frequencyToNoteName } from '../utils/helpers';

interface SongPracticeProps {
  song: Song;
  onBack: () => void;
}

export function SongPractice({ song, onBack }: SongPracticeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sessionStats, setSessionStats] = useState({
    pitchAccuracy: 0,
    resonance: 0,
    clarity: 0,
    volumeControl: 0,
    pitchHits: 0,
    totalNotes: 0,
  });
  const timerRef = useRef<number | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const { toggleSongFavorite, addSession, addXP, incrementStreak, updateVocalStats } = useStore();

  const currentLyric = song.lyrics.find(
    (lyric) => currentTime >= lyric.startTime && currentTime <= lyric.endTime
  );

  useEffect(() => {
    return () => {
      stopPractice();
    };
  }, []);

  const startPractice = async () => {
    try {
      if (!audioAnalyzer.isInitialized()) {
        await audioAnalyzer.initialize();
      }

      setIsPlaying(true);
      startTimeRef.current = Date.now();

      // Start timer
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= song.duration) {
            completePractice();
            return song.duration;
          }
          return next;
        });
      }, 1000);

      // Start analysis
      analysisIntervalRef.current = window.setInterval(() => {
        const result = audioAnalyzer.getAnalysis(currentLyric?.targetPitch);
        if (result) {
          setAnalysis(result);
          updateSessionStats(result);
        }
      }, 100);
    } catch (error) {
      console.error('Failed to start practice:', error);
      alert('Please allow microphone access to practice');
    }
  };

  const pausePractice = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
  };

  const stopPractice = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    audioAnalyzer.stop();
    setCurrentTime(0);
    setAnalysis(null);
  };

  const completePractice = () => {
    pausePractice();

    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const score = calculateScore(sessionStats);

    const session: PracticeSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      duration,
      type: 'song',
      score,
      stats: {
        pitchAccuracy: sessionStats.pitchAccuracy,
        resonance: sessionStats.resonance,
        clarity: sessionStats.clarity,
        volumeControl: sessionStats.volumeControl,
        range: { lowest: 0, highest: 0 },
      },
      improvements: [],
    };

    addSession(session);
    addXP(score);
    incrementStreak();

    // Update overall stats
    updateVocalStats({
      pitchAccuracy: (sessionStats.pitchAccuracy + session.stats.pitchAccuracy) / 2,
      resonance: (sessionStats.resonance + session.stats.resonance) / 2,
      clarity: (sessionStats.clarity + session.stats.clarity) / 2,
      volumeControl: (sessionStats.volumeControl + session.stats.volumeControl) / 2,
    });

    audioAnalyzer.stop();
  };

  const updateSessionStats = (result: AnalysisResult) => {
    setSessionStats((prev) => {
      const newTotalNotes = prev.totalNotes + 1;
      const newPitchHits = result.isOnPitch ? prev.pitchHits + 1 : prev.pitchHits;
      const newPitchAccuracy = (newPitchHits / newTotalNotes) * 100;

      return {
        pitchAccuracy: newPitchAccuracy,
        resonance: (prev.resonance * prev.totalNotes + result.resonance) / newTotalNotes,
        clarity: (prev.clarity * prev.totalNotes + result.clarity) / newTotalNotes,
        volumeControl: (prev.volumeControl * prev.totalNotes + result.volume) / newTotalNotes,
        pitchHits: newPitchHits,
        totalNotes: newTotalNotes,
      };
    });
  };

  const progressPercentage = (currentTime / song.duration) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Songs</span>
        </button>
        <button
          onClick={() => toggleSongFavorite(song.id)}
          className={`p-2 rounded-full ${
            song.favorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className="w-6 h-6" fill={song.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Song Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2">{song.title}</h2>
        <p className="text-gray-600">{song.artist}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {song.targetSkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Real-time Analysis Display */}
      {isPlaying && analysis && (
        <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4">🎯 Real-time Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-sm opacity-90">Pitch</div>
              <div className="text-xl font-bold">{frequencyToNoteName(analysis.frequency)}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-sm opacity-90">Volume</div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <div className="text-xl font-bold">{Math.round(analysis.volume)}%</div>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-sm opacity-90">Clarity</div>
              <div className="text-xl font-bold">{Math.round(analysis.clarity)}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-sm opacity-90">Resonance</div>
              <div className="text-xl font-bold">{Math.round(analysis.resonance)}%</div>
            </div>
          </div>
          {currentLyric && (
            <div className="mt-4 text-center">
              <div className="text-sm opacity-75">Target: {frequencyToNoteName(currentLyric.targetPitch)}</div>
              <div className={`text-2xl font-bold ${analysis.isOnPitch ? 'text-green-300' : 'text-white'}`}>
                {analysis.isOnPitch ? '✓ On Pitch!' : '○ Keep trying'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lyrics Display */}
      <div className="bg-white rounded-xl shadow-lg p-8 min-h-[200px] flex items-center justify-center">
        {currentLyric ? (
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-4 animate-pulse">
              {currentLyric.text}
            </div>
            <div className="text-sm text-gray-500">
              Target Note: {frequencyToNoteName(currentLyric.targetPitch)}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-lg">
            {isPlaying ? 'Listen...' : 'Press Play to start'}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center space-x-4">
          {!isPlaying ? (
            <button
              onClick={startPractice}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Play className="w-6 h-6" />
              <span>Start Practice</span>
            </button>
          ) : (
            <>
              <button
                onClick={pausePractice}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Pause className="w-6 h-6" />
                <span>Pause</span>
              </button>
              <button
                onClick={stopPractice}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <StopCircle className="w-6 h-6" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Session Stats */}
      {sessionStats.totalNotes > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">Session Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Pitch Accuracy</div>
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(sessionStats.pitchAccuracy)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Clarity</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(sessionStats.clarity)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Resonance</div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(sessionStats.resonance)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Volume Control</div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(sessionStats.volumeControl)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
