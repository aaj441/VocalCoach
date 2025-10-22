// Helper utilities

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 1000;
}

export function getXPProgress(currentXP: number, currentLevel: number): number {
  const xpForCurrentLevel = (currentLevel - 1) * 1000;
  const xpForNextLevel = currentLevel * 1000;
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  return (xpInCurrentLevel / (xpForNextLevel - xpForCurrentLevel)) * 100;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
    case 'beginner':
      return 'text-green-600';
    case 'medium':
    case 'intermediate':
      return 'text-yellow-600';
    case 'hard':
    case 'advanced':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-600 bg-gray-100';
    case 'rare':
      return 'text-blue-600 bg-blue-100';
    case 'epic':
      return 'text-purple-600 bg-purple-100';
    case 'legendary':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function calculateScore(stats: {
  pitchAccuracy: number;
  resonance: number;
  clarity: number;
  volumeControl: number;
}): number {
  return Math.round(
    (stats.pitchAccuracy * 0.4 +
      stats.resonance * 0.2 +
      stats.clarity * 0.2 +
      stats.volumeControl * 0.2)
  );
}

export function midiNoteToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export function frequencyToNoteName(frequency: number): string {
  if (frequency === 0) return '--';

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const midiNote = Math.round(12 * Math.log2(frequency / 440) + 69);
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;

  return `${noteNames[noteIndex]}${octave}`;
}

export function shareProgress(text: string, url?: string): void {
  if (navigator.share) {
    navigator.share({
      title: 'VocalCoach Progress',
      text,
      url: url || window.location.href,
    }).catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${text}\n${url || window.location.href}`);
    alert('Progress copied to clipboard!');
  }
}

export function downloadProgressReport(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
