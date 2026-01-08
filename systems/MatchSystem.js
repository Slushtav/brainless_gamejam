class MatchSystem {
  static find(grid) {
    const mark = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(false)
    );

    const check = (r, c, dr, dc) => {
      const type = grid.cells[r][c]?.type;
      let i = 1;
      while (
        grid.cells[r + dr * i]?.[c + dc * i] &&
        grid.cells[r + dr * i][c + dc * i].type === type
      ) i++;

      if (i >= 3)
        for (let k = 0; k < i; k++)
          mark[r + dr * k][c + dc * k] = true;
    };

    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (grid.cells[r][c]) {
          check(r, c, 1, 0);
          check(r, c, 0, 1);
        }

    return mark;
  }
}
