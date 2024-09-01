import * as Matter from 'matter-js';
import * as PIXI from 'pixi.js';
import { LabelScore } from "./LabelScore";
import { App } from '../system/App';
import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import { Platforms } from "./Platforms";

export class GameScene extends Scene {
    create() {
        this.createBackground();
        this.createHero();
        this.createPlatforms();
        this.setEvents();
        this.createUI();

        this.handleCountdown();
    }

    async handleCountdown() {
        this.mainTextMessage = new PIXI.Text("Ready?", App.config.mainText.style);
        this.mainTextMessage.anchor.set(App.config.mainText.anchor);
        this.mainTextMessage.x =App.config.mainText.x;
        this.mainTextMessage.y = App.config.mainText.y;
        this.container.addChild(this.mainTextMessage);
    
        // We need to wait 1ms so game is initialized properly before pausinig for the countdown so everything is rendered properly
        await new Promise(resolve => setTimeout(resolve, 1));

        // wait for 1 seconds before starting the game
        App.app.ticker.stop();
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.mainTextMessage.visible = false;
        App.app.ticker.start();
    }

    handleGameOver() {
        this.mainTextMessage.text = "Game Over";
        this.mainTextMessage.visible = true;

        setTimeout(() => {
            App.scenes.start("Game");
        },  2000);
    }
    
    createUI() {
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);
        this.hero.sprite.on("score", () => {
            this.labelScore.renderScore(this.hero.score);
        });
    }
    
    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    onCollisionStart(event) {
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB];
        const hero = colliders.find(body => body.gameHero);
        const platform = colliders.find(body => body.gamePlatform);

        if (hero && platform) {
            this.hero.stayOnPlatform(platform.gamePlatform);
        }

        const diamond = colliders.find(body => body.gameDiamond);

        if (hero && diamond) {
            this.hero.collectDiamond(diamond.gameDiamond);
        }
    }

    createHero() {
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);

        this.container.interactive = true;
        this.container.on("pointerdown", () => {
            this.hero.startJump();
        });

        this.hero.sprite.once("die", () => {
            this.handleGameOver();
        });
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    createPlatforms() {
        this.platfroms = new Platforms();
        this.container.addChild(this.platfroms.container);
    }

    update(dt) {
        this.bg.update(dt);
        this.platfroms.update(dt);
    }

    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        App.app.ticker.remove(this.update, this);
        this.bg.destroy();
        this.hero.destroy();
        this.platfroms.destroy();
        this.labelScore.destroy();
        this.mainTextMessage.destroy();
    }
}