# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server)
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **TypeScript check**: `tsc --noEmit` (for type checking without building)

## Architecture Overview

This is a Phaser 3 platformer game built with TypeScript and Vite. The game uses a multi-scene architecture:

### Scene System
- **MainScene** (`src/MainScene.ts`): Core game logic, player movement, collision detection, and game state
- **UIScene** (`src/UIScene.ts`): Overlay UI showing score and bomb count, runs parallel to MainScene
- **GameOverScene** (in `src/main.ts`): Restart functionality after game over

Scenes communicate through the Phaser registry system (`this.registry.set/get`) for shared state like score and bomb count.

### Game Mechanics
- **Player movement**: Acceleration-based (not direct velocity) with world wrapping at screen edges
- **Star collection**: Stars respawn randomly after 2 seconds using `spawnableWorld` regions
- **Bomb spawning**: Every 9 stars collected, bombs spawn with physics
- **Jump debounce**: 200ms cooldown prevents double-jumping

### Technical Implementation
- **Physics**: Arcade physics with custom gravity (300 + 100 for player)
- **Type aliases**: Defined in `phaser-aliases.d.ts` for cleaner Phaser type usage
- **Audio**: Background music loops, sound effects for coins and game over
- **Debug**: Physics debug bodies enabled in development

### Key Files Structure
- `src/main.ts`: Game configuration and GameOverScene
- `src/MainScene.ts`: Primary game scene with all gameplay logic
- `src/UIScene.ts`: UI overlay scene for score display
- `src/consts.ts`: Scene key constants
- `src/phaser-aliases.d.ts`: TypeScript type aliases for Phaser objects

## Phaser Event Typing

When working with Phaser physics callbacks, use proper type casting:

```typescript
// At call site:
this.collectStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback

// In function definition:
collectStar(
    player: DynSprite,  // Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    star: ArcadeImage   // Phaser.Physics.Arcade.Image
) {
    // ...
}
```

## Asset Management
Game assets are in the `assets/` directory. All assets are preloaded in the `preload()` methods of respective scenes. Audio files include background music and sound effects for interactions.

## Game Configuration
- **Canvas size**: 800x600 pixels
- **Physics**: Arcade physics with world gravity of 300 and additional player gravity of 100
- **Debug mode**: Physics debug bodies are enabled by default in development
- **Scene management**: Scenes are defined in main.ts config and communicate via Phaser registry

## Development Notes
- Player has world wrapping enabled (exits left edge, appears on right)
- Stars use `spawnableWorld` regions for controlled random positioning
- Background clouds use parallax scrolling with different speeds
- Scene transitions use smooth fade effects for game over state
- Event listeners in UIScene are properly cleaned up on scene shutdown/destroy