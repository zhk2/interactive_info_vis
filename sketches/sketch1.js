
registerSketch('sk1', function (p) {

  const PETALS = 12;
  const PULSE_PERIOD = 10; 
  let cx, cy, R, rInner, rOuter;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.RADIANS);
    cx = p.width / 2;
    cy = p.height / 2;
    R = Math.min(p.width, p.height) * 0.36;
    rInner = R * 0.35;
    rOuter = R * 0.95;
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
    cx = p.width / 2;
    cy = p.height / 2;
    R = Math.min(p.width, p.height) * 0.36;
    rInner = R * 0.35;
    rOuter = R * 0.95;
  };

  // ---------- time helpers ----------
  function nowSmooth() {
    const d = new Date();
    const s = d.getSeconds() + d.getMilliseconds() / 1000;
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    const day = d.getHours() + m / 60; // 0..24
    return { s, m, h, day };
  }

  // ---------- visuals ----------
  function drawBackground(dayFrac24) {
    // simple night to day tint
    const f = (dayFrac24 % 24) / 24;
    const bg = p.lerpColor(p.color(18, 24, 40), p.color(245, 236, 210), easeInOut(f));
    p.background(bg);
  }

  function drawSunArc(h) {
    // top semicircle and sun dot for hours
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
      const col = p.lerpColor(p.color(120, 90, 20), p.color(240, 195, 30), bloom);

      const d = angleDiff(sweepA, a);
      const sweepBoost = p.map(p.constrain(Math.abs(d), 0, p.TWO_PI / PETALS), 0, p.TWO_PI / PETALS, 0.35, 0);
      const disp = p.lerpColor(col, p.color(255, 230, 120), sweepBoost);

      p.push();
      p.rotate(a);
      p.noStroke();
      p.fill(disp);
      drawPetalShape(rInner, rOuter, R * 0.12);
      p.noFill();
      p.stroke(40, 28, 16, 180);
      p.strokeWeight(i === current ? 2.5 : 1.5);
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
    const t = (p.millis() / 1000) / PULSE_PERIOD; 
    const wave = triangle01(frac(t)); 
    const r = p.map(wave, 0, 1, rInner * 0.45, rInner * 0.7);
    p.noFill();
    p.stroke(255, 240);
    p.strokeWeight(1.5);
    p.circle(0, 0, r * 2);
    p.noStroke();
    p.fill(255, 255, 255, 18);
    p.circle(0, 0, r * 2.5);
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


  function angleDiff(a, b) {
    let d = a - b;
    while (d > p.PI) d -= p.TWO_PI;
    while (d < -p.PI) d += p.TWO_PI;
    return d;
  }
  function frac(x) { return x - Math.floor(x); }
  function triangle01(t) { return 1 - Math.abs(2 * (t - Math.floor(t + 0.5))); }
  function easeInOut(x) { return -(Math.cos(p.PI * x) - 1) / 2; }
});