var sketchProc = function(processingInstance) {
   with (processingInstance) {

     var SIZE = min(window.innerWidth, window.innerHeight) - 35;
     size(SIZE, SIZE);

     // *** Program Code Goes Here ***

     //////////////////////////////////////////////////////
     //
     //  Galaxy Bowl
     //
     //  Version 5
     //
     //  M.C. Begam   
     //  --------------------------------------------------
     //
     //  Spin-off of "Mouse-Accelerated Mover"
     //  Adapted from Dan Shiffman, natureofcode.com
     //
     //  Khan Academy 
     //  Computer programming -- JavaScript
     //  Unit 5, Lesson 6 -- Angular movement
     //  "Pointing towards movement" tutorial
     //-----------------------------------------------------
     //  
     //  Methods and Functions:
     //
     //  Pin constuctor
     //  Pin.prototype.draw
     //
     //  Ball constructor
     //  Ball.prototype.update
     //  Ball.prototype.display
     //  Ball.prototype.reset
     //  Ball.prototype.showPos  (for debugging only)
     //
     //  drawWorld
     //  updateWall
     //  showHelp
     //  showStatus
     //  drawBoards
     //  analyze
     //  draw
     //  keyPressed
     //  mouseClicked
     //  -----------------------------------------------------
     //
     //  Scaling added  8/14
     //
     //  Analysis added  8/12:
     //  (See https://en.wikipedia.org/wiki/Tenpin_bowling
     //  "Pins and pin carry" section)
     //
     //  Refactoring & showStatus added  8/16
     //
     //  Ball-Pin contact detection added  8/18
     //-------------------------------------------------------
     //
     //  To do:   
     //
     //  Fix 2D projection of ball movement
     //  Fix proportions (true to life)
     //  Pins!  
     //  Pin/Ball mechanics
     //  Scoring
     //  Lane details...
     //  ???
     //---------------------------------------------------------

     //  
     //  Globals
     //

     var SCALE = width/400.0;
     var xCen  = width/2.0;
     var yCen  = height/2.0;

     var yHor = 100*SCALE;              //  Horizon line y-coordinate
     var xAim = xCen;                   //  Aim point x-coordinate

     var yWall = yHor + 15.0*SCALE;     //  Back wall y-coordinate
     var yPit  = yHor + 30.0*SCALE;     //  Pit y-coordinate
     var yDeck = yPit + 0.032*width;    //  Deck entry y-coordinate
     var yRack = 345.0 * SCALE;         //  Rack y-coordinate
     var hWall = yWall;                 //  Wall height

     var helpOn = true;
     var started = false;
     var statusOn = true;

     var font = createFont("sans-serif");
     var degs = String.fromCharCode(176);

     var nStars = 200;
     var starsX = [];
     var starsY = [];
     var starsSize = [];
     var motionOn = true;

     var signColors = [];
     var signColorsN;

     var wallColor = color(92, 97, 237);
     var pitColor = color(99, 80, 99);
     var frmRate;

     //
     //  Analysis globals
     //
     var ballX;
     var ballZ;

     var ballXs = [];
     var ballZs = [];

     var pinConfigs = [
         
         //  Coords (inches) from back left corner of lane
         
         { n:  1, x: 20.75,  y: 34.125 },
         { n:  2, x: 14.75,  y: 23.75, },
         { n:  3, x: 26.75,  y: 23.75  },
         { n:  4, x:  8.75,  y: 13.375 },
         { n:  5, x: 20.75,  y: 13.375 },
         { n:  6, x: 32.75,  y: 13.375 },
         { n:  7, x:  2.75,  y:  3.00  },
         { n:  8, x: 14.75,  y:  3.00  },
         { n:  9, x: 26.75,  y:  3.00  },
         { n: 10, x: 38.75,  y:  3.00  } 
     ];

     var analyzeOn = false;
     var entered = false;
     var entryAngle;

     //  Pixels-to-inches conversion factor
     //  (lane is full width of canvas)

     var inches = width / 41.5; 

     var trackOn = true;
     var fillOn = true;
     var ballSize = 8.5 * inches;
     var pinSize = 4.766 * inches;

     //  Instance definitions

     var pins = [];
     var ball;

     /////////////////////////////////////////////
     //  Pin Constructor
     /////////////////////////////////////////////

     var Pin = function(config) {
         
         this.n = config.n;
         this.x = config.x;
         this.y = config.y;
         this.hit = false;
     };

     Pin.prototype.draw = function() {
         
         // x and y are real-world coordinates in inches relative
         // to back left corner of the lane -- n is pin number
         
         noStroke();
         fill((this.hit) ? color(175, 175, 175) : color(255, 255, 255));
         ellipse(this.x*inches, this.y*inches, 4.766*inches, 4.766*inches);
         
         textAlign(CENTER);
         textSize(18*SCALE);
         fill(0, 0, 0);
         text(str(this.n), this.x*inches, this.y*inches + 6.0*SCALE);
     };


     //////////////////////////////////
     //  Ball constructor
     //////////////////////////////////

     var Ball = function() {
       
         //  Physical appearance  
         this.color = color(0, 0, 0);
         this.diam = width/5.0;
         
         //  Mechanics
         this.pos = new PVector(width, yRack);
         this.vel = new PVector(0, 0);
         this.acc = new PVector(0, 0); 
         this.speed = 0.0;
         
         //  States
         this.racked = true;
         this.positioning = false;
         this.aiming = false;
         this.rolling = false;
         this.entered = false;
         this.returning = false;
         this.inGutterL = false;
         this.inGutterR = false;
         this.inDeck = false;
         this.inPit = false;
         this.inLight = false;
     };


     /////////////////////////////////////////////
     //  Ball methods --
     //  from "Mouse-Accelerated Mover" with mods
     /////////////////////////////////////////////

     Ball.prototype.update = function() {
         
         var vanPoint = new PVector(xCen, yHor);
         var aimPoint = new PVector(xAim, yHor);
         var     rack = new PVector(width, yRack);
         
         // Lane narrows towards vanishing point on horizon

         var laneWidth = width * (this.pos.y - yHor) / (height - yHor);
         var  xGutterL = xCen - (laneWidth/2.0);
         var  xGutterR = xCen + (laneWidth/2.0);
         
         //  Gutter ball conditionals
         
         this.inGutterL = this.rolling && 
                          this.pos.y > yPit-10.0*SCALE &&   
                          this.pos.x < xGutterL;
                   
         this.inGutterR = this.rolling &&
                          this.pos.y > yPit-10.0*SCALE &&  
                          this.pos.x > xGutterR;
                          
         //  Other ball location conditionals
         
         this.inPit   = this.pos.y <  yPit - 5.0*SCALE;
         
         this.inLight = this.pos.y >= yPit - 5.0*SCALE &&
                        this.pos.y <  yPit + 15.0*SCALE;
         
         this.inDeck  = this.pos.y >= yPit && 
                        this.pos.y <= yDeck;
                         
         if (this.racked) {
             
             this.speed = 0.0;
         }
         else if (this.positioning) {
             
             this.speed = 0.0;
             
             //  Stay in our lane
             this.pos.x = constrain(this.pos.x, xGutterL, xGutterR);
         }
         else if (this.aiming) {
             
             this.speed = 0.0;
             xAim = constrain(xAim, 0, width);
             
             //  Set the initial direction
             
             this.acc = PVector.sub(aimPoint, this.pos);
         }
         else if (this.rolling) {
             
             this.speed = 2.0*SCALE;

             if (this.inGutterL || this.inGutterR) {
                 
                 //  Fall all the way into the gutter...
                 
                 if (this.inGutterL) {
                     this.pos.x = xGutterL - (laneWidth/14.0)*SCALE;
                 }
                 if (this.inGutterR) {
                     this.pos.x = xGutterR + (laneWidth/14.0)*SCALE;
                 }
                 
                 //  ...and stay in the gutter
                 
                 this.acc = (PVector.sub(vanPoint, this.pos));
             }
             if (this.pos.y < yPit - 10.0*SCALE)  {
                 
                 //  In the pit -- return the ball
                 
                 xAim = xCen;
                 this.speed = 0;
                 this.pos.set(xAim, yHor);
                 this.vel.set(0, 0);
                 this.inGutterL = false;
                 this.inGutterR = false;
                 this.rolling = false;
                 this.returning = true;
             }
             else {
                 
                 //  Go towards the aim point
                 this.acc = PVector.sub(aimPoint, this.pos);
             }
         }
         else if (this.returning) {
             
             this.speed = 2.0*SCALE;
             this.acc = PVector.sub(rack, this.pos);
             
             //  Check for the rack
             
             if (this.pos.y >= yRack) {
                 this.speed = 0;
                 this.pos.set(rack);
                 this.vel.set(0, 0);
                 this.returning = false;
                 this.racked = true;
             }
         } 
         
         //  Update direction only -- not speed!
         
         this.acc.normalize();
         this.vel = PVector.mult(this.acc, this.speed);
         this.pos.add(this.vel);
         
         //  Track real-world ball coords in inches
         
         var ballX = map(this.pos.x, xGutterL, xGutterR, 0, 41.5);
         var ballZ = map(this.pos.y, yPit, height, 0, 754.125);
         ballZ = 754.125 - ballZ;
         
         if (this.rolling && ballZ > 700) {
             ballXs.push(ballX);
             ballZs.push(ballZ);
         }
     };

     Ball.prototype.display = function() {
         
         //  Modified for one-point perspective--
         //  ball diameter decreases to zero at horizon.
         //
         //  Max diameter of approx 1/5 lane width is
         //  real-life proportion
         
         this.diam = map(this.pos.y, yHor, height, 0, width/5.0);
         
         noStroke();
         
         if (this.inPit) {
             fill(pitColor);
         }
         else {
             fill(0, 0, 0);
         }
         ellipse(this.pos.x, this.pos.y, this.diam, this.diam);  
         
         if (this.inLight) {
             fill(255, 255, 255, 100);
             ellipse(this.pos.x, this.pos.y, this.diam, this.diam);
         }
     };

     //////////////////////////////////////////
     //  Original methods
     //////////////////////////////////////////

     Ball.prototype.reset = function() {
         
         this.pos.set(width, yRack);
         this.vel.set(0, 0);
         this.acc.set(0, 0);
         
         this.racked = true;
         this.positioning = false;
         this.aiming = false;
         this.rolling = false;
         this.returning = false;
     };

     //  For debugging -- uncomment keyCode default

     Ball.prototype.showPos = function() {
         var Pos = str(this.pos.x) + " " + str(this.pos.y);
         println(Pos);
     };

     //////////////////////////////////////////////
     //  Other functions
     //////////////////////////////////////////////

     var drawWorld = function() {
         
         var wallColor = color(92, 97, 237);
         var laneColor = color(166, 130, 45);
         var pitColor = color(99, 80, 99);
         var gutterColor = color(96, 99, 158);
         
         var pitWidth = width * (yPit - yHor) / (height - yHor);
         
         background(gutterColor);
         
         // Horizon line for perspective reference --
         // make visible by commenting out back wall & pit
         
         textSize(15*SCALE);
         textAlign(LEFT);
         text("Horizon", 20*SCALE, 100*SCALE);
         stroke(pitColor);
         strokeWeight(1*SCALE);
         line(0, yHor, width, yHor);
         
         line(0, yWall, width, hWall);
         
         // Lanes
         
         fill(laneColor);
         noStroke();
         
         //  Center lane
         triangle(0, height, width, height, xCen, yHor);
         
         //  All the others -- decoration only
         triangle(-1440*SCALE, height, -1040*SCALE, height, xCen, yHor);
         triangle( -960*SCALE, height,  -560*SCALE, height, xCen, yHor);
         triangle( -480*SCALE, height,   -80*SCALE, height, xCen, yHor);
         triangle(  480*SCALE, height,   880*SCALE, height, xCen, yHor);
         triangle(  960*SCALE, height,  1360*SCALE, height, xCen, yHor);
         triangle( 1440*SCALE, height,  1840*SCALE, height, xCen, yHor);
         
         //  Pin deck (approximate)
         //stroke(255, 255, 255);
         noFill();
         fill(255, 255, 255, 100);
         triangle(xCen-pitWidth/2, yPit, xCen, yDeck, xCen+pitWidth/2, yPit);
         
         
         // Back wall
         fill(wallColor);
         noStroke();
         rect(0, 0, width, hWall);
         
         // Stars
         fill(255, 255, 255);
         for (var i = 0; i < nStars; i++) {
             ellipse(starsX[i], starsY[i], starsSize[i], starsSize[i]);
         }
         
         // Neon sign

         textAlign(CENTER);
         
         //    Shadow
         textFont(font, 40*SCALE);
         fill(50, 50, 50, 200);
         text("G a l a x y  B o w l", xCen, yWall/2.0 - 3.0*SCALE);
         
         //    Neon light
         textSize(38*SCALE);
         fill(signColors[signColorsN % 3]);
         text("G a l a x y   B o w l", xCen, yWall/2.0);
         
         // Pit
         noStroke();
         fill(pitColor);
         rect(0, yHor, width, 30*SCALE);
         
         // Pin light
         noStroke();
         fill(255, 255, 255, 30);
         rect(0, yPit, width, 15*SCALE);
     };

     var updateWall = function() {
         
         //  Cycle index of neon sign colors array
         if (frameCount % 200 === 0) {
             signColorsN++;
         }
         //  Animate star field
         if (motionOn && frameCount % round(frmRate * 0.12) === 0) {
             for (var i = 0; i < nStars; i++) {
                 starsX[i] = (starsX[i] + 1) % width;
                 starsY[i] = (starsY[i] + 1) % yWall;
             }
         }
     };

     var showWelcome = function() {
         
         fill(235, 233, 223);
         
         textAlign(CENTER);
         textSize(30*SCALE);   
         text("Click to start", xCen, yCen-20*SCALE);
             
         textAlign(RIGHT);
         textSize(25*SCALE);
         text("h:", xCen-50*SCALE, yCen+20*SCALE);
         text("s:", xCen-50*SCALE, yCen+45*SCALE);
         text("m:", xCen-50*SCALE, yCen+70*SCALE);
         
         textAlign(LEFT);
         textSize(20*SCALE);
         text("Help on/off", xCen-30*SCALE, yCen+20*SCALE);
         text("Status on/off", xCen-30*SCALE, yCen+45*SCALE);
         text("Star motion on/off", xCen-30*SCALE, yCen+70*SCALE);
     };

     var showHelp = function() {
         
         textAlign(CENTER);
         textSize(25*SCALE);
         fill(240, 240, 255, 120);
         
         if (ball.racked) {
             text("Up Arrow to take ball", xCen, yCen+110*SCALE);
         }
         else if (ball.positioning) {
             text("L/R Arrow to position ball...", xCen, yCen+80*SCALE);
             text("Up Arrow to take aim", xCen, yCen+110*SCALE);
         }
         else if (ball.aiming) {
             text("L/R Arrow to aim...", xCen, yCen+50*SCALE); 
             text("(Down Arrow to go back)", xCen, yCen+80*SCALE);
             text("Up Arrow to roll", xCen, yCen+110*SCALE);
         }
         else if (ball.rolling && !(ball.inGutterL || ball.inGutterR)) {
             text("L/R Arrow to hook" , xCen, yCen+80);
         }
         else if (ball.returning) {
             text("Hit Space", xCen, yCen+80*SCALE); 
             text("to toggle analysis", xCen, yCen+110*SCALE);
         }
     };

     var showStatus = function() {
         
         textAlign(LEFT);
         textSize(10*SCALE);
         
         fill(ball.racked ? (255, 255, 255) : (255, 255, 255, 200));
         text("racked", 5*SCALE, yCen-40*SCALE);
         
         fill(ball.positioning ? (255, 255, 255) : (255, 255, 255, 200));
         text("positioning", 5*SCALE, yCen-30*SCALE);
         
         fill(ball.aiming ? (255, 255, 255) : (255, 255, 255, 200));
         text("aiming", 5*SCALE, yCen-20*SCALE);
         
         fill(ball.rolling ? (255, 255, 255) : (255, 255, 255, 200));
         text("rolling", 5*SCALE, yCen-10*SCALE);
         
         fill(ball.inGutterL ? (255, 255, 255) : (255, 255, 255, 200));
         text("inGutterL", 5*SCALE, yCen);
         
         fill(ball.inGutterR ? (255, 255, 255) : (255, 255, 255, 200));
         text("inGutterR", 5*SCALE, yCen+10*SCALE);  
         
         fill(ball.inDeck ? (255, 255, 255) : (255, 255, 255, 200));
         text("inDeck", 5*SCALE, yCen+20*SCALE);
         
         fill(ball.inPit ? (255, 255, 255) : (255, 255, 255, 200));
         text("inPit", 5*SCALE, yCen+30*SCALE); 
         
         fill(ball.inLight ? (255, 255, 255) : (255, 255, 255, 200));
         text("inLight", 5*SCALE, yCen+40*SCALE);
         
         fill(ball.returning ? (255, 255, 255) : (255, 255, 255, 200));
         text("returning", 5*SCALE, yCen+50*SCALE); 
         
         if (ball.rolling) {
             var hdng = -round(ball.vel.heading());
             textSize(12*SCALE);
             fill(255, 255, 255);
             text(str(hdng) + degs, 5*SCALE, yCen+70*SCALE);
         }
     };

     var drawBoards = function() {
         
         var bw = 1.064 * inches; // board width
         
         stroke(0, 0, 0);
         strokeWeight(0.3);
         
         for (var i = 0; i < 39; i++) {
             
             var x = i * bw;
             
             fill(255, 196, 0);
             
             if ((i + 1) % 5 === 0) {
                 fill(255, 247, 0);
             }
             else {
                 fill(237, 191, 73);
             }   
             rect(x, 0, x + bw, height);
         }
         
         // Board numbers
         
         textAlign(CENTER);
         textSize(14*SCALE);
         fill(0, 0, 0);
         
         text("3",  4.5 * bw, 375*SCALE);
         text("5",  4.5 * bw, 388*SCALE);
         text("3",  9.5 * bw, 375*SCALE); 
         text("0",  9.5 * bw, 388*SCALE);
         text("2", 14.5 * bw, 375*SCALE);
         text("5", 14.5 * bw, 388*SCALE);
         text("2", 19.5 * bw, 375*SCALE);
         text("0", 19.5 * bw, 388*SCALE);
         text("1", 24.5 * bw, 375*SCALE);
         text("5", 24.5 * bw, 388*SCALE);
         text("1", 29.5 * bw, 375*SCALE);
         text("0", 29.5 * bw, 388*SCALE);
         text("5", 34.5 * bw, 388*SCALE);
     };

     var analyze = function() {
         
         // See https://en.wikipedia.org/wiki/Tenpin_bowling
         // "Pin and pin carry" section
         
         var ballSize = 8.5 * inches;
         var x = [];
         var y = [];
         
         for (var i = 0; i < ballZs.length; i++) {
             
             x[i] = map(ballXs[i], 0.0, 41.5, 0.0, width);
             y[i] = map(ballZs[i], 700.0, 754.125, 0.0, height);
             y[i] = height - y[i];
             
             noFill();
             stroke(0, 0, 0);
             strokeWeight(1*SCALE);
             ellipse(x[i], y[i], ballSize, ballSize);
             
             stroke(255, 0, 0);
             strokeWeight(5*SCALE);
             point(x[i], y[i]);
             
             //  Ball-Pin contact detection
             
             for (var j = 0; j < 10; j++) {
                 var d = dist(x[i], y[i], pins[j].x*inches, pins[j].y*inches);
                 if (d < (ballSize + pinSize) / 2.0) {
                     pins[j].hit = true;
                 }
             }
         }
         
         //  Entry angle
         
         entryAngle = degrees(atan((x[1]-x[0])/(y[1]-y[0])));
         
         //  Display analysis
         
         drawBoards();
         
         // Pins
         for (var i = 0; i < 10; i++) {
             pins[i].draw();
         }
         
         for (var i = 0; i < ballZs.length; i++) {

             // Ball outline
             stroke(0, 0, 0);
             strokeWeight(1*SCALE);
             noFill();
             ellipse(x[i], y[i], ballSize, ballSize);
             
             // Ball center
             stroke(255, 0, 0);
             strokeWeight(5*SCALE);
             point(x[i], y[i]);
         }
         textAlign(LEFT);
         textSize(14*SCALE);
         fill(0, 0, 0);
         text("Entry angle: "+str(abs(round(entryAngle)))+degs, 5*SCALE, 350*SCALE);
     };


     ////////////////////////////////////////////////
     //  Main Program
     ////////////////////////////////////////////////

     // Set up and initialize

     smooth();

     frmRate = 40;
     frameRate(frmRate);

     for (var i = 0; i < 10; i++) {
         pins.push(new Pin(pinConfigs[i])) ;
     }

     for (var i = 0; i < nStars; i++) {
         starsX[i] = round(random(0, width));
         starsY[i] = round(random(0, yHor));
         starsSize[i] = round(random(1, 3) * SCALE);
     }

     signColors[0] = color(237, 17, 204);
     signColors[1] = color(8, 236, 240);
     signColors[2] = color(191, 232, 9);
     signColorsN = 0;

     ball = new Ball();

     ///////////////////
     //  Animation loop
     ///////////////////

     draw = function() {
         
         drawWorld();
         
         if (!started) {
             
             // Welcome display
             showWelcome();
         }
         if (!analyzeOn) {
         
             // Aim point
         
             if ((ball.aiming || ball.rolling) && 
                !(ball.inGutterL || ball.inGutterR)) {
                    
                 textSize(30*SCALE);
                 fill(255, 255, 255);
                 text("+", xAim, yHor+10*SCALE);
             }

             ball.update();
             ball.display();
             updateWall();
         
             //  Homerian cry (too annoying?)
         
             if (ball.inGutterL || ball.inGutterR) {
                 fill(240, 240, 255, 120);
                 textAlign(CENTER);
                 textSize(50*SCALE);
                 //text("D'oh!", xCen, yCen+80*SCALE);
             }
         
             //  Messages
         
             if (started & helpOn) {
                 showHelp();
             }
             if (started & statusOn) {
                 showStatus();
             }
             if (started && ball.racked) {
                 textAlign(CENTER);
                 textSize(30*SCALE);
                 fill(62, 212, 72);
                 text("Ready", xCen, yCen);
             }
         }
         else {
             analyze();
         }
     };

     ////////////////////////////
     //  Keyboard functionality
     ////////////////////////////

     keyPressed = function() {
         
         switch(keyCode) {
             
             //  h
             case 72: {  
                 helpOn = !helpOn;
                 break;
             }
             //  m
             case 77: {  
                 motionOn = !motionOn;
                 break;
             }
             //  s
             case 83: {
                 statusOn = !statusOn;
                 break;
             }
             //  Spacebar
             case 32: {
                 analyzeOn = !analyzeOn;
                 break;
             }
             case UP: {
                 if (ball.racked) {
                     ball.pos.set(xCen, height);
                     ball.racked = false;
                     ball.positioning = true;
                 } 
                 else if (ball.positioning) {
                     ball.positioning = false;
                     ball.aiming = true;
                 }
                 else if (ball.aiming) {
                     ballXs = [];
                     ballZs = [];
                     for (var i = 0; i < 10; i++) {
                         pins[i].hit = false;
                     }
                     ball.inDeck = false;
                     ball.entered = false;
                     ball.aiming = false;
                     ball.rolling = true;
                 }
                 break;
             }
             case DOWN: {
                 if (ball.aiming) {
                     xAim = xCen;
                     ball.aiming = false;
                     ball.positioning = true;
                 }
                 break;
             }
             case LEFT: {
                 if (ball.positioning) {
                     ball.pos.x--;
                 }
                 else if ((ball.aiming || ball.rolling) && xAim > 15*SCALE) {
                     xAim -= (ball.aiming) ? 1.0*SCALE : 15.0*SCALE;
                 }
                 break;
             }
             case RIGHT:  {
                 if (ball.positioning) {
                     ball.pos.x++;
                 }
                 else if ((ball.aiming || ball.rolling) && xAim < width-15*SCALE) {
                     xAim += (ball.aiming) ? 1.0*SCALE : 15.0*SCALE;
                 }
                 break;
             }
             // w
             case 87: {
                 yHor += SCALE;
                 break;
             } 
             default: {
                 // ball.showPos();
                 break;
             }
         }
     };

     /////////////////////////
     //  Mouse functionality
     /////////////////////////

     mouseClicked = function() {
         cursor("NONE");
         started = true;
         ball.reset();
     };
}};

// Set the value of the h1 tag

// document.getElementById("hdr1").innerHTML = "*** Insert Header Here ***";

// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.
processingInstance = new Processing(canvas, sketchProc); 
