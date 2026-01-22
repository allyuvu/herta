import { BaseGame, GameConfig, GameState } from '@engine/BaseGame.js';
import { InputManager } from '@engine/InputManager.js';
import { AudioManager } from '@engine/AudioManager.js';
import { randomInt, rectCollision } from '@utils/helpers.js';
import { storage } from '@utils/storage.js';

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

export class SnakeGame extends BaseGame {
  private snake: SnakeSegment[] = [];
  private food: Food = { x: 0, y: 0 };
  private gridSize: number = 20;
  private direction: 'up' | 'down' | 'left' | 'right' = 'right';
  private nextDirection: 'up' | 'down' | 'left' | 'right' = 'right';
  private gameSpeed: number = 120;
  private moveTimer: number = 0;
  private inputManager: InputManager;
  private audioManager: AudioManager;

  constructor(canvas: HTMLCanvasElement) {
    const config: GameConfig = {
      width: 600,
      height: 400,
      backgroundColor: '#000',
      fps: 60
    };
    
    super(canvas, config);
    this.inputManager = new InputManager(canvas);
    this.audioManager = new AudioManager();
    this.setupEventListeners();
  }

  public async init(): Promise<void> {
    // Initialize snake with 3 segments
    this.snake = [
      { x: 5 * this.gridSize, y: 10 * this.gridSize },
      { x: 4 * this.gridSize, y: 10 * this.gridSize },
      { x: 3 * this.gridSize, y: 10 * this.gridSize }
    ];

    // Reset game state
    this.direction = 'right';
    this.nextDirection = 'right';
    this.state.score = 0;
    this.state.level = 1;
    this.gameSpeed = 120;

    // Load high score
    this.state.highScore = storage.getHighScore('snake');

    // Generate initial food
    this.generateFood();

    // Load sounds
    try {
      await this.audioManager.loadSound('eat', '/sounds/eat.mp3');
      await this.audioManager.loadSound('gameOver', '/sounds/gameover.mp3');
    } catch (error) {
      console.warn('Failed to load sounds:', error);
    }
  }

  private setupEventListeners(): void {
    this.inputManager.addHandler('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          if (this.direction !== 'down') this.nextDirection = 'up';
          break;
        case 'ArrowDown':
          if (this.direction !== 'up') this.nextDirection = 'down';
          break;
        case 'ArrowLeft':
          if (this.direction !== 'right') this.nextDirection = 'left';
          break;
        case 'ArrowRight':
          if (this.direction !== 'left') this.nextDirection = 'right';
          break;
        case ' ':
          this.pause();
          break;
        case 'Enter':
          this.reset();
          this.start();
          break;
      }
    });
  }

  private generateFood(): void {
    let foodOnSnake: boolean;
    do {
      foodOnSnake = false;
      this.food = {
        x: randomInt(0, Math.floor(this.config.width / this.gridSize) - 1) * this.gridSize,
        y: randomInt(0, Math.floor(this.config.height / this.gridSize) - 1) * this.gridSize
      };

      // Check if food is on snake
      for (const segment of this.snake) {
        if (segment.x === this.food.x && segment.y === this.food.y) {
          foodOnSnake = true;
          break;
        }
      }
    } while (foodOnSnake);
  }

  public update(deltaTime: number): void {
    if (!this.state.isRunning || this.state.isPaused) return;

    this.moveTimer += deltaTime;

    if (this.moveTimer >= this.gameSpeed) {
      this.moveTimer = 0;
      this.moveSnake();
    }
  }

  private moveSnake(): void {
    // Update direction
    this.direction = this.nextDirection;

    // Calculate new head position
    let head = { ...this.snake[0] };

    switch (this.direction) {
      case 'up':
        head.y -= this.gridSize;
        break;
      case 'down':
        head.y += this.gridSize;
        break;
      case 'left':
        head.x -= this.gridSize;
        break;
      case 'right':
        head.x += this.gridSize;
        break;
    }

    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= this.config.width ||
      head.y < 0 ||
      head.y >= this.config.height
    ) {
      this.gameOver();
      return;
    }

    // Check self collision
    for (const segment of this.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        this.gameOver();
        return;
      }
    }

    // Add new head
    this.snake.unshift(head);

    // Check food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.eatFood();
    } else {
      // Remove tail if no food eaten
      this.snake.pop();
    }
  }

  private eatFood(): void {
    // Increase score
    this.state.score += 10;
    this.audioManager.playSound('eat');

    // Increase speed every 50 points
    if (this.state.score % 50 === 0 && this.gameSpeed > 50) {
      this.gameSpeed -= 10;
      this.state.level++;
    }

    // Generate new food
    this.generateFood();
  }

  private gameOver(): void {
    this.stop();
    this.audioManager.playSound('gameOver');
    
    // Update high score
    storage.saveHighScore('snake', this.state.score);
    this.state.highScore = storage.getHighScore('snake');

    // Trigger game over event
    this.onGameOver();
  }

  protected onGameOver(): void {
    // Override in subclasses for custom game over behavior
    console.log(`Game Over! Score: ${this.state.score}`);
  }

  public render(): void {
    // Clear canvas
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);

    // Draw grid
    this.drawGrid();

    // Draw snake
    this.drawSnake();

    // Draw food
    this.drawFood();

    // Draw UI
    this.drawUI();
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= this.config.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.config.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.config.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.config.width, y);
      this.ctx.stroke();
    }
  }

  private drawSnake(): void {
    this.snake.forEach((segment, index) => {
      // Head is brighter green
      if (index === 0) {
        this.ctx.fillStyle = '#4CAF50';
      } else {
        // Body gradient effect
        const greenValue = Math.max(100, 255 - index * 15);
        this.ctx.fillStyle = `rgb(76, ${greenValue}, 80)`;
      }

      this.ctx.fillRect(segment.x, segment.y, this.gridSize, this.gridSize);

      // Draw border
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(segment.x, segment.y, this.gridSize, this.gridSize);

      // Draw eyes on head
      if (index === 0) {
        this.drawSnakeEyes(segment);
      }
    });
  }

  private drawSnakeEyes(head: SnakeSegment): void {
    this.ctx.fillStyle = '#000';
    const eyeSize = 2;
    const eyeOffset = 5;

    let eye1X: number, eye1Y: number, eye2X: number, eye2Y: number;

    switch (this.direction) {
      case 'right':
        eye1X = head.x + this.gridSize - eyeOffset;
        eye1Y = head.y + eyeOffset;
        eye2X = head.x + this.gridSize - eyeOffset;
        eye2Y = head.y + this.gridSize - eyeOffset;
        break;
      case 'left':
        eye1X = head.x + eyeOffset;
        eye1Y = head.y + eyeOffset;
        eye2X = head.x + eyeOffset;
        eye2Y = head.y + this.gridSize - eyeOffset;
        break;
      case 'up':
        eye1X = head.x + eyeOffset;
        eye1Y = head.y + eyeOffset;
        eye2X = head.x + this.gridSize - eyeOffset;
        eye2Y = head.y + eyeOffset;
        break;
      case 'down':
        eye1X = head.x + eyeOffset;
        eye1Y = head.y + this.gridSize - eyeOffset;
        eye2X = head.x + this.gridSize - eyeOffset;
        eye2Y = head.y + this.gridSize - eyeOffset;
        break;
    }

    // Draw eyes
    this.ctx.beginPath();
    this.ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawFood(): void {
    // Draw red apple
    this.ctx.fillStyle = '#ff4444';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x + this.gridSize / 2,
      this.food.y + this.gridSize / 2,
      this.gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw apple stem
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(this.food.x + this.gridSize / 2 - 1, this.food.y + 2, 2, 5);

    // Draw apple leaf
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.food.x + this.gridSize / 2 + 4,
      this.food.y + 4,
      3, 2, 0, 0, Math.PI * 2
    );
    this.ctx.fill();
  }

  private drawUI(): void {
    // Draw score
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.state.score}`, 10, 30);
    this.ctx.fillText(`High Score: ${this.state.highScore}`, 10, 55);
    this.ctx.fillText(`Level: ${this.state.level}`, 10, 80);

    // Draw pause indicator
    if (this.state.isPaused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.config.width, this.config.height);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '40px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.config.width / 2, this.config.height / 2);
      this.ctx.textAlign = 'left';
    }
  }

  public destroy(): void {
    super.stop();
    this.inputManager.destroy();
    this.audioManager.destroy();
  }
}