# VocalCoach - AI-Powered Gamified Vocal Training Platform

![VocalCoach](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6)

An immersive, ADHD-friendly gamified vocal coaching app that transforms voice improvement into an engaging, habit-forming experience. Perfect for busy professionals who want to enhance their vocal skills through interactive practice, real-time feedback, and fun mini-games.

## Features

### Core Vocal Training
- **Real-time Audio Analysis**: Advanced pitch detection, resonance, clarity, and volume analysis using Web Audio API
- **Interactive Song Practice**: Sing along to songs with live pitch tracking and visual feedback
- **Vocal Exercises**: Structured breathing, pitch, resonance, and clarity exercises
- **Mini-Games**: Engaging vocal challenges including pitch targets, articulation drills, and volume control

### Gamification System
- **Levels & XP**: Progress through levels by practicing and completing challenges
- **Daily Challenges**: Fresh challenges every day with XP rewards
- **Badges & Achievements**: Unlock badges for milestones and accomplishments
- **Avatar Customization**: Unlock new avatar items by leveling up
- **Streak Tracking**: Build and maintain practice streaks for consistency

### ADHD-Friendly Design
- **Focus Timer**: Pomodoro-style timer (25min focus / 5min break) for structured practice
- **Quick Access**: Favorites screen for immediate access to preferred content
- **Clear Visual Feedback**: Large, colorful UI elements with intuitive navigation
- **Progress Tracking**: Visual charts showing improvement over time
- **Bite-sized Sessions**: Short, focused practice sessions to maintain engagement

### Social & Sharing
- **Share Progress**: Share achievements and progress on social media
- **Export Data**: Download comprehensive progress reports
- **Leaderboards**: Compare scores with friends (coming soon)

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Audio Processing**: Web Audio API
- **Pitch Detection**: Autocorrelation algorithm
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aaj441/VocalCoach.git
   cd VocalCoach
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage Guide

### Getting Started

1. **Allow Microphone Access**: The app needs microphone access for vocal analysis
2. **Create Your Profile**: Customize your name and avatar
3. **Start Practicing**: Choose from songs, exercises, or mini-games

### Practice Modes

#### Song Practice
- Select a song from the library
- Sing along with real-time pitch guidance
- See live feedback on pitch accuracy, clarity, resonance, and volume
- Complete songs to earn XP and improve stats

#### Mini-Games
- **Pitch Target**: Hit target pitches quickly for high scores
- **Articulation**: Practice tongue twisters and clarity
- **Volume Control**: Master dynamic control
- **Rhythm Master**: Match vocal rhythm patterns

#### Focus Timer
- Set 25-minute focused practice sessions
- Automatic break reminders
- Track completed sessions
- ADHD-friendly structured practice

### Progress Tracking

View your improvement across multiple metrics:
- **Pitch Accuracy**: How well you hit target notes
- **Clarity**: Articulation and pronunciation quality
- **Resonance**: Vocal power and harmonic richness
- **Volume Control**: Dynamic range management

### Daily Challenges

Complete daily challenges to earn bonus XP:
- Practice for a set duration
- Achieve target pitch accuracy
- Maintain your practice streak

### Avatar Customization

Unlock new avatar items by leveling up:
- **Skin tones**: Unlocked at levels 1, 3, 5
- **Hairstyles**: Unlocked at levels 1, 4, 7, 10
- **Outfits**: Unlocked at levels 1, 5, 8, 12
- **Accessories**: Unlocked at levels 1, 3, 6, 15

## Audio Analysis

### How It Works

VocalCoach uses advanced Web Audio API features to analyze your voice in real-time:

1. **Microphone Input**: Captures audio with noise suppression and echo cancellation
2. **Pitch Detection**: Autocorrelation algorithm identifies fundamental frequency
3. **Spectral Analysis**: FFT analysis for resonance and clarity metrics
4. **Volume Measurement**: RMS calculation for dynamic level tracking

### Metrics Explained

- **Pitch**: Your current note compared to the target (displayed as note name + octave)
- **Volume**: Loudness level from 0-100%
- **Clarity**: Harmonic definition and pronunciation quality (0-100%)
- **Resonance**: Vocal power and harmonic richness (0-100%)

## ADHD-Friendly Features

The app is specifically designed for users with ADHD:

1. **Visual Clarity**: High contrast, large buttons, clear typography
2. **Quick Navigation**: One-click access to any section
3. **Immediate Feedback**: Real-time visual and numerical feedback
4. **Short Sessions**: Bite-sized activities to prevent overwhelm
5. **Gamification**: Constant rewards and progression to maintain motivation
6. **Focus Timer**: Structured practice with built-in breaks
7. **Favorites**: Quick access to preferred content
8. **Progress Visualization**: Charts and graphs showing improvement

## Data Privacy

- All data is stored **locally** in your browser using localStorage
- No data is sent to external servers
- You can export or delete your data at any time from Settings
- Microphone access is only used for real-time analysis, no recordings are stored

## Browser Compatibility

VocalCoach works best on modern browsers with Web Audio API support:

- ✅ Chrome/Edge 88+
- ✅ Firefox 94+
- ✅ Safari 14.1+
- ✅ Opera 74+

**Note**: Microphone access is required for vocal analysis features.

## Development

### Project Structure

```
VocalCoach/
├── src/
│   ├── components/        # React components
│   │   ├── Layout.tsx     # Main layout with navigation
│   │   ├── Home.tsx       # Dashboard/home screen
│   │   ├── SongsList.tsx  # Song library
│   │   ├── SongPractice.tsx # Song practice interface
│   │   ├── MiniGames.tsx  # Mini-games selection
│   │   ├── PitchTargetGame.tsx # Pitch target mini-game
│   │   ├── Progress.tsx   # Progress and analytics
│   │   ├── AvatarCustomization.tsx # Avatar editor
│   │   ├── FocusTimer.tsx # Pomodoro timer
│   │   ├── Favorites.tsx  # Favorites quick access
│   │   └── Settings.tsx   # Settings panel
│   ├── store/
│   │   └── useStore.ts    # Zustand state management
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   ├── utils/
│   │   ├── audioAnalyzer.ts # Audio processing and analysis
│   │   ├── gameData.ts    # Game content generators
│   │   └── helpers.ts     # Utility functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Key Components

- **AudioAnalyzer**: Real-time audio processing using Web Audio API
- **Store**: Centralized state management with persistence
- **Layout**: ADHD-friendly navigation and UI structure
- **Practice Components**: Interactive practice interfaces with live feedback

### Adding New Songs

Edit `src/utils/gameData.ts` and add to `generateInitialSongs()`:

```typescript
{
  id: 'song-new',
  title: 'Song Title',
  artist: 'Artist Name',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  duration: 60, // seconds
  targetSkills: ['pitch', 'clarity'],
  pitchData: [262, 294, 330], // MIDI note frequencies
  lyrics: [
    { startTime: 0, endTime: 2, text: 'Lyrics here', targetPitch: 262 }
  ],
  favorite: false
}
```

### Adding New Mini-Games

1. Create a new component in `src/components/`
2. Add game definition to `generateInitialMiniGames()` in `gameData.ts`
3. Import and use in `App.tsx` view routing

## Performance Optimization

- Audio analysis runs at ~100ms intervals for smooth feedback
- State updates are optimized with Zustand
- Component re-renders minimized with React.memo where appropriate
- Tailwind CSS purges unused styles in production

## Future Enhancements

- [ ] Cloud sync for cross-device progress
- [ ] Social features and friend challenges
- [ ] Leaderboards with weekly competitions
- [ ] More mini-games (rhythm, harmony, tone control)
- [ ] AI-powered personalized recommendations
- [ ] Video tutorials and guided lessons
- [ ] Vocal range assessment tool
- [ ] Custom song upload and analysis
- [ ] Mobile app (React Native)

## Troubleshooting

### Microphone Not Working

1. Check browser permissions (look for microphone icon in address bar)
2. Ensure HTTPS or localhost (microphone requires secure context)
3. Try reloading the page
4. Check system microphone settings

### Audio Analysis Inaccurate

1. Use a good quality microphone
2. Practice in a quiet environment
3. Speak/sing clearly and at moderate volume
4. Ensure proper mic positioning

### Performance Issues

1. Close other browser tabs
2. Disable browser extensions
3. Update to latest browser version
4. Clear localStorage and refresh

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or building your own vocal coach app!

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Web Audio API for real-time audio processing
- React and TypeScript for robust UI development
- Tailwind CSS for beautiful, responsive design
- Zustand for elegant state management
- Lucide React for beautiful icons

---

**Made with ❤️ for vocal enthusiasts and ADHD-friendly learning**

Happy Singing! 🎤✨
