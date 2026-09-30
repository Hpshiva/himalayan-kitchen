// Himalayan Procedural Audio Engine: Wind, Glacial Waters, Tingsha Bells & Sacred Monastery Resonances
type AudioStateListener = (active: boolean) => void;

class HimalayanAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private stereoPanner: StereoPannerNode | null = null;

  // Alpine Mountain Wind & Aeolian Whistle Layers
  private windGain: GainNode | null = null;
  private windBandpass: BiquadFilterNode | null = null;
  private aeolianGain: GainNode | null = null;

  // Mountain Glacial Stream & Water Turbulence
  private waterGain: GainNode | null = null;
  private fallingDriftGain: GainNode | null = null;

  // Hero Section Hearth & Cooking Sizzle Layers
  private crackleGain: GainNode | null = null;
  private sizzleGain: GainNode | null = null;

  // Sacred Multi-Harmonic Drone (108Hz Om + 216Hz + 324Hz)
  private droneGain: GainNode | null = null;

  // Timers for organic non-repeating acoustic events
  private singingBowlTimer: number | null = null;
  private tingshaTimer: number | null = null;
  private windChimeTimer: number | null = null;
  private streamBubbleTimer: number | null = null;
  private waterDropTimer: number | null = null;

  private isMuted: boolean = true;
  private hasInteracted: boolean = false;
  private isPostHero: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const handleFirstGesture = () => {
        if (!this.hasInteracted) {
          this.hasInteracted = true;
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
          window.removeEventListener('click', handleFirstGesture);
          window.removeEventListener('touchstart', handleFirstGesture);
          window.removeEventListener('keydown', handleFirstGesture);
          window.removeEventListener('scroll', handleFirstGesture);
        }
      };

      window.addEventListener('click', handleFirstGesture, { passive: true });
      window.addEventListener('touchstart', handleFirstGesture, { passive: true });
      window.addEventListener('keydown', handleFirstGesture, { passive: true });
      window.addEventListener('scroll', handleFirstGesture, { passive: true });
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const active = !this.isMuted;
    this.listeners.forEach((l) => l(active));
  }

  public init(): AudioContext | null {
    if (!this.ctx) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
        this.setupAudioGraph();
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private setupAudioGraph() {
    if (!this.ctx) return;

    // Master Volume & Stereo Spatial Panner
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;

    if (this.ctx.createStereoPanner) {
      this.stereoPanner = this.ctx.createStereoPanner();
      this.stereoPanner.pan.value = 0.0;
      this.masterGain.connect(this.stereoPanner);
      this.stereoPanner.connect(this.ctx.destination);
    } else {
      this.masterGain.connect(this.ctx.destination);
    }

    const sampleRate = this.ctx.sampleRate;

    // -------------------------------------------------------------
    // 1. PROCEDURAL ALPINE MOUNTAIN WIND (Pink Noise + Dual LFOs)
    // -------------------------------------------------------------
    const windBufferSize = sampleRate * 5;
    const windBuffer = this.ctx.createBuffer(1, windBufferSize, sampleRate);
    const windData = windBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < windBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      windData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
      b6 = white * 0.115926;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;

    this.windBandpass = this.ctx.createBiquadFilter();
    this.windBandpass.type = 'bandpass';
    this.windBandpass.frequency.value = 320;
    this.windBandpass.Q.value = 1.4;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0;

    // Wind draft swell LFO
    const windLfo = this.ctx.createOscillator();
    windLfo.frequency.value = 0.11;
    const windLfoGain = this.ctx.createGain();
    windLfoGain.gain.value = 110;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(this.windBandpass.frequency);
    windLfo.start(0);

    windSource.connect(this.windBandpass);
    this.windBandpass.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    // -------------------------------------------------------------
    // 2. AEOLIAN HARP / WIND FLUTE RESONANCE (Singing Peak Drafts)
    // -------------------------------------------------------------
    const aeolianFilter = this.ctx.createBiquadFilter();
    aeolianFilter.type = 'bandpass';
    aeolianFilter.frequency.value = 540;
    aeolianFilter.Q.value = 14; // High Q whistles musically on the wind

    this.aeolianGain = this.ctx.createGain();
    this.aeolianGain.gain.value = 0;

    const aeolianLfo = this.ctx.createOscillator();
    aeolianLfo.frequency.value = 0.08;
    const aeolianLfoGain = this.ctx.createGain();
    aeolianLfoGain.gain.value = 130;
    aeolianLfo.connect(aeolianLfoGain);
    aeolianLfoGain.connect(aeolianFilter.frequency);
    aeolianLfo.start(0);

    windSource.connect(aeolianFilter);
    aeolianFilter.connect(this.aeolianGain);
    this.aeolianGain.connect(this.masterGain);
    windSource.start(0);

    // -------------------------------------------------------------
    // 3. PROCEDURAL MOUNTAIN STREAM WATER FLOW (Fluid Turbulence)
    // -------------------------------------------------------------
    const waterBufferSize = sampleRate * 4;
    const waterBuffer = this.ctx.createBuffer(1, waterBufferSize, sampleRate);
    const waterData = waterBuffer.getChannelData(0);

    let lastSample = 0;
    for (let i = 0; i < waterBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastSample = (lastSample + 0.032 * white) / 1.032;
      waterData[i] = lastSample * 3.2;
    }

    const waterSource = this.ctx.createBufferSource();
    waterSource.buffer = waterBuffer;
    waterSource.loop = true;

    // Low-mid stream body
    const waterFilter1 = this.ctx.createBiquadFilter();
    waterFilter1.type = 'bandpass';
    waterFilter1.frequency.value = 640;
    waterFilter1.Q.value = 2.4;

    // High water surface ripples & spray
    const waterFilter2 = this.ctx.createBiquadFilter();
    waterFilter2.type = 'bandpass';
    waterFilter2.frequency.value = 1420;
    waterFilter2.Q.value = 3.6;

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.value = 0;

    const waterLfo1 = this.ctx.createOscillator();
    waterLfo1.frequency.value = 0.26;
    const waterLfoGain1 = this.ctx.createGain();
    waterLfoGain1.gain.value = 110;
    waterLfo1.connect(waterLfoGain1);
    waterLfoGain1.connect(waterFilter1.frequency);
    waterLfo1.start(0);

    const waterLfo2 = this.ctx.createOscillator();
    waterLfo2.frequency.value = 0.72;
    const waterLfoGain2 = this.ctx.createGain();
    waterLfoGain2.gain.value = 160;
    waterLfo2.connect(waterLfoGain2);
    waterLfoGain2.connect(waterFilter2.frequency);
    waterLfo2.start(0);

    waterSource.connect(waterFilter1);
    waterSource.connect(waterFilter2);
    waterFilter1.connect(this.waterGain);
    waterFilter2.connect(this.waterGain);
    this.waterGain.connect(this.masterGain);
    waterSource.start(0);

    // -------------------------------------------------------------
    // 4. FALLING SLOW: HIGH-ALTITUDE SNOW DRIFT WHISPER
    // -------------------------------------------------------------
    const driftBufferSize = sampleRate * 3;
    const driftBuffer = this.ctx.createBuffer(1, driftBufferSize, sampleRate);
    const driftData = driftBuffer.getChannelData(0);
    for (let i = 0; i < driftBufferSize; i++) {
      driftData[i] = (Math.random() * 2 - 1) * 0.028;
    }

    const driftSource = this.ctx.createBufferSource();
    driftSource.buffer = driftBuffer;
    driftSource.loop = true;

    const driftFilter = this.ctx.createBiquadFilter();
    driftFilter.type = 'bandpass';
    driftFilter.frequency.value = 3600;
    driftFilter.Q.value = 1.2;

    this.fallingDriftGain = this.ctx.createGain();
    this.fallingDriftGain.gain.value = 0;

    driftSource.connect(driftFilter);
    driftFilter.connect(this.fallingDriftGain);
    this.fallingDriftGain.connect(this.masterGain);
    driftSource.start(0);

    // -------------------------------------------------------------
    // 5. SACRED MULTI-HARMONIC 108Hz MONASTERY OM DRONE
    // -------------------------------------------------------------
    const d1 = this.ctx.createOscillator();
    const d2 = this.ctx.createOscillator();
    const d3 = this.ctx.createOscillator();
    d1.type = 'sine';
    d1.frequency.value = 108; // Fundamental Sacred Om
    d2.type = 'sine';
    d2.frequency.value = 216; // First Octave
    d3.type = 'sine';
    d3.frequency.value = 324.5; // Harmonic Fifth with 0.5Hz gentle acoustic shimmer

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0;

    const d1Gain = this.ctx.createGain();
    const d2Gain = this.ctx.createGain();
    const d3Gain = this.ctx.createGain();
    d1Gain.gain.value = 0.5;
    d2Gain.gain.value = 0.28;
    d3Gain.gain.value = 0.15;

    d1.connect(d1Gain);
    d2.connect(d2Gain);
    d3.connect(d3Gain);
    d1Gain.connect(this.droneGain);
    d2Gain.connect(this.droneGain);
    d3Gain.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    d1.start(0);
    d2.start(0);
    d3.start(0);

    // -------------------------------------------------------------
    // 6. CEDAR HEARTH CRACKLE & GHEE SIMMER (Hero Altar)
    // -------------------------------------------------------------
    const crackleBufferSize = sampleRate * 5;
    const crackleBuffer = this.ctx.createBuffer(1, crackleBufferSize, sampleRate);
    const crackleData = crackleBuffer.getChannelData(0);

    for (let i = 0; i < crackleBufferSize; i++) {
      if (Math.random() < 0.00075) {
        const popLen = Math.floor(Math.random() * 80 + 25);
        const amp = (Math.random() < 0.2 ? 0.75 : 0.3) * (Math.random() * 0.7 + 0.3);
        for (let j = 0; j < popLen && i + j < crackleBufferSize; j++) {
          const decay = 1 - j / popLen;
          crackleData[i + j] += (Math.random() * 2 - 1) * amp * decay * decay;
        }
      }
    }

    const crackleSource = this.ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.value = 2100;
    crackleFilter.Q.value = 2.4;

    this.crackleGain = this.ctx.createGain();
    this.crackleGain.gain.value = 0;

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(this.crackleGain);
    this.crackleGain.connect(this.masterGain);
    crackleSource.start(0);

    // Sizzle (Ghee & Steam)
    const sizzleBufferSize = sampleRate * 3;
    const sizzleBuffer = this.ctx.createBuffer(1, sizzleBufferSize, sampleRate);
    const sizzleData = sizzleBuffer.getChannelData(0);
    for (let i = 0; i < sizzleBufferSize; i++) {
      sizzleData[i] = (Math.random() * 2 - 1) * 0.038;
    }

    const sizzleSource = this.ctx.createBufferSource();
    sizzleSource.buffer = sizzleBuffer;
    sizzleSource.loop = true;

    const sizzleHighpass = this.ctx.createBiquadFilter();
    sizzleHighpass.type = 'highpass';
    sizzleHighpass.frequency.value = 3400;

    this.sizzleGain = this.ctx.createGain();
    this.sizzleGain.gain.value = 0;

    sizzleSource.connect(sizzleHighpass);
    sizzleHighpass.connect(this.sizzleGain);
    this.sizzleGain.connect(this.masterGain);
    sizzleSource.start(0);
  }

  // -------------------------------------------------------------
  // ORGANIC ACOUSTIC PROCEDURAL SOUNDS: Tingsha, Chimes, Bubbles & Drops
  // -------------------------------------------------------------

  // Authentic Tibetan Tingsha Cymbals (dual bronze plates with 4Hz acoustic warble)
  public playTingshaBell(fundamentalFreq: number = 1760, volume: number = 0.08) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const f1 = fundamentalFreq;
      const f2 = fundamentalFreq + 4.2;

      [f1, f2].forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        // High metallic overtone
        const highOsc = this.ctx.createOscillator();
        const highGain = this.ctx.createGain();
        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(freq * 2.76, now);
        highGain.gain.setValueAtTime(volume * 0.16, now);
        highGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(gain);
        gain.connect(this.masterGain);
        highOsc.connect(highGain);
        highGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 5.5);
        highOsc.start(now);
        highOsc.stop(now + 2.0);
      });
    } catch {
      // ignore
    }
  }

  // Pentatonic Tibetan Temple Wind Chimes (gentle mountain breeze bells)
  public playWindChime(pitchIndex?: number, volume: number = 0.07) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const scale = [311.13, 349.23, 415.3, 466.16, 523.25, 622.25, 698.46, 830.61];
      const freq =
        pitchIndex !== undefined
          ? scale[pitchIndex % scale.length]
          : scale[Math.floor(Math.random() * scale.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      const partial = this.ctx.createOscillator();
      const partialGain = this.ctx.createGain();
      partial.type = 'sine';
      partial.frequency.setValueAtTime(freq * 2.756, now);
      partialGain.gain.setValueAtTime(volume * 0.35, now);
      partialGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      partial.connect(partialGain);
      partialGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.8);
      partial.start(now);
      partial.stop(now + 1.8);
    } catch {
      // ignore
    }
  }

  // Organic micro-bubble popping in the mountain stream (Minnaert bubble acoustic model)
  public playStreamBubble() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startFreq = 480 + Math.random() * 520;
      const endFreq = startFreq * (1.5 + Math.random() * 0.4);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.024);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.022 + Math.random() * 0.018, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  // Crystalline slow water droplet falling in mountain stream/cave
  public playSlowWaterDrop() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      const baseFreq = 980 + Math.random() * 560; // 980Hz - 1540Hz serene crystal ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.88, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.14);

      dropGain.gain.setValueAtTime(0, now);
      dropGain.gain.linearRampToValueAtTime(0.045, now + 0.015);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(dropGain);
      dropGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // ignore
    }
  }

  // Multi-harmonic Tibetan Singing Bowl
  public playSingingBowl(
    fundamentalFreq: number = 432,
    duration: number = 4.2,
    volume: number = 0.18
  ) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const now = this.ctx.currentTime;
      const harmonics = [
        { mult: 1.0, gain: volume, decay: duration },
        { mult: 2.76, gain: volume * 0.45, decay: duration * 0.72 },
        { mult: 5.4, gain: volume * 0.18, decay: duration * 0.42 },
      ];

      harmonics.forEach(({ mult, gain: peakGain, decay }) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamentalFreq * mult, now);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn('Singing bowl playback error', e);
    }
  }

  // Interactive mouse modulation: Cursor position subtly pans stereo field & opens mountain breeze
  public updateMouseModulation(normX: number, normY: number) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Pan across stereo speakers smoothly (-0.6 to +0.6)
    if (this.stereoPanner) {
      this.stereoPanner.pan.setTargetAtTime(normX * 0.55, now, 0.2);
    }

    // Y position slightly opens the wind filter frequency (higher cursor = higher altitude draft)
    if (this.windBandpass) {
      const baseFreq = 320;
      const modFreq = baseFreq + (-normY) * 120;
      this.windBandpass.frequency.setTargetAtTime(Math.max(220, Math.min(500, modFreq)), now, 0.3);
    }
  }

  // Start periodic, organic non-repeating acoustic events
  private startAcousticTimers() {
    this.stopAcousticTimers();

    // 1. Periodic Tibetan Singing Bowl (every ~30s)
    const scheduleBowl = () => {
      if (!this.isMuted) {
        const freq = Math.random() > 0.5 ? 432 : 528;
        this.playSingingBowl(freq, 4.5, 0.12);
      }
      this.singingBowlTimer = window.setTimeout(scheduleBowl, 26000 + Math.random() * 12000);
    };
    this.singingBowlTimer = window.setTimeout(scheduleBowl, 20000);

    // 2. Periodic Tibetan Tingsha Cymbals (every ~20s)
    const scheduleTingsha = () => {
      if (!this.isMuted) {
        this.playTingshaBell(1760 + (Math.random() > 0.5 ? 0 : 352), 0.075);
      }
      this.tingshaTimer = window.setTimeout(scheduleTingsha, 18000 + Math.random() * 14000);
    };
    this.tingshaTimer = window.setTimeout(scheduleTingsha, 12000);

    // 3. Periodic Pentatonic Wind Chimes (every ~12s)
    const scheduleChime = () => {
      if (!this.isMuted) {
        this.playWindChime(undefined, 0.065);
        if (Math.random() > 0.4) {
          window.setTimeout(() => this.playWindChime(undefined, 0.045), 350 + Math.random() * 400);
        }
      }
      this.windChimeTimer = window.setTimeout(scheduleChime, 11000 + Math.random() * 9000);
    };
    this.windChimeTimer = window.setTimeout(scheduleChime, 8000);

    // 4. Glacial Stream Bubbles (continuous organic bubbling every 0.9s - 2.4s)
    const scheduleBubble = () => {
      if (!this.isMuted && this.isPostHero) {
        this.playStreamBubble();
        if (Math.random() > 0.5) {
          window.setTimeout(() => this.playStreamBubble(), 80 + Math.random() * 140);
        }
      }
      this.streamBubbleTimer = window.setTimeout(scheduleBubble, 900 + Math.random() * 1500);
    };
    this.streamBubbleTimer = window.setTimeout(scheduleBubble, 1800);

    // 5. Calm Glacial Water Droplets (every 2.6s - 4.8s)
    const scheduleDrop = () => {
      if (!this.isMuted && this.isPostHero) {
        this.playSlowWaterDrop();
      }
      this.waterDropTimer = window.setTimeout(scheduleDrop, 2600 + Math.random() * 2400);
    };
    this.waterDropTimer = window.setTimeout(scheduleDrop, 2200);
  }

  private stopAcousticTimers() {
    if (this.singingBowlTimer) window.clearTimeout(this.singingBowlTimer);
    if (this.tingshaTimer) window.clearTimeout(this.tingshaTimer);
    if (this.windChimeTimer) window.clearTimeout(this.windChimeTimer);
    if (this.streamBubbleTimer) window.clearTimeout(this.streamBubbleTimer);
    if (this.waterDropTimer) window.clearTimeout(this.waterDropTimer);

    this.singingBowlTimer = null;
    this.tingshaTimer = null;
    this.windChimeTimer = null;
    this.streamBubbleTimer = null;
    this.waterDropTimer = null;
  }

  public enableSound(): boolean {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = false;
    const now = this.ctx.currentTime;

    if (this.isPostHero) {
      // POST-HERO: CONSTANT MOUNTAIN SANCTUARY (Wind, Stream, Aeolian Flute, Drone)
      if (this.waterGain) {
        this.waterGain.gain.cancelScheduledValues(now);
        this.waterGain.gain.setValueAtTime(this.waterGain.gain.value, now);
        this.waterGain.gain.linearRampToValueAtTime(0.14, now + 1.2);
      }
      if (this.windGain) {
        this.windGain.gain.cancelScheduledValues(now);
        this.windGain.gain.setValueAtTime(this.windGain.gain.value, now);
        this.windGain.gain.linearRampToValueAtTime(0.12, now + 1.2);
      }
      if (this.aeolianGain) {
        this.aeolianGain.gain.cancelScheduledValues(now);
        this.aeolianGain.gain.setValueAtTime(this.aeolianGain.gain.value, now);
        this.aeolianGain.gain.linearRampToValueAtTime(0.045, now + 1.5);
      }
      if (this.fallingDriftGain) {
        this.fallingDriftGain.gain.cancelScheduledValues(now);
        this.fallingDriftGain.gain.setValueAtTime(this.fallingDriftGain.gain.value, now);
        this.fallingDriftGain.gain.linearRampToValueAtTime(0.035, now + 1.5);
      }
      if (this.droneGain) {
        this.droneGain.gain.cancelScheduledValues(now);
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.linearRampToValueAtTime(0.024, now + 1.5);
      }
      if (this.crackleGain) this.crackleGain.gain.linearRampToValueAtTime(0.0, now + 0.8);
      if (this.sizzleGain) this.sizzleGain.gain.linearRampToValueAtTime(0.0, now + 0.8);
    } else {
      // HERO SECTION: Summit Wind, Aeolian Flute, Hearth Crackle & Sizzle
      if (this.windGain) {
        this.windGain.gain.cancelScheduledValues(now);
        this.windGain.gain.setValueAtTime(this.windGain.gain.value, now);
        this.windGain.gain.linearRampToValueAtTime(0.11, now + 1.0);
      }
      if (this.aeolianGain) {
        this.aeolianGain.gain.cancelScheduledValues(now);
        this.aeolianGain.gain.setValueAtTime(this.aeolianGain.gain.value, now);
        this.aeolianGain.gain.linearRampToValueAtTime(0.038, now + 1.2);
      }
      if (this.crackleGain) {
        this.crackleGain.gain.cancelScheduledValues(now);
        this.crackleGain.gain.setValueAtTime(this.crackleGain.gain.value, now);
        this.crackleGain.gain.linearRampToValueAtTime(0.08, now + 1.2);
      }
      if (this.sizzleGain) {
        this.sizzleGain.gain.cancelScheduledValues(now);
        this.sizzleGain.gain.setValueAtTime(this.sizzleGain.gain.value, now);
        this.sizzleGain.gain.linearRampToValueAtTime(0.045, now + 1.5);
      }
      if (this.droneGain) {
        this.droneGain.gain.cancelScheduledValues(now);
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.linearRampToValueAtTime(0.03, now + 1.5);
      }
      if (this.waterGain) this.waterGain.gain.linearRampToValueAtTime(0.0, now + 0.5);
      if (this.fallingDriftGain) this.fallingDriftGain.gain.linearRampToValueAtTime(0.0, now + 0.5);
    }

    // Initial warm Singing Bowl strike and Tingsha chime
    this.playSingingBowl(432, 4.2);
    setTimeout(() => this.playTingshaBell(1760, 0.08), 800);

    this.startAcousticTimers();
    this.notify();
    return true;
  }

  public disableSound(): boolean {
    this.isMuted = true;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      [
        this.windGain,
        this.aeolianGain,
        this.waterGain,
        this.fallingDriftGain,
        this.crackleGain,
        this.sizzleGain,
        this.droneGain,
      ].forEach((g) => {
        if (g) {
          g.gain.cancelScheduledValues(now);
          g.gain.linearRampToValueAtTime(0, now + 0.4);
        }
      });
    }

    this.stopAcousticTimers();
    this.notify();
    return false;
  }

  public toggleMute(): boolean {
    if (this.isMuted) {
      return this.enableSound();
    } else {
      return this.disableSound();
    }
  }

  public updateScrollModulation(_scrollProgress: number, heroProgress: number = 0) {
    const isNowPostHero = heroProgress >= 0.95;

    // Auto-engage sound once hero section is passed if user hasn't explicitly muted
    if (isNowPostHero && this.isMuted && this.hasInteracted) {
      this.isPostHero = true;
      this.enableSound();
      return;
    }

    if (this.isPostHero !== isNowPostHero) {
      this.isPostHero = isNowPostHero;
      if (!this.isMuted && this.ctx) {
        const now = this.ctx.currentTime;
        if (isNowPostHero) {
          // Fade in Constant Mountain Sanctuary
          if (this.waterGain) this.waterGain.gain.setTargetAtTime(0.14, now, 0.6);
          if (this.windGain) this.windGain.gain.setTargetAtTime(0.12, now, 0.6);
          if (this.aeolianGain) this.aeolianGain.gain.setTargetAtTime(0.045, now, 0.6);
          if (this.fallingDriftGain) this.fallingDriftGain.gain.setTargetAtTime(0.035, now, 0.6);
          if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.024, now, 0.6);
          if (this.crackleGain) this.crackleGain.gain.setTargetAtTime(0.0, now, 0.5);
          if (this.sizzleGain) this.sizzleGain.gain.setTargetAtTime(0.0, now, 0.5);
        } else {
          // Transition back to hero cooking altar soundscape
          if (this.waterGain) this.waterGain.gain.setTargetAtTime(0.0, now, 0.5);
          if (this.fallingDriftGain) this.fallingDriftGain.gain.setTargetAtTime(0.0, now, 0.5);
          if (this.windGain) this.windGain.gain.setTargetAtTime(0.11, now, 0.5);
          if (this.aeolianGain) this.aeolianGain.gain.setTargetAtTime(0.038, now, 0.5);
          if (this.crackleGain) this.crackleGain.gain.setTargetAtTime(0.08, now, 0.5);
          if (this.sizzleGain) this.sizzleGain.gain.setTargetAtTime(0.045, now, 0.5);
        }
      }
    }

    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.isPostHero) {
      // POST-HERO: KEEP THE MOUNTAIN NATURE SOUNDSCAPE COMPLETELY CONSTANT
      if (this.waterGain) this.waterGain.gain.setTargetAtTime(0.14, now, 0.3);
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.12, now, 0.3);
      if (this.aeolianGain) this.aeolianGain.gain.setTargetAtTime(0.045, now, 0.3);
      if (this.fallingDriftGain) this.fallingDriftGain.gain.setTargetAtTime(0.035, now, 0.3);
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.024, now, 0.3);
    } else {
      // IN HERO: Dynamically modulate cooking hearth and summit wind
      const targetWind = 0.12 - heroProgress * 0.03;
      const targetCrackle = 0.05 + heroProgress * 0.07;
      const targetSizzle = 0.03 + heroProgress * 0.04;

      if (this.windGain) this.windGain.gain.setTargetAtTime(Math.max(0.06, targetWind), now, 0.3);
      if (this.crackleGain) this.crackleGain.gain.setTargetAtTime(Math.min(0.12, targetCrackle), now, 0.3);
      if (this.sizzleGain) this.sizzleGain.gain.setTargetAtTime(Math.min(0.08, targetSizzle), now, 0.3);
      // As mountains part and the glacial river opens on scroll, river water swells smoothly!
      let riverWaterGain = 0;
      if (heroProgress >= 0.12 && heroProgress <= 0.88) {
        const t = (heroProgress - 0.12) / 0.28;
        const clampedT = Math.min(1, Math.max(0, t));
        const smoothT = clampedT * clampedT * (3 - 2 * clampedT);
        riverWaterGain = smoothT * 0.15;
      }
      if (this.waterGain) this.waterGain.gain.setTargetAtTime(riverWaterGain, now, 0.3);
    }
  }

  public playSoftTick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.03);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // ignore
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsPostHero(): boolean {
    return this.isPostHero;
  }
}

export const soundEngine = new HimalayanAudioEngine();
