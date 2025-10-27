registerSketch('sk2', function (p) {
  let cx, cy, rx, ry;
  const lanes = { sec: 0.70, min: 0.78, hr: 0.86 };
  const runners = { sec: {trail: []}, min: {}, hr: {} };
  let cone = null;
  let flashUntil = 0;
  let tzAlt = false;
  const altOffsetHours = 5;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.RADIANS);
    recalc();
  };

  p.draw = function () {
    const t = nowSmooth(tzAlt ? altOffsetHours : 0);
    p.background(18, 18, 24);
    p.translate(cx, cy);

    drawTrack();
    drawHourFlags();
    drawMinuteTicks(t.m);

    const aSec = unitAngle(t.s, 60);
    const aMin = unitAngle(t.m, 60);
    const aHr  = unitAngle(t.h, 12);

    drawGhostTrail(aSec);
    drawRunner(aSec, lanes.sec, p.color(255, 190, 90));
    drawRunner(aMin, lanes.min, p.color(90, 180, 255));
    drawRunner(aHr,  lanes.hr,  p.color(160, 120, 255));

    if (cone) drawCone(cone);
    if (cone && nearAngle(aSec, cone, 0.03)) flashUntil = p.millis() + 400;

    drawBoard(t, p.millis() < flashUntil);

    p.translate(-cx, -cy);
    drawLegend();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    recalc();
  };

  p.mousePressed = function () {
    const a = Math.atan2(p.mouseY - cy, p.mouseX - cx);
    cone = a;
  };

  p.keyPressed = function () {
    if (p.key.toLowerCase() === 't') tzAlt = !tzAlt;
  };

  function recalc() {
    cx = p.width / 2;
    cy = p.height / 2;
    const R = Math.min(p.width, p.height) * 0.46;
    rx = R; ry = R * 0.70;
  }

  function nowSmooth(offsetHours = 0) {
    const d = new Date();
    const ms = d.getMilliseconds();
    const s = d.getSeconds() + ms / 1000;
    const m = d.getMinutes() + s / 60;
    const H = d.getHours() + offsetHours;
    const h12 = ((H % 24 + 24) % 24) % 12 + m / 60;
    return { s, m, h: h12, H: (H % 24 + 24) % 24 };
  }

  function unitAngle(u, wrap) {
    return (u / wrap) * p.TWO_PI - p.HALF_PI;
  }

  function posOnLane(theta, lane) {
    const R = laneRadius(lane);
    return { x: Math.cos(theta) * R.x, y: Math.sin(theta) * R.y };
  }

  function laneRadius(lane) {
    return { x: rx * lane, y: ry * lane };
  }

  function drawTrack() {
    p.noFill();
    p.stroke(60);
    p.strokeWeight(18);
    ellipse0(rx, ry);
    p.stroke(40);
    p.strokeWeight(12);
    ellipse0(rx * lanes.hr, ry * lanes.hr);
    ellipse0(rx * lanes.min, ry * lanes.min);
    ellipse0(rx * lanes.sec, ry * lanes.sec);
  }

  function ellipse0(a, b) {
    p.beginShape();
    const n = 240;
    for (let i = 0; i < n; i++) {
      const th = (i / n) * p.TWO_PI;
      p.vertex(Math.cos(th) * a, Math.sin(th) * b);
    }
    p.endShape(p.CLOSE);
  }

  function drawHourFlags() {
    p.stroke(230, 200);
    p.strokeWeight(3);
    for (let i = 0; i < 12; i++) {
      const th = unitAngle(i, 12);
      const R0 = laneRadius(0.92), R1 = laneRadius(0.99);
      const x0 = Math.cos(th) * R0.x, y0 = Math.sin(th) * R0.y;
      const x1 = Math.cos(th) * R1.x, y1 = Math.sin(th) * R1.y;
      p.line(x0, y0, x1, y1);
    }
  }

  function drawMinuteTicks(minSmooth) {
    const thNow = unitAngle(minSmooth, 60);
    for (let i = 0; i < 60; i++) {
      const th = unitAngle(i, 60);
      const d = angleDistance(th, thNow);
      const a = p.map(d, 0, 0.35, 255, 20, true);
      p.stroke(180, 220, 255, a);
      p.strokeWeight(2);
      const R0 = laneRadius(0.74), R1 = laneRadius(0.82);
      const x0 = Math.cos(th) * R0.x, y0 = Math.sin(th) * R0.y;
      const x1 = Math.cos(th) * R1.x, y1 = Math.sin(th) * R1.y;
      p.line(x0, y0, x1, y1);
    }
  }

  function drawRunner(theta, lane, col) {
    const pnt = posOnLane(theta, lane);
    p.noStroke();
    p.fill(col);
    p.circle(pnt.x, pnt.y, 12);
    if (lane === lanes.sec) {
      runners.sec.trail.push({ x: pnt.x, y: pnt.y, t: p.millis() });
      while (runners.sec.trail.length && p.millis() - runners.sec.trail[0].t > 5000) runners.sec.trail.shift();
    }
  }

  function drawGhostTrail(thetaCurr) {
    for (const q of runners.sec.trail) {
      const age = p.millis() - q.t;
      const a = p.map(age, 0, 5000, 220, 0, true);
      const sz = p.map(age, 0, 5000, 10, 4, true);
      p.noStroke();
      p.fill(255, 190, 90, a);
      p.circle(q.x, q.y, sz);
    }
  }

  function drawCone(a) {
    const R = laneRadius(lanes.sec);
    const x = Math.cos(a) * R.x, y = Math.sin(a) * R.y;
    p.push();
    p.translate(x, y);
    p.rotate(a + p.HALF_PI);
    p.noStroke();
    p.fill(255, 120, 100);
    p.triangle(-8, 10, 8, 10, 0, -16);
    p.pop();
  }

  function drawBoard(t, flash) {
    p.push();
    p.translate(-cx, -cy);
    const bw = 180, bh = 60, bx = p.width - bw - 16, by = 16;
    p.noStroke();
    p.fill(30, 80);
    p.rect(bx, by, bw, bh, 8);
    p.fill(flash ? p.color(255, 210, 120) : p.color(230));
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    const HH = String(t.H).padStart(2, '0');
    const MM = String(Math.floor(t.m)).padStart(2, '0');
    const SS = String(Math.floor(t.s)).padStart(2, '0');
    p.text(`${HH}:${MM}:${SS}`, bx + bw / 2, by + 22);
    p.textSize(12);
    p.fill(200);
    p.text(tzAlt ? `Alt TZ (+${altOffsetHours}h)` : `Local TZ`, bx + bw / 2, by + 42);
    p.pop();
  }

  function drawLegend() {
    const items = [
      { c: p.color(255, 190, 90),  label: 'Seconds' },
      { c: p.color(90, 180, 255),  label: 'Minutes' },
      { c: p.color(160, 120, 255), label: 'Hours'   }
    ];
    let x = 16, y = p.height - 22;
    p.noStroke();
    for (const it of items) {
      p.fill(it.c); p.circle(x, y, 10);
      p.fill(230); p.textAlign(p.LEFT, p.CENTER); p.textSize(12);
      p.text(it.label, x + 14, y);
      x += 90;
    }
    p.fill(170); p.textAlign(p.RIGHT, p.CENTER); p.text('Click = set cone • T = toggle timezone', p.width - 16, y);
  }

  function angleDistance(a, b) {
    let d = Math.abs(a - b);
    if (d > p.PI) d = p.TWO_PI - d;
    return d;
  }

  function nearAngle(a, b, eps) {
    return angleDistance(a, b) < eps;
  }
});