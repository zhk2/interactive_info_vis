registerSketch('sk9', function (p) {
  let prices = [100, 120, 130, 140, 160, 180, 200, 180, 160, 150, 130, 110];
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(10, 10, 40);
    p.translate(p.width / 2, p.height / 2);
    const R = 200;

    for (let i = 0; i < months.length; i++) {
      const angle = (i / months.length) * 360 - 90;
      const radius = R * p.map(prices[i], 100, 200, 0.6, 1.2);
      const x = p.cos(angle) * radius;
      const y = p.sin(angle) * radius;
      p.fill(100, 180, 255);
      p.noStroke();
      p.circle(x, y, 10);
      p.fill(255);
      p.textSize(10);
      p.text(months[i], x, y - 14);
    }

    p.fill(255);
    p.textSize(18);
    p.text('Food Price Prototype (Static Layout)', 0, R + 40);
  };
});