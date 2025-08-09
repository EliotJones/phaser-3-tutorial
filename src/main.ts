import Phaser, { Game } from "phaser";
import { sceneKeys } from "./consts";
import { UIScene } from "./UIScene";
import { MainScene } from "./MainScene";

class GameOverScene extends Phaser.Scene {
    gameOverText!: Phaser.GameObjects.Text;

    constructor() {
        super(sceneKeys.gameOver);
    }

    create(data: any) {
        this.add.text(400, 300, 'Game Over! Press "A" to play again.')
            .setOrigin(0.5);


        // Create key input
        this.input.keyboard!.on('keydown-A', () => {
            console.log('restart the scene')
            this.scene.stop(sceneKeys.gameOver);

            this.scene.start(sceneKeys.main, {});
        });
    }
}

var config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene, UIScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300, x: 0 },
            debug: true
        }
    }
}

var game = new Phaser.Game(config);
