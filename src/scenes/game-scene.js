import Phaser from "../lib/Phaser.js";
import { BOX_ASSETS_KEYS } from "../assets/asset-key.js";
import { SCENES_KEY } from "./scene-keys.js";

export class GameScene extends Phaser.Scene {
    score = 0;
    text;
    timedEvent;
    box;
    object = [];
    platforms;
    constructor() {
        super({
            key: SCENES_KEY.GAME_SCENE,
            physics: {
                arcade: {
                    debug: false,
                    gravity: { y: 100 }
                },
            }
        });
    }

    init() {
        console.log("init");
    }

    /**
     * load assets here
     */
    preload() {
        this.load.image(BOX_ASSETS_KEYS.BOX, '../src/assets/box.png')
        this.load.image(BOX_ASSETS_KEYS.Ball1, '../src/assets/red1.png')
        this.load.image(BOX_ASSETS_KEYS.Ball2, '../src/assets/red2.png')
        this.load.image(BOX_ASSETS_KEYS.Ball3, '../src/assets/white1.png')
    }

    create() {
        const textConfig = {
            x: (window.innerWidth - 80) / 2,
            y: 10,
            text: this.score.toString(),
            style: {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: '#ffffff',
                metrics: {
                    ascent: 45,
                    descent: 10,
                    fontSize: 55
                }
            }
        };
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(10, window.innerHeight + 10, '', '', false).setScale(0.2).refreshBody();

        this.text = this.make.text(textConfig);
        this.timedEvent = this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });

        this.box = this.physics.add.sprite(10, window.innerHeight - 80, BOX_ASSETS_KEYS.BOX).setScale(0.4).setOrigin(0)
        this.box.setInteractive({ draggable: true });

        this.box.setBounce(0.2);
        this.box.setCollideWorldBounds(true);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            if (dragY > 0 && window.innerHeight - 80 >= dragY) {
                gameObject.y = dragY;
            }
            if (dragX > 0 && window.innerWidth - 80 >= dragX) {
                gameObject.x = dragX;
            }
        });

        this.input.keyboard.on('keydown', this.handleKeyDown, this);
        this.input.keyboard.on('keyup', this.handleKeyUp, this);
    }

    update() {
        this.text.setText(this.score.toString())
    }

    onEvent() {
        if (this.object.length > 10) return;
        const random = Math.random()
        const arr = [BOX_ASSETS_KEYS.Ball1, BOX_ASSETS_KEYS.Ball2, BOX_ASSETS_KEYS.Ball3]
        const randomIndex = Math.floor(Math.random() * arr.length);

        let result = random * (window.innerWidth - 80);
        const object = this.physics.add.sprite(result, -100, arr[randomIndex]).setSize(200, 200);
        switch (randomIndex) {
            case 0:
                object.setScale(0.1);
                break;
            case 1:
                object.setScale(0.07);
                break;
            case 2:
                object.setScale(0.11);
                break;

            default:
                break;
        }
        this.physics.add.overlap(this.box, object, this.collectDec, this.collectDec, this);
        this.physics.add.overlap(object, this.platforms, this.objectfall, this.objectfall, this);
    }

    collectDec(box, object) {
        if (object.y < box.y) {
            // console.log('object hit the top side of the box');
            object.destroy(true);
            this.score++
            if (this.score > 10) {
                this.physics.world.gravity.y = 400 + this.score;
            }
        } else if (object.y > box.y + box.height) {
            // console.log('object hit the bottom side of the box');
        } else if (object.x < box.x) {
            object.setVelocity(-100, object.body.velocity.y)
            // console.log('object hit the left side of the box');
        } else if (object.x < box.x + box.width) {
            // console.log('object hit the right side of the box');
            object.setVelocity(100, object.body.velocity.y)
        }
    }

    objectfall(object, platform) {
        object.destroy(true);
    }

    handleKeyDown(event) {
        // Handle keydown events
        switch (event.code) {
            case 'ArrowLeft':
                // Move box left
                this.box.setVelocityX(-500);
                break;
            case 'ArrowRight':
                // Move box right
                this.box.setVelocityX(500);
                break;
        }
    }
    
    handleKeyUp(event) {
        // Handle keydown events
        this.box.setVelocity(0)
    }

}