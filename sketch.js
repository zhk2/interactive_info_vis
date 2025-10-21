//custom variables for y-coordinate of sun & horizon
let shapeHeight;

let designWidth = 4000;
let designHeight= 4000;
let horizon ;
function setup() {
  createCanvas(designWidth,designHeight);
  horizon =height/2;
}

function draw() {

  //shape follows y-coordinate of mouse
  shapeHeight = mouseY;
  currentWidth = mouseX;

  //light blue background if the shape is above horizon

  //with if-else statement
  if (shapeHeight < horizon) {
    background("grey"); // blue if above horizon
    
  } else {
    background("lightblue"); // grey if below horizon
  }

  //sun
  fill("orange");
  
  rect(width/4, shapeHeight, width/2);
  textSize(20);
  fill("white");
  text('Hi! My name is Zain', currentWidth/2, shapeHeight/2);
  


  // draw line for horizon
  stroke('cyan');
  line(0,horizon,width,horizon);

  //grass

  fill("cyan");

  rect(0, horizon, width, height);

}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  horizon = height / 2; // recalc horizon after resize
}

