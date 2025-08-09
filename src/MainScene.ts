import Phaser from "phaser";
import { sceneKeys } from "./consts";

export class MainScene extends Phaser.Scene {
    gameOver = false;
    score = 0;
    stars!: Grp;
    bombs!: Grp;
    player!: DynSprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    clouds: Ts[] = [];
    cloudSpeeds: number[] = [-0.1, 0.2, -0.6];

    maxSpeed = 320;
    accel = 600;
    drag = 700;
    lastJumpTime = 0;
    canJump = true;

    spawnableWorld: { x: number; y: number; width: number; yBot: number; }[] = [
        { x: 0, y: 0, width: 800, yBot: 220 - 16 },
        { x: 0, y: 250 + 16, width: 800, yBot: 400 - 16 },
        { x: 0, y: 400 + 16, width: 800, yBot: 568 - 16 }
    ];
    coinSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    gameOverSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    constructor() {
        super(sceneKeys.main);
    }

    preload() {
        // Images
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('cloud-bg', 'assets/cloud-bg.png');
        this.load.image('cloud-mg', 'assets/cloud-mg.png');
        this.load.image('cloud-fg', 'assets/cloud-fg.png');

        // Music
        this.load.audio('coin', 'assets/coin.mp3');
        this.load.audio('game-over', 'assets/game-over.mp3');
        this.load.audio('bg-music', 'assets/bg-music.mp3');

        // Animations
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        this.clouds = [
            this.add.tileSprite(0, 150, 800, 500, 'cloud-bg').setTileScale(1.2, 1.2).setOrigin(0, 0),
            this.add.tileSprite(0, 150, 800, 500, 'cloud-mg').setTileScale(1.2, 1.2).setOrigin(0, 0),
            this.add.tileSprite(0, 150, 800, 500, 'cloud-fg').setTileScale(1.2, 1.2).setOrigin(0, 0),
        ];

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.score = 0;

        this.registry.set('score', 0);
        this.registry.set('bombs', 0);
        const platforms = this.physics.add.staticGroup();

        this.scene.launch(sceneKeys.UI);
        this.scene.bringToTop(sceneKeys.UI);

        platforms.create(400, 568, 'ground').setScale(5, 2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(650, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(false);
        this.player.body.setGravityY(100);
        this.player.setMaxVelocity(this.maxSpeed, 500); // X, Y
        this.player.setDragX(this.drag);

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

        this.stars = this.physics.add.group();

        for (let i = 0; i < 11; i++) {
            const { x, y } = this.getRandomSpawn();
            this.stars.create(x, y, 'star');
        }

        this.stars.children.iterate(child => (child as any).setBounceY(Phaser.Math.FloatBetween(0.2, 0.4)));
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
        this.coinSound = this.sound.add('coin');
        this.gameOverSound = this.sound.add('game-over');
        this.sound.play('bg-music', {
            loop: true
        });
    }

    getRandomSpawn() {
        const halfStarHeight = 11;
        const regionIx = Phaser.Math.Between(0, this.spawnableWorld.length - 1);
        const region = this.spawnableWorld[regionIx];
        const x = Phaser.Math.Between(region.x, region.width - halfStarHeight);
        const y = Phaser.Math.Between(region.y + halfStarHeight, region.yBot - 22);

        return { x, y };
    }

    collectStar(
        player: DynSprite,
        star: ArcadeImage
    ) {
        const dbgColor = star.debugBodyColor;
        star.disableBody(true, true);
        star.setDebug(false, false, 0);

        this.score += 1;
        this.registry.set('score', this.score);
        this.coinSound.play({
            volume: 0.2
        });

        const timer = this.time.delayedCall(2000, () => {
            const { x, y } = this.getRandomSpawn();
            star.enableBody(true, x, y, true, true);

            star.setDebug(true, true, dbgColor);
            timer.destroy();
        }, undefined, this);

        if (this.score % 9 === 0 && this.score > 0) {

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

            this.registry.set('bombs', this.bombs.countActive());
        }
    }

    hitBomb(player: any, bomb: any) {
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.scene.pause();

        this.sound.stopByKey('bg-music');
        this.gameOverSound.play();

        this.gameOver = true;

        this.scene.stop(sceneKeys.UI);
        this.scene.stop(sceneKeys.main);

        this.scene.transition({
            target: sceneKeys.gameOver,
            duration: 1500,
            moveBelow: true,
            onUpdate: (progress: number) => {
                this.cameras.main.setAlpha(1 - progress);
            }
        });
    }

    update(time: number, delta: number) {
        const onGround = this.player.body.blocked.down;
        if (!this.cursors) {
            return;
        }

        // Reset jump ability when touching ground
        if (onGround && !this.canJump) {
            this.canJump = true;
        }

        if (this.cursors.left.isDown) {
            if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(0)
            }
            this.player.setAccelerationX(-this.accel);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            if (this.player.body.velocity.x < 0) {
                this.player.setVelocityX(0)
            }
            this.player.setAccelerationX(this.accel);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setAccelerationX(0);

            this.player.anims.play('turn');
        }

        if (this.player.x < -10) {
            this.player.setX(803);
        }
        else if (this.player.x > 810) {
            this.player.setX(-3);
        }

        for (let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].tilePositionX += this.cloudSpeeds[i] * (delta / 30);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)
            && this.canJump
            && time > this.lastJumpTime + 200) {
            this.player.setVelocityY(-360);
            this.lastJumpTime = time;
            this.canJump = false;
        }
    }
}
