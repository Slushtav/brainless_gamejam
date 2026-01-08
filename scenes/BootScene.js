class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // MUSIC
    this.load.audio("bgm_menu", "assets/audio/bgm_menu.mp3");
    this.load.audio("bgm_game", "assets/audio/bgm_game.mp3");
    this.load.image("red", "assets/img/red.png");
    this.load.image("blue", "assets/img/blue.png");
    this.load.image("yellow", "assets/img/yellow.png");
    this.load.image("green", "assets/img/green.png");
    this.load.image("purple", "assets/img/purple.png");


  }

  create() {
    this.scene.start("MenuScene");
  }
}
