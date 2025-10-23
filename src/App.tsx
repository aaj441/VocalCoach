import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { SongsList } from './components/SongsList';
import { SongPractice } from './components/SongPractice';
import { MiniGames } from './components/MiniGames';
import { PitchTargetGame } from './components/PitchTargetGame';
import { Progress } from './components/Progress';
import { AvatarCustomization } from './components/AvatarCustomization';
import { FocusTimer } from './components/FocusTimer';
import { Favorites } from './components/Favorites';
import { Settings } from './components/Settings';
import { useStore } from './store/useStore';
import type { Song, MiniGame, Exercise } from './types';

type ViewType =
  | 'home'
  | 'favorites'
  | 'songs'
  | 'song-practice'
  | 'games'
  | 'game-play'
  | 'progress'
  | 'avatar'
  | 'timer'
  | 'settings';

interface ViewState {
  type: ViewType;
  data?: Song | MiniGame | Exercise;
}

function App() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'home' });
  const { refreshDailyChallenges } = useStore();

  useEffect(() => {
    // Refresh daily challenges on mount
    refreshDailyChallenges();
  }, [refreshDailyChallenges]);

  const handleViewChange = (view: string, data?: unknown) => {
    setViewState({ type: view as ViewType, data: data as Song | MiniGame });
  };

  const handleSelectSong = (song: Song) => {
    setViewState({ type: 'song-practice', data: song });
  };

  const handleSelectGame = (game: MiniGame) => {
    setViewState({ type: 'game-play', data: game });
  };

  const handleSelectExercise = (exercise: Exercise) => {
    // For now, just show an alert. In a full implementation, you'd create an ExercisePractice component
    alert(`Exercise selected: ${exercise.name}\n\nInstructions:\n${exercise.instructions.join('\n')}`);
  };

  // const handleBack = () => {
  //   setViewState({ type: 'home' });
  // };

  const renderView = () => {
    switch (viewState.type) {
      case 'home':
        return <Home onNavigate={handleViewChange} />;

      case 'favorites':
        return (
          <Favorites
            onSelectSong={handleSelectSong}
            onSelectExercise={handleSelectExercise}
          />
        );

      case 'songs':
        return <SongsList onSelectSong={handleSelectSong} />;

      case 'song-practice':
        return viewState.data ? (
          <SongPractice
            song={viewState.data as Song}
            onBack={() => setViewState({ type: 'songs' })}
          />
        ) : (
          <SongsList onSelectSong={handleSelectSong} />
        );

      case 'games':
        return <MiniGames onSelectGame={handleSelectGame} />;

      case 'game-play':
        return viewState.data ? (
          <PitchTargetGame
            game={viewState.data as MiniGame}
            onBack={() => setViewState({ type: 'games' })}
          />
        ) : (
          <MiniGames onSelectGame={handleSelectGame} />
        );

      case 'progress':
        return <Progress />;

      case 'avatar':
        return <AvatarCustomization />;

      case 'timer':
        return <FocusTimer />;

      case 'settings':
        return <Settings />;

      default:
        return <Home onNavigate={handleViewChange} />;
    }
  };

  return (
    <Layout currentView={viewState.type} onViewChange={handleViewChange}>
      {renderView()}
    </Layout>
  );
}

export default App;
