var sketchProc = function(processingInstance) {
   with (processingInstance) {

     var SIZE = min(window.innerWidth, window.innerHeight) - 35;
     var SCALE = SIZE / 400;
     size(SIZE, SIZE);
     frameRate(30);

     // *** Program Code Goes Here ***

     //
     // Computational Creatures Project
     //
     // M.C. Begam          25 Jan 2016
     //
     // Watch the "mykrobes" avoid the nemesis dot.

     // user-adjustable variables

     var mykNum = 10;
     var mykSize = 20*SCALE;
     var maxSpeed = 7.0*SCALE;

     // nemesis dot constructor function

     var NemDot = function() {
         this.position = new PVector(random(399)*SCALE, random(399*SCALE));
         this.velocity = new PVector(random(-0.5*SCALE, 0.5*SCALE), random(-0.5*SCALE, 0.5*SCALE));
     };

     // nemesis dot update function

     NemDot.prototype.update = function() {
         this.position.add(this.velocity);
     };

     // wrap around function--modified from example code 
     // to prevent mykrobes from getting stuck at the edges

     NemDot.prototype.checkEdges = function() {
         if (this.position.x > width) {
             this.position.x %= width;
         } 
         else if (this.position.x < 0) {
             this.position.x += width;
         }
         else if (this.position.y > height) {
             this.position.y %= height;
         } 
         else if (this.position.y < 0) {
             this.position.y += height;
         }
     };

     // function to draw nemesis dot

     NemDot.prototype.draw = function() {
         fill(255, 0, 0);
         ellipse(this.position.x, this.position.y, 10*SCALE, 10*SCALE);
     };

     // mykrobe constructor function

     var Mykrobe = function(x, y, size) {
         this.position = new PVector(x, y);
         this.velocity = new PVector(random(-1, 1), random(-1, 1));
         this.acceleration = new PVector(0, 0);
         this.angle = atan(this.velocity.y/this.velocity.x);
         this.size = size;
         this.color = color(14, 245, 68, 100);
     };

     // mykrobe behavior function

     Mykrobe.prototype.update = function(vector) {
         
         var dir = PVector.sub(vector.position, this.position);
         var dirMag = dir.mag();
         
         var maxDir = new PVector(width, height);
         if (this.position.x < width/2 && this.position.y < height/2) {
             maxDir = PVector.sub(new PVector(width,height), this.position);
         }
         else if (this.position.x > width/2 & this.position.y < height/2) {
             maxDir = PVector.sub(new PVector(0,height), this.position);
         }
         else if (this.position.x < width/2 && this.position.y > height/2) {
             maxDir = PVector.sub(new PVector(width, 0), this.position);
         }
         else if (this.position.x > width/2 && this.position.y > height/2) {
             maxDir = PVector.sub(new PVector(0, 0), this.position);
         }
         var maxMag = maxDir.mag();
         var closeness = (maxMag - dirMag) / maxMag;
         dir.normalize();
         
         // behavior is sensitive to closeness
         // adjustment factor -- default = 1/15
         dir.mult(-closeness/6); 

         // avoid nemesis dot!
         this.acceleration = dir;
         this.velocity.add(this.acceleration);
         this.velocity.limit(maxSpeed);
         this.position.add(this.velocity);
         this.angle = atan(this.velocity.y / this.velocity.x);
         
         // register alarm with body color
         if (closeness > 0.5) {
             colorMode(HSB);
             var hVal = map(closeness, 0.5, 1, 100, 0);
             var tVal = map(closeness, 0.5, 1, 100, 255);
             this.color = color(hVal, 255, 255, tVal);
         }
         else {
             colorMode(HSB);
             this.color = color(100, 255, 255, 100);
         }
     };

     // wrap around function--modified from example code 
     // to prevent mykrobes from getting stuck at the edges

     Mykrobe.prototype.checkEdges = function() {
         if (this.position.x > width) {
             this.position.x %= width;
         } 
         else if (this.position.x < 0) {
             this.position.x += width;
         }
         if (this.position.y > height) {
             this.position.y %= height;
         } 
         else if (this.position.y < 0) {
             this.position.y += height;
         }
     };

     // function to draw the mykrobe

     Mykrobe.prototype.draw = function() {
         fill(21, 255, 0);
         var x = this.position.x;
         var y = this.position.y;
         var width = this.size;
         var height = this.size * 2/3;
         var eyeSize = this.size / 10;
         
         // put the eye on the front end

         var eyeX = (this.velocity.x > 0) ? width/4 : -width/4;
         
         // orient the body in the direction of motion

         pushMatrix();
         translate(x, y);
         rotate(this.angle);
         fill(this.color);
         ellipse(0, 0, width, height);
         fill(0, 0, 0);
         ellipse(eyeX, 0, eyeSize, eyeSize);
         popMatrix();
     };

     //
     // Main Program
     //

     // create nemesis dot

     var nem = new NemDot();

     // set up array of new mykrobes

     var Myks = [];
     for (var i = 0; i < mykNum; i++) {
         var newX = random(399*SCALE);
         var newY = random(399*SCALE);
         Myks.push(new Mykrobe(newX, newY, mykSize));
     }

     // initial value for text transparancy

     var fadeOut = 255;

     // Main Loop

     draw = function() {
         colorMode(RGB);
         background(208, 242, 236);
         nem.update();
         nem.checkEdges();
         nem.draw();
         for (var i = 0; i < Myks.length; i++) {
             Myks[i].update(nem);
             Myks[i].checkEdges();
             Myks[i].draw();
         }
         if (fadeOut > 0) {
             colorMode(RGB);
             fill(0, 60, 255, fadeOut);
             textSize(25*SCALE);
             textAlign(CENTER, CENTER);
             text("Click or Tap to Reposition\nthe Nemesis Dot", width/2, height/2);
             fadeOut -= 2;
         }
         if (frameCount % 500 === 0) {
             var newX = random(399*SCALE);
             var newY = random(399*SCALE);
             Myks.push(new Mykrobe(newX, newY, mykSize));
         }
     };

     // click to reset nemesis dot position and velocity

     mouseClicked = function() {
         nem.position.x = mouseX;
         nem.position.y = mouseY;
         nem.velocity.x = random(-0.5, 0.5);
         nem.velocity.y = random(-0.5, 0.5);
     };

}};

// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.

var processingInstance = new Processing(canvas, sketchProc); 
