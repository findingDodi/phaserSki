import { GameObjects, Math } from "phaser";

export class Obstacle extends GameObjects.Image
{
    speed;
    end_direction = new Math.Vector2(0, 0);

    constructor(scene, x, y) {
        super(scene, x, y, "house");
        this.speed = Phaser.Math.GetSpeed(450, 1);
        this.name = "obstacle";
    }

    spawn(x, y, targetX = 1, targetY = 0, obstacle_texture = "house")
    {
        // Change bullet change texture
        this.setTexture(obstacle_texture);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.end_direction.setTo(0, -1);
    }

    // Update obstacle position and destroy if it goes offscreen
    update (time, delta)
    {
        this.x += this.end_direction.x * this.speed * delta;
        this.y += this.end_direction.y * this.speed * delta;

        // Verifica si la bala ha salido de la pantalla
        if (this.x > this.scene.sys.canvas.width || this.x < 0 || this.y > this.scene.sys.canvas.height || this.y < 0) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
}