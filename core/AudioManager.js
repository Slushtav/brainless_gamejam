class AudioManager {
  static bgm = null;

  static play(scene, key, volume = 0.5) {
    if (this.bgm && this.bgm.key === key && this.bgm.isPlaying) return;

    this.stop();

    this.bgm = scene.sound.add(key, {
      loop: true,
      volume
    });

    if (!scene.sound.locked) this.bgm.play();
    scene.sound.once("unlocked", () => {
      if (!this.bgm.isPlaying) this.bgm.play();
    });
  }

  static stop() {
    if (!this.bgm) return;
    this.bgm.stop();
    this.bgm.destroy();
    this.bgm = null;
  }

  static sfx(scene, key, volume = 0.6) {
    scene.sound.play(key, { volume });
  }
}
