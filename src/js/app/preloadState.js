/**
 * Created by jimliang on 2015/12/18 0018.
 */
import Phaser from 'Phaser';

export default class PreloadState extends Phaser.State {

    preload() {
        let preloadSprite = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'loading'); //创建显示loading进度的sprite
        preloadSprite.anchor.set(0.5);
        this.game.load.setPreloadSprite(preloadSprite);
        //以下为要加载的资源
        this.game.load.image('background', 'assets/background.png'); //背景
        this.game.load.image('ground', 'assets/ground.png'); //地面
        this.game.load.image('title', 'assets/title.png'); //游戏标题
        this.game.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3); //鸟
        this.game.load.image('btn', 'assets/start-button.png');  //按钮
        this.game.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2); //管道
        this.game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');
        this.game.load.audio('fly_sound', 'assets/flap.wav');//飞翔的音效
        this.game.load.audio('score_sound', 'assets/score.wav');//得分的音效
        this.game.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
        this.game.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效

        this.game.load.image('ready_text', 'assets/get-ready.png');
        this.game.load.image('play_tip', 'assets/instructions.png');
        this.game.load.image('game_over', 'assets/gameover.png');
        this.game.load.image('score_board', 'assets/scoreboard.png');
    }

    create() {
        this.game.state.start('menu');
    }
}