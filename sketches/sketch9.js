registerSketch('sk9', function (p) {
  let table;
  let months = [];
  let prices = [];
  let years = [];
  let minPrice = 0, maxPrice = 1;

  let spin = 0;
  let spinSpeed = 0.18;
  let paused = false;

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
    if (!paused) spin += spinSpeed;

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
    let hoverIdx = -1;
    let hoverDist = 18;

    for (let i = 0; i < n; i++) {
      const t = i / n;
      const ang = t * 360 + spin - 90;
      const k = p.map(prices[i], minPrice, maxPrice, 0.75, 1.35);
      const rr = R * k;
      const x = rr * p.cos(ang);
      const y = rr * p.sin(ang);

      const yr = years[i];
      let col;
      if (yr <= 2019) col = p.color(80, 170, 255, 225);
      else if (yr === 2020) col = p.color(255, 210, 100, 235);
      else if (yr === 2021) col = p.color(255, 140, 120, 235);
      else col = p.color(255, 90, 90, 240);

      p.noStroke();
      p.fill(col);
      p.circle(x, y, 8);

      const mx = p.mouseX - cx;
      const my = p.mouseY - cy;
      const d = p.dist(mx, my, x, y);
      if (d < hoverDist) {
        hoverIdx = i;
        hoverDist = d;
      }
    }

    p.fill(255);
    p.textSize(18);
    p.text('Global Food Price Time Wheel 2018 to 2022  Iteration 3', 0, -R * 1.8);

    drawLegend();

    if (hoverIdx >= 0) {
      const t = hoverIdx / n;
      const ang = t * 360 + spin - 90;
      const k = p.map(prices[hoverIdx], minPrice, maxPrice, 0.75, 1.35);
      const rr = R * k;
      const x = rr * p.cos(ang);
      const y = rr * p.sin(ang);
      const label = formatMonth(months[hoverIdx]) + '\n$' + prices[hoverIdx].toFixed(2);
      drawTooltip(x, y, label);
    }

    p.fill(210);
    p.textSize(12);
    p.text('Space to pause or play   Up or Down to change speed', 0, R * 1.55);
  };

  p.keyPressed = function () {
    if (p.keyCode === 32) paused = !paused;
    else if (p.keyCode === p.UP_ARROW) spinSpeed = Math.min(1.0, spinSpeed + 0.05);
    else if (p.keyCode === p.DOWN_ARROW) spinSpeed = Math.max(0.02, spinSpeed - 0.05);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    recalc();
  };

  function recalc() {
    cx = p.width * 0.5;
    cy = p.height * 0.52;
    R = Math.min(p.width, p.height) * 0.28;
  }

  function drawLegend() {
    const items = [
      { c: p.color(80, 170, 255), label: '2018 to 2019' },
      { c: p.color(255, 210, 100), label: '2020' },
      { c: p.color(255, 140, 120), label: '2021' },
      { c: p.color(255, 90, 90),   label: '2022' }
    ];
    p.textSize(12);
    let total = 0;
    for (const it of items) total += p.textWidth(it.label) + 26;
    let x = -total / 2;
    const y = -R * 1.58;
    for (const it of items) {
      p.noStroke();
      p.fill(it.c);
      p.circle(x, y, 10);
      p.fill(220);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(it.label, x + 14, y);
      x += p.textWidth(it.label) + 26;
    }
  }

  function drawTooltip(x, y, textStr) {
    const pad = 8;
    p.textSize(12);
    const lines = textStr.split('\n');
    const w = Math.max(...lines.map(s => p.textWidth(s))) + pad * 2;
    const h = lines.length * 16 + pad * 2;
    const bx = x + 14;
    const by = y - h - 10;
    p.noStroke();
    p.fill(20, 170);
    p.rect(bx, by, w, h, 8);
    p.fill(255);
    for (let i = 0; i < lines.length; i++) {
      p.text(lines[i], bx + w / 2, by + pad + 10 + i * 16);
    }
  }

  function formatMonth(s) {
    const y = s.slice(0, 4);
    const m = parseInt(s.slice(5, 7), 10);
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return names[m - 1] + ' ' + y;
  }
});