class AudioManager {
  constructor() {
    this.sounds = {};
    this.backgroundMusic = null;
    this.isMuted = false;
    this.volume = 0.7;
    this.musicVolume = 0.3;
    this.initialized = false;
  }

  // Initialize audio system
  async init() {
    if (this.initialized) return;
    
    try {
      // Create audio context for better control
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Load sound effects
      await this.loadSounds();
      
      this.initialized = true;
      console.log('🎵 Audio system initialized');
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  // Load all sound effects
  async loadSounds() {
    const soundFiles = {
      // Basic UI sounds
      scroll: this.createBeepSound(220, 0.1, 'sine'), // Scroll transition
      hover: this.createBeepSound(440, 0.05, 'square'), // Button hover
      click: this.createBeepSound(880, 0.1, 'triangle'), // Button click
      
      // Menu navigation
      menuMove: this.createBeepSound(330, 0.08, 'sine'), // Arrow key navigation
      menuSelect: this.createBeepSound(660, 0.15, 'square'), // Menu selection
      
      // Snake game sounds
      snakeEat: this.createBeepSound(523, 0.2, 'square'), // Apple eaten
      snakeWin: this.createVictorySound(), // Game completed
      snakeMove: this.createBeepSound(110, 0.03, 'sine'), // Snake movement (subtle)
      
      // Stage transitions
      warning: this.createDramaticSound(), // Warning appears
      intro: this.createFanfareSound(), // Flashy intro
      success: this.createSuccessSound(), // General success
    };

    this.sounds = soundFiles;
  }

  // Create simple beep sound
  createBeepSound(frequency, duration, waveType = 'sine') {
    return () => {
      if (!this.audioContext || this.isMuted) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = waveType;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    };
  }

  // Create dramatic warning sound
  createDramaticSound() {
    return () => {
      if (!this.audioContext || this.isMuted) return;
      
      // Low dramatic tone
      const osc1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      
      osc1.connect(gain1);
      gain1.connect(this.audioContext.destination);
      
      osc1.frequency.setValueAtTime(80, this.audioContext.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.5);
      osc1.type = 'sawtooth';
      
      gain1.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain1.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.1);
      gain1.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
      
      osc1.start();
      osc1.stop(this.audioContext.currentTime + 0.8);
    };
  }

  // Create fanfare sound for intro
  createFanfareSound() {
    return () => {
      if (!this.audioContext || this.isMuted) return;
      
      const notes = [262, 330, 392, 523]; // C, E, G, C
      notes.forEach((freq, index) => {
        setTimeout(() => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          
          osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
          osc.type = 'square';
          
          gain.gain.setValueAtTime(0, this.audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
          
          osc.start();
          osc.stop(this.audioContext.currentTime + 0.3);
        }, index * 100);
      });
    };
  }

  // Create victory sound for snake game
  createVictorySound() {
    return () => {
      if (!this.audioContext || this.isMuted) return;
      
      // Victory melody
      const melody = [523, 659, 784, 1047]; // C, E, G, C (higher octave)
      melody.forEach((freq, index) => {
        setTimeout(() => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          
          osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
          osc.type = 'triangle';
          
          gain.gain.setValueAtTime(0, this.audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
          
          osc.start();
          osc.stop(this.audioContext.currentTime + 0.4);
        }, index * 150);
      });
    };
  }

  // Create success sound
  createSuccessSound() {
    return () => {
      if (!this.audioContext || this.isMuted) return;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.3);
    };
  }

  // Start background music
  startBackgroundMusic() {
    if (this.backgroundMusic || this.isMuted || !this.audioContext) return;
    
    try {
      // Create a simple ambient background track
      this.createAmbientMusic();
    } catch (error) {
      console.warn('Background music failed:', error);
    }
  }

  // Create ambient retro music
  createAmbientMusic() {
    // Create a simple chord progression loop
    const chords = [
      [220, 277, 330], // Am
      [196, 247, 294], // G
      [175, 220, 262], // F
      [196, 247, 294], // G
    ];
    
    let chordIndex = 0;
    
    const playChord = () => {
      if (this.isMuted || !this.audioContext) return;
      
      const chord = chords[chordIndex];
      const oscillators = [];
      const gains = [];
      
      chord.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, this.audioContext.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(this.musicVolume * 0.05, this.audioContext.currentTime + 3.5);
        gain.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + 4);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 4);
        
        oscillators.push(osc);
        gains.push(gain);
      });
      
      chordIndex = (chordIndex + 1) % chords.length;
    };
    
    // Start the ambient loop
    playChord();
    this.backgroundMusic = setInterval(playChord, 4000); // Every 4 seconds
  }

  // Play a specific sound effect
  playSound(soundName) {
    if (!this.initialized) {
      this.init().then(() => {
        if (this.sounds[soundName]) {
          this.sounds[soundName]();
        }
      });
      return;
    }
    
    if (this.sounds[soundName] && !this.isMuted) {
      this.sounds[soundName]();
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted && this.backgroundMusic) {
      clearInterval(this.backgroundMusic);
      this.backgroundMusic = null;
    } else if (!this.isMuted && !this.backgroundMusic) {
      this.startBackgroundMusic();
    }
    
    return this.isMuted;
  }

  // Set volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Set music volume
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  // Stop all audio
  stopAll() {
    if (this.backgroundMusic) {
      clearInterval(this.backgroundMusic);
      this.backgroundMusic = null;
    }
  }

  // Get audio status
  getStatus() {
    return {
      initialized: this.initialized,
      muted: this.isMuted,
      volume: this.volume,
      musicVolume: this.musicVolume,
      backgroundMusicPlaying: !!this.backgroundMusic
    };
  }
}

// Create and export singleton instance
const audioManager = new AudioManager();
export default audioManager;