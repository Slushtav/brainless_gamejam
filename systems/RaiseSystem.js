class RaiseSystem {
  static raise(grid, scene) {

    // =========================
    // GAME OVER CHECK
    // =========================
    for (let c = 0; c < COLS; c++) {
      if (grid.cells[ROWS - 1][c]) return false;
    }

    // =========================
    // SHIFT DATA (NO TWEEN)
    // =========================
    for (let r = ROWS - 1; r > 0; r--) {
      for (let c = 0; c < COLS; c++) {
        const block = grid.cells[r - 1][c];
        grid.cells[r][c] = block;

        if (block) {
          block.row = r;
          block.col = c;
        }
      }
    }

    // =========================
    // SPAWN NEW BOTTOM ROW
    // =========================
    for (let c = 0; c < COLS; c++) {
      const color = scene.nextRow[c];
      const block = grid.spawnBlock(0, c, color);

      // spawn slightly below
      block.y += BLOCK_SIZE;
    }

    // =========================
    // ANIMATE ALL BLOCKS (BATCH)
    // =========================
    const movingBlocks = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const block = grid.cells[r][c];
        if (block) {
          movingBlocks.push(block);
        }
      }
    }

    scene.tweens.add({
      targets: movingBlocks,
      y: block => (ROWS - block.row - 1) * BLOCK_SIZE,
      duration: 220,
      ease: "Sine.easeInOut"
    });

    // =========================
    // NEXT ROW PREVIEW
    // =========================
    scene.generateNextRow();
    return true;
  }
}
