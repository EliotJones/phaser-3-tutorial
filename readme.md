# Tasks:

- Work out how to correctly type events in Phaser (difficult, see notes)
- Add jump debounce timer to player
- Wrap world for player
- Randomize star placements
- Move score to a new scene
- Add game over and start scene

## Typing events

Need to cast the call site:

```
this.collectStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
```

When defining the function param types:

```
    collectStar(
        player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        star: Phaser.Physics.Arcade.Image
    ) {
        // ...
    }
```