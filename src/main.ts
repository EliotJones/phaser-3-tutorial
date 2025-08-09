import Phaser, { Game } from "phaser";
import { UIScene } from "./UIScene";
import { MainScene } from "./MainScene";
import { GameOverScene } from "./GameOverScene";

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
