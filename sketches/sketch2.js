registerSketch('sk2', function (p) {
  let cx, cy, rx, ry;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.RADIANS);
    recalc();
  };

  p.draw = function () {
    const t = nowSmooth();
    p.background(18, 18, 24);
    p.translate(cx, cy);

    drawTrack();
    drawHourFlags();
    drawMinuteTicks();

    const aSec = angleFromUnit(t.s, 60);
    const aMin = angleFromUnit(t.m, 60);
    const aHr  = angleFromUnit(t.h, 12);

    drawRunner(aSec, 0.7, p.color(255, 190, 90));
    drawRunner(aMin, 0.78, p.color(90, 180, 255));
    drawRunner(aHr, 0.86, p.color(160, 120, 255));

    p.translate(-cx, -cy);
    drawLegend();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    recalc();
  };

  function recalc() {
    cx = p.width / 2;
    cy = p.height / 2;
    const R = Math.min(p.width, p.height) * 0.46;
    rx = R;
    ry = R * 0.7;
  }

  function nowSmooth() {
    const d = new Date();
    const ms = d.getMilliseconds();
    const s = d.getSeconds() + ms / 1000;
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    return { s, m, h };
  }

  function angleFromUnit(u, wrap) {
    return (u / wrap) * p.TWO_PI - p.HALF_PI;
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

  function drawTrack() {
    p.noFill();
    p.stroke(60);
    p.strokeWeight(18);
    ellipse0(rx, ry);
    p.stroke(40);
    p.strokeWeight(12);
    ellipse0(rx * 0.86, ry * 0.86);
    ellipse0(rx * 0.78, ry * 0.78);
    ellipse0(rx * 0.7,  ry * 0.7);
  }

  function drawHourFlags() {
    p.stroke(230, 200);
    p.strokeWeight(3);
    for (let i = 0; i < 12; i++) {
      const th = angleFromUnit(i, 12);
      const x0 = Math.cos(th) * rx * 0.9;
      const y0 = Math.sin(th) * ry * 0.9;
      const x1 = Math.cos(th) * rx * 0.96;
      const y1 = Math.sin(th) * ry * 0.96;
      p.line(x0, y0, x1, y1);
    }
  }

  function drawMinuteTicks() {
    p.stroke(160);
    p.strokeWeight(1.5);
    for (let i = 0; i < 60; i++) {
      const th = angleFromUnit(i, 60);
      const x0 = Math.cos(th) * rx * 0.74;
      const y0 = Math.sin(th) * ry * 0.74;
      const x1 = Math.cos(th) * rx * 0.8;
      const y1 = Math.sin(th) * ry * 0.8;
      p.line(x0, y0, x1, y1);
    }
  }

  function drawRunner(theta, lane, col) {
    const x = Math.cos(theta) * rx * lane;
    const y = Math.sin(theta) * ry * lane;
    p.noStroke();
    p.fill(col);
    p.circle(x, y, 12);
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
  }
});