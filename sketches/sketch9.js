registerSketch('sk9', function (p) {
  let table;
  let months = [];
  let prices = [];
  let years = [];
  let minPrice = 0, maxPrice = 1;
  let spin = 0;
  let spinSpeed = 0.15;
  let cx = 0, cy = 0, R = 260;

  p.preload = function () {
    table = p.loadTable('dataset/food_prices_2018_2022_monthly.csv', 'csv', 'header');
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();

    for (let r = 0; r < table.getRowCount(); r++) {
      const m = table.getString(r, 'month');
      const v = parseFloat(table.getString(r, 'avg_price_usd'));
      if (m && !isNaN(v)) {
        months.push(m);
        prices.push(v);
        years.push(parseInt(m.slice(0, 4), 10));
      }
    }

    if (prices.length === 0) return;
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
    recalc();
  };

  p.draw = function () {
    p.background(10, 12, 28);
    spin += spinSpeed;
    p.translate(cx, cy);

    for (let r = 140; r > 0; r -= 8) {
      p.fill(255, 190, 40, p.map(r, 140, 0, 8, 220));
      p.circle(0, 0, r);
    }

    p.noFill();
    p.stroke(255, 255, 255, 30);
    p.strokeWeight(2);
    p.circle(0, 0, R * 1.6);
    p.circle(0, 0, R * 2.0);
    p.circle(0, 0, R * 2.4);

    const n = months.length;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const ang = t * 360 + spin - 90;
      const k = p.map(prices[i], minPrice, maxPrice, 0.75, 1.35);
      const rr = R * k;
      const x = rr * p.cos(ang);
      const y = rr * p.sin(ang);
      const yr = years[i];
      let col;
      if (yr <= 2019) col = p.color(80, 170, 255, 220);
      else if (yr === 2020) col = p.color(255, 210, 100, 230);
      else if (yr === 2021) col = p.color(255, 140, 120, 230);
      else col = p.color(255, 80, 80, 235);
      p.noStroke();
      p.fill(col);
      p.circle(x, y, 8);
    }

    p.fill(255);
    p.textSize(18);
    p.text('Global Food Price Time Wheel – Iteration 2', 0, -R * 1.8);
    drawLegend();
  };

  function drawLegend() {
    const items = [
      { c: p.color(80, 170, 255), label: '2018–2019' },
      { c: p.color(255, 210, 100), label: '2020' },
      { c: p.color(255, 140, 120), label: '2021' },
      { c: p.color(255, 80, 80), label: '2022' }
    ];
    let x = -140;
    const y = R * 1.4;
    p.textSize(12);
    for (const it of items) {
      p.noStroke();
      p.fill(it.c);
      p.circle(x, y, 10);
      p.fill(220);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(it.label, x + 14, y);
      x += 90;
    }
  }

  function recalc() {
    cx = p.width / 2;
    cy = p.height / 2;
    R = Math.min(p.width, p.height) * 0.28;
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    recalc();
  };
});