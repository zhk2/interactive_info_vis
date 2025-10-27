registerSketch('sk1', function (p) {
  const PETALS = 12;
  let cx, cy, R, rInner, rOuter;
  const breathPeriod = 10;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.RADIANS);
    recalc();
  };

  p.draw = function () {
    const t = nowSmooth();
    drawBackground(t.day);
    p.push();
    p.translate(cx, cy);
    drawSunArc(t.h);
    drawPetals(t.m, t.s);
    drawCenterDisk();
    drawBreathPulse();
    p.pop();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    recalc();
  };

  function recalc() {
    cx = p.width / 2;
    cy = p.height / 2;
    R = Math.min(p.width, p.height) * 0.36;
    rInner = R * 0.35;
    rOuter = R * 0.95;
  }

  function nowSmooth() {
    const d = new Date();
    const s = d.getSeconds() + d.getMilliseconds() / 1000;
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    const day = d.getHours() + m / 60;
    return { s, m, h, day };
  }

  function drawBackground(day24) {
    const f = (day24 % 24) / 24;
    const dawn = p.color(230, 225, 205);
    const noon = p.color(250, 240, 215);
    const dusk = p.color(215, 210, 195);
    const night = p.color(200, 198, 185);
    let bg;
    if (f < 0.25) bg = p.lerpColor(night, dawn, f / 0.25);
    else if (f < 0.5) bg = p.lerpColor(dawn, noon, (f - 0.25) / 0.25);
    else if (f < 0.75) bg = p.lerpColor(noon, dusk, (f - 0.5) / 0.25);
    else bg = p.lerpColor(dusk, night, (f - 0.75) / 0.25);
    p.background(bg);
  }

  function drawSunArc(h) {
    p.push();
    const r = R * 0.95;
    const yArc = -R * 0.85;
    p.noFill();
    p.stroke(255, 230);
    p.strokeWeight(2);
    p.arc(0, yArc, r, r, p.PI, 0);
    const theta = p.map(h, 0, 12, p.PI, 0);
    const x = (r * 0.5) * p.cos(theta);
    const y = yArc + (r * 0.5) * p.sin(theta);
    p.noStroke();
    p.fill(255, 210, 120, 230);
    p.circle(x, y, 12);
    p.pop();
  }

  function drawPetals(minSmooth, secSmooth) {
    const current = Math.floor(minSmooth) % PETALS;
    const sweepA = p.map(secSmooth, 0, 60, 0, p.TWO_PI);
    for (let i = 0; i < PETALS; i++) {
      const a = (p.TWO_PI * i) / PETALS;
      const bloom = i <= current ? 1 : 0.4;
      const col = p.lerpColor(p.color(135, 110, 40), p.color(240, 195, 30), bloom);
      p.push();
      p.rotate(a);
      p.noStroke();
      p.fill(col);
      drawPetalShape(rInner, rOuter, R * 0.12);
      p.stroke(40, 28, 16, 180);
      p.strokeWeight(1.5);
      p.noFill();
      drawPetalShape(rInner, rOuter, R * 0.12);
      p.pop();
    }
  }

  function drawCenterDisk() {
    p.noStroke();
    p.fill(40, 28, 16);
    p.circle(0, 0, rInner * 1.08);
  }

  function drawBreathPulse() {
    const t = (p.millis() / 1000) / breathPeriod;
    const wave = 1 - Math.abs(2 * (t - Math.floor(t + 0.5))); // triangle 0–1–0
    const r = p.map(wave, 0, 1, rInner * 0.45, rInner * 0.7);
    p.noFill();
    p.stroke(255, 240);
    p.circle(0, 0, r * 2);
  }

  function drawPetalShape(r1, r2, w) {
    p.beginShape();
    const n = 20;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const rr = p.lerp(r1, r2, t);
      const side = p.sin(t * p.PI) * w;
      p.vertex(rr, side);
    }
    for (let i = n; i >= 0; i--) {
      const t = i / n;
      const rr = p.lerp(r1, r2, t);
      const side = -p.sin(t * p.PI) * w;
      p.vertex(rr, side);
    }
    p.endShape(p.CLOSE);
  }
});