var sketchProc = function(processingInstance) {
   with (processingInstance) {

      // ProgramCodeGoesHere

      //
      //  fold-FSdata 
      //
      //  M.C. Begam   12 Jun 2020
      //
      //  Simulates folding operation used in processing
      //  frequency-switched radio telescope data.
      //
      //  Scaling proportions based on a 400x400 canvas
      //
      //  Scaling sets 1 channel per pixel
      //

      var SIZE = min(window.innerWidth, window.innerHeight) - 35;
      var SCALE = SIZE / 400;
      size(SIZE, SIZE); 
      frameRate(30);
      
      var lineArr = [];
      var raw = [];
      var folded = [];
      var nChans; 
      var loChan;
      var hiChan;
      var offset; 
      var sigLine;
      var refLine;

      var SCALE = width / 400.0;
      var lineWidth = SCALE * 9.0;
      var lineHeight = SCALE * 80.0;
      var halfWidth;
      var lineStep; 

      var pi = 3.141592654;
      var rad = pi / 180;
      var theta;

      initialize = function() {
          
          var i;
          var x;

          // Make sure nChans is an even integer

          nChans = (width % 2) ? width - 1 : width;
          nChans = round(nChans);

          // Make sure lineWidth (in channels) is an odd integer

          lineWidth = round(lineWidth);
          if (lineWidth % 2 === 0) {
               lineWidth++;
          }

          offset = round(nChans / 10);
          sigLine = round((nChans - offset) / 2);
          refLine = round((nChans + offset) / 2);
          halfWidth = round((lineWidth - 1) / 2);

          // Create line array:
          // 
          // Line is a concave-down parabola with domain -1 to +1
          // and intercepts at -1 and +1.  Array size "lineWidth"
          // is scaled so that the base of the line is 9 channels
          // wide for every 400 channels in the plot (2.25%).

          lineStep = 2.0 / (lineWidth - 1);

          for (i = 0; i < lineWidth; i++) {
              x = -1.0 + i * lineStep; 
              lineArr[i] = -lineHeight * (sq(x) - 1.0);
          }
          
          // Create a sine-on-sine baseline

          theta = rad * (360.0 / nChans);
          for (i = 0; i < nChans; i++) {
              raw[i] = SCALE*30.0*sin(i*theta) + SCALE*15.0*sin(i*10.0*theta);
          }
          
          // Add line to baseline in sig & ref positions.
          
          for (i = 0; i < lineWidth; i++) {
              raw[i+sigLine-halfWidth] += lineArr[i];
              raw[i+refLine-halfWidth] -= lineArr[i];
          }
      };

      var getChans = function() {

           // Use mouse-pointer location to deternine which
           // two channels are currently being folded.

           loChan = constrain(mouseX, 1, nChans-offset-1);
           hiChan = loChan + offset;
      };

      var fold = function() {
          
          // Refresh folded array with raw array

          for (var i = 0; i < nChans; i++) {
              folded[i] = raw[i];
          }

          // Fold only channels < loChan

          for (var i = 0; i < loChan; i++) {
               folded[i] = (raw[i] - raw[i+offset]) / 2.0;
          }
      };

      var plot = function() {
          
          background(255, 255, 255);
          var yZero = height - height / 3.0;
          var yOff = raw[sigLine];
          
          // Text output

          strokeWeight(SCALE);
          textSize(SCALE*15);
          fill(255, 0, 0);
          text("Lo = " + round(raw[loChan-1]), SCALE*20, SCALE*80);
          fill(0, 0, 255);
          text("Hi  = " + round(raw[hiChan-1]), SCALE*20, SCALE*100);
          fill(0, 255, 0);
          text("Folded = (Lo - Hi) / 2 = " + round(folded[loChan-1]), SCALE*20, SCALE*120);
          textSize(SCALE*19);
          fill(0, 0, 0);
          text("Frequency-Switched Data 'Fold' Operation", SCALE*20, SCALE*30);
          
          // Draw Axis

          stroke(0, 0, 0);
          line(1, yZero, width, yZero);
          
          // Draw spectrum by connecting the dots

          stroke(0, 0, 0);
          strokeWeight(SCALE*2);
          for (var i = 0; i < nChans-1; i++) {
              if (i < loChan) {
                   stroke(0, 255, 0);
              }
              else {
                   stroke(0, 0, 0);
              }
              line(i, yZero-folded[i], i+1, yZero-folded[i+1]);
          }

          // Draw line for lower channel

          stroke(255, 0, 0);
          line(loChan, yZero-yOff, loChan, yZero+yOff);
          
          // Draw line for upper channel

          stroke(0, 0, 255);
          line(hiChan, yZero-yOff, hiChan, yZero+yOff);
          
      };

      // Main program

      initialize();
      draw = function() {
          getChans();
          fold();
          plot();
      };
   }
};

// Get the canvas that Processing-js will use
var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc); 