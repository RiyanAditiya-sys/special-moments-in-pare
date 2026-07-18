/**
 * Procedural Audio Synthesizer using Web Audio API
 * Generates an emotional, premium ambient soundscape without loading heavy assets.
 */

export class AmbientSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private birdsGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;

  // Active state trackers
  private isPlaying = false;
  private padOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private rainSource: AudioBufferSourceNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private birdTimer: NodeJS.Timeout | null = null;
  private chimeTimer: NodeJS.Timeout | null = null;

  constructor() {}

  /**
   * Initializes the AudioContext and sets up the node graph
   */
  private init() {
    if (this.ctx) return;

    // Use standard AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // 1. Create master controls
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // 2. Create delay/reverb channel for chimes and pads
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.setValueAtTime(0.8, this.ctx.currentTime);

    const delayFeedback = this.ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.6, this.ctx.currentTime);

    // Feed delay back into itself
    this.delayNode.connect(delayFeedback);
    delayFeedback.connect(this.delayNode);

    // Connect delay to master
    this.delayNode.connect(this.masterGain);

    // 3. Create independent sub-gains for mixing
    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.padGain.connect(this.masterGain);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime); // default off
    this.rainGain.connect(this.masterGain);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0, this.ctx.currentTime); // default off
    this.windGain.connect(this.masterGain);

    this.birdsGain = this.ctx.createGain();
    this.birdsGain.gain.setValueAtTime(0, this.ctx.currentTime); // default off
    this.birdsGain.connect(this.masterGain);
  }

  /**
   * Starts playing the entire ambient soundscape
   */
  public start() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Fade in master gain slowly
    this.masterGain!.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain!.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 2.0);

    // Start individual synthesizers
    this.startPadSynth();
    this.startRainSynth();
    this.startWindSynth();
    this.startChimeGenerator();
    this.startBirdGenerator();
  }

  /**
   * Stops/fades out all sound generators
   */
  public stop() {
    if (!this.isPlaying || !this.ctx) return;

    // Fade out master gain first
    this.masterGain!.gain.setValueAtTime(this.masterGain!.gain.value, this.ctx.currentTime);
    this.masterGain!.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

    setTimeout(() => {
      this.cleanupNodes();
      this.isPlaying = false;
    }, 1600);
  }

  private cleanupNodes() {
    // Stop pad oscillators
    this.padOscillators.forEach((voice) => {
      try {
        voice.osc.stop();
      } catch (e) {}
    });
    this.padOscillators = [];

    // Stop rain buffer
    if (this.rainSource) {
      try {
        this.rainSource.stop();
      } catch (e) {}
      this.rainSource = null;
    }

    // Stop wind buffer
    if (this.windSource) {
      try {
        this.windSource.stop();
      } catch (e) {}
      this.windSource = null;
    }

    // Clear timers
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (this.birdTimer) {
      clearInterval(this.birdTimer);
      this.birdTimer = null;
    }
  }

  /**
   * Master Volume (0 to 1)
   */
  public setVolume(volume: number) {
    this.init();
    if (this.masterGain && this.ctx) {
      const vol = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.2);
    }
  }

  /**
   * Set specific channel volume
   */
  public toggleAmbientSound(id: string, active: boolean) {
    this.init();
    if (!this.ctx) return;

    let targetGain: GainNode | null = null;
    let targetVol = 0.25;

    if (id === "rain") {
      targetGain = this.rainGain;
      targetVol = 0.35;
    } else if (id === "wind") {
      targetGain = this.windGain;
      targetVol = 0.18;
    } else if (id === "birds") {
      targetGain = this.birdsGain;
      targetVol = 0.12;
    } else if (id === "cafe") {
      // Cafe ambient represented as slightly hummy wind / low crackles
      targetGain = this.windGain;
      targetVol = 0.2;
    }

    if (targetGain) {
      targetGain.gain.setValueAtTime(targetGain.gain.value, this.ctx.currentTime);
      targetGain.gain.linearRampToValueAtTime(active ? targetVol : 0, this.ctx.currentTime + 1.0);
    }
  }

  /**
   * Voice 1: Cinematic Warm Pad
   * Synthesizes 4 voices playing a warm major 7th chord.
   */
  private startPadSynth() {
    if (!this.ctx || !this.padGain) return;

    // Chord: F2 (87.31Hz), C3 (130.81Hz), A3 (220.00Hz), C4 (261.63Hz)
    // A lush, floating, nostalgic minor/major suspension.
    const pitches = [87.31, 130.81, 220.00, 261.63];

    pitches.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const voiceGain = this.ctx!.createGain();

      // Triangle waves for warm, woodwind-like analog character
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.5, this.ctx!.currentTime); // Detune slightly

      // Smooth slow LFO volume modulation for organic movement
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(0.04 + index * 0.015, this.ctx!.currentTime); // slow waves (20-25 seconds)

      lfoGain.gain.setValueAtTime(0.08, this.ctx!.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(voiceGain.gain); // Modulate volume

      // Connect components
      osc.connect(voiceGain);
      voiceGain.connect(this.padGain!);

      // Feed some pad output to delay to make it expansive
      if (this.delayNode) {
        const sendGain = this.ctx!.createGain();
        sendGain.gain.setValueAtTime(0.2, this.ctx!.currentTime);
        voiceGain.connect(sendGain);
        sendGain.connect(this.delayNode);
      }

      // Voice base gain (detuned mix)
      voiceGain.gain.setValueAtTime(0.08, this.ctx!.currentTime);

      osc.start();
      lfo.start();

      this.padOscillators.push({ osc, gain: voiceGain });
    });
  }

  /**
   * Voice 2: Procedural Rain Generator
   * Uses synthesized white noise buffer + lowpass filters with slow frequency sweeps
   */
  private startRainSynth() {
    if (!this.ctx || !this.rainGain) return;

    // 1. Generate 2 seconds of white noise
    const bufferSize = this.ctx.sampleRate * 2.0;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2.0 - 1.0;
    }

    // 2. Play noise in a loop
    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = noiseBuffer;
    this.rainSource.loop = true;

    // 3. Create filters for rain tone (lowpass & highpass)
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(150, this.ctx.currentTime);

    // 4. Modulate rain filter with LFO to simulate gusty wind shifting rain drops
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12 second wave

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(300, this.ctx.currentTime); // shift filter between 700Hz and 1300Hz

    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    // Connect node path
    this.rainSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(this.rainGain);

    lfo.start();
    this.rainSource.start();
  }

  /**
   * Voice 3: Evening Breeze (Wind)
   * Bandpass filtered white noise swept slowly in center frequency
   */
  private startWindSynth() {
    if (!this.ctx || !this.windGain) return;

    // 1. Generate noise
    const bufferSize = this.ctx.sampleRate * 3.0;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2.0 - 1.0;
    }

    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;

    // 2. Bandpass filter with high Q (resonance) creates a whistling sound
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.Q.setValueAtTime(3.0, this.ctx.currentTime); // Resonant wind whistling
    bandpass.frequency.setValueAtTime(350, this.ctx.currentTime);

    // 3. Modulate wind whistle pitch using a slow LFO
    const windLFO = this.ctx.createOscillator();
    windLFO.frequency.setValueAtTime(0.05, this.ctx.currentTime); // 20s cycle

    const windLFOGain = this.ctx.createGain();
    windLFOGain.gain.setValueAtTime(150, this.ctx.currentTime); // Sweep between 200Hz and 500Hz

    windLFO.connect(windLFOGain);
    windLFOGain.connect(bandpass.frequency);

    // Connect path
    this.windSource.connect(bandpass);
    bandpass.connect(this.windGain);

    windLFO.start();
    this.windSource.start();
  }

  /**
   * Voice 4: Generative Pentatonic Chimes
   * Periodically triggers soft sine wave chimes passing through the delay-feedback line
   */
  private startChimeGenerator() {
    if (!this.ctx || !this.delayNode) return;

    // F Major Pentatonic scale (dreamy and nostalgic):
    // F4 (349.23Hz), G4 (392.00Hz), A4 (440.00Hz), C5 (523.25Hz), D5 (587.33Hz), F5 (698.46Hz)
    const scale = [349.23, 392.00, 440.00, 523.25, 587.33, 698.46];

    this.chimeTimer = setInterval(() => {
      if (!this.ctx || this.ctx.state === "suspended") return;

      // Random trigger chance (80%)
      if (Math.random() > 0.8) return;

      const now = this.ctx.currentTime;
      const freq = scale[Math.floor(Math.random() * scale.length)];

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Volume envelope: rapid attack (10ms) and very long release (5.0 seconds)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

      // Connect to delay/reverb channel instead of direct master
      osc.connect(gainNode);
      gainNode.connect(this.delayNode!);

      osc.start(now);
      osc.stop(now + 5.1);
    }, 4000); // Check every 4 seconds
  }

  /**
   * Voice 5: Generative Bird Chirper
   * Programmatically sweeps high-frequency sine waves to create organic forest birds.
   */
  private startBirdGenerator() {
    if (!this.ctx || !this.birdsGain) return;

    this.birdTimer = setInterval(() => {
      if (!this.ctx || this.ctx.state === "suspended") return;

      // Check random chance (35%)
      if (Math.random() > 0.35) return;

      const now = this.ctx.currentTime;
      const baseFreq = 2200 + Math.random() * 800; // 2.2KHz - 3KHz
      const chirpCount = 3 + Math.floor(Math.random() * 4); // 3-6 chirps in a row

      let startOffset = 0;

      for (let i = 0; i < chirpCount; i++) {
        const time = now + startOffset;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = "sine";
        // Bird sweep: start high and slide rapidly higher, or slide down
        osc.frequency.setValueAtTime(baseFreq + (Math.random() - 0.5) * 200, time);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 600 + Math.random() * 400, time + 0.07);

        // Chirp envelope
        gainNode.gain.setValueAtTime(0.001, time);
        gainNode.gain.linearRampToValueAtTime(0.04, time + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

        // Direct to birds mix
        osc.connect(gainNode);
        gainNode.connect(this.birdsGain!);

        osc.start(time);
        osc.stop(time + 0.08);

        startOffset += 0.12 + Math.random() * 0.05; // Gap between sub-chirps
      }
    }, 8000); // Check every 8 seconds
  }
}
