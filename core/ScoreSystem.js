class ScoreSystem {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
  }

  add(blockCount, chain) {
    const gain = blockCount * 10 * chain;
    this.score += gain;
    this.scene.updateScoreUI(this.score, gain, chain);
  }

  reset() {
    this.score = 0;
  }
}
