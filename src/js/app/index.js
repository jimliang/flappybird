/**
 * Created by jimliang on 2015/12/18 0018.
 */
import Phaser from 'Phaser';
import BootState from './bootState';
import PreloadState from './preloadState';
import MenuState from './menuState';
import PlayState from './playState';

Phaser.Device.whenReady(()=> {
    let desktop = Phaser.Device.desktop;
    let game = new Phaser.Game(desktop ? 960 : 320, 505, Phaser.AUTO, 'game');

    game.state.add('boot', new BootState);
    game.state.add('preload', new PreloadState);
    game.state.add('menu', new MenuState);
    game.state.add('play', new PlayState);
    game.state.start('boot');
});
