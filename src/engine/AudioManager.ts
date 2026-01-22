/**
 * Audio Manager - Handle sound effects and background music
 */

export interface SoundConfig {
  volume: number;
  loop: boolean;
  autoplay: boolean;
}

export class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private masterVolume: number = 1;
  private isMuted: boolean = false;

  constructor() {
    this.setupAudioContext();
  }

  private setupAudioContext(): void {
    // Create audio context for better control
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
  }

  private audioContext: AudioContext | null = null;

  public loadSound(name: string, url: string, config: SoundConfig = { volume: 1, loop: false, autoplay: false }): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      
      audio.volume = config.volume * this.masterVolume;
      audio.loop = config.loop;
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(name, audio);
        if (config.autoplay) {
          this.playSound(name);
        }
        resolve();
      }, { once: true });

      audio.addEventListener('error', (error) => {
        reject(new Error(`Failed to load sound: ${name}`));
      }, { once: true });

      audio.load();
    });
  }

  public playSound(name: string, volume: number = 1): void {
    const sound = this.sounds.get(name);
    if (sound && !this.isMuted) {
      sound.currentTime = 0;
      sound.volume = volume * this.masterVolume;
      sound.play().catch(error => {
        console.warn(`Failed to play sound: ${name}`, error);
      });
    }
  }

  public stopSound(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  public pauseSound(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
    }
  }

  public resumeSound(name: string): void {
    const sound = this.sounds.get(name);
    if (sound && !this.isMuted) {
      sound.play().catch(error => {
        console.warn(`Failed to resume sound: ${name}`, error);
      });
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setSoundVolume(name: string, volume: number): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume)) * this.masterVolume;
    }
  }

  public mute(): void {
    this.isMuted = true;
    this.updateAllVolumes();
  }

  public unmute(): void {
    this.isMuted = false;
    this.updateAllVolumes();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.updateAllVolumes();
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  private updateAllVolumes(): void {
    this.sounds.forEach((sound, name) => {
      sound.volume = this.isMuted ? 0 : sound.volume;
    });
  }

  public isSoundPlaying(name: string): boolean {
    const sound = this.sounds.get(name);
    return sound ? !sound.paused && sound.currentTime > 0 : false;
  }

  public getSoundDuration(name: string): number {
    const sound = this.sounds.get(name);
    return sound ? sound.duration : 0;
  }

  public getSoundCurrentTime(name: string): number {
    const sound = this.sounds.get(name);
    return sound ? sound.currentTime : 0;
  }

  public setSoundCurrentTime(name: string, time: number): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = Math.max(0, Math.min(time, sound.duration));
    }
  }

  public preloadSounds(soundUrls: Record<string, string>): Promise<void[]> {
    const promises = Object.entries(soundUrls).map(([name, url]) => 
      this.loadSound(name, url)
    );
    return Promise.all(promises);
  }

  public destroy(): void {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.src = '';
    });
    this.sounds.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}