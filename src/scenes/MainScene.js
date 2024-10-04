import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { Obstacle } from "../gameobjects/Obstacle.js";

export class MainScene extends Scene {
    player = null;
    cursors = null;
    obstacles = null;

    points = 100;

    constructor() {
        super("MainScene");        
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points for a restart
        this.points = 100;

        this.obstacles = this.physics.add.group({
            classType: Obstacle,
            maxSize: 100,
            runChildUpdate: true
        });
    }

    create() {
        // set Background to white (like snow)
        this.add.rectangle(
            0,
            0,
            this.scale.width,
            this.scale.height,
            0xffffff
        ).setOrigin(0, 0);   

        this.player = new Player({ scene: this });
        this.cursors = this.input.keyboard.createCursorKeys();

        // Overlap player with obstacles
        this.physics.add.overlap(this.obstacles, this.player, (player, obstacle) => {
            obstacle.destroy();
            
            // Flash the color red for 300ms
            this.cameras.main.flash(300, 255, 10, 10, false);
            this.cameras.main.shake(100, 0.01);
            
            this.points -= 10;
            this.scene.get("HudScene").update_points(this.points);
        });
         

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene");
            this.player.start();            
        });
    }

    update() {
        this.player.update();

        if (this.points === 0) {
            // You need remove the event listener to avoid duplicate events.
            this.game.events.removeListener("start-game");
            
            // It is necessary to stop the scenes launched in parallel.
            this.scene.stop("HudScene");
            this.scene.start("GameOverScene");
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