import { GameObjects, Math } from "phaser";

export class Obstacle extends GameObjects.Image
{
    speed;
    end_direction = new Math.Vector2(0, 0);
    possible_obsticles = ["house", "stone", "tree"];

    constructor(scene, x, y) {
        super(scene, x, y, "house");
        this.speed = Phaser.Math.GetSpeed(50, 1);
        this.name = "obstacle";
    }

    spawn(x, y) {
        let random_texture_index = Phaser.Math.RND.integerInRange(0, this.possible_obsticles.length - 1);
        this.setTexture(this.possible_obsticles[random_texture_index]);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.end_direction.setTo(0, -1);
    }

    // Update obstacle position and destroy if it goes offscreen
    update(time, delta){
        this.x += this.end_direction.x * this.speed * delta;
        this.y += this.end_direction.y * this.speed * delta;

        // Check if Obstacles are offscreen
        if (this.x > this.scene.sys.canvas.width || this.x < 0 || this.y < 0) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
}