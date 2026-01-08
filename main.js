const config = {
  type: Phaser.AUTO,
  width: COLS * BLOCK_SIZE,
  height: ROWS * BLOCK_SIZE + 80,
  scene: [
    BootScene,
    MenuScene,
    GameScene
  ]
};

new Phaser.Game(config);
