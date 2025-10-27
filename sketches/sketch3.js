registerSketch('sk3', function (p) {
  let cx, cy, r;
  const emojis = ["😀","😃","🙂","😐","😕","😟","😢","😭","😞","😔","😴","😊"];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    recalc();
  };

  p.draw = function () {
    p.background(240, 230, 220);
    const h = p.hour() % 12;
    const m = p.minute();
    const s = p.second();
    p.translate(cx, cy);

    for (let i = 0; i < 12; i++) {
      const angle = p.TWO_PI * i / 12 - p.HALF_PI;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      p.text(emojis[i], x, y);
    }

    p.stroke(50);
    p.strokeWeight(8);
    p.line(0, 0, Math.cos(p.TWO_PI * (h + m / 60) / 12 - p.HALF_PI) * r * 0.5, 
                  Math.sin(p.TWO_PI * (h + m / 60) / 12 - p.HALF_PI) * r * 0.5);
    p.strokeWeight(4);
    p.line(0, 0, Math.cos(p.TWO_PI * (m + s / 60) / 60 - p.HALF_PI) * r * 0.8, 
                  Math.sin(p.TWO_PI * (m + s / 60) / 60 - p.HALF_PI) * r * 0.8);
    p.stroke(200, 80, 80);
    p.line(0, 0, Math.cos(p.TWO_PI * s / 60 - p.HALF_PI) * r * 0.9, 
                  Math.sin(p.TWO_PI * s / 60 - p.HALF_PI) * r * 0.9);
  };

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); recalc(); };

  function recalc() {
    cx = p.width / 2;
    cy = p.height / 2;
    r = Math.min(p.width, p.height) * 0.35;
  }
});