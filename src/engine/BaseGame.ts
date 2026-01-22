/**
 * Base Game Engine - Core game functionality
 */

export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  score: number;
  highScore: number;
  level: number;
}

export interface GameConfig {
  width: number;
  height: number;
  backgroundColor: string;
  fps: number;
}

export abstract class BaseGame {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected config: GameConfig;
  protected state: GameState;
  protected animationId: number | null = null;
  protected lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;
    this.state = {
      isRunning: false,
      isPaused: false,
      score: 0,
      highScore: parseInt(localStorage.getItem(`${this.constructor.name}HighScore`) || '0'),
      level: 1
    };

    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.canvas.style.backgroundColor = this.config.backgroundColor;
  }

  abstract init(): void;
  abstract update(deltaTime: number): void;
  abstract render(): void;
  abstract handleInput(event: KeyboardEvent | MouseEvent | TouchEvent): void;

  public start(): void {
    if (this.state.isRunning) return;
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public pause(): void {
    this.state.isPaused = !this.state.isPaused;
  }

  public stop(): void {
    this.state.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public reset(): void {
    this.stop();
    this.state.score = 0;
    this.state.level = 1;
    this.init();
  }

  protected gameLoop = (): void => {
    if (!this.state.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (!this.state.isPaused) {
      this.update(deltaTime);
      this.render();
    }

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  protected updateHighScore(): void {
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      localStorage.setItem(`${this.constructor.name}HighScore`, this.state.highScore.toString());
    }
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getConfig(): GameConfig {
    return { ...this.config };
  }
}