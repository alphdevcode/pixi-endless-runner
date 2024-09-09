import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../system/App';

export class Hero {
    constructor() {
        this.createSprite();
        this.createBody();
        App.app.ticker.add(this.update, this);

        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpCount = 0;
        this.score = 0;
    }

    collectDiamond(diamond) {
        this.score+=10;
        this.sprite.emit("score");
        diamond.destroy();
    }

    startJump() {
        if (this.platform || this.jumpCount === 1) {
            ++this.jumpCount;
            this.platform = null;
            Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
        }
    }

    stayOnPlatform(platform) {
        this.platform = platform;
        this.jumpCount = 0;
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height, {friction: 0});
        Matter.World.add(App.physics.world, this.body);
        this.body.gameHero = this;
    }

    update() {
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;

        if (this.sprite.y > window.innerHeight || this.sprite.x < 0) {
            this.sprite.emit("die");
        }
    }

    createSprite() {
        this.sprite = new PIXI.AnimatedSprite([
            App.res("TV-Walk1"),
            App.res("TV-Walk2"),
            App.res("TV-Walk3"),
            App.res("TV-Walk4"),
            App.res("TV-Walk5"),
            App.res("TV-Walk6"),
            App.res("TV-Walk7"),
            App.res("TV-Walk8"),
            App.res("TV-Walk9"),
            App.res("TV-Walk10"),
            App.res("TV-Walk11"),
            App.res("TV-Walk12"),
            App.res("TV-Walk13"),
            App.res("TV-Walk14"),
            App.res("TV-Walk15"),
            App.res("TV-Walk16"),
            App.res("TV-Walk17"),
            App.res("TV-Walk18")
        ]);

        this.sprite.x = App.config.hero.position.x;
        this.sprite.y = App.config.hero.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = .7;
        this.sprite.play();
    }

    destroy() {
        App.app.ticker.remove(this.update, this);
        Matter.World.add(App.physics.world, this.body);
        this.sprite.destroy();
    }
}