/**
 * Created by jimliang on 2015/12/18 0018.
 */
import Phaser from 'Phaser';

export default class PlayState extends Phaser.State {

    create() {
        this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');//背景图
        this.pipeGroup = this.game.add.group();
        this.pipeGroup.enableBody = true;
        this.ground = this.game.add.tileSprite(0, this.game.height - 112, this.game.width, 112, 'ground'); //地板
        this.bird = this.game.add.sprite(50, 150, 'bird'); //鸟
        this.bird.animations.add('fly');
        this.bird.animations.play('fly', 12, true);
        this.bird.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.bird, Phaser.Physics.ARCADE); //开启鸟的物理系统
        this.bird.body.gravity.y = 0; //鸟的重力,未开始游戏，先先让他不动
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);//地面
        this.ground.body.immovable = true; //固定不动

        this.soundFly = this.game.add.sound('fly_sound');
        this.soundScore = this.game.add.sound('score_sound');
        this.soundHitPipe = this.game.add.sound('hit_pipe_sound');
        this.soundHitGround = this.game.add.sound('hit_ground_sound');
        this.scoreText = this.game.add.bitmapText(this.game.world.centerX - 20, 30, 'flappy_font', '0', 36);

        this.readyText = this.game.add.image(this.game.width / 2, 40, 'ready_text'); //get ready 文字
        this.playTip = this.game.add.image(this.game.width / 2, 300, 'play_tip'); //提示点击
        this.readyText.anchor.setTo(0.5, 0);
        this.playTip.anchor.setTo(0.5, 0);

        this.hasStarted = false; //游戏是否已开始
        this.game.time.events.loop(900, this.generatePipes, this);
        this.game.time.events.stop(false);
        this.game.input.onDown.addOnce(this.startGame, this);
    };

    update() {
        if (!this.hasStarted) return; //游戏未开始
        this.game.physics.arcade.collide(this.bird, this.ground, this.hitGround, null, this); //与地面碰撞
        this.game.physics.arcade.overlap(this.bird, this.pipeGroup, this.hitPipe, null, this); //与管道碰撞
        if (!this.bird.inWorld) this.hitCeil(); //出了边界
        if (this.bird.angle < 90) this.bird.angle += 2.5; //下降时头朝下
        this.pipeGroup.forEachExists(this.checkScore, this); //分数检测和更新
    }

    startGame() {
        this.gameSpeed = 200; //游戏速度
        this.gameIsOver = false;
        this.hasHitGround = false;
        this.hasStarted = true;
        this.score = 0;
        this.bg.autoScroll(-(this.gameSpeed / 10), 0);
        this.ground.autoScroll(-this.gameSpeed, 0);
        this.bird.body.gravity.y = 1150; //鸟的重力
        this.readyText.destroy();
        this.playTip.destroy();
        this.game.input.onDown.add(this.fly, this);
        this.game.time.events.start();
    }

    stopGame() {
        this.bg.stopScroll();
        this.ground.stopScroll();
        this.pipeGroup.forEachExists(function (pipe) {
            pipe.body.velocity.x = 0;
        }, this);
        this.bird.animations.stop('fly', 0);
        this.game.input.onDown.remove(this.fly, this);
        this.game.time.events.stop(true);
    }

    fly() {
        this.bird.body.velocity.y = -350;
        this.game.add.tween(this.bird).to({angle: -30}, 100, null, true, 0, 0, false); //上升时头朝上
        this.soundFly.play();
    }

    hitCeil() {//撞了天花板
        this.soundHitPipe.play();
        this.gameOver();
    }

    hitPipe() {
        if (this.gameIsOver) return;
        this.soundHitPipe.play();
        this.gameOver();
    }

    hitGround() {
        if (this.hasHitGround) return; //已经撞击过地面
        this.hasHitGround = true;
        this.soundHitGround.play();
        this.gameOver(true);
    }

    gameOver(show_text) {
        this.gameIsOver = true;
        this.stopGame();
        if (show_text) this.showGameOverText();
    };

    showGameOverText() {
        this.scoreText.destroy();
        this.game.bestScore = this.game.bestScore || 0;
        if (this.score > this.game.bestScore) this.game.bestScore = this.score; //最好分数
        this.gameOverGroup = this.game.add.group(); //添加一个组
        let gameOverText = this.gameOverGroup.create(this.game.width / 2, 0, 'game_over'); //game over 文字图片
        let scoreboard = this.gameOverGroup.create(this.game.width / 2, 70, 'score_board'); //分数板
        let currentScoreText = this.game.add.bitmapText(this.game.width / 2 + 60, 105, 'flappy_font', this.score + '', 20, this.gameOverGroup); //当前分数
        let bestScoreText = this.game.add.bitmapText(this.game.width / 2 + 60, 153, 'flappy_font', this.game.bestScore + '', 20, this.gameOverGroup); //最好分数
        let replayBtn = this.game.add.button(this.game.width / 2, 210, 'btn', function () {//重玩按钮
            this.game.state.start('play');
        }, this, null, null, null, null, this.gameOverGroup);
        gameOverText.anchor.setTo(0.5, 0);
        scoreboard.anchor.setTo(0.5, 0);
        replayBtn.anchor.setTo(0.5, 0);
        this.gameOverGroup.y = 30;
    }

    generatePipes(gap = 100) { //制造管道 gap上下管道之间的间隙宽度
        let position = (505 - 320 - gap) + Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random());
        let topPipeY = position - 360;
        let bottomPipeY = position + gap;

        if (this.resetPipe(topPipeY, bottomPipeY)) return;

        let topPipe = this.game.add.sprite(this.game.width, topPipeY, 'pipe', 0, this.pipeGroup);
        let bottomPipe = this.game.add.sprite(this.game.width, bottomPipeY, 'pipe', 1, this.pipeGroup);
        this.pipeGroup.setAll('checkWorldBounds', true);
        this.pipeGroup.setAll('outOfBoundsKill', true);
        this.pipeGroup.setAll('body.velocity.x', -this.gameSpeed);
    }

    resetPipe(topPipeY, bottomPipeY) {//重置出了边界的管道，做到回收利用
        let i = 0;
        this.pipeGroup.forEachDead(function (pipe) {
            if (pipe.y <= 0) { //topPipe
                pipe.reset(this.game.width, topPipeY);
                pipe.hasScored = false; //重置为未得分
            } else {
                pipe.reset(this.game.width, bottomPipeY);
            }
            pipe.body.velocity.x = -this.gameSpeed;
            i++;
        }, this);
        return i == 2; //如果 i==2 代表有一组管道已经出了边界，可以回收这组管道了
    }

    checkScore(pipe) {//负责分数的检测和更新
        if (!pipe.hasScored && pipe.y <= 0 && pipe.x <= this.bird.x - 17 - 54) {
            pipe.hasScored = true;
            this.scoreText.text = ++this.score;
            this.soundScore.play();
            return true;
        }
        return false;
    }

}