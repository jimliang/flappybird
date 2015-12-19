/**
 * Created by jimliang on 2015/12/18 0018.
 */
import Phaser from 'Phaser';

export default class MenuState extends Phaser.State {

    create() {
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background').autoScroll(-10, 0); //背景图
        this.game.add.tileSprite(0, this.game.height - 112, this.game.width, 112, 'ground').autoScroll(-100, 0); //地板
        let titleGroup = this.game.add.group(); //创建存放标题的组
        titleGroup.create(0, 0, 'title'); //标题
        let bird = titleGroup.create(190, 10, 'bird'); //添加bird到组里
        bird.animations.add('fly'); //添加动画
        bird.animations.play('fly', 12, true); //播放动画
        titleGroup.x = this.game.width / 2 -titleGroup.width /2 ;
        titleGroup.y = 100;
        this.game.add.tween(titleGroup).to({y: 120}, 1000, null, true, 0, Number.MAX_VALUE, true); //标题的缓动动画
        let btn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'btn', function () {//开始按钮
            this.game.state.start('play');
        });
        btn.anchor.setTo(0.5, 0.5);
    }
}