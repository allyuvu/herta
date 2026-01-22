import { SnakeGame } from './SnakeGame.js';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const overlay = document.getElementById('gameOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayMessage = document.getElementById('overlayMessage');
  const overlayButton = document.getElementById('overlayButton');
  
  const scoreElement = document.getElementById('score');
  const highScoreElement = document.getElementById('highScore');
  const levelElement = document.getElementById('level');
  
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  const mobileControls = document.getElementById('mobileControls');

  // Create game instance
  const game = new SnakeGame(canvas);

  // Initialize game
  game.init().then(() => {
    setupEventListeners();
    updateUI();
  });

  function setupEventListeners(): void {
    // Control buttons
    startBtn?.addEventListener('click', () => {
      game.start();
      hideOverlay();
    });

    pauseBtn?.addEventListener('click', () => {
      game.pause();
      if (game.getState().isPaused) {
        showOverlay('遊戲暫停', '按繼續按鈕或空格鍵繼續遊戲', '繼續遊戲');
      } else {
        hideOverlay();
      }
    });

    resetBtn?.addEventListener('click', () => {
      game.reset();
      game.init().then(() => {
        updateUI();
        showOverlay('遊戲重置', '按開始按鈕開始新遊戲', '開始遊戲');
      });
    });

    overlayButton?.addEventListener('click', () => {
      const buttonText = overlayButton.textContent;
      if (buttonText === '開始遊戲' || buttonText === '重新開始') {
        game.start();
        hideOverlay();
      } else if (buttonText === '繼續遊戲') {
        game.pause();
        hideOverlay();
      }
    });

    // Mobile controls
    const mobileButtons = mobileControls?.querySelectorAll('.mobile-control-btn');
    mobileButtons?.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const direction = (e.target as HTMLElement).dataset.direction;
        if (direction) {
          // Simulate keyboard input
          const keyboardEvent = new KeyboardEvent('keydown', {
            key: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`
          });
          canvas.dispatchEvent(keyboardEvent);
        }
      });
    });

    // Game over handler
    game.onGameOver = () => {
      const state = game.getState();
      showOverlay(
        '遊戲結束！',
        `最終分數: ${state.score} | 最高分: ${state.highScore}`,
        '重新開始'
      );
    };
  }

  function showOverlay(title: string, message: string, buttonText: string): void {
    if (overlayTitle) overlayTitle.textContent = title;
    if (overlayMessage) overlayMessage.textContent = message;
    if (overlayButton) overlayButton.textContent = buttonText;
    if (overlay) overlay.style.display = 'flex';
  }

  function hideOverlay(): void {
    if (overlay) overlay.style.display = 'none';
  }

  function updateUI(): void {
    const state = game.getState();
    
    if (scoreElement) scoreElement.textContent = state.score.toString();
    if (highScoreElement) highScoreElement.textContent = state.highScore.toString();
    if (levelElement) levelElement.textContent = state.level.toString();
  }

  // Update UI periodically
  setInterval(updateUI, 100);

  // Show mobile controls on touch devices
  if ('ontouchstart' in window) {
    mobileControls?.style.removeProperty('display');
  }

  // Initial overlay
  showOverlay('遊戲準備', '按開始按鈕開始遊戲', '開始遊戲');
});