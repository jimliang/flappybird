import Phaser from 'Phaser';

export default class BootState extends Phaser.State {

    preload() {
        if (!this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
        this.game.load.image('loading', 'assets/preloader.gif');
    }

    create() {
        this.game.state.start('preload'); //跳转到资源加载页面
    };
}
