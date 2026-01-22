/**
 * Storage utilities for game data persistence
 */

export interface StorageData {
  [key: string]: any;
}

export class StorageManager {
  private prefix: string;

  constructor(prefix: string = 'herta_game_') {
    this.prefix = prefix;
  }

  /**
   * Save data to localStorage
   */
  public save(key: string, data: any): boolean {
    try {
      const prefixedKey = this.prefix + key;
      const serializedData = JSON.stringify(data);
      localStorage.setItem(prefixedKey, serializedData);
      return true;
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  public load<T>(key: string, defaultValue?: T): T | null {
    try {
      const prefixedKey = this.prefix + key;
      const serializedData = localStorage.getItem(prefixedKey);
      if (serializedData === null) {
        return defaultValue || null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
      return defaultValue || null;
    }
  }

  /**
   * Remove data from localStorage
   */
  public remove(key: string): boolean {
    try {
      const prefixedKey = this.prefix + key;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.warn('Failed to remove data from localStorage:', error);
      return false;
    }
  }

  /**
   * Check if key exists in localStorage
   */
  public exists(key: string): boolean {
    const prefixedKey = this.prefix + key;
    return localStorage.getItem(prefixedKey) !== null;
  }

  /**
   * Get all keys with prefix
   */
  public getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  /**
   * Clear all data with prefix
   */
  public clearAll(): boolean {
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => this.remove(key));
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage data:', error);
      return false;
    }
  }

  /**
   * Save high score
   */
  public saveHighScore(gameName: string, score: number): boolean {
    const currentHighScore = this.getHighScore(gameName);
    if (score > currentHighScore) {
      return this.save(`${gameName}_highscore`, score);
    }
    return true;
  }

  /**
   * Get high score
   */
  public getHighScore(gameName: string): number {
    return this.load(`${gameName}_highscore`, 0) as number;
  }

  /**
   * Save game settings
   */
  public saveSettings(settings: StorageData): boolean {
    return this.save('settings', settings);
  }

  /**
   * Get game settings
   */
  public getSettings(): StorageData {
    return this.load('settings', {}) as StorageData;
  }

  /**
   * Save game progress
   */
  public saveProgress(gameName: string, progress: StorageData): boolean {
    return this.save(`${gameName}_progress`, progress);
  }

  /**
   * Get game progress
   */
  public getProgress(gameName: string): StorageData {
    return this.load(`${gameName}_progress`, {}) as StorageData;
  }
}

/**
 * Export default storage manager instance
 */
export const storage = new StorageManager();