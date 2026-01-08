class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.mode = data.difficulty || "normal";
  }

  create() {
    // =========================
    // DIFFICULTY CONFIG
    // =========================
    const DIFFICULTY = {
      easy: { colors: 4, startRows: 2, baseRaise: 3600, minRaise: 1800, accel: 25 },
      normal: { colors: 4, startRows: 3, baseRaise: 2900, minRaise: 1300, accel: 45 },
      hard: { colors: 5, startRows: 3, baseRaise: 2000, minRaise: 700, accel: 60 }
    };

    this.diff = DIFFICULTY[this.mode];

    AudioManager.play(this, "bgm_game", 0.45);

  

    // =========================
    // GRID
    // =========================
    this.activeTypes = BLOCK_TYPES.slice(0, this.diff.colors);
    this.grid = new Grid(this);
    this.grid.spawnInitial(this.activeTypes, this.diff.startRows);
    this.cursor = new Cursor(this);

    // score system
    this.scoreSystem = new ScoreSystem(this);
    this.scoreText = this.add.text(8, 8, "SCORE: 0", {
      fontSize: "16px",
      color: "#ffffff"
    }).setDepth(10);
    


    // =========================
    // STATE
    // =========================
    this.chain = 0;
    this.resolving = false;
    this.isRaising = false;
    this.gameOver = false;

    // =========================
    // RAISE SYSTEM
    // =========================
    this.raiseInterval = this.diff.baseRaise;
    this.minRaiseInterval = this.diff.minRaise;
    this.raiseAccel = this.diff.accel;
    this.raiseTimer = 0;
    

    // =========================
    // UI
    // =========================
    this.diffText = this.add.text(
    this.scale.width - 8,
    8,
    this.mode.toUpperCase(),
    {
      fontSize: "14px",
      color: "#aaaaaa"
    }
  ) 
  .setOrigin(1, 0)   // kanan atas
  .setDepth(10);


    //ui function for score system
    this.updateScoreUI = (score, gain, chain) => {
      this.scoreText.setText(`SCORE: ${score}`);
      const cx = this.scale.width / 2;
      const cy = this.scale.height / 2;
      const gainText = this.add.text(cx, cy, `+${gain} (x${chain})`, {
        fontSize: "28px",
        color: "#ffff00"
      }).setOrigin(0.5);
      this.tweens.add({
        targets: gainText,
        y: cy - 50,
        alpha: 0,
        duration: 800,
        ease: "Cubic.easeOut",
        onComplete: () => gainText.destroy()
      });
    }
    
    // PREVIEW
    // =========================
    this.previewGroup = this.add.group();
    this.generateNextRow();

    // =========================
    // INPUT
    // =========================
    this.input.keyboard.enabled = true;
    this.input.keyboard.resetKeys();

    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.focus();

    this.input.on("pointerdown", () => {
      this.game.canvas.focus();
    });

    // INPUT
    this.input.keyboard.on("keydown", e => {
      if (this.gameOver || this.resolving || this.isRaising) return;

      switch (e.code) {
        case "KeyA": this.cursor.move(-1, 0); break;
        case "KeyD": this.cursor.move(1, 0); break;
        case "KeyW": this.cursor.move(0, 1); break;
        case "KeyS": this.cursor.move(0, -1); break;
        case "Space":
          this.swap();
          this.resolve();
          break;
      }
    });
  }

  // =========================
  generateNextRow() {
    this.previewGroup.clear(true, true);
    this.nextRow = [];

    for (let c = 0; c < COLS; c++) {
      const type = Phaser.Math.RND.pick(this.activeTypes);
      this.nextRow.push(type);

      const img = this.add.image(
        c * BLOCK_SIZE + BLOCK_SIZE / 2,
        ROWS * BLOCK_SIZE + BLOCK_SIZE / 2 + 6, 
        type
      );
      img.setDisplaySize(BLOCK_SIZE , BLOCK_SIZE );
      img.setAlpha(0.6);
      this.previewGroup.add(img);
    }
  }

  swap() {
    const r = this.cursor.row;
    const c = this.cursor.col;

    const a = this.grid.cells[r][c];
    const b = this.grid.cells[r][c + 1];

    this.grid.cells[r][c] = b;
    this.grid.cells[r][c + 1] = a;

    if (a) this.grid.tweenTo(a, r, c + 1);
    if (b) this.grid.tweenTo(b, r, c);
  }

  resolve() {
    if (this.resolving || this.isRaising) return;
    this.resolving = true;

    const mark = MatchSystem.find(this.grid);
    let destroyed = 0;


    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (mark[r][c]) {
          destroyed++;
          this.grid.cells[r][c].destroy();
          this.grid.cells[r][c] = null;
        }
      }
    }

    if (destroyed === 0) {
      this.chain = 0;
      this.resolving = false;
      return;
    }

    this.chain++;
    this.scoreSystem.add(destroyed, this.chain);

    this.time.delayedCall(120, () => this.gravityLoop());
  }

  gravityLoop() {
    if (this.isRaising) {
      this.resolving = false;
      return;
    }

    if (GravitySystem.apply(this.grid)) {
      this.time.delayedCall(80, () => this.gravityLoop());
    } else {
      this.resolving = false;
      this.time.delayedCall(100, () => this.resolve());
    }
  }

  startRaise() {
    this.isRaising = true;

    if (!RaiseSystem.raise(this.grid, this)) {
      this.triggerGameOver();
      return;
    }

    this.raiseInterval = Math.max(
      this.minRaiseInterval,
      this.raiseInterval - this.raiseAccel
    );

    this.time.delayedCall(220, () => {
      this.isRaising = false;
      this.resolve();
    });
  }

  // =========================
  // GAME OVER
  // =========================
  triggerGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.time.removeAllEvents();
    this.isRaising = false;
    this.resolving = false;
    
  



    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    const overlay = this.add.rectangle(
      cx,
      cy,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.6
    );
    AudioManager.stop();

    this.add.text(cx, cy - 80, "GAME OVER", {
      fontSize: "32px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.createButton(cx, cy, "RETRY", () => {
      this.scene.restart({ mode: this.mode });
    });

    this.createButton(cx, cy + 60, "CHANGE DIFFICULTY", () => {
      this.scene.start("MenuScene");
    });
  }
  
    
  createButton(x, y, label, callback) {
    const bg = this.add.rectangle(x, y, 220, 46, 0x444444)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y, label, {
      fontSize: "18px",
      color: "#ffffff"
    }).setOrigin(0.5);

    bg.on("pointerdown", callback);
    bg.on("pointerover", () => bg.setFillStyle(0x666666));
    bg.on("pointerout", () => bg.setFillStyle(0x444444));
  }
  

  update(_, delta) {
    if (this.gameOver) return;
    if (this.resolving || this.isRaising) return;

    this.raiseTimer += delta;
    if (this.raiseTimer >= this.raiseInterval) {
      this.raiseTimer = 0;
      this.startRaise();
    }
    
  }
  
}
