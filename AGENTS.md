# AGENTS.md - Herta Game Collection

This file contains guidelines and commands for agentic coding agents working on this HTML5 game collection repository.

## Project Overview

This is a modern HTML5 game collection featuring 11 interactive games built with TypeScript, Vite, and modern web technologies. The project uses a modular architecture with shared game engine components.

## Build Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Build for production
```

### Testing
```bash
npm run test         # Run all tests
npm run test:ui      # Run tests with UI interface
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run typecheck    # Run TypeScript type checking
```

### Single Test Commands
```bash
# Run specific test file
npm run test -- tests/engine/BaseGame.test.ts

# Run tests matching pattern
npm run test -- --grep "BaseGame"

# Run tests in watch mode
npm run test -- --watch
```

## Project Structure

```
src/
├── engine/           # Shared game engine components
│   ├── BaseGame.ts   # Base game class with common functionality
│   ├── InputManager.ts # Input handling (keyboard, mouse, touch)
│   ├── AudioManager.ts # Sound effects and music management
│   └── AnimationManager.ts # Sprite animations and particle effects
├── games/            # Individual game implementations
│   ├── SnakeGame.ts  # Snake game implementation
│   ├── snake.html    # Snake game HTML template
│   └── SnakeGame.js  # Snake game entry point
├── utils/            # Utility functions and helpers
│   ├── helpers.ts    # Math, collision, formatting utilities
│   └── storage.ts    # Local storage management
└── styles/           # CSS stylesheets
    └── snake.css     # Snake game styles
```

## Code Style Guidelines

### Naming Conventions
- **Files**: PascalCase for classes (e.g., `SnakeGame.ts`), kebab-case for styles (e.g., `snake.css`)
- **Classes**: PascalCase (e.g., `BaseGame`, `InputManager`)
- **Methods/Functions**: camelCase (e.g., `updateHighScore`, `generateFood`)
- **Variables**: camelCase (e.g., `gameSpeed`, `currentFrame`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `GRID_SIZE`, `MAX_SCORE`)
- **Private members**: Prefix with underscore (e.g., `_animationId`, `_moveTimer`)

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use generic types where appropriate
- Always specify return types for public methods
- Use `readonly` for immutable properties
- Prefer `const` over `let` when possible

### Import/Export Patterns
```typescript
// Named exports preferred
export class BaseGame { }
export interface GameState { }

// Import with aliases
import { BaseGame, GameState } from '@engine/BaseGame.js';
import { randomInt, rectCollision } from '@utils/helpers.js';

// Default export for main entry points
export default SnakeGame;
```

### Error Handling
- Use try-catch blocks for async operations
- Log warnings for non-critical failures
- Throw errors for critical issues
- Always handle promise rejections
- Use proper error types and messages

### Code Organization
- Keep classes focused on single responsibility
- Use composition over inheritance when possible
- Extract common functionality into utility functions
- Group related methods together
- Use JSDoc comments for public APIs

## Game Development Patterns

### Base Game Class
All games should extend `BaseGame`:
```typescript
export class MyGame extends BaseGame {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, config);
  }

  public init(): void { /* Initialize game state */ }
  public update(deltaTime: number): void { /* Update game logic */ }
  public render(): void { /* Render game */ }
  public handleInput(event: Event): void { /* Handle input */ }
}
```

### State Management
- Use the base game state for common properties (score, level, etc.)
- Store game-specific state in private properties
- Use localStorage for persistent data via StorageManager
- Update high scores automatically through base class

### Input Handling
- Use InputManager for all input events
- Support keyboard, mouse, and touch inputs
- Provide mobile controls for touch devices
- Prevent default behaviors for game controls

### Performance Guidelines
- Use requestAnimationFrame for smooth animations
- Implement object pooling for frequently created objects
- Optimize rendering with dirty rectangle techniques
- Use efficient collision detection algorithms
- Monitor memory usage and clean up resources

## Testing Guidelines

### Unit Tests
- Test all public methods and properties
- Mock external dependencies (canvas, localStorage, etc.)
- Use descriptive test names and organize tests logically
- Test both success and failure scenarios
- Maintain high test coverage (>80%)

### Test Structure
```typescript
describe('ClassName', () => {
  beforeEach(() => {
    // Setup test fixtures
  });

  it('should do expected behavior', () => {
    // Arrange, Act, Assert
  });
});
```

### Game Testing
- Test game state transitions (start, pause, game over)
- Verify collision detection accuracy
- Test input handling and response
- Validate score calculations and high score updates
- Test edge cases and boundary conditions

## Development Workflow

### Before Making Changes
1. Run existing tests to ensure they pass
2. Check code formatting with `npm run format:check`
3. Run linting with `npm run lint`
4. Create a new branch for feature development

### After Making Changes
1. Run all tests and ensure they pass
2. Add or update tests for new functionality
3. Check code formatting and fix any issues
4. Run type checking to ensure no TypeScript errors
5. Test games manually in browser

### Commit Guidelines
- Use conventional commit messages (feat:, fix:, docs:, etc.)
- Include scope in commit messages (e.g., `feat(game): add snake game`)
- Keep commits focused and atomic
- Reference issues in commit messages when applicable

## Browser Compatibility

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
- Use Vite legacy plugin for older browser support
- Test in multiple browsers during development
- Provide fallbacks for unsupported features

## Security Considerations

- Never expose sensitive data in client-side code
- Validate all user inputs
- Use HTTPS for production deployments
- Sanitize user-generated content
- Implement proper CSP headers

## Deployment

### Build Process
- Run `npm run build` to create production assets
- Test built application locally with `npm run preview`
- Ensure all assets are properly optimized
- Verify game functionality in production build

### Environment Variables
- Use `.env` files for environment-specific configuration
- Never commit sensitive environment variables
- Provide default values for optional variables

## Troubleshooting

### Common Issues
- **Module resolution errors**: Check import paths and file extensions
- **TypeScript errors**: Verify types and interfaces are properly defined
- **Test failures**: Check mock implementations and test setup
- **Build failures**: Ensure all dependencies are properly installed

### Debug Tips
- Use browser dev tools for runtime debugging
- Enable source maps for easier debugging
- Use console logging sparingly and remove before production
- Test games on different devices and screen sizes

## Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)

### Tools
- ESLint for code linting
- Prettier for code formatting
- Vitest for testing
- TypeScript for type safety

### Best Practices
- Follow modern JavaScript/TypeScript patterns
- Use semantic HTML5 elements
- Implement responsive design principles
- Optimize for performance and accessibility