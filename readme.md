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

## Assets

Image assets from Phaser 3 tutorial:
- https://phaser.io/tutorials/making-your-first-phaser-3-game/part1

Sounds:
- Coin: Sound Effect by <a href="https://pixabay.com/users/liecio-3298866/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=190037">LIECIO</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=190037">Pixabay</a>
- Game over: https://pixabay.com/sound-effects/080047-lose-funny-retro-video-game-80925/
- Music: https://pixabay.com/sound-effects/be-more-serious-loop-275528/