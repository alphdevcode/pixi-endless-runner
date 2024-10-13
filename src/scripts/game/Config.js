import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";

export const Config = {
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    bgSpeed: .4,
    mainText: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        anchor: 0.5,
        style: {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 80,
            fill: ["#FFFFFF"]
        }
    },
    score: {
        x: window.innerWidth - 15,
        y: 10,
        anchor: {
            x: 1,
            y: 0
        },
        style: {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#FFFFFF"]
        }
    },
    diamonds: {
        chance: 0.4,
        offset: {
            min: 150,
            max: 250
        }
    },
    platforms: {
        moveSpeed: -2.5,
        ranges: {
            rows: {
                min: 2,
                max: 6
            },
            cols: {
                min: 3,
                max: 9
            },
            offset: {
                min: 100,
                max: 200
            }
        }
    },
    hero: {
        jumpSpeed: 15,
        maxJumps: 2,
        position: {
            x: 350,
            y: 595
        }
    },
    scenes: {
        "Game": GameScene
    }
};