import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InputManager } from '@engine/InputManager.js';

describe('InputManager', () => {
  let inputManager: InputManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    inputManager = new InputManager(mockElement);
  });

  afterEach(() => {
    inputManager.destroy();
  });

  it('should initialize with empty state', () => {
    expect(inputManager.isKeyPressed('ArrowUp')).toBe(false);
    expect(inputManager.getMousePosition()).toEqual({ x: 0, y: 0 });
    expect(inputManager.getTouchPosition()).toEqual({ x: 0, y: 0 });
  });

  it('should track keyboard input correctly', () => {
    // Simulate key down
    const keyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(keyDownEvent);

    expect(inputManager.isKeyPressed('ArrowUp')).toBe(true);

    // Simulate key up
    const keyUpEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
    window.dispatchEvent(keyUpEvent);

    expect(inputManager.isKeyPressed('ArrowUp')).toBe(false);
  });

  it('should track mouse position correctly', () => {
    const rect = mockElement.getBoundingClientRect();
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: rect.left + 100,
      clientY: rect.top + 50
    });

    mockElement.dispatchEvent(mouseEvent);

    expect(inputManager.getMousePosition()).toEqual({ x: 100, y: 50 });
  });

  it('should track touch position correctly', () => {
    const rect = mockElement.getBoundingClientRect();
    const touch = new Touch({
      identifier: 0,
      clientX: rect.left + 75,
      clientY: rect.top + 25
    });

    const touchEvent = new TouchEvent('touchstart', {
      touches: [touch]
    });

    mockElement.dispatchEvent(touchEvent);

    expect(inputManager.getTouchPosition()).toEqual({ x: 75, y: 25 });
  });

  it('should add and remove event handlers correctly', () => {
    const handler = vi.fn();
    
    inputManager.addHandler('mousedown', handler);
    
    const mouseEvent = new MouseEvent('mousedown');
    mockElement.dispatchEvent(mouseEvent);

    expect(handler).toHaveBeenCalledWith(mouseEvent);

    inputManager.removeHandler('mousedown', handler);
    
    const mouseEvent2 = new MouseEvent('mousedown');
    mockElement.dispatchEvent(mouseEvent2);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should clean up resources on destroy', () => {
    const handler = vi.fn();
    inputManager.addHandler('click', handler);

    inputManager.destroy();

    const clickEvent = new MouseEvent('click');
    mockElement.dispatchEvent(clickEvent);

    expect(handler).not.toHaveBeenCalled();
  });
});