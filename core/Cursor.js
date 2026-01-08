class Cursor {
  constructor(scene) {
    this.scene = scene;
    this.row = 2;
    this.col = 2;

    this.rect = scene.add.rectangle(
      0, 0,
      BLOCK_SIZE * 2,
      BLOCK_SIZE,
      0xffffff,
      0.3
    ).setOrigin(0);

    this.update();
  }

  move(dx, dy) {
    this.col = Phaser.Math.Clamp(this.col + dx, 0, COLS - 2);
    this.row = Phaser.Math.Clamp(this.row + dy, 0, ROWS - 1);
    this.update();
  }

  update() {
    this.rect.x = this.col * BLOCK_SIZE;
    this.rect.y = (ROWS - this.row - 1) * BLOCK_SIZE;
  }
}
