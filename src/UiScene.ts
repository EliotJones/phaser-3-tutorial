import Phaser, { GameObjects } from "phaser";
import { sceneKeys } from "./consts";

export class UIScene extends Phaser.Scene {
    barContainer!: GameObjects.Container;
    scoreText!: Phaser.GameObjects.Text;
    pauseText!: Phaser.GameObjects.Text;
    bombs: number = 0;
    bombsText!: Phaser.GameObjects.Text;
    paused: boolean = false;

    constructor() {
        super(sceneKeys.UI);
    }

    preload() {
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('score-bar', 'assets/score-bar.png');
        this.load.spritesheet('pause-btn', 'assets/pause-btn.png', {
            frameHeight: 18,
            frameWidth: 18,
            startFrame: 0
        })
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

        const pauseBtn = this.add.sprite(400, 5 + 3, 'pause-btn', 0).setOrigin(0.5, 0).setScale(1.5);
        pauseBtn.setInteractive();
        pauseBtn.on('pointerover', () => {
            pauseBtn.setFrame(1);
            this.input.setDefaultCursor('pointer');
        });
        pauseBtn.on('pointerout', () => {
            pauseBtn.setFrame(0);
            this.input.setDefaultCursor('default');
        });
        pauseBtn.on('pointerup', () => {
            this.paused = !this.paused;
            if (this.paused) {
                pauseBtn.setTint(0xc0392b);
                this.scene.pause(sceneKeys.main);
                this.pauseText.setVisible(true);
                const mainScene = this.scene.get(sceneKeys.main);
                mainScene.sound.pauseAll();
            } else {
                pauseBtn.clearTint();
                this.scene.resume(sceneKeys.main);
                this.pauseText.setVisible(false);
                const mainScene = this.scene.get(sceneKeys.main);
                mainScene.sound.resumeAll();
            }
        })

        this.pauseText = this.add.text(400, 300, 'Paused', {
            font: '32px Consolas', fontStyle: 'bold', color: '#c0392b'
        }).setOrigin(0.5).setVisible(false);

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
        this.registry.events.off('changedata-score', this.updateScore);
        this.registry.events.off('changedata-bombs', this.updateBombs);
    }

    destroy() {
        this.registry.events.off('changedata-score', this.updateScore);
        this.registry.events.off('changedata-bombs', this.updateBombs);
    }

    init() {
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
        this.events.on(Phaser.Scenes.Events.DESTROY, this.destroy, this);
    }
}
