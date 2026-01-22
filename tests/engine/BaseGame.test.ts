import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseGame, GameConfig } from '@engine/BaseGame.js';

describe('BaseGame', () => {
  let game: TestGame;
  let canvas: HTMLCanvasElement;
  let config: GameConfig;

  beforeEach(() => {
    canvas = global.createMockCanvas();
    config = {
      width: 600,
      height: 400,
      backgroundColor: '#000',
      fps: 60
    };
    game = new TestGame(canvas, config);
  });

  it('should initialize with correct configuration', () => {
    expect(game.getConfig()).toEqual(config);
    expect(game.getState().isRunning).toBe(false);
    expect(game.getState().isPaused).toBe(false);
    expect(game.getState().score).toBe(0);
  });

  it('should setup canvas correctly', () => {
    expect(canvas.width).toBe(config.width);
    expect(canvas.height).toBe(config.height);
    expect(canvas.style.backgroundColor).toBe(config.backgroundColor);
  });

  it('should start and stop game correctly', () => {
    game.start();
    expect(game.getState().isRunning).toBe(true);

    game.stop();
    expect(game.getState().isRunning).toBe(false);
  });

  it('should pause and resume game correctly', () => {
    game.start();
    game.pause();
    expect(game.getState().isPaused).toBe(true);

    game.pause();
    expect(game.getState().isPaused).toBe(false);
  });

  it('should reset game correctly', () => {
    game.start();
    game.state.score = 100;
    game.state.level = 5;

    game.reset();

    expect(game.getState().isRunning).toBe(false);
    expect(game.getState().score).toBe(0);
    expect(game.getState().level).toBe(1);
  });

  it('should update high score correctly', () => {
    game.state.score = 150;
    game.state.highScore = 100;

    game.updateHighScore();

    expect(game.getState().highScore).toBe(150);
  });

  it('should not update high score if score is lower', () => {
    game.state.score = 50;
    game.state.highScore = 100;

    game.updateHighScore();

    expect(game.getState().highScore).toBe(100);
  });
});

// Test implementation of BaseGame
class TestGame extends BaseGame {
  public init(): void {
    // Test implementation
  }

  public update(deltaTime: number): void {
    // Test implementation
  }

  public render(): void {
    // Test implementation
  }

  public handleInput(event: KeyboardEvent | MouseEvent | TouchEvent): void {
    // Test implementation
  }

  // Expose protected methods for testing
  public updateHighScore(): void {
    super.updateHighScore();
  }
}