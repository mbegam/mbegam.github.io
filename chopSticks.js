var sketchProc = function(processingInstance) {
   with (processingInstance) {

     var SIZE = min(window.innerWidth, window.innerHeight) - 35;
     size(SIZE, SIZE);
     frameRate(30);

     // *** Program Code Goes Here ***
     //
     //  Chopsticks fly challenge v2             
     //      --m.c. begam  June 2026
     //
     //  If you've seen "The Karate Kid" (original version),
     //  you know what this is.
     //
     //  ----------------------------------------------------------------
     //  Changes in version 2: 
     //
     //  1. Game is Resizable
     //
     //  2. Help screen & button added
     //
     //  3. Boolean mouseIsPressed replaced with custom-version myPressed
     //     in order to prevent sticks from getting stuck closed when the 
     //     mouse-pointer is moved off the canvas
     //
     //  4.  Chopsticks lengthened
     //  ----------------------------------------------------------------


     //  Unicode arrow symbols

     var    up = String.fromCodePoint(0x2191);
     var  down = String.fromCodePoint(0x2193);
     var  left = String.fromCodePoint(0x2190);
     var right = String.fromCodePoint(0x2192);

     //  Globals

     var SCALE = width / 400;
     var myPressed = false;

     var speed = 5;
     var tries = 0;
     var spacing = 15*SCALE;
     var inZone = false;
     var caught = false;
     var rightHanded = true;
     var started = false;
     var inStartButton = false;
     var inHelpButton = false;
     var helpOn = false;
     var fadeOut = 255;

     //
     //  Fly constructor & methods
     //

     var Fly = function(x, y) {
         
         this.x = x;
         this.y = y;
         this.angle = 0;
         this.speed = speed*SCALE;
     };

     Fly.prototype.update  = function() {
         
         //  Position & direction
         
         this.angle += floor(random(-20, 21));
         
         var dx = this.speed * cos(radians(this.angle));
         var dy = this.speed * sin(radians(this.angle));
         
         //  Keep the fly inside canvas
         
         var nearEdgeX = (dx < 0 && this.x < 20*SCALE) || (dx > 0 && this.x > 380*SCALE);
         var nearEdgeY = (dy < 0 && this.y < 20*SCALE) || (dy > 0 && this.y > 380*SCALE);
         
         //  Hold it tight or let it fly
          
         if (caught) {
             this.speed = 0;
             this.x = (rightHanded) ? mouseX + 5*SCALE : mouseX - 5*SCALE;
             this.y = mouseY;
         }
         else {
             this.speed = speed*SCALE;
             this.x += (nearEdgeX) ? -dx : dx;
             this.y += (nearEdgeY) ? -dy : dy;
             this.angle += (nearEdgeX || nearEdgeY) ? 180 : 0;
         }
     };
         
     Fly.prototype.draw = function() {
          
         pushMatrix();
         translate(this.x, this.y);
         rotate(radians(this.angle));
         
         // Wings
         
         stroke(0);
         strokeWeight(SCALE);
         fill(255, 255, 255, 100);
         
         rotate(radians(20));
         ellipse(-7*SCALE, 0, 14*SCALE, 6*SCALE);
         rotate(radians(-40));
         ellipse(-7*SCALE, 0, 14*SCALE, 6*SCALE);
         
         // Body
         
         strokeWeight(8*SCALE);
         point(0, 0);
         
         popMatrix();
     };

     //
     //  Chopsticks functions
     //

     var drawOpen = function() {
         
         strokeWeight(6*SCALE);
         stroke(181, 144, 98);
         
         spacing = 15*SCALE;
         
         if (rightHanded) {
             line(mouseX+200*SCALE, mouseY-12*SCALE, mouseX, mouseY - spacing);
             line(mouseX+200*SCALE, mouseY+12*SCALE, mouseX, mouseY + spacing);
         }
         else {
             line(mouseX-200*SCALE, mouseY-12*SCALE, mouseX, mouseY - spacing);
             line(mouseX-200*SCALE, mouseY+12*SCALE, mouseX, mouseY + spacing);
         }
     };

     var drawClosed = function() {
         
         strokeWeight(6*SCALE);
         stroke(181, 144, 98);
         
         spacing = (inZone) ? 5*SCALE : 3*SCALE;
         
         if (rightHanded) {
             line(mouseX+200*SCALE, mouseY-18*SCALE, mouseX, mouseY - spacing);
             line(mouseX+200*SCALE, mouseY+18*SCALE, mouseX, mouseY + spacing);
         }
         else {
             line(mouseX-200*SCALE, mouseY-18*SCALE, mouseX, mouseY - spacing);
             line(mouseX-200*SCALE, mouseY+18*SCALE, mouseX, mouseY + spacing);
         }
     };

     var showHelp = function() {
         
         background(200, 200, 200);
         
         textAlign(CENTER);
         textSize(20*SCALE);
         fill(0, 0, 200);
         
         text("Decrease the fly's speed", 200*SCALE, 100*SCALE); 
         text("to zero to convince yourself", 200*SCALE, 125*SCALE);
         text("that it's possible to grab & move", 200*SCALE, 150*SCALE);
         text("the fly with the chopsticks,", 200*SCALE, 175*SCALE);
         text("then increase the speed gradually.", 200*SCALE, 200*SCALE);
         
         textAlign(CENTER);
         textSize(16*SCALE);
         text("Click anywhere to go back...", 200*SCALE, 300*SCALE);
     };

     //
     //  Main program
     //

     var myFly = new Fly(width, height);

     smooth();

     draw = function() {
          
         background(200, 200, 200);
         
         inStartButton = mouseX > 160*SCALE && mouseX < 240*SCALE && 
                         mouseY > 290*SCALE && mouseY < 330*SCALE;

         inHelpButton  = mouseX > 170*SCALE && mouseX < 230*SCALE && 
                         mouseY > 345*SCALE && mouseY < 375*SCALE;
                         
         //  Not started
         
         if (!started) {
             
             cursor((inHelpButton || inStartButton) ? HAND : ARROW);
             
             if (helpOn) {
                 cursor(ARROW);
                 inHelpButton = false;
                 showHelp();
             }
             else {
                 textAlign(CENTER);
                 fill(0, 0, 200);
                 
                 textSize(28*SCALE);
                 text("One who catch fly\n with chopstick, \naccomplish anything!", 200*SCALE, 50*SCALE);
                 
                 textSize(18*SCALE);
                 text("Press a mouse-button\n to close the chopsticks ", 200*SCALE, 160*SCALE);
                 
                 textAlign(RIGHT);
                 text(left, 120*SCALE, 210*SCALE);
                 text(right, 120*SCALE, 230*SCALE);
                 text(up + down, 120*SCALE, 265*SCALE);
                 
                 textAlign(LEFT);
                 text("Sticks in left hand", 135*SCALE, 210*SCALE);
                 text("Sticks in right hand", 135*SCALE, 230*SCALE);
                 text("Adjust the fly's speed", 135*SCALE, 265*SCALE);
                 
                 textAlign(CENTER, CENTER);
                 textSize(25*SCALE);
                 text("Start", 200*SCALE, 310*SCALE);
                 textSize(18*SCALE);
                 text("Help", 200*SCALE, 360*SCALE);
                 
                 rectMode(CENTER);
                 noFill();
                 stroke(0, 0, 200);
                 
                 strokeWeight((inStartButton) ? 2*SCALE : SCALE);
                 rect(200*SCALE, 310*SCALE, 80*SCALE, 40*SCALE,6*SCALE);

                 strokeWeight((inHelpButton) ? 2*SCALE : SCALE);
                 rect(200*SCALE, 360*SCALE, 60*SCALE, 30*SCALE, 4*SCALE);
                  
             }
         }
         
         //  Started
         
         else {
             
             cursor("none");
             
             if (fadeOut > 0) {
                 
                 textAlign(CENTER);
                 textSize(30*SCALE);
                 fill(0, 0, 200, fadeOut);
                 text("Don't forget to breathe!", width/2, height/2);
                 fadeOut -= 2;
             }
             
             if (caught) {
                 
                 textSize(20*SCALE);
                 fill(0, 0, 200);
                 
                 textAlign(RIGHT);
                 text("Tries:", 195*SCALE, 185*SCALE);
                 text("Speed:", 195*SCALE, 215*SCALE);
                 
                 textAlign(LEFT);
                 text(tries, 205*SCALE, 185*SCALE);
                 text(speed.toFixed(1), 205*SCALE, 215*SCALE);
             }
             
             myFly.update();
             
             //  The "spacing" variable is the vertical distance between
             //  the tip of each stick and the mouse position.  It can
             //  take 3 values, representing 3 states:  open, completely
             //  closed, or closed-on-the-fly.  Testing against the 2nd
             //  of these prevents "catching" the fly with the sticks 
             //  already closed.
             
             if (rightHanded) {
             
                 inZone = spacing !== 3*SCALE &&
                          myFly.x >= mouseX && myFly.x <= mouseX + 12*SCALE &&
                          myFly.y >= mouseY - 5*SCALE && myFly.y <= mouseY + 5*SCALE;
             }
             else {
                 
                 inZone = spacing !== 3*SCALE && 
                          myFly.x >= mouseX - 12*SCALE && myFly.x <= mouseX  &&
                          myFly.y >= mouseY - 5*SCALE && myFly.y <= mouseY + 5*SCALE;
             }
             
             myFly.draw();
             
             //  Draw the chopsticks
             
             if (myPressed) {
                 drawClosed();
                 caught = (inZone) ? true : false;
             }
             else {
                 drawOpen();
                 caught = false;
             }
         }
     };
        
     //
     //  Event handlers
     //

     keyPressed = function() {
         
         switch(keyCode) {
             
             //  Arrow keys
             
             case LEFT: {
                 rightHanded = false;
                 break;
             }
             case RIGHT: {
                 rightHanded = true;
                 break;
             }
             case UP: {
                 speed += 0.5;
                 break;
             }
             case DOWN: {
                 speed -= 0.5;
                 break;
             }
             default: {
                 break;
             }
         }
         
         speed = constrain(speed, 0, 11);
     };

     mouseClicked = function() {
         
         //  Start button
         
         if (inStartButton && !started) {
             started = true;
             fadeOut = 255;
         }
         else if (inHelpButton && !started) {
             helpOn = true;
         }
         else if (helpOn) {
             helpOn = false;
         }
     };

     mousePressed = function() {
         
         myPressed = true;
         
         //  Update the score
         
         if (started) {
             tries++;
         }
     };

     mouseReleased = function() {
         
         myPressed = false;
         
         //  Reset the score following a catch
         
         if (caught) {
             tries = 0;
         }
     };

     mouseOut = function() {
         myPressed = false;
     };
}};

// Set the value of the h1 tag

// document.getElementById("hdr1").innerHTML = "*** Insert Header Here ***";

// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.

var processingInstance = new Processing(canvas, sketchProc); 
