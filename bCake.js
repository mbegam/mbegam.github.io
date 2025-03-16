//  Birthday Cake   M.C. Begam
//  p5.js version 21 Jan 2025

//  Globals

let SIZE;
let SCALE;
let xCen;
let yCen;
let started;
let wished;
let blown;
let name;
let age;

let nameInput;
let ageInput;
let button;

function setup() {

   SIZE = min(windowWidth, windowHeight) - 35;
   createCanvas(SIZE, SIZE);  
   
   angleMode(DEGREES);
   frameRate(8);

   SCALE = SIZE / 400;
   xCen = SIZE/2;
   yCen = SIZE/2;

   started = false;
   wished = false;
   blown = 0;
   age = 20;
   
   background(125, 231, 240);
   textAlign(CENTER, CENTER);
   textSize(30*SCALE);
   fill(255, 0, 255)
   text("Create Your Cake", xCen, yCen-40*SCALE);
   getInfo();
}

function draw() {

   let i;
   let x;
   let y;

   const off140 = SCALE*140;
   const off45 = SCALE*45;
   
   // theta is negative so candles and flames are
   // drawn in CCW direction, i.e, back to front!

   const theta = (-360.0 / age);
      
   if (started) {

      drawBackground();
      drawCake();

      for (i = 0; i < age; i++) {
         x = xCen + off140 * cos(i * theta);
         y = yCen + off45 * sin(i * theta);
         putCandle(x, y);
         if (i >= blown) {
            putFlame(x, y, random(SCALE*8, SCALE*30));
         }
      }
      if (wished) {
         blown++;
      }
   }
}

function getInfo() {

   textSize(15*SCALE);
   fill(0, 0, 0);

   text("Name", xCen-40*SCALE, yCen);
   nameInput = createInput();
   nameInput.position(xCen, yCen);
   nameInput.size(50*SCALE);

   text("Age", xCen-32*SCALE, yCen+30*SCALE);
   ageInput = createInput();
   ageInput.position(xCen, yCen+30*SCALE);
   ageInput.size(20*SCALE);

   button = createButton("Enter");
   button.position(xCen-20*SCALE, yCen+60*SCALE);
   button.mousePressed(setInfo);
}

function setInfo() {
   name = nameInput.value();
   age = ageInput.value();
   
   removeElements();

   // in case canvas got resized during input, as on a phone
   resizeCanvas(SIZE, SIZE, true);
}

function drawBackground() {

   background(125, 231, 240);
   fill(255, 0, 0);
   textAlign(CENTER, CENTER);

   if (!wished) {
      textSize(SCALE*25);
      text("Make a wish!", xCen, SCALE*40);
      textSize(SCALE*15);
      text("Click or Tap to Blow Out the Candles", xCen, SCALE*65);
    }
    else if (blown > age) {
      textSize(SCALE*30);
      text("Have a Great Day!", xCen, SCALE*40);
    }
}

function drawCake() {

   let off150 = SCALE*150;
   let off100 = SCALE*100;

   fill(105, 60, 34);
   noStroke();
   ellipse(xCen, yCen+SCALE*100, SCALE*300, SCALE*100);
   quad(xCen-off150, yCen, xCen+off150, yCen, xCen+off150, yCen+off100, 
        xCen-off150, yCen+off100);
   fill(237, 216, 216);
   ellipse(xCen, yCen, SCALE*300, SCALE*100);

   stroke(SCALE);
   fill(16, 224, 23);
   textSize(SCALE*24);
   textAlign(CENTER, CENTER);
   text("Happy Birthday", xCen, SCALE*175);
   textSize(SCALE*30);
   text(name + "!", xCen, SCALE*200);
}

function putCandle(x, y) {
   let off3 = SCALE*3;
   let off40 = SCALE*40;
      
   fill(180, 29, 194);
   noStroke();
   ellipse(x, y, SCALE*6, SCALE*3);
   quad(x-off3, y, x+off3, y, x+off3, y-off40, x-off3, y-off40);
   ellipse(x, y-SCALE*40, SCALE*6, SCALE*3);
}

function putFlame(x, y, size) {
   fill(224, 189, 16);
   noStroke();
   ellipse(x, y-(SCALE*45+size/2), SCALE*5, size);
}

function mousePressed() {
   if (started) {
      wished = true;
   }
   if (name !== undefined) {
      started = true;
   }
}
