import type { AnalysisResult } from '../types';

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private frequencyData: Float32Array | null = null;
  private isRunning = false;

  async initialize(): Promise<void> {
    try {
      this.audioContext = new AudioContext();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 4096;
      this.analyserNode.smoothingTimeConstant = 0.8;

      const bufferLength = this.analyserNode.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.frequencyData = new Float32Array(bufferLength);

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyserNode);

      this.isRunning = true;
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
      throw new Error('Microphone access denied or not available');
    }
  }

  getAnalysis(targetPitch?: number): AnalysisResult | null {
    if (!this.analyserNode || !this.dataArray || !this.frequencyData || !this.audioContext) {
      return null;
    }

    // @ts-expect-error - Web Audio API typed array mismatch
    this.analyserNode.getByteTimeDomainData(this.dataArray);
    // @ts-expect-error - Web Audio API typed array mismatch
    this.analyserNode.getFloatFrequencyData(this.frequencyData);

    const volume = this.getVolume(this.dataArray);
    const frequency = this.detectPitch(this.dataArray, this.audioContext.sampleRate);
    const pitch = this.frequencyToMidiNote(frequency);
    const clarity = this.calculateClarity(this.frequencyData);
    const resonance = this.calculateResonance(this.frequencyData, frequency);

    const isOnPitch = targetPitch
      ? Math.abs(pitch - targetPitch) < 0.5
      : false;

    return {
      timestamp: Date.now(),
      pitch,
      frequency,
      volume,
      clarity,
      resonance,
      isOnPitch,
      targetPitch,
    };
  }

  private getVolume(dataArray: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    return Math.min(100, rms * 200);
  }

  private detectPitch(dataArray: Uint8Array, sampleRate: number): number {
    // Autocorrelation pitch detection
    const bufferSize = dataArray.length;
    const correlations = new Array(bufferSize);

    let maxCorrelation = 0;
    let maxCorrelationIndex = 0;

    // Calculate autocorrelation
    for (let lag = 0; lag < bufferSize; lag++) {
      let correlation = 0;
      for (let i = 0; i < bufferSize - lag; i++) {
        const val1 = (dataArray[i] - 128) / 128;
        const val2 = (dataArray[i + lag] - 128) / 128;
        correlation += val1 * val2;
      }
      correlations[lag] = correlation;

      if (lag > 0 && correlation > maxCorrelation) {
        maxCorrelation = correlation;
        maxCorrelationIndex = lag;
      }
    }

    // Find fundamental frequency
    if (maxCorrelationIndex > 0) {
      const frequency = sampleRate / maxCorrelationIndex;
      // Filter out unrealistic frequencies (outside human voice range)
      if (frequency >= 80 && frequency <= 1200) {
        return frequency;
      }
    }

    return 0;
  }

  private frequencyToMidiNote(frequency: number): number {
    if (frequency === 0) return 0;
    return 12 * Math.log2(frequency / 440) + 69;
  }

  private calculateClarity(frequencyData: Float32Array): number {
    // Clarity is based on the presence of clear harmonics
    // Higher spectral flatness = more noise-like = less clarity
    const spectralFlatness = this.calculateSpectralFlatness(frequencyData);
    return Math.max(0, Math.min(100, (1 - spectralFlatness) * 100));
  }

  private calculateResonance(frequencyData: Float32Array, fundamentalFreq: number): number {
    if (fundamentalFreq === 0) return 0;

    // Resonance is measured by the strength of harmonics
    const sampleRate = this.audioContext?.sampleRate || 48000;
    const binSize = sampleRate / (this.analyserNode?.fftSize || 4096);

    let harmonicStrength = 0;
    const harmonicsToCheck = 5;

    for (let i = 1; i <= harmonicsToCheck; i++) {
      const harmonicFreq = fundamentalFreq * i;
      const bin = Math.round(harmonicFreq / binSize);
      if (bin < frequencyData.length) {
        harmonicStrength += frequencyData[bin];
      }
    }

    const averageHarmonicStrength = harmonicStrength / harmonicsToCheck;
    return Math.max(0, Math.min(100, (averageHarmonicStrength + 100) * 0.7));
  }

  private calculateSpectralFlatness(frequencyData: Float32Array): number {
    let geometricMean = 0;
    let arithmeticMean = 0;
    let count = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      const magnitude = Math.pow(10, frequencyData[i] / 20);
      if (magnitude > 0) {
        geometricMean += Math.log(magnitude);
        arithmeticMean += magnitude;
        count++;
      }
    }

    if (count === 0) return 1;

    geometricMean = Math.exp(geometricMean / count);
    arithmeticMean = arithmeticMean / count;

    if (arithmeticMean === 0) return 1;
    return geometricMean / arithmeticMean;
  }

  stop(): void {
    this.isRunning = false;

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyserNode = null;
    this.dataArray = null;
    this.frequencyData = null;
  }

  isInitialized(): boolean {
    return this.isRunning && this.audioContext !== null;
  }
}

export const audioAnalyzer = new AudioAnalyzer();
