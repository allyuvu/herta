import { describe, it, expect } from 'vitest';
import {
  clamp,
  lerp,
  random,
  randomInt,
  rectCollision,
  circleCollision,
  distance,
  degToRad,
  radToDeg,
  angle,
  normalize,
  formatTime,
  formatNumber,
  isMobile,
  pointInRect,
  pointInCircle,
  generateId,
  shuffle
} from '@utils/helpers.js';

describe('Helper Functions', () => {
  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should linearly interpolate between values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it('should clamp t value', () => {
      expect(lerp(0, 10, -0.5)).toBe(0);
      expect(lerp(0, 10, 1.5)).toBe(10);
    });
  });

  describe('random', () => {
    it('should generate random number in range', () => {
      for (let i = 0; i < 100; i++) {
        const value = random(0, 10);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(10);
      }
    });
  });

  describe('randomInt', () => {
    it('should generate random integer in range', () => {
      for (let i = 0; i < 100; i++) {
        const value = randomInt(0, 10);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
        expect(Number.isInteger(value)).toBe(true);
      }
    });
  });

  describe('rectCollision', () => {
    it('should detect rectangle collision', () => {
      const rect1 = { x: 0, y: 0, width: 10, height: 10 };
      const rect2 = { x: 5, y: 5, width: 10, height: 10 };
      expect(rectCollision(rect1, rect2)).toBe(true);

      const rect3 = { x: 20, y: 20, width: 10, height: 10 };
      expect(rectCollision(rect1, rect3)).toBe(false);
    });
  });

  describe('circleCollision', () => {
    it('should detect circle collision', () => {
      const circle1 = { x: 0, y: 0, radius: 10 };
      const circle2 = { x: 5, y: 5, radius: 10 };
      expect(circleCollision(circle1, circle2)).toBe(true);

      const circle3 = { x: 25, y: 25, radius: 10 };
      expect(circleCollision(circle1, circle3)).toBe(false);
    });
  });

  describe('distance', () => {
    it('should calculate distance between points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
      expect(distance(0, 0, 0, 0)).toBe(0);
    });
  });

  describe('degToRad', () => {
    it('should convert degrees to radians', () => {
      expect(degToRad(0)).toBe(0);
      expect(degToRad(180)).toBeCloseTo(Math.PI, 5);
      expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 5);
    });
  });

  describe('radToDeg', () => {
    it('should convert radians to degrees', () => {
      expect(radToDeg(0)).toBe(0);
      expect(radToDeg(Math.PI)).toBeCloseTo(180, 5);
      expect(radToDeg(2 * Math.PI)).toBeCloseTo(360, 5);
    });
  });

  describe('angle', () => {
    it('should calculate angle between points', () => {
      expect(angle(0, 0, 1, 0)).toBeCloseTo(0, 5);
      expect(angle(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2, 5);
      expect(angle(0, 0, -1, 0)).toBeCloseTo(Math.PI, 5);
    });
  });

  describe('normalize', () => {
    it('should normalize vector', () => {
      const result = normalize(3, 4);
      expect(result.x).toBeCloseTo(0.6, 5);
      expect(result.y).toBeCloseTo(0.8, 5);
    });

    it('should handle zero vector', () => {
      const result = normalize(0, 0);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(3661)).toBe('61:01');
      expect(formatTime(0)).toBe('00:00');
    });
  });

  describe('formatNumber', () => {
    it('should format number with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(123)).toBe('123');
    });
  });

  describe('pointInRect', () => {
    it('should check if point is in rectangle', () => {
      const point = { x: 5, y: 5 };
      const rect = { x: 0, y: 0, width: 10, height: 10 };
      expect(pointInRect(point, rect)).toBe(true);

      const point2 = { x: 15, y: 15 };
      expect(pointInRect(point2, rect)).toBe(false);
    });
  });

  describe('pointInCircle', () => {
    it('should check if point is in circle', () => {
      const point = { x: 3, y: 4 };
      const circle = { x: 0, y: 0, radius: 10 };
      expect(pointInCircle(point, circle)).toBe(true);

      const point2 = { x: 15, y: 15 };
      expect(pointInCircle(point2, circle)).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = shuffle(array);
      
      expect(shuffled).toHaveLength(5);
      expect(shuffled).not.toEqual(array);
      
      // Check all elements are still present
      array.forEach(item => {
        expect(shuffled).toContain(item);
      });
    });
  });
});