/**
 * Input Manager - Handle keyboard, mouse, and touch inputs
 */

export type InputHandler = (event: KeyboardEvent | MouseEvent | TouchEvent) => void;

export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private touchPosition: { x: number; y: number } = { x: 0, y: 0 };
  private handlers: Map<string, InputHandler[]> = new Map();

  constructor(private target: HTMLElement | Window = window) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Mouse events
    this.target.addEventListener('mousemove', this.handleMouseMove);
    this.target.addEventListener('mousedown', this.handleMouseDown);
    this.target.addEventListener('mouseup', this.handleMouseUp);

    // Touch events
    this.target.addEventListener('touchstart', this.handleTouchStart);
    this.target.addEventListener('touchmove', this.handleTouchMove);
    this.target.addEventListener('touchend', this.handleTouchEnd);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    this.keys.set(event.key, true);
    this.triggerHandler('keydown', event);
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.set(event.key, false);
    this.triggerHandler('keyup', event);
  };

  private handleMouseMove = (event: MouseEvent): void => {
    const rect = (this.target as HTMLElement).getBoundingClientRect();
    this.mousePosition.x = event.clientX - rect.left;
    this.mousePosition.y = event.clientY - rect.top;
    this.triggerHandler('mousemove', event);
  };

  private handleMouseDown = (event: MouseEvent): void => {
    this.triggerHandler('mousedown', event);
  };

  private handleMouseUp = (event: MouseEvent): void => {
    this.triggerHandler('mouseup', event);
  };

  private handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = (this.target as HTMLElement).getBoundingClientRect();
    this.touchPosition.x = touch.clientX - rect.left;
    this.touchPosition.y = touch.clientY - rect.top;
    this.triggerHandler('touchstart', event);
  };

  private handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = (this.target as HTMLElement).getBoundingClientRect();
    this.touchPosition.x = touch.clientX - rect.left;
    this.touchPosition.y = touch.clientY - rect.top;
    this.triggerHandler('touchmove', event);
  };

  private handleTouchEnd = (event: TouchEvent): void => {
    event.preventDefault();
    this.triggerHandler('touchend', event);
  };

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }

  public getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  public getTouchPosition(): { x: number; y: number } {
    return { ...this.touchPosition };
  }

  public addHandler(eventType: string, handler: InputHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  public removeHandler(eventType: string, handler: InputHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private triggerHandler(eventType: string, event: KeyboardEvent | MouseEvent | TouchEvent): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    
    if (this.target instanceof HTMLElement) {
      this.target.removeEventListener('mousemove', this.handleMouseMove);
      this.target.removeEventListener('mousedown', this.handleMouseDown);
      this.target.removeEventListener('mouseup', this.handleMouseUp);
      this.target.removeEventListener('touchstart', this.handleTouchStart);
      this.target.removeEventListener('touchmove', this.handleTouchMove);
      this.target.removeEventListener('touchend', this.handleTouchEnd);
    }

    this.handlers.clear();
    this.keys.clear();
  }
}