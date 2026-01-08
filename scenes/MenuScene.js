class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("menu_bg", "assets/ui/menu_bg.jpg");
    this.load.image("banner", "assets/ui/banner.png");
  }

  create() {
    const { width, height } = this.scale;

    // ===============================
    // CLEAN STATE
    // ===============================
    this.children.removeAll();
    this.sound.stopAll();

    // ===============================
    // BACKGROUND
    // ===============================
    const bg = this.add.image(width / 2, height / 2, "menu_bg");
    const scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale);

    // dark overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.35)
      .setOrigin(0);

    // ===============================
    // BANNER (PORTRAIT)
    // ===============================
    const banner = this.add.image(width / 2, 20, "banner")
      .setOrigin(0.5, 0);

    banner.setScale(width / banner.width);
    const bannerBottom = banner.displayHeight + 20;

    // ===============================
    // PANEL ANCHOR (INI KUNCI RAPINYA)
    // ===============================
    const panelY = bannerBottom + 200;

    // panel background
    this.add.rectangle(
      width / 2,
      panelY,
      width - 32,
      300,
      0x0f0f0f,
      0.9
    ).setStrokeStyle(3, 0xfacc15);

    // ===============================
    // PANEL TITLE
    // ===============================
    this.add.text(width / 2, panelY - 110, "SELECT DIFFICULTY", {
      fontFamily: "Press Start 2P",
      fontSize: "16px",
      color: "#facc15"
    }).setOrigin(0.5);

    // ===============================
    // BUTTONS (CENTERED & LOWER)
    // ===============================
    const startY = panelY - 40;
    const gap = 72;

    this.createButton(
      width / 2,
      startY,
      "EASY",
      0x22c55e,
      () => this.startGame("easy")
    );

    this.createButton(
      width / 2,
      startY + gap,
      "NORMAL",
      0x3b82f6,
      () => this.startGame("normal")
    );

    this.createButton(
      width / 2,
      startY + gap * 2,
      "HARD",
      0xef4444,
      () => this.startGame("hard")
    );
  }

  // ===============================
  // PIXEL BUTTON
  // ===============================
  createButton(x, y, label, color, callback) {
    const btn = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 200, 56, color)
      .setStrokeStyle(3, 0x020617);

    const text = this.add.text(0, 0, label, {
      fontFamily: "Press Start 2P",
      fontSize: "18px",
      color: "#020617"
    }).setOrigin(0.5);

    btn.add([bg, text]);
    btn.setSize(200, 56);
    btn.setInteractive({ useHandCursor: true });

    // hover
    btn.on("pointerover", () => {
      btn.y -= 2;
      bg.fillColor =
        Phaser.Display.Color.ValueToColor(color).brighten(20).color;
    });

    btn.on("pointerout", () => {
      btn.y += 2;
      bg.fillColor = color;
    });

    // click
    btn.on("pointerdown", () => {
      this.tweens.add({
        targets: btn,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 60,
        yoyo: true
      });
      callback();
    });
  }

  // ===============================
  // START GAME
  // ===============================
  startGame(difficulty) {
    this.sound.stopAll();
    this.scene.start("GameScene", { difficulty });
  }
}
