//
//  MandelZoom:  Interactive Mandelbrot Set 
//
//  Michael Begam    27 Nov 2022
//
//  Click/tap on the image to zoom in x 10 at that location
//
//  15 clicks (factor of 1 quadrillion) max for now
//

  
// Globals

const LIMIT = 100;

var side;
var rNW;
var iNW;

var old_side;
var old_rNW;
var old_iNW;

var plotArray = [];
var backArray = [];
var maxCount;
var minCount;
var autoScaleOn;
var msgOn;
var scaleMsg;
var goBack;
var bound;  
var magnification;    
var stopTime;
var SIZE;
var SCALE;

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

function getRegion() {

     var step = side / SIZE;

     var zMag = 0.0;
     var real = 0.0;
     var imag = 0.0;
     var rtmp = 0.0;
     var iPix = 0.0;
     var jPix = 0.0;

     maxCount = 0;
     minCount = LIMIT;
     var myCount = 0;
     var n = 0;

     // For every pixel in SIZE x SIZE array   

     for (var i = 0; i < SIZE; i++) {
          for (var j = 0; j < SIZE; j++) {

               real = jPix = rNW + j * step;
               imag = iPix = iNW - i * step;
               zMag = 0.0;
               myCount = 0;
       
               //  This loop is the  big number cruncher!
               //  For complex num c, zMag <-- zmag^2 + c

               while (zMag < bound && myCount < LIMIT) {
                    rtmp = real;
                    real = rtmp*rtmp - imag*imag + jPix;
                    imag *= rtmp;
                    imag += imag + iPix;
                    zMag = real*real + imag*imag;
                    myCount++;
               }

               // Keep track of max & min vals for later use
        
               if (myCount < LIMIT && myCount > maxCount) {
                    maxCount = myCount;
               }
               if (myCount >= 0 && myCount < minCount) {
                    minCount = myCount;
               }

               plotArray[n++] = myCount;  // store the value
          }
     }
     // showGlobals(); 
}

function drawBox() {

    var boxSize = SIZE / 10.0;

    colorMode(RGB);
    stroke(255, 255, 255);
    strokeWeight(3);
    noFill();
   
    var x = mouseX - 0.5 * boxSize;
    var y = mouseY - 0.5 * boxSize;

    rect(x, y, boxSize, boxSize);
    
    return true;
}

function zoomIn() {

     var boxSize = SIZE / 10.0;
     var step = side / SIZE;

     magnification *= 10;
   
     // Update the plot coords & side length

     old_rNW = rNW;
     old_iNW = iNW;
     old_side = side;

     rNW += (step * (mouseX - 0.5 * boxSize));
     iNW -= (step * (mouseY - 0.5 * boxSize));
     side /= 10.0;

     // Draw the box to highlight the region selection
     // and assure the user that something is happening

     drawBox();

     // Avoid any unexpected default behaviors

     return false;
}

//
//  *** Main Program ***
//

function setup() {

     // Set up the canvas

     SIZE = min(window.innerWidth, window.innerHeight);
     SCALE = SIZE / 400;

     createCanvas(SIZE, SIZE);
     background(210, 214, 126);

     // Main-set region parameters 

     rNW = -2.0;   // real coord of NW corner
     iNW = 1.5;    // imag coord of NW corner
     side = 3.0;   // side length of region

     old_rNW = rNW;
     old_iNW = iNW;
     old_side = side;

     bound = 4.0;  // boundary val for determining set membership

     // miscellany

     magnification = 1;   
     scaleMsg = "";
     autoScaleOn = true;
     msgOn = false;
     goBack = false;

     // Compute the set and store it in plotArray

     getRegion();   

     // Draw the canvas once

     redraw();

     // Keep the browser from continuously redrawing the canvas.
     // We'll do that only in response to mouse/touch events
     // from now on.

     noLoop();
}

function draw() {

     // Update the canvas

     var n = 0;   // index for linear array
    
     // for every pixel in SIZE x SIZE array

     for (var i = 0; i < SIZE; i++) {
          for (var j = 0; j < SIZE; j++) {

               // member of set -- color black
            
               if (plotArray[n] === LIMIT) {
                    colorMode(RGB);
                    stroke(0, 0, 0);
               }

               // not a member -- set the color by
               // mapping 0 - maxArrayVal to 0 - 255

               else {
                    var myColor = plotArray[n];
                    if (autoScaleOn) {
                         myColor = map(myColor, minCount, maxCount, 0, 255);
                    }
                    else {
                         myColor = map(myColor, 0, maxCount, 0, 255);
                    }
                    colorMode(HSB, 255);
                    stroke(myColor, 255, 255);
               }

               // draw the pixel on the canvas & incr the index

               point(j, i);
               n++;
          }
     }

     if (msgOn) {
          colorMode(RGB);
          stroke(255, 255, 255);
          fill(255, 255, 255);
          textAlign(CENTER, CENTER);
          textSize(25*SCALE);
          text(scaleMsg, width/2, height/2);
     }
}

//
//  Mouse and touch functionality  
//  

//
//  (This is called by default if a touch event is detected 
//  but no touch-event function is defined.) 
//

function mousePressed() {
  
     zoomIn();
     return false;
}

function mouseReleased() {

     getRegion();
     redraw();
     return false;
}    

function keyPressed() {

     // 'a': Toggle auto scaling on/off

     if (keyCode === 65) {
          autoScaleOn = !autoScaleOn;
          msgOn = true;
          scaleMsg = (autoScaleOn) ? "Auto Scaling On" : "Auto Scaling Off";
          redraw();
          msgOn = false;
          redraw();
     }

     // 'b':  Zoom back out
 
     if (keyCode === 66) {
          rNW = old_rNW;
          iNW = old_iNW;
          side = old_side;
          redraw();
     } 
     return false;
}
