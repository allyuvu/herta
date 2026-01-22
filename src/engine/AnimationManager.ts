/**
 * Animation Manager - Handle sprite animations and transitions
 */

export interface AnimationFrame {
  spriteX: number;
  spriteY: number;
  spriteWidth: number;
  spriteHeight: number;
  duration: number;
}

export interface AnimationConfig {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
  framerate: number;
}

export class AnimationManager {
  private animations: Map<string, AnimationConfig> = new Map();
  private currentAnimation: string | null = null;
  private currentFrame: number = 0;
  private frameTimer: number = 0;
  private isPlaying: boolean = false;

  constructor(private spriteSheet: HTMLImageElement) {}

  public addAnimation(config: AnimationConfig): void {
    this.animations.set(config.name, config);
  }

  public playAnimation(name: string, reset: boolean = true): void {
    const animation = this.animations.get(name);
    if (!animation) {
      console.warn(`Animation not found: ${name}`);
      return;
    }

    this.currentAnimation = name;
    this.isPlaying = true;

    if (reset) {
      this.currentFrame = 0;
      this.frameTimer = 0;
    }
  }

  public stopAnimation(): void {
    this.isPlaying = false;
  }

  public pauseAnimation(): void {
    this.isPlaying = false;
  }

  public resumeAnimation(): void {
    if (this.currentAnimation) {
      this.isPlaying = true;
    }
  }

  public update(deltaTime: number): void {
    if (!this.isPlaying || !this.currentAnimation) return;

    const animation = this.animations.get(this.currentAnimation)!;
    const frame = animation.frames[this.currentFrame];

    this.frameTimer += deltaTime;

    if (this.frameTimer >= frame.duration) {
      this.frameTimer = 0;
      this.currentFrame++;

      if (this.currentFrame >= animation.frames.length) {
        if (animation.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = animation.frames.length - 1;
          this.isPlaying = false;
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    if (!this.currentAnimation || !this.spriteSheet.complete) return;

    const animation = this.animations.get(this.currentAnimation)!;
    const frame = animation.frames[this.currentFrame];

    ctx.drawImage(
      this.spriteSheet,
      frame.spriteX,
      frame.spriteY,
      frame.spriteWidth,
      frame.spriteHeight,
      x,
      y,
      width,
      height
    );
  }

  public getCurrentFrame(): AnimationFrame | null {
    if (!this.currentAnimation) return null;

    const animation = this.animations.get(this.currentAnimation)!;
    return animation.frames[this.currentFrame];
  }

  public isAnimationPlaying(name: string): boolean {
    return this.currentAnimation === name && this.isPlaying;
  }

  public isAnimationComplete(name: string): boolean {
    const animation = this.animations.get(name);
    if (!animation) return true;

    return this.currentFrame === animation.frames.length - 1 && !this.isPlaying;
  }

  public setAnimationFrame(frame: number): void {
    const animation = this.currentAnimation ? this.animations.get(this.currentAnimation) : null;
    if (animation && frame >= 0 && frame < animation.frames.length) {
      this.currentFrame = frame;
      this.frameTimer = 0;
    }
  }

  public getCurrentAnimationName(): string | null {
    return this.currentAnimation;
  }

  public getAnimationProgress(): number {
    if (!this.currentAnimation) return 0;

    const animation = this.animations.get(this.currentAnimation)!;
    return (this.currentFrame + 1) / animation.frames.length;
  }
}

/**
 * Particle System - Handle particle effects
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

export interface ParticleConfig {
  x: number;
  y: number;
  count: number;
  velocity: { min: number; max: number };
  life: { min: number; max: number };
  size: { min: number; max: number };
  colors: string[];
  gravity: number;
  fadeOut: boolean;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private isActive: boolean = true;

  constructor(private canvas: HTMLCanvasElement) {}

  public emit(config: ParticleConfig): void {
    for (let i = 0; i < config.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = config.velocity.min + Math.random() * (config.velocity.max - config.velocity.min);
      const life = config.life.min + Math.random() * (config.life.max - config.life.min);
      const size = config.size.min + Math.random() * (config.size.max - config.size.min);
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];

      this.particles.push({
        x: config.x,
        y: config.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: life,
        maxLife: life,
        size: size,
        color: color,
        alpha: 1
      });
    }
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;

    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity
      particle.life -= deltaTime;

      if (particle.fadeOut) {
        particle.alpha = particle.life / particle.maxLife;
      }

      return particle.life > 0;
    });
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  public clear(): void {
    this.particles = [];
  }

  public setActive(active: boolean): void {
    this.isActive = active;
  }

  public getParticleCount(): number {
    return this.particles.length;
  }
}