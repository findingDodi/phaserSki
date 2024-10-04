import { Physics } from "phaser";
import { Obstacle } from "./Obstacle.js";

export class Player extends Physics.Arcade.Image {
    
    // Player states: waiting, start, can_move
    state = "waiting";
    scene = null;
    obstacles = null;

    constructor({scene}) {
        super(scene, 100, -190, "player");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        // Obstacles group to create pool
        this.obstacles = this.scene.physics.add.group({
            classType: Obstacle,
            maxSize: 100,
            runChildUpdate: true
        });
    }

    start() {
        this.state = "start";

        // player slides in from above to y=200
        this.scene.tweens.add({
            targets: this,
            y: 200,
            duration: 800,
            delay: 1000,
            ease: "Power2",
            yoyo: false,
            onComplete: () => {
                // When all tween are finished, the player can move
                this.state = "can_move";
            }
        });
    }

    move(direction) {
        if (this.state === "can_move") {
            if (direction === "left" && this.x - 10 > 0) {
                this.x -= 5;
            } else if (direction === "right" && this.x + 10 < this.scene.scale.width) {
                this.x += 5;
            }
        }
    }
    
    update() {
        // wiggle
        this.x += Math.sin(this.scene.time.now / 200) * 0.10;
    }

}