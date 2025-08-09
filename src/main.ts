import Phaser, { GameObjects } from "phaser";

class MainScene extends Phaser.Scene {
    gameOver = false;
    score = 0;
    scoreText!: Phaser.GameObjects.Text;

    stars!: Grp;
    bombs!: Grp;
    player!: DynSprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor() {
        super('main')
    }

    preload() {
        const sky = this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        )
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        this.cursors = this.input.keyboard?.createCursorKeys();

        const platforms = this.physics.add.staticGroup();

        (platforms.create(400, 568, 'ground')).setScale(5, 2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(650, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(false);
        this.player.body.setGravityY(100);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: '4' }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, platforms);

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(child => (child as any).setBounceY(Phaser.Math.FloatBetween(0.2, 0.4)));
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px', color: '#021'
        });

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
    }

    collectStar(
        player: DynSprite,
        star: ArcadeImage
    ) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText(`score: ${this.score}`);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child: any) =>
                child.enableBody(true, child.x, 0, true, true));

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitBomb(player: any, bomb: any) {
        this.scene.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');

        this.gameOver = true;
    }

    update() {
        if (!this.cursors) {
            console.log('no cursors defined');
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.player.x < -10) {
            this.player.setX(805)
        }
        else if (this.player.x > 810) {
            this.player.setX(-5)
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-360);
        }
    }
}

var config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300, x: 0 },
            debug: true
        }
    }
}

var game = new Phaser.Game(config);
