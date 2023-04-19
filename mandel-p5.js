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
var bound;  
var magnification;    
var magLevel;
var showInfoOn;
var SIZE;
var SCALE;
var LIMIT;

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
    strokeWeight(SIZE/400.0);
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
     magLevel++;
     LIMIT = 100 * magLevel;
   
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

function showInfo() {

     var status;  

     if (autoScaleOn) {
          status = "on";
     }
     else {
          status = "off";
     }

     //noStroke();
     //fill(0, 0, 100);
     textAlign(LEFT, CENTER);
     textSize(10*SCALE);
     //text("autoScale: " + (autoScaleOn) ? "on" : "off", 10*SCALE, 10*SCALE); 
     text("autoScale: " + status, 10*SCALE, 10*SCALE); 
     text("magLevel: " + magLevel, 10*SCALE, 20*SCALE);
     text("LIMIT: " + LIMIT, 10*SCALE, 30*SCALE);
}

//
//  *** Main Program ***
//

function setup() {

     // Set up the canvas

     SIZE = min(window.innerWidth, window.innerHeight);
     SCALE = SIZE / 400;

     createCanvas(SIZE, SIZE);

     // Main-set region parameters 

     rNW = -2.0;   // real coord of NW corner
     iNW = 1.5;    // imag coord of NW corner
     side = 3.0;   // side length of region

     old_rNW = rNW;
     old_iNW = iNW;
     old_side = side;

     LIMIT = 100;
     bound = 4.0;  // boundary val for determining set membership

     // miscellany

     magnification = 1;   
     magLevel = 1;
     showInfoOn = false;
     scaleMsg = "";
     autoScaleOn = true;
     msgOn = false;

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

     var n = 0;   // index for linear array

     var myHue;
    
     var min = LIMIT - maxCount;
     var max = LIMIT - minCount;

     // Update the canvas

     background(210, 214, 126);

     // for every pixel in array of length SIZE*SIZE;

     for (var i = 0; i < SIZE; i++) {
          for (var j = 0; j < SIZE; j++) {

               // member of set -- color black
            
               if (plotArray[n] >= LIMIT) {
                    colorMode(RGB);
                    stroke(0, 0, 0);
               }

               // not a member 

               else {

                    myHue = LIMIT - plotArray[n];

                    if (autoScaleOn) {
                         myHue = map(myHue, min, max, 0, 260);
                    }
                    else {
                         myHue = map(myHue, 0, LIMIT, 0, 260);
                    }
                    colorMode(HSB);
                    stroke(myHue, 100, 100);
               }

               // draw the pixel on the canvas & incr the index

               point(j, i);
               n++;
          }
     }
     if (showInfoOn) {
          var status;  

          if (autoScaleOn) {
               status = "on";
          }
          else {
               status = "off";
          }

          //noStroke();
          fill(0, 0, 100);
          textAlign(LEFT, CENTER);
          textSize(10*SCALE);
          text("autoScale: " + status, 10*SCALE, 10*SCALE); 
          text("magLevel: " + magLevel, 10*SCALE, 20*SCALE);
          text("LIMIT: " + LIMIT, 10*SCALE, 30*SCALE);
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

function keyTyped() {

     switch(key) {

          //  Toggle auto scaling on/off

          case 'a':
               autoScaleOn = !autoScaleOn;
               redraw();
               break;

          //  Zoom back out

          case 'b':
               if (magLevel > 1) {
                    rNW = old_rNW;
                    iNW = old_iNW;
                    side = old_side;
                    magLevel--;
                    LIMIT = 100 * magLevel;
                    getRegion();
                    redraw();
               }
               break;
   
          case 'i':
               showInfoOn = !showInfoOn;
               redraw();
               break;

          //  Enhance

          case '0': case '1': case '2': case '3': case '4': 
          case '5': case '6': case '7': case '8': case '9':
                    
               LIMIT = 100 * pow(2, key); 
               getRegion();
               redraw();
               //LIMIT = 100 * magLevel;
               break;

          //  Display the last key pressed

          default:
               console.log(key);
               break;
     }
     return false;
}
