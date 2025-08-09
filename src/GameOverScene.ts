import Phaser from "phaser";
import { sceneKeys } from "./consts";

export class GameOverScene extends Phaser.Scene {
    gameOverText!: Phaser.GameObjects.Text;

    constructor() {
        super(sceneKeys.gameOver);
    }

    create(data: any) {
        // Reset cursor to default in case it was stuck as pointer
        this.input.setDefaultCursor('default');
        
        this.add.text(400, 300, 'Game Over! Press "A" to play again.')
            .setOrigin(0.5);


        // Create key input
        this.input.keyboard!.on('keydown-A', () => {
            console.log('restart the scene');
            this.scene.stop(sceneKeys.gameOver);

            this.scene.start(sceneKeys.main, {});
        });
    }
}
