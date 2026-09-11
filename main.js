// ---------------------------------------------------------------------------
// Godzilla Portfolio — Phaser 3 starter scaffold
// Replace the placeholder rectangle sprites with real sprite sheets when ready.
// See README.md for asset slots and how to swap them in.
// ---------------------------------------------------------------------------

const WORLD_WIDTH = 3200;
const WORLD_HEIGHT = 600;

const BUILDINGS = [
  { key: "about",           x: 300,  label: "ABOUT ME",       color: 0x2b6cb0 },
  { key: "education",       x: 700,  label: "EDUCATION",      color: 0x2f855a },
  { key: "skills",          x: 1100, label: "SKILLS TOWER",   color: 0x805ad5 },
  { key: "projects",        x: 1600, label: "PROJECTS LAB",   color: 0xc05621 },
  { key: "experience",      x: 2100, label: "EXPERIENCE HQ",  color: 0x975a16 },
  { key: "certifications",  x: 2550, label: "CERT MONUMENT",  color: 0xb7791f },
  { key: "contact",         x: 2950, label: "CONTACT BEACON", color: 0xd53f8c },
];

const BEAM_RANGE = 180;

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    // --- Placeholder graphics generated at runtime (no external image files needed to run) ---
    // Swap these for real sprite sheets: this.load.spritesheet('godzilla', 'assets/godzilla.png', {frameWidth: 64, frameHeight: 64});
  }

  create() {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Ground
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 40, WORLD_WIDTH, 80, 0x1a2027).setOrigin(0.5);

    // Sky gradient (simple placeholder)
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x0b0f14).setDepth(-10);

    // Buildings + labels + interaction zones
    this.buildingSprites = {};
    BUILDINGS.forEach(b => {
      const height = 220;
      const rect = this.add.rectangle(b.x, WORLD_HEIGHT - 40 - height / 2, 140, height, b.color)
        .setStrokeStyle(3, 0xffffff, 0.15);
      this.add.text(b.x, WORLD_HEIGHT - 40 - height - 16, b.label, {
        fontFamily: "Courier New", fontSize: "14px", color: "#d7ffe0"
      }).setOrigin(0.5);
      this.buildingSprites[b.key] = { rect, x: b.x, hit: false };
    });

    // Godzilla placeholder (green rectangle body + eyes) — swap for real sprite sheet later
    this.godzilla = this.add.container(200, WORLD_HEIGHT - 40 - 60);
    const body = this.add.rectangle(0, 0, 70, 100, 0x2f855a);
    const eye1 = this.add.circle(-15, -25, 5, 0xffffff);
    const eye2 = this.add.circle(15, -25, 5, 0xffffff);
    this.godzilla.add([body, eye1, eye2]);
    this.physics.world.enable(this.godzilla);
    this.godzilla.body.setCollideWorldBounds(true);
    this.godzilla.facing = 1;

    // Roar visual (expanding ring) + beam graphic
    this.roarRing = this.add.circle(0, 0, 10, 0xffff88, 0.4).setVisible(false);
    this.beamGraphic = this.add.rectangle(0, 0, 10, 10, 0x66ffcc, 0.9).setVisible(false);

    // Camera follow
    this.cameras.main.startFollow(this.godzilla, true, 0.1, 0.1);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE,F");

    // Prompt text above nearest building
    this.promptText = this.add.text(0, 0, "", {
      fontFamily: "Courier New", fontSize: "13px", color: "#ffff88"
    }).setOrigin(0.5).setVisible(false);

    // Modal DOM wiring
    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    document.getElementById("close-btn").addEventListener("click", () => {
      this.modal.style.display = "none";
    });
  }

  openModal(key) {
    const data = PORTFOLIO_CONTENT[key];
    if (!data) return;
    this.modalTitle.textContent = data.title;
    this.modalBody.innerHTML = data.html;
    this.modal.style.display = "flex";
  }

  nearestBuilding() {
    let nearest = null;
    let nearestDist = Infinity;
    Object.entries(this.buildingSprites).forEach(([key, b]) => {
      const d = Math.abs(this.godzilla.x - b.x);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = key;
      }
    });
    return { key: nearest, dist: nearestDist };
  }

  fireBeam() {
    const { key, dist } = this.nearestBuilding();
    const dir = this.godzilla.facing;
    this.beamGraphic
      .setPosition(this.godzilla.x + dir * 60, this.godzilla.y - 20)
      .setSize(BEAM_RANGE, 8)
      .setOrigin(dir > 0 ? 0 : 1, 0.5)
      .setVisible(true);
    this.tweens.add({
      targets: this.beamGraphic,
      alpha: { from: 1, to: 0 },
      duration: 350,
      onComplete: () => this.beamGraphic.setVisible(false)
    });

    if (dist < BEAM_RANGE + 40) {
      this.cameras.main.shake(150, 0.004);
      this.openModal(key);
    }
  }

  roar() {
    this.roarRing.setPosition(this.godzilla.x, this.godzilla.y).setRadius(10).setVisible(true).setAlpha(0.6);
    this.tweens.add({
      targets: this.roarRing,
      radius: 120,
      alpha: 0,
      duration: 500,
      onComplete: () => this.roarRing.setVisible(false)
    });
    this.cameras.main.shake(200, 0.003);
  }

  update() {
    const speed = 220;
    let vx = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) { vx = -speed; this.godzilla.facing = -1; }
    else if (this.cursors.right.isDown || this.keys.D.isDown) { vx = speed; this.godzilla.facing = 1; }
    this.godzilla.body.setVelocityX(vx);

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.roar();
    if (Phaser.Input.Keyboard.JustDown(this.keys.F)) this.fireBeam();

    const { key, dist } = this.nearestBuilding();
    if (dist < BEAM_RANGE + 40) {
      const b = this.buildingSprites[key];
      this.promptText.setPosition(b.x, WORLD_HEIGHT - 340).setVisible(true)
        .setText(`Press F to beam "${key.toUpperCase()}"`);
    } else {
      this.promptText.setVisible(false);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: "game-container",
  backgroundColor: "#0b0f14",
  physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
  scene: [MainScene]
};

new Phaser.Game(config);
