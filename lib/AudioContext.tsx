"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { AmbientSynth } from "./audioSynth";

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  artwork: string;
}

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  currentTrack: Track | null;
  tracks: Track[];
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  audioData: number[]; // for a tiny inline playing indicator
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [audioData, setAudioData] = useState<number[]>(new Array(4).fill(0)); // only 4 bars for a tiny indicator

  const synthRef = useRef<AmbientSynth | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Load configuration and previous state
  useEffect(() => {
    fetch("/data/music.json")
      .then((r) => r.json())
      .then((musicData) => {
        setTracks(musicData);
        
        // Restore last played track
        const savedTrackId = localStorage.getItem("last_track_id");
        const restoredTrack = musicData.find((t: Track) => t.id === savedTrackId) || musicData[0];
        if (restoredTrack) {
          setCurrentTrack(restoredTrack);
        }

        // Restore last volume
        const savedVolume = localStorage.getItem("last_volume");
        if (savedVolume) {
          const vol = parseFloat(savedVolume);
          setVolumeState(vol);
          if (audioRef.current) audioRef.current.volume = vol;
          if (synthRef.current) synthRef.current.setVolume(vol);
        }
      })
      .catch((err) => {
        console.error("Failed to load music configuration:", err);
      });
  }, []);

  // Initialize synth
  useEffect(() => {
    synthRef.current = new AmbientSynth();
    return () => {
      if (synthRef.current) synthRef.current.stop();
      if (audioRef.current) audioRef.current.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const changeVolume = (vol: number) => {
    setVolumeState(vol);
    localStorage.setItem("last_volume", String(vol));
    if (synthRef.current) synthRef.current.setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    localStorage.setItem("last_track_id", track.id);

    // Stop current media
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.stop();
    }

    // Play new media
    if (track.url === "procedural") {
      setTimeout(() => {
        if (synthRef.current) {
          synthRef.current.start();
          synthRef.current.setVolume(volume);
        }
      }, 100);
    } else {
      const audio = new Audio(track.url);
      audio.volume = volume;
      audio.loop = true;
      audioRef.current = audio;
      audio.play().catch((err) => console.log("Audio play blocked by browser:", err));
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (synthRef.current) synthRef.current.stop();
    } else {
      playTrack(currentTrack);
    }
  };

  const nextTrack = () => {
    if (tracks.length === 0 || !currentTrack) return;
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = (index + 1) % tracks.length;
    playTrack(tracks[nextIdx]);
  };

  const prevTrack = () => {
    if (tracks.length === 0 || !currentTrack) return;
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (index - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIdx]);
  };

  // Tiny visualizer ticker (4 bars)
  useEffect(() => {
    let tick = 0;
    const updateVisualizer = () => {
      if (isPlaying) {
        tick += 0.2;
        setAudioData([
          Math.max(4, Math.sin(tick) * 8 + 12),
          Math.max(4, Math.cos(tick * 0.8) * 10 + 12),
          Math.max(4, Math.sin(tick * 1.2) * 9 + 12),
          Math.max(4, Math.cos(tick * 1.5) * 7 + 12)
        ]);
      } else {
        setAudioData([4, 4, 4, 4]);
      }
      animationRef.current = requestAnimationFrame(updateVisualizer);
    };

    animationRef.current = requestAnimationFrame(updateVisualizer);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        currentTrack,
        tracks,
        togglePlay,
        playTrack,
        nextTrack,
        prevTrack,
        setVolume: changeVolume,
        audioData
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
