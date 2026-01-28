# AGENTS.md - Herta Game Collection

Guidelines and commands for agentic coding agents working on this HTML5 game collection repository.

## Project Overview

Collection of HTML5 games with vanilla JavaScript and CSS. Self-contained HTML files with embedded styles and scripts. Uses Vitest for testing with mocked browser APIs.

## Build Commands

### Development
```bash
# Games run directly in browser - no build required
# Open HTML files directly in browser for testing
```

### Testing
```bash
npm test              # Run all tests using Vitest
npm run test:coverage # Run tests with coverage report (≥80% required)
```

### Single Test Commands
```bash
npm test tests/engine/BaseGame.test.ts  # Run specific test file
npm test -- --grep "BaseGame"           # Run tests matching pattern
npm test -- --watch                     # Watch mode
npm test tests/engine/                   # Run directory tests
```

### Code Quality
```bash
npm run lint          # ESLint code quality checks
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes
npm run typecheck     # TypeScript type checking
npm audit             # Security audit
```

### CI/CD Requirements
- Tests must pass on Node.js 18.x and 20.x
- Code coverage ≥80%
- ESLint, Prettier, and TypeScript checks must pass
- Security audit must pass (moderate level or higher)

## Code Style Guidelines

### File Organization
- Each game is self-contained in a single HTML file
- Use embedded `<style>` and `<script>` tags
- Structure: HTML → CSS → JavaScript
- Test files mirror source structure in `/tests`

### Naming Conventions
- **HTML Files**: kebab-case (`snake.html`, `music-game.html`)
- **CSS Classes**: kebab-case (`game-container`, `score-display`)
- **Functions/Variables**: camelCase (`updateScore`, `gameSpeed`)
- **Constants**: UPPER_SNAKE_CASE (`GRID_SIZE`, `MAX_LIVES`)
- **HTML IDs**: kebab-case (`game-canvas`, `score-display`)

### TypeScript Guidelines
- Use explicit type annotations for parameters and returns
- Define interfaces for game state and configuration
- Import types with `import type` when only using types
- Use generics for reusable components
- Prefer `const` over `let`
- Use enum for game states and directions

### Import/Export Patterns
```typescript
// Type-only imports
import type { GameConfig, GameState } from './types';

// Named imports
import { describe, it, expect } from 'vitest';
import { BaseGame } from '@engine/BaseGame.js';

// Default exports for main classes
export default class Game extends BaseGame { }

// Named exports for utilities
export { calculateScore, validateInput };
```

### HTML/CSS Structure
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Title</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Microsoft JhengHei', Arial, sans-serif; }
    </style>
</head>
<body>
    <!-- HTML structure -->
    <script>
        // JavaScript game logic
    </script>
</body>
</html>
```

### JavaScript Guidelines
- Use modern ES6+ features appropriately
- Implement game loop with `requestAnimationFrame`
- Handle keyboard/mouse/touch inputs for cross-device compatibility
- Use `localStorage` for persistent data (high scores, settings)
- Implement proper event listeners and cleanup

### Error Handling
- Wrap critical operations in try-catch blocks
- Provide user-friendly error messages
- Log errors for debugging
- Implement graceful degradation for unsupported features
- Handle offline scenarios appropriately

### Testing Patterns
- Use Vitest with jsdom for DOM testing
- Mock browser APIs in `tests/setup.ts`
- Test game logic independently from DOM manipulation
- Use descriptive test names: "should [expected behavior]"
- Structure tests with describe/it blocks

### Game Development Patterns
#### Base Game Structure
```javascript
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.isRunning = false;
        this.init();
    }
    
    init() { /* Initialize game */ }
    update(deltaTime) { /* Update game logic */ }
    render() { /* Render game */ }
    handleInput(event) { /* Handle user input */ }
    gameLoop() { /* Main game loop */ }
}
```

#### Performance & Input
- Support keyboard, mouse, and touch inputs
- Use event delegation for dynamic elements
- Implement object pooling for frequently created objects
- Use `requestAnimationFrame` for smooth animations
- Optimize canvas rendering with dirty rectangles

## Browser Compatibility & Workflow

### Target Browsers
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile responsive design with viewport meta tag

### Development Workflow
1. Run tests: `npm test` (coverage ≥80% required)
2. Run linting: `npm run lint` and `npm run format:check`
3. Type checking: `npm run typecheck`
4. Test games manually in multiple browsers
5. Include game name in commits: `feat(snake): add power-up system`

### Security & Deployment
- Validate all user inputs and sanitize content
- Use HTTPS for production, implement CSP headers
- Never expose sensitive data in client-side code
- Games are static files ready for deployment