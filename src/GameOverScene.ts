import Phaser from "phaser";
import { sceneKeys } from "./consts";

export class GameOverScene extends Phaser.Scene {
    gameOverText!: Phaser.GameObjects.Text;

    constructor() {
        super(sceneKeys.gameOver);
    }

    create(data: any) {
        // Reset cursor state.
        this.input.setDefaultCursor('default');

        const score = data.score || 0;

        this.add.text(400, 300, 'Game Over! Press "A" to play again.')
            .setOrigin(0.5);

        this.add.text(400, 340, `Final Score: ${score}`, {
            font: '24px Consolas',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Listen for restart request.
        this.input.keyboard!.on('keydown-A', () => {
            this.scene.stop(sceneKeys.gameOver);
            this.scene.start(sceneKeys.main, {});
        });
    }
}
