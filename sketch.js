//custom variables for y-coordinate of sun & horizon
let sunHeight;
let horizon = 200;
function setup() {
  createCanvas(400, 400);
}

function draw() {

  //sun follows y-coordinate of mouse
  sunHeight = mouseY;
  currentWidth = mouseX;

  //light blue background if sun is above horizon

  //with if-else statement
  c2 = color('hsba(160, 100%, 30%, 0.5)');
  if (sunHeight < horizon) {
    background("lightblue"); // blue sky if above horizon
    
  } else {
    background("grey"); // night sky otherwise
  }

  //sun
  fill("white");
  
  rect(100, sunHeight, 200);
  textSize(20);
  fill("black");
  text('Hi! My name is...', currentWidth/2, sunHeight/2);
  


  // draw line for horizon
  stroke('lavender');
  line(0,horizon,400,horizon);

  //grass

  fill("lavender");

  rect(0, horizon, 400, 400);

}


