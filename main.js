// ---------------------------------------------------------------------------
// Godzilla Portfolio — Phaser 3 scaffold v2
// All visuals/sounds are generated at runtime (no external asset files needed).
// Godzilla now has a proper silhouette, spikes, a tail, a real roar shockwave +
// jaw animation, a glowing beam projectile with particles, and WebAudio SFX.
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

const BEAM_RANGE = 220;

class SFX {
  constructor() { this.ctx = null; }
  ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  roar() {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.9);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.9);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.0);

    const bufferSize = ctx.sampleRate * 1.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(400, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.25, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.0);
  }
  beam() {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.35);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }
  step() {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.sfx = new SFX();
    this.isRoaring = false;
    this.isFiring = false;
    this.stepTimer = 0;
  }

  preload() {}

  create() {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x0b0f14).setDepth(-10);
    for (let i = 0; i < 120; i++) {
      const sx = Phaser.Math.Between(0, WORLD_WIDTH);
      const sy = Phaser.Math.Between(0, WORLD_HEIGHT - 120);
      this.add.circle(sx, sy, Phaser.Math.Between(1, 2), 0x2a3a4a).setDepth(-9);
    }
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 40, WORLD_WIDTH, 80, 0x1a2027).setOrigin(0.5);

    this.buildingSprites = {};
    BUILDINGS.forEach(b => {
      const height = 220;
      this.add.rectangle(b.x, WORLD_HEIGHT - 40 - height / 2, 140, height, b.color)
        .setStrokeStyle(3, 0xffffff, 0.15);
      for (let wy = 0; wy < 6; wy++) {
        for (let wx = 0; wx < 3; wx++) {
          this.add.rectangle(
            b.x - 45 + wx * 45,
            WORLD_HEIGHT - 40 - height + 25 + wy * 32,
            14, 18, 0xffe08a, 0.5
          );
        }
      }
      this.add.text(b.x, WORLD_HEIGHT - 40 - height - 16, b.label, {
        fontFamily: "Courier New", fontSize: "14px", color: "#d7ffe0"
      }).setOrigin(0.5);
      this.buildingSprites[b.key] = { x: b.x, height };
    });

    this.godzilla = this.add.container(200, WORLD_HEIGHT - 40 - 90);
    this.gz = this.buildGodzillaGraphics();
    this.godzilla.add(this.gz.all);
    this.physics.world.enable(this.godzilla);
    this.godzilla.body.setSize(90, 140);
    this.godzilla.body.setOffset(-45, -110);
    this.godzilla.body.setCollideWorldBounds(true);
    this.godzilla.facing = 1;

    this.roarRings = [
      this.add.circle(0,0,10,0xffff88,0.5).setVisible(false),
      this.add.circle(0,0,10,0xffff88,0.35).setVisible(false)
    ];

    this.beamGraphics = this.add.graphics().setDepth(5);
    this.beamParticles = this.add.particles(0, 0, undefined, {
      lifespan: 300,
      speed: { min: 40, max: 90 },
      scale: { start: 0.6, end: 0 },
      quantity: 0,
      blendMode: "ADD",
      tint: [0x66ffcc, 0x33ffff, 0xccffee]
    });
    const pg = this.add.graphics();
    pg.fillStyle(0x99ffee, 1).fillCircle(4, 4, 4);
    pg.generateTexture("glow", 8, 8);
    pg.destroy();
    this.beamParticles.setTexture("glow");

    this.cameras.main.startFollow(this.godzilla, true, 0.1, 0.1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE,F");

    this.promptText = this.add.text(0, 0, "", {
      fontFamily: "Courier New", fontSize: "13px", color: "#ffff88"
    }).setOrigin(0.5).setVisible(false);

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    document.getElementById("close-btn").addEventListener("click", () => {
      this.modal.style.display = "none";
    });

    this.input.once("pointerdown", () => this.sfx.ensureCtx());
    this.input.keyboard.once("keydown", () => this.sfx.ensureCtx());
  }

  buildGodzillaGraphics() {
    const g = this.add.graphics();
    const bodyColor = 0x2f6b4f;
    const bellyColor = 0x3f8a63;
    const spikeColor = 0xd7ffb8;

    g.fillStyle(bodyColor, 1);
    g.fillTriangle(-40, -20, -95, -5, -40, 10);

    g.fillStyle(bodyColor, 1);
    g.fillRect(-32, 30, 22, 40);
    g.fillRect(14, 30, 22, 40);

    g.fillStyle(bodyColor, 1);
    g.fillRoundedRect(-40, -70, 80, 100, 14);
    g.fillStyle(bellyColor, 1);
    g.fillRoundedRect(-24, -30, 48, 55, 10);

    g.fillStyle(bodyColor, 1);
    g.fillRoundedRect(-46, -40, 14, 34, 6);
    g.fillRoundedRect(32, -40, 14, 34, 6);

    g.fillStyle(bodyColor, 1);
    g.fillRoundedRect(-28, -115, 56, 50, 10);

    g.fillStyle(spikeColor, 1);
    const spikeX = [-28, -12, 4, 20];
    spikeX.forEach((sx, i) => {
      const h = 22 - i * 2;
      g.fillTriangle(sx, -70, sx + 14, -70, sx + 7, -70 - h);
    });

    const all = this.add.container(0, 0, [g]);

    const eye1 = this.add.circle(-12, -95, 4, 0xffe36b);
    const eye2 = this.add.circle(12, -95, 4, 0xffe36b);
    all.add([eye1, eye2]);

    const jaw = this.add.graphics();
    jaw.fillStyle(0x1f4a37, 1);
    jaw.fillRoundedRect(-22, 0, 44, 14, 4);
    jaw.setPosition(0, -68);
    all.add(jaw);

    return { all, bodyGraphics: g, eye1, eye2, jaw };
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
      if (d < nearestDist) { nearestDist = d; nearest = key; }
    });
    return { key: nearest, dist: nearestDist };
  }

  fireBeam() {
    if (this.isFiring) return;
    this.isFiring = true;
    this.sfx.beam();

    const { key, dist } = this.nearestBuilding();
    const dir = this.godzilla.facing;
    const originX = this.godzilla.x + dir * 45;
    const originY = this.godzilla.y - 95;
    const length = BEAM_RANGE + 60;
    const endX = originX + dir * length;

    this.beamGraphics.clear();
    let progress = 0;
    const drawBeam = () => {
      this.beamGraphics.clear();
      const currentEndX = originX + dir * length * progress;
      this.beamGraphics.lineStyle(10, 0x33ffcc, 0.9);
      this.beamGraphics.beginPath();
      this.beamGraphics.moveTo(originX, originY);
      this.beamGraphics.lineTo(currentEndX, originY);
      this.beamGraphics.strokePath();
      this.beamGraphics.lineStyle(4, 0xffffff, 1);
      this.beamGraphics.beginPath();
      this.beamGraphics.moveTo(originX, originY);
      this.beamGraphics.lineTo(currentEndX, originY);
      this.beamGraphics.strokePath();
    };

    this.tweens.addCounter({
      from: 0, to: 1, duration: 160,
      onUpdate: (tw) => { progress = tw.getValue(); drawBeam(); },
      onComplete: () => {
        this.beamParticles.emitParticleAt(endX, originY, 16);
        this.cameras.main.shake(150, 0.005);
        this.tweens.addCounter({
          from: 1, to: 0, duration: 200, delay: 80,
          onComplete: () => { this.beamGraphics.clear(); this.isFiring = false; }
        });
        if (dist < BEAM_RANGE + 40) {
          this.openModal(key);
        }
      }
    });
  }

  roar() {
    if (this.isRoaring) return;
    this.isRoaring = true;
    this.sfx.roar();

    this.tweens.add({
      targets: this.gz.jaw,
      y: -55,
      duration: 180,
      yoyo: true,
      hold: 300,
      onComplete: () => { this.isRoaring = false; }
    });

    this.tweens.add({
      targets: [this.gz.eye1, this.gz.eye2],
      alpha: { from: 1, to: 0.3 },
      duration: 150,
      yoyo: true,
      repeat: 2
    });

    this.roarRings.forEach((ring, i) => {
      ring.setPosition(this.godzilla.x, this.godzilla.y - 90).setRadius(10).setVisible(true).setAlpha(0.6);
      this.tweens.add({
        targets: ring,
        radius: 160 + i * 40,
        alpha: 0,
        duration: 600 + i * 150,
        delay: i * 80,
        onComplete: () => ring.setVisible(false)
      });
    });

    this.tweens.add({
      targets: this.godzilla,
      x: this.godzilla.x + Phaser.Math.Between(-4, 4),
      duration: 60,
      yoyo: true,
      repeat: 4
    });
    this.cameras.main.shake(300, 0.006);
  }

  update(time, delta) {
    const speed = 220;
    let vx = 0;
    let moving = false;
    if (this.cursors.left.isDown || this.keys.A.isDown) { vx = -speed; this.godzilla.facing = -1; moving = true; }
    else if (this.cursors.right.isDown || this.keys.D.isDown) { vx = speed; this.godzilla.facing = 1; moving = true; }
    this.godzilla.body.setVelocityX(vx);
    this.godzilla.setScale(this.godzilla.facing, 1);

    if (moving) {
      this.godzilla.y = (WORLD_HEIGHT - 40 - 90) + Math.sin(time / 90) * 4;
      this.stepTimer -= delta;
      if (this.stepTimer <= 0) {
        this.sfx.step();
        this.stepTimer = 260;
      }
    } else {
      this.godzilla.y = WORLD_HEIGHT - 40 - 90;
    }

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
