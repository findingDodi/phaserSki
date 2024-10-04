import { GameObjects, Physics } from "phaser";
import { Bullet } from "./Bullet";

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
        
        // Bullets group to create pool
        this.obstacles = this.scene.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });
    }

    start() {
        this.state = "start";

        // Effect to move the player from left to right
        this.scene.tweens.add({
            targets: this,
            y: 200,
            duration: 800,
            delay: 1000,
            ease: "Power2",
            yoyo: false,
            onUpdate: () => {},
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

    fire(x, y) {
        if (this.state === "can_move") {
            // Create bullet
            const bullet = this.obstacles.get();
            if (bullet) {
                bullet.fire(this.x + 16, this.y + 5, x, y);
            }
        }
    }
    
    update() {
        // Sinusoidal movement up and down up and down 2px
        this.x += Math.sin(this.scene.time.now / 200) * 0.10;
        //console.log(this.x, this.y);
    }

}