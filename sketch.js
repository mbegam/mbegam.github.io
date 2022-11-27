//
//  Plot the Mandelbrot Set
//

var SIZE = myMin(window.innerWidth, window.innerHeight) - 35;

// var SIZE = 200;
  
const LIMIT = 1024;
const SCALE = 4.0;

// For main Set: side = 3.0, rNW = -2.0, iNW = 1.5

var side;
var rNW;
var iNW;

var plotArray = [];
var maxCount;
var autoScaleOn;
var bound;  
var magnification;    

function showGlobals() {

     console.log(" *** Global Variables ***\n");
     console.log("magnification: x " + magnification +"\n");
     console.log("SIZE: " + SIZE + "\n");
     console.log("LIMIT: " + LIMIT + "\n");
     console.log("SCALE: " + SCALE + "\n");
     console.log("side: " + side + "\n");
     console.log("rNW: " + rNW + "\n");
     console.log("iNW: " + iNW + "\n");
     console.log("maxCount: " + maxCount + "\n");
     console.log("bound: " + bound + "\n");
     console.log("autoScaleOn: " + autoScaleOn + "\n");
     console.log("length: " + plotArray.length + "\n");
}

function myMin(n1, n2) {
     return (n1 < n2) ? n1 : n2;
}

function getRegion() {

     var step = side / SIZE;

     var zMag = 0.0;
     var real = 0.0;
     var imag = 0.0;
     var rtmp = 0.0;
     var iPix = 0.0;
     var jPix = 0.0;

     var myCount = 0;
     maxCount = 0;
     var n = 0;

     for (var i = 0; i < SIZE; i++) {
          for (var j = 0; j < SIZE; j++) {

               real = jPix = rNW + j * step;
               imag = iPix = iNW - i * step;
               zMag = 0.0;
               myCount = 0;
       
               //  for complex num c, zMag <-- zmag^2 + c

               while (zMag < bound && myCount < LIMIT) {
                    rtmp = real;
                    real = rtmp*rtmp - imag*imag + jPix;
                    imag *= rtmp;
                    imag += imag + iPix;
                    zMag = real*real + imag*imag;
                    myCount++;
               }
               if (myCount < LIMIT && myCount > maxCount) {
                    maxCount = myCount;
               }
               plotArray[n++] = myCount;
          }
     }
     // showGlobals(); 
}

function drawBox() {

    var boxSize = SIZE / 10.0;

    stroke(0, 0, 255);
    strokeWeight(3);
    noFill();
   
    var x = mouseX - 0.5 * boxSize;
    var y = mouseY - 0.5 * boxSize;

    rect(x, y, boxSize, boxSize);
}

//
// Main Program
//

function setup() {

     createCanvas(SIZE, SIZE);
     background(210, 214, 126);

     // plot the main set

     autoScaleOn = true;

     rNW = -2.0;
     iNW = 1.5;
     side = 3.0;
     bound = 2.0;
     magnification = 1;   

     getRegion();
     redraw(3);

     // only redraw the screen on mouse/touch events
     // from here on

     noLoop();
}

function draw() {

     // draw the plot...
     
     var n = 0;
    
     for (var i = 0; i < SIZE; i++) {
          for (var j = 0; j < SIZE; j++) {
               if (plotArray[n] === LIMIT) {
                    colorMode(RGB);
                    stroke(0, 0, 0);
               }
               else {
                    var myColor = plotArray[n] / SCALE;
                    if (autoScaleOn === true) {
                         myColor = map(myColor, 0, maxCount, 0, LIMIT);
                    }
                    colorMode(HSB, 255);
                    stroke(myColor, 255, 255);
               }
               point(j, i);
               n++;
          }
     }
}

//
//  Mouse and touch functionality  
//  
//  (This is called by default if a touch event is detected 
//  but no touch-event function is defined.) 
//

async function mousePressed() {

     var boxSize = SIZE / 10.0;
     var step = side / SIZE;

     magnification *= 10;

     // update the plot coords

     rNW += (step * (mouseX - 0.5 * boxSize));
     iNW -= (step * (mouseY - 0.5 * boxSize));

     // zoom in 10x

     side /= 10.0;

     // update the plot

     await drawBox();
     getRegion();
     redraw(3);

     return false;


