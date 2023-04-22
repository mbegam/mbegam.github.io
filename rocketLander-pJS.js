var sketchProc = function(processingInstance) {
     with (processingInstance) {

          // *** Program Code Goes Here ***

          //
          // Rocket Lander
          // 
          // M.C. Begam   
          //

          var SIZE = min(window.innerWidth, window.innerHeight) - 35;
          var SCALE = SIZE / 400;
          var RAD = PI / 180.0;

          size(SIZE, SIZE);

          var ftPerPix = 2.0*SCALE;
          var x0 = 350*SCALE;
          var y0 = 15*SCALE;
          var vX0 = -20*SCALE;
          var vY0 = 20*SCALE;
          var vX = 0;
          var vY = 0;
          var g = 32*SCALE;
          var T = 0;
          var shipX = x0;
          var shipY = y0;
          var h = 350*SCALE - y0;
          var r = 300*SCALE;
          var Th2weight = 2.0;

          var tSec = 0;
          var tTotal = 0;
          var theta = 30;
          var Z;
          var frmRate = 30;
          var fuel = 30 * frmRate;
          var saveCount = 0;

          var reset = false;
          var started = false;
          var thrustOn = false;
          var showThrust = false;
          var telemetryOn = true;
          var helpOn = false;
          var paused = false;
          var landed = false;
          var flameout = false;
          var crashed = false;

          // var thrust = getSound("retro/thruster-short");

          var drawWater = function() {
              
               fill(0, 255, 255, 200);
               rect(0, 350*SCALE, 400*SCALE, 50*SCALE); 
          };
              
          var drawShip = function() {
              
               strokeWeight(1);
               stroke(0, 0, 0);
               noFill();
               
               pushMatrix();
               translate(shipX, shipY);
               rotate(theta*RAD);
               
               if (crashed) {
                   
                    // fire and smoke

                    stroke(255, 0, 0);
                    fill(255, 180, 0, 180);
                    ellipse(0*SCALE, 0*SCALE, 20*SCALE, 40*SCALE);
                    noStroke();
                    fill(0, 0, 0, 50);
                    ellipse(3*SCALE, -20*SCALE, 30*SCALE, 50*SCALE);
                    rotate(15*RAD);
                    fill(0, 0, 0, 20);
                    ellipse(3*SCALE, -30*SCALE, 20*SCALE,50*SCALE);
                    
                    // wreckage

                    stroke(0, 0, 0);
                    noFill();
                    ellipse(0*SCALE, 20*SCALE, 10*SCALE, 20*SCALE);
                    ellipse(0*SCALE, 20*SCALE, 30*SCALE, 12*SCALE);
                    line(-10*SCALE, 8*SCALE, 25*SCALE, 10*SCALE);
                    ellipse(0*SCALE, -2*SCALE, 10*SCALE, 12*SCALE);
                    rect(-4*SCALE, -2*SCALE, 7*SCALE, 4*SCALE);
                    rotate(10*RAD);
                    line(-10*SCALE, 0*SCALE, 20*SCALE, 20*SCALE);
                    rect(5*SCALE, 5*SCALE, 16*SCALE, 10*SCALE);
                    triangle(0*SCALE, -5*SCALE, -2*SCALE, 10*SCALE, 11*SCALE, 3*SCALE);
                    rotate(5*RAD);
                    rect(-10*SCALE, 8*SCALE, 10*SCALE, 8*SCALE);
                    
                    // more fire

                    noStroke();
                    fill(150, 50, 0, 100);
                    ellipse(0*SCALE, 10*SCALE, 40*SCALE, 40*SCALE);
                    fill(255, 180, 0);
                    ellipse(0*SCALE, 0*SCALE, 10*SCALE, 25*SCALE);
               }
               else {
                    
                    // draw the ship

                    arc(0, 25*SCALE, 25*SCALE, 25*SCALE, PI, TWO_PI);
                    arc(0, 25*SCALE, 25*SCALE, 35*SCALE, PI, TWO_PI);
                    fill(255, 255, 255);
                    ellipse(0, 0, 15*SCALE, 30*SCALE);
                    if (showThrust && fuel > 0) {
                         stroke(255, 0, 0);
                         fill(255, 180, 0);
                         ellipse(0*SCALE, 30*SCALE, 5*SCALE, 20*SCALE);
                    }
                    stroke(0, 0, 0);
                    fill(255, 255, 255);
                    triangle(0, 15*SCALE, -5*SCALE, 20*SCALE, 5*SCALE, 20*SCALE);
               }
               popMatrix();
          };

          var drawBarge = function() {
              
               noStroke();
               fill(0, 0, 0);
               rect(180*SCALE, 345*SCALE, 40*SCALE, 10*SCALE);
          };

          var showTelemetry = function() {

               textSize(15*SCALE);
               textAlign(LEFT, BASELINE);

               fill(0, 0, 0);
               text("t = " + round(tTotal / frmRate), 10*SCALE, 20*SCALE);
               text("h = " + round(h / SCALE), 10*SCALE, 40*SCALE);
               text("r = " + round(r / SCALE), 10*SCALE, 60*SCALE);

               if (round(vY) > 10*SCALE) {
                    fill(255, 0, 0);
               }
               text("vY = " + round(vY/SCALE), 10*SCALE, 80*SCALE);

               fill(0, 0, 0);
               if (round(Z) > 5) {
                    fill(255, 0, 0);
               }
               text("angle = " + Z, 10*SCALE, 100*SCALE);

               fill (0, 0, 0);
               if (round(fuel / frmRate) <= 10) {
                    fill(255, 0, 0);
               }
               text("fuel = " + round(fuel / frmRate), 10*SCALE, 120*SCALE);

               //text("g = " + g, 20*SCALE, 140*SCALE);
               //text("tSec = " + round(tSec), 10*SCALE, 140*SCALE);
               //text("thrustOn = " + thrustOn, 20*SCALE, 100*SCALE);
               //text("y0 = " + round(y0), 20*SCALE, 100*SCALE);
               //text("v0 = " + round(vY0), 20*SCALE, 120*SCALE);
               //text("theta = " + theta, 20*SCALE, 160*SCALE);
               //text("reset = " + reset, 20*SCALE, 120*SCALE);
          };

          var toggleReset = function() {

               frameCount = 0;
               x0 = shipX;
               y0 = shipY;
               vX0 = vX;
               vY0 = vY;
               reset = !reset;
          };

          var allStop = function() {

               g = 0;  // else we sink through the barge!

               x0 = 200*SCALE;
               y0 = 320*SCALE;
               vX0 = 0;
               vY0 = 0;
               vX = 0;
               vY = 0;
               shipX = 200*SCALE;
               shipY = 320*SCALE;
               theta = 0;
               frameCount = 0;
          };

          var endGame = function() {

               fill(255, 0, 0);
               textSize(25*SCALE);
               textAlign(CENTER, CENTER);
               text("It's game over, man!", 200*SCALE, 200*SCALE);
               thrustOn = false;
               noLoop();
          };

          var showHelp = function() {
              
               background(222, 206, 222);
               
               fill(255, 0, 0);
               textSize(25*SCALE);
               
               textAlign(CENTER, CENTER);
               text("Welcome to Rocket Lander!", 200*SCALE, 30*SCALE);
               textSize(22*SCALE);
               text("hit h to go back...", 200*SCALE, 370*SCALE);
               
               textAlign(LEFT, BASELINE);
               textSize(22*SCALE);
               text("Arrow Keys", 40*SCALE, 80*SCALE);
               text("Keyboard Keys", 40*SCALE, 175*SCALE);
               text("Instructions", 40*SCALE, 270*SCALE);
               fill(0, 0, 0);
               textSize(18*SCALE);
               text("up", 40*SCALE, 100*SCALE);
               text("thrust", 200*SCALE, 100*SCALE);
               text("left", 40*SCALE, 120*SCALE);
               text("rotate ccw", 200*SCALE, 120*SCALE);
               text("right", 40*SCALE, 140*SCALE);
               text("rotate cw", 200*SCALE, 140*SCALE);
               text("t", 40*SCALE, 215*SCALE);
               text("telemetry on/off", 200*SCALE, 215*SCALE);
               text("p", 40*SCALE, 235*SCALE);
               text("pause on/off", 200*SCALE, 235*SCALE);
               text("h", 40*SCALE, 195*SCALE);
               text("help on/off", 200*SCALE, 195*SCALE);
               textSize(16*SCALE);
               text("Land on barge with vY < 10 fps and within", 40*SCALE, 290*SCALE);
               text("5 degrees of vertical.  Do not hold down", 40*SCALE, 310*SCALE);
               text("more than one arrow key at a time!", 40*SCALE, 330*SCALE);
          };

          //
          // Main Loop
          //

          draw = function() {
              
               frameRate(frmRate);
               background(255, 255, 255);
               
               // zenith angle

               Z = abs(theta % 360);
               if (Z > 180) {
                    Z = 360 - Z;
               }

               if (telemetryOn) {
                    showTelemetry();
               }
               drawShip();
               drawBarge();
               drawWater();
               
               if (started) {
                   
                    tSec = frameCount / frmRate;

                    if (fuel > 0 && thrustOn) {
                         T = Th2weight * g;
                    }
                    else {
                         T = 0;
                    }

                    // contact with barge

                    if (abs(round(r)) < 14*SCALE && round(h) <= 30*SCALE) {
                        
                         // not landed yet  

                         if (!landed) {

                              // crash: excessive speed or zenith angle

                              if (vY > 20 * SCALE || Z > 5) {   
                                   crashed = true;
                                   thrustOn = false;
                                   background(255, 255, 255);
                                   if (telemetryOn) {
                                        showTelemetry();
                                   }
                                   drawShip();
                                   drawBarge();
                                   drawWater();
                                   endGame();
                              }
                         
                              // good landing

                              else {
                                  allStop();
                                  landed = true;
                              }
                         }

                         // already landed

                         else {
                              fill(255, 0, 0);
                              textAlign(CENTER, CENTER);
                              textSize(25*SCALE);
                              text("Good job!", 200*SCALE, 200*SCALE);
                              if (fuel > 0) {
                                   text("Ready For Launch", 200*SCALE, 250*SCALE);
                              }
                         }
                    }

                    // contact with water

                    if (abs(round(r)) >= 14*SCALE && h < 25*SCALE) {

                         flameout = true;
                         thrustOn = false;
                         showThrust = false;
                         toggleReset();
                         g = 8*SCALE;

                         fill(255, 0, 0);
                         textAlign(CENTER, CENTER);
                         textSize(25*SCALE);
                         text("Splash!", 200*SCALE, 200*SCALE);
                    }

                    // sunk

                    if (shipY > 1000*SCALE) {
                         endGame();
                    }
                    
                    // eqns of motion

                    var aX = T * cos(theta*RAD - HALF_PI);
                    var aY = g + T * sin(theta*RAD - HALF_PI);

                    shipX = x0 + vX0*tSec + 0.5*aX*tSec*tSec;
                    shipY = y0 + vY0*tSec + 0.5*aY*tSec*tSec;

                    vX = vX0 + aX*tSec;
                    vY = vY0 + aY*tSec;

                    h = (350*SCALE - shipY);
                    r = (shipX - 200*SCALE);

                    tTotal++;
               }
               else  {

                    // welcome message

                    fill(255, 0, 0);
                    textSize(30*SCALE);
                    textAlign(CENTER, CENTER);
                    text("Rocket Lander", 200*SCALE, 160*SCALE);
                    textSize(25*SCALE);
                    text("Click to Start", 200*SCALE, 200*SCALE);
                    text("(Hit h for Help)", 200*SCALE, 230*SCALE);
               }
          };

          //
          // Keyboard Functionality
          //

          keyPressed = function() {

               if (fuel > 0) {
                    if (landed) {
                         g = 32*SCALE;
                    }

                    // arrow keys

                    switch(keyCode) { 
                         case UP:
                             if (reset === false) {
                                  thrustOn = true;
                                  toggleReset();
                             }
                             if (!flameout) {
                                  showThrust = true;
                             }
                             if (fuel-- === 0) {
                                  thrustOn = false;
                                  toggleReset();
                             }
                             landed = false;
                             break;
                         case LEFT:
                             theta -= 2;
                             break;
                         case RIGHT:
                             theta += 2;
                             break;
                         default:
                             break;
                    }
               }
          
               // other keys

               switch(key.code) {
                   // t
                   case 116:
                        telemetryOn = !telemetryOn;
                        break;
                   // h
                   case 104:
                        if (!helpOn) {
                             showHelp();
                             noLoop();
                        }
                        else {
                             loop();
                        }
                        helpOn = !helpOn;
                        break;
                   // p
                   case 112:
                        if (!paused) {
                             noLoop();
                        }
                        else {
                             loop();
                        }
                        paused = !paused;
                        break;
                   default:
                        break;
               }
               //println(key.code);
          };

          keyReleased = function() {
              
               if (keyCode === UP && fuel > 0) {
                    thrustOn = false;
                    showThrust = false;
                    toggleReset();
               }
               //println(keyCode);
          };

          mouseClicked = function() {
               frameCount = 0;
               if (!started) {
                    started = !started;
               }
          };
     }
};

// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.

var processingInstance = new Processing(canvas, sketchProc); 
