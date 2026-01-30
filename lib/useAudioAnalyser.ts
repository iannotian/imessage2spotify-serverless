import { useEffect, useRef, useState, useCallback } from "react";
import { Howler } from "howler";

const FFT_SIZE = 64;
const BAR_COUNT = 4;

export function useAudioAnalyser(isPlaying: boolean) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const connectedRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>(
    () => new Array(BAR_COUNT).fill(0)
  );

  const updateWaveform = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Sample down to BAR_COUNT bars, focusing on lower/mid frequencies
    const bars: number[] = [];
    const usableBins = Math.floor(dataArray.length * 0.75);
    const step = Math.floor(usableBins / BAR_COUNT);

    for (let i = 0; i < BAR_COUNT; i++) {
      let sum = 0;
      const start = i * step;
      for (let j = 0; j < step; j++) {
        sum += dataArray[start + j] || 0;
      }
      bars.push((sum / step) / 255);
    }

    setWaveformData(bars);
    animationRef.current = requestAnimationFrame(updateWaveform);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setWaveformData((prev) => prev.map((v) => v * 0.8));
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const ctx = Howler.ctx;
    if (!ctx) return;

    // Create analyser once and keep it
    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = FFT_SIZE;
      analyserRef.current.smoothingTimeConstant = 0.7;
    }

    // Connect to masterGain if not already connected
    if (!connectedRef.current && Howler.masterGain) {
      try {
        Howler.masterGain.connect(analyserRef.current);
        connectedRef.current = true;
      } catch (e) {
        // Already connected or other error
      }
    }

    animationRef.current = requestAnimationFrame(updateWaveform);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, updateWaveform]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return waveformData;
}
