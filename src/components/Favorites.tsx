import { Heart, Music, Dumbbell } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Song, Exercise } from '../types';
import { getDifficultyColor } from '../utils/helpers';

interface FavoritesProps {
  onSelectSong: (song: Song) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export function Favorites({ onSelectSong, onSelectExercise: _onSelectExercise }: FavoritesProps) {
  const { songs, exercises, toggleSongFavorite, toggleExerciseFavorite } = useStore();

  const favoriteSongs = songs.filter((s) => s.favorite);
  const favoriteExercises = exercises.filter((e) => e.favorite);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Favorites</h2>
        <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
      </div>

      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">Quick Access to Your Best Practices</h3>
        <p className="opacity-90">
          Mark songs and exercises as favorites for easy access. Perfect for ADHD-friendly quick starts!
        </p>
      </div>

      {/* Favorite Songs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Music className="w-6 h-6 mr-2 text-primary-500" />
          Favorite Songs ({favoriteSongs.length})
        </h3>
        {favoriteSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteSongs.map((song) => (
              <div
                key={song.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold">{song.title}</h4>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                  <button
                    onClick={() => toggleSongFavorite(song.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className={`font-semibold capitalize ${getDifficultyColor(song.difficulty)}`}>
                    {song.difficulty}
                  </span>
                  <span className="text-gray-600">{song.duration}s</span>
                </div>
                <button
                  onClick={() => onSelectSong(song)}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  Practice Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No favorite songs yet</p>
            <p className="text-sm">Click the heart icon on any song to add it here</p>
          </div>
        )}
      </div>

      {/* Favorite Exercises */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Dumbbell className="w-6 h-6 mr-2 text-primary-500" />
          Favorite Exercises ({favoriteExercises.length})
        </h3>
        {favoriteExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold">{exercise.name}</h4>
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                  </div>
                  <button
                    onClick={() => toggleExerciseFavorite(exercise.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className={`font-semibold capitalize ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                  <span className="text-gray-600">{exercise.duration} min</span>
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  Type: <span className="font-semibold capitalize">{exercise.type}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No favorite exercises yet</p>
            <p className="text-sm">Mark exercises as favorites for quick access</p>
          </div>
        )}
      </div>
    </div>
  );
}
