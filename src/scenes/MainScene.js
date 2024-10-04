import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { BlueEnemy } from "../gameobjects/BlueEnemy";
import {Obstacle} from "../gameobjects/Obstacle.js";
import {Bullet} from "../gameobjects/Bullet.js";

export class MainScene extends Scene {
    player = null;
    enemy_blue = null;
    cursors = null;
    obstacles = null;

    points = 0;
    game_over_timeout = 20;

    constructor() {
        super("MainScene");

        
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points
        this.points = 100;
        this.game_over_timeout = 120;

        this.obstacles = this.physics.add.group({
            classType: Obstacle,
            maxSize: 100,
            runChildUpdate: true
        });
    }

    create() {
        //this.add.image(0, 0, "background").setOrigin(0, 0);
        //this.add.image(0, this.scale.height, "floor").setOrigin(0, 1);

        this.add.rectangle(
            0,
            0,
            this.scale.width,
            this.scale.height,
            0xffffff
        ).setOrigin(0, 0);   

        // Player
        this.player = new Player({ scene: this });

        // Enemy
        //this.enemy_blue = new BlueEnemy(this);

        // Cursor keys 
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.on("down", () => {
            this.player.fire();
        });
        this.input.on("pointerdown", (pointer) => {
            this.player.fire(pointer.x, pointer.y);
        });
        

        // Overlap enemy with bullets
        /*
        this.physics.add.overlap(this.player.bullets, this.enemy_blue, (enemy, bullet) => {
            bullet.destroyBullet();
            this.enemy_blue.damage(this.player.x, this.player.y);
            this.points += 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });
        
        // Overlap player with enemy bullets
        this.physics.add.overlap(this.enemy_blue.bullets, this.player, (player, bullet) => {
            bullet.destroyBullet();
            this.cameras.main.shake(100, 0.01);
            // Flash the color white for 300ms
            this.cameras.main.flash(300, 255, 10, 10, false);
            this.points -= 10;
            this.scene.get("HudScene").update_points(this.points);
        });
         */

        // Overlap player with obstacles
        this.physics.add.overlap(this.obstacles, this.player, (player, obstacle) => {
            obstacle.destroy();
            this.cameras.main.shake(100, 0.01);
            // Flash the color red for 300ms
            this.cameras.main.flash(300, 255, 10, 10, false);
            this.points -= 10;
            //this.scene.get("HudScene").update_points(this.points);
        });
         

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            //this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.player.start();
            //this.enemy_blue.start();
            
            // Game Over timeout
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    if (this.game_over_timeout === 0) {
                        // You need remove the event listener to avoid duplicate events.
                        this.game.events.removeListener("start-game");
                        // It is necessary to stop the scenes launched in parallel.
                        //this.scene.stop("HudScene");
                        this.scene.start("GameOverScene", { points: this.points });
                    } else {
                        this.game_over_timeout--;
                        //this.scene.get("HudScene").update_timeout(this.game_over_timeout);
                    }
                }
            });
        });
    }

    update() {
        this.player.update();
        //this.obstacle.update();
        //this.enemy_blue.update();

        if (this.points === 0) {
            // You need remove the event listener to avoid duplicate events.
            this.game.events.removeListener("start-game");
            // It is necessary to stop the scenes launched in parallel.
            //this.scene.stop("HudScene");
            this.scene.start("GameOverScene", { points: this.points });
        }

        for (let i = 0; i < 20; i++) {
            const current_obstacle = this.obstacles.get();
            if (current_obstacle) {
                let current_start_x = Phaser.Math.RND.integerInRange(0, this.scale.width);
                let current_start_y = Phaser.Math.RND.integerInRange(this.scale.height, this.scale.height + this.scale.height);
                current_obstacle.spawn(current_start_x, current_start_y);
            }
        }

        // Player movement entries
        if (this.cursors.left.isDown) {
            this.player.move("left");
        }
        if (this.cursors.right.isDown) {
            this.player.move("right");
        }

    }
}