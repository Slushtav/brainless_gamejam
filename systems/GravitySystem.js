class GravitySystem {
  static apply(grid) {
    let moved = false;

    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 1; r++) {
        if (!grid.cells[r][c] && grid.cells[r + 1][c]) {
          grid.cells[r][c] = grid.cells[r + 1][c];
          grid.cells[r + 1][c] = null;
          grid.tweenTo(grid.cells[r][c], r, c);
          moved = true;
        }
      }
    }

    return moved;
  }
}
