var sketchProc = function(processingInstance) {
   with (processingInstance) {

     //  
     //   Computational Creatures Project
     //  
     //   M.C. Begam          25 Jan 2016
     //  

     var SIZE = min(window.innerWidth, window.innerHeight) - 35;
     var SCALE = SIZE / 400;
     size(SIZE, SIZE);
     smooth();
     frameRate(30);

     // user-adjustable variables

     var mykNum = 1;
     var mykSize = 20*SCALE;
     var maxSpeed = 10*SCALE;
     var FC = 0;
     var fcMin = document.getElementById("force").min;
     var fcMax = document.getElementById("force").max;
    
     // nemesis dot constructor function

     var NemDot = function() {
         this.position = new PVector(200*SCALE, 200*SCALE);
         //this.position = new PVector(random(399)*SCALE, random(399*SCALE));
         //this.velocity = new PVector(random(-0.5*SCALE, 0.5*SCALE), random(-0.5*SCALE, 0.5*SCALE));
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
         var grayVal = map(FC, fcMin, fcMax, 0, 255);
         console.log(grayVal);
         fill(grayVal);
         ellipse(this.position.x, this.position.y, 10*SCALE, 10*SCALE);
     };

     // mykrobe constructor function

     var Mykrobe = function(x, y, size) {
         this.position = new PVector(x, y);
         this.velocity = new PVector(random(-5*SCALE, 5*SCALE), random(-5*SCALE, 5*SCALE));
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
         
         // acceleration propotional to inverse sq. of "closeness" to dot

         FC = document.getElementById("force").value;
         dir.mult(-FC*(closeness*closeness)); 
         document.getElementById("FC").innerHTML = FC;

         // avoid nemesis dot!

         this.acceleration = dir;
         this.velocity.add(this.acceleration);
         this.velocity.limit(maxSpeed);
         this.position.add(this.velocity);
         this.angle = atan(this.velocity.y / this.velocity.x);

         // register "closeness" with color     
         
         colorMode(HSB);
         var hVal = map(closeness, 0, 1, 180, 0);
         this.color = color(hVal, 255, 255, 255);
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
         strokeWeight(0.25*SCALE);
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

     var nem = new NemDot();
     var Myks = [];
     var fadeOut = 255;

     //  *** Main Loop ***

     draw = function() {
         colorMode(RGB);
         background(208, 242, 236);
         //nem.update();
         nem.checkEdges();
         nem.draw();

         // Get # of mykrobes from current slider value

         var nMyks = document.getElementById("mykrobes").value;
         document.getElementById("nMK").innerHTML = nMyks;
      
         if (Myks.length > nMyks) {
             while (Myks.length > nMyks) {
                 Myks.pop();
             }
         }
         else if (Myks.length < nMyks) {
             while (Myks.length < nMyks) {
                 var newX = random(399*SCALE);
                 var newY = random(399*SCALE);
                 Myks.push(new Mykrobe(newX, newY, mykSize));
             }
         }
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
