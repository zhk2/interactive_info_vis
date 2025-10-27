registerSketch('sk3', function (p) {
  let cx, cy, R;
  let showTrail = true;
  const trail = [];
  let speedMul = 1.0;
  let fatigue = 0.0;
  const SPRINT_BOOST = 0.6;
  let sprinting = false;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.RADIANS);
    p.textAlign(p.CENTER, p.CENTER);
    recalc();
  };

  p.draw = function () {
    const t = nowSmooth();
    const dt = p.deltaTime / 1000;
    const baseSpeed = speedMul;
    const sprint = sprinting ? SPRINT_BOOST : 0;
    const currSpeed = baseSpeed + sprint;
    const work = Math.max(0, currSpeed - 1);
    fatigue += work * 0.25 * dt;
    fatigue -= (0.15 + Math.max(0, 1 - currSpeed) * 0.35) * dt;
    fatigue = p.constrain(fatigue, 0, 1);
    const speedNorm = p.constrain(currSpeed / 2.5, 0, 1);
    const effort = p.constrain(0.45 * speedNorm + 0.55 * fatigue, 0, 1);
    p.background(bgForEffort(effort));
    p.translate(cx, cy);
    drawDial();
    const theta = ((t.s / 60) * p.TWO_PI - p.HALF_PI) * currSpeed;
    const pos = { x: Math.cos(theta) * R, y: Math.sin(theta) * R };
    const tangent = theta + p.HALF_PI;
    if (showTrail) {
      trail.push({ x: pos.x, y: pos.y, t: p.millis() });
      while (trail.length && p.millis() - trail[0].t > 4000) trail.shift();
      for (const q of trail) {
        const age = p.millis() - q.t;
        const a = p.map(age, 0, 4000, 220, 0, true);
        p.noStroke(); p.fill(255, 200, 120, a);
        p.circle(q.x, q.y, p.map(age, 0, 4000, 8, 3, true));
      }
    }
    drawRunner(pos.x, pos.y, tangent, effort, currSpeed, t);
    p.resetMatrix();
    drawHUD(t, currSpeed, fatigue, effort);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.SHIFT) sprinting = true;
    if (p.keyCode === p.UP_ARROW) speedMul = Math.min(3.0, +(speedMul + 0.1).toFixed(2));
    if (p.keyCode === p.DOWN_ARROW) speedMul = Math.max(0.4, +(speedMul - 0.1).toFixed(2));
    if (p.key.toLowerCase() === 'g') showTrail = !showTrail;
    if (p.key.toLowerCase() === 'r') { fatigue = 0; speedMul = 1.0; }
  };
  p.keyReleased = function () {
    if (p.keyCode === p.SHIFT) sprinting = false;
  };

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); recalc(); };

  function recalc() {
    cx = p.width / 2; cy = p.height / 2;
    R = Math.min(p.width, p.height) * 0.36;
  }

  function nowSmooth() {
    const d = new Date();
    const ms = d.getMilliseconds();
    const s = d.getSeconds() + ms / 1000;
    const m = d.getMinutes() + s / 60;
    const H = d.getHours();
    return { s, m, H };
  }

  function drawDial() {
    p.noFill();
    p.stroke(40, 50, 60, 160); p.strokeWeight(12); p.circle(0, 0, R * 2.2);
    p.stroke(255, 230); p.strokeWeight(2); p.circle(0, 0, R * 2);
    p.stroke(220); p.strokeWeight(3);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * p.TWO_PI - p.HALF_PI;
      const x0 = Math.cos(a) * R * 0.85, y0 = Math.sin(a) * R * 0.85;
      const x1 = Math.cos(a) * R * 0.95, y1 = Math.sin(a) * R * 0.95;
      p.line(x0, y0, x1, y1);
    }
  }

  function drawRunner(x, y, dir, effort, currSpeed, t) {
    const strideAmp = p.lerp(0.25, 1.0, effort);
    const cadence = p.lerp(2.0, 4.0, currSpeed - 0.4);
    const swing = Math.sin(t.s * cadence * p.TWO_PI) * strideAmp;
    const easyCol = p.color(90, 180, 120);
    const hardCol = p.color(220, 90, 90);
    const col = p.lerpColor(easyCol, hardCol, effort);
    p.push();
    p.translate(x, y);
    p.rotate(dir);
    p.stroke(col); p.strokeWeight(4); p.noFill();
    p.line(0, -10, 0, 12);
    p.line(0, -4, 10, -6 + swing * 6);
    p.line(0, -4, -10, -6 - swing * 6);
    p.line(0, 12, 12, 20 + swing * 9);
    p.line(0, 12, -9, 22 - swing * 9);
    p.noStroke(); p.fill(250);
    p.circle(0, -16, 12);
    p.textSize(12);
    p.text(emojiForEffort(effort), 0, -16);
    p.fill(col); p.noStroke();
    p.circle(0, -26, p.lerp(3, 8, effort));
    p.pop();
  }

  function emojiForEffort(e) {
    if (e < 0.12) return "😀";
    if (e < 0.25) return "🙂";
    if (e < 0.40) return "😐";
    if (e < 0.55) return "😕";
    if (e < 0.70) return "😟";
    if (e < 0.85) return "🥵";
    return "😫";
  }

  function bgForEffort(e) {
    const easy = p.color(240, 248, 238);
    const hard = p.color(245, 228, 228);
    return p.lerpColor(easy, hard, e);
  }

  function drawHUD(t, currSpeed, fat, eff) {
    const bw = 240, bh = 74, bx = 16, by = 16;
    p.noStroke(); p.fill(30, 80); p.rect(bx, by, bw, bh, 10);
    p.fill(20); p.textAlign(p.LEFT, p.TOP); p.textSize(12);
    const HH = String(t.H).padStart(2, '0');
    const MM = String(Math.floor(t.m)).padStart(2, '0');
    const SS = String(Math.floor(t.s)).padStart(2, '0');
    p.text(`Time  ${HH}:${MM}:${SS}`, bx + 10, by + 10);
    p.text(`Pace  ×${currSpeed.toFixed(2)}  (↑/↓, Shift=sprint)`, bx + 10, by + 28);
    p.text(`Fatigue ${(fat * 100).toFixed(0)}%  Effort ${(eff * 100).toFixed(0)}%`, bx + 10, by + 44);
    p.text(`G=trail  R=reset`, bx + 10, by + 60);
  }
});