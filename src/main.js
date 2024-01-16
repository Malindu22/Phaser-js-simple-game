import Phaser from "./lib/Phaser.js"
import { GameScene } from "./scenes/game-scene.js"
import { SCENES_KEY } from "./scenes/scene-keys.js"

const scaleRatio = window.devicePixelRatio / 3;

const game = new Phaser.Game({
    parent: 'game-mg',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE
    }
})
// console.log(window.innerHeight,window.innerWidth);
// const resizeObserver = new ResizeObserver(entries => 
//     console.log('Body height changed:', window.innerWidth)
// )
// resizeObserver.observe(document.body);


game.scene.add(SCENES_KEY.GAME_SCENE, GameScene)
game.scene.start(SCENES_KEY.GAME_SCENE)