var sketchProc = function(processingInstance) {
   with (processingInstance) {

      // *** Program Code Goes Here ***

      //
      //  Birthday Cake
      //

      var SIZE = min(window.innerWidth, window.innerHeight) - 35;
      var SCALE = SIZE / 400;
      size(SIZE, SIZE);
      frameRate(30);

      var xCen = width/2;
      var yCen = height/2;
      var wished = false;
      var blown = 0;
      var name = "James";
      var age = 68;

      var drawBackground = function() {

          background(125, 231, 240);
          fill(255, 0, 0);
          textAlign(CENTER, CENTER);
          if (!wished) {
               textSize(SCALE*15);
               text("Make a wish, then click or tap to blow out the candles!", xCen, SCALE*40);
          }
          else if (blown > age) {
              textSize(SCALE*30);
              text("Have a Great Day!", xCen, SCALE*50);
          }
      };

      var drawCake = function() {

          var off150 = SCALE*150;
          var off100 = SCALE*100;
          
          // cake
          fill(105, 60, 34);
          noStroke();
          ellipse(xCen, yCen+SCALE*100, SCALE*300, SCALE*100);
          quad(xCen-off150, yCen, xCen+off150, yCen, xCen+off150, yCen+off100, 
               xCen-off150, yCen+off100);
          stroke(0, 0, 0);
          fill(237, 216, 216);
          ellipse(xCen, yCen, SCALE*300, SCALE*100);

          fill(16, 224, 23);
          textSize(SCALE*24);
          textAlign(CENTER, CENTER);
          text("Happy Birthday", xCen, SCALE*175);
          textSize(SCALE*30);
          text(name+"!", xCen, SCALE*200);
      };

      var putCandle = function(x, y) {
          
          var off3 = SCALE*3;
          var off40 = SCALE*40;
          
          fill(180, 29, 194);
          noStroke();
          ellipse(x, y, SCALE*6, SCALE*3);
          quad(x-off3, y, x+off3, y, x+off3, y-off40, x-off3, y-off40);
          ellipse(x, y-SCALE*40, SCALE*6, SCALE*3);
      };

      var putFlame = function(x, y, size) {
          fill(224, 189, 16);
          noStroke();
          ellipse(x, y-(SCALE*45+size/2), SCALE*5, size);
          
      };

      //
      // Main program
      //

      frameRate(7);
      draw = function() {
          var x;
          var y;
          var off140 = SCALE*140;
          var off45 = SCALE*45;
          var pi = 3.141592654;
          var theta = (360.0 / age) * (pi / 180.0);
          
          drawBackground();
          drawCake();
          for (var i = 0; i < age; i++) {
              x = xCen + off140 * cos(i * theta);
              y = yCen +  off45 * sin(i * theta);
              putCandle(x, y);
          }
          for (var i = 0; i < age; i++) {
              x = xCen + off140 * cos(i * theta);
              y = yCen + off45 * sin(i * theta);
              if (i >= blown) {
                  putFlame(x, y, random(SCALE*8, SCALE*30));
              }
          }
          if (wished) {
              blown++;
          }
      };

      var mouseClicked = function() {
          wished = true;
      };
   }
};

// Set the value of the h1 tag

// document.getElementById("hdr1").innerHTML = "*** Insert Header Here ***";

// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.

var processingInstance = new Processing(canvas, sketchProc); 
