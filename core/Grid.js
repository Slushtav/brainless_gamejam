class Grid {
  constructor(scene) {
    this.scene = scene;

    this.cells = [];
    for (let r = 0; r < ROWS; r++) {
      this.cells[r] = new Array(COLS).fill(null);
    }
  }

  // ======================================================
  // SPAWN INITIAL GRID (ANTI INITIAL MATCH)
  // ======================================================
  spawnInitial(typePool, startRows = 3) {
    for (let r = 0; r < startRows; r++) {
      for (let c = 0; c < COLS; c++) {
        let type;
        do {
          type = Phaser.Math.RND.pick(typePool);
        } while (this.createsMatch(r, c, type));

        this.spawnBlock(r, c, type);
      }
    }
  }

  createsMatch(r, c, type) {
    // horizontal
    if (c >= 2) {
      const a = this.cells[r][c - 1];
      const b = this.cells[r][c - 2];
      if (a && b && a.type === type && b.type === type) {
        return true;
      }
    }

    // vertical
    if (r >= 2) {
      const a = this.cells[r - 1][c];
      const b = this.cells[r - 2][c];
      if (a && b && a.type === type && b.type === type) {
        return true;
      }
    }

    return false;
  }

  // ======================================================
  // BLOCK CREATION (IMAGE)
  // ======================================================
  spawnBlock(row, col, type) {
    const x = col * BLOCK_SIZE;
    const y = (ROWS - row - 1) * BLOCK_SIZE;

    const block = this.scene.add.image(x, y, type);
    block.setOrigin(0); // ⬅️ KUNCI UTAMA
    block.setDisplaySize(BLOCK_SIZE - 2, BLOCK_SIZE - 2);

    block.row = row;
    block.col = col;
    block.type = type;

    this.cells[row][col] = block;
    return block;
  }


  // ======================================================
  // TWEEN MOVE (GRID SAFE)
  // ======================================================
  tweenTo(block, row, col, duration = 80) {
    block.row = row;
    block.col = col;

    this.scene.tweens.add({
      targets: block,
      x: col * BLOCK_SIZE,
      y: (ROWS - row - 1) * BLOCK_SIZE,
      duration,
      ease: "Quad.easeOut"
    });
  }


  // ======================================================
  // DIRECT MOVE (NO ANIMATION)
  // ======================================================
  moveInstant(block, row, col) {
    block.row = row;
    block.col = col;
    block.x = col * BLOCK_SIZE;
    block.y = (ROWS - row - 1) * BLOCK_SIZE;
  }


  // ======================================================
  // CLEAR BLOCK
  // ======================================================
  remove(row, col) {
    const block = this.cells[row][col];
    if (!block) return;

    block.destroy();
    this.cells[row][col] = null;
  }

  // ======================================================
  // DEBUG / SAFETY
  // ======================================================
  inBounds(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
  }
}
