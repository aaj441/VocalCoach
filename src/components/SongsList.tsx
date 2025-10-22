import React, { useState } from 'react';
import { Music, Heart, Search, Filter } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Song } from '../types';
import { getDifficultyColor } from '../utils/helpers';

interface SongsListProps {
  onSelectSong: (song: Song) => void;
}

export function SongsList({ onSelectSong }: SongsListProps) {
  const { songs, toggleSongFavorite } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === 'all' || song.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Song Library</h2>
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-primary-500" />
          <span className="text-gray-600">{songs.length} songs</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:scale-102"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{song.title}</h3>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSongFavorite(song.id);
                  }}
                  className={`p-2 rounded-full ${
                    song.favorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={song.favorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Difficulty</span>
                  <span className={`font-semibold capitalize ${getDifficultyColor(song.difficulty)}`}>
                    {song.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{song.duration}s</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-2">Target Skills</div>
                <div className="flex flex-wrap gap-1">
                  {song.targetSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectSong(song)}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Practice Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No songs found</p>
        </div>
      )}
    </div>
  );
}
