import Phaser, { GameObjects } from "phaser";
import { sceneKeys } from "./consts";

export class UIScene extends Phaser.Scene {
    barContainer!: GameObjects.Container;
    scoreText!: Phaser.GameObjects.Text;
    bombs: number = 0;
    bombsText!: Phaser.GameObjects.Text;

    constructor() {
        super(sceneKeys.UI);
    }

    preload() {
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('score-bar', 'assets/score-bar.png');
    }

    create() {
        this.barContainer = this.add.container(0, 0);
        const img = this.add.image(5, 5, 'score-bar').setOrigin(0, 0)
            .setScale(1.5, 1);
        this.barContainer.add(img);
        const star = this.add.image(5 + 8, 5 + 6, 'star').setOrigin(0, 0)
            .setScale(0.8);
        const bomb = this.add.image(5 + 75, 5 + 6, 'bomb').setOrigin(0, 0)
            .setScale(1.2);
        this.barContainer.add(star);
        this.barContainer.add(bomb);

        const scoreTextX = 5 + 12 + star.displayWidth;
        const scoreTextY = 5 + 4;
        this.scoreText = this.add.text(scoreTextX, scoreTextY, `0`,
            {
                font: '22px Consolas', fontStyle: 'bold', color: '#FFF',
            });

        const bombTextX = bomb.x + bomb.displayWidth + 3;
        const bombTextY = 5 + 4;
        this.bombsText = this.add.text(bombTextX, bombTextY, `0`,
            {
                font: '22px Consolas', fontStyle: 'bold', color: '#FFF',
            });

        this.barContainer.add(this.scoreText);
        this.barContainer.add(this.bombsText);

        this.registry.events.on('changedata-score', this.updateScore, this);
        this.registry.events.on('changedata-bombs', this.updateBombs, this);
    }

    updateScore(parent: any, score: number) {
        this.scoreText.setText(`${score}`);
    }

    updateBombs(parent: any, bombs: number) {
        this.bombsText.setText(`${bombs}`);
    }

    shutdown() {
        // Called when the scene shuts down (but may be restarted later)
        this.registry.events.off('changedata-score', this.updateScore);
        this.registry.events.off('changedata-bombs', this.updateBombs);
    }

    destroy() {
        // Called when the scene is fully destroyed
        this.registry.events.off('changedata-score', this.updateScore);
        this.registry.events.off('changedata-bombs', this.updateBombs);
    }

    // Phaser 3 specific way to hook into lifecycle
    init() {
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
        this.events.on(Phaser.Scenes.Events.DESTROY, this.destroy, this);
    }
}
