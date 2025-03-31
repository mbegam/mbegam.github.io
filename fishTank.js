var sketchProc = function(processingInstance) {
   with (processingInstance) {

    // Fish Tank
    //
    // m.c. begam
    //

    var SIZE = min(window.innerWidth, window.innerHeight) - 35;
    var SCALE = SIZE / 400;
    size(SIZE, SIZE);

    var firstClick = true;
    var water = color(89, 216, 255);
    background(water);
    smooth();

    stroke(255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(25*SCALE);
    text("Welcome to Fish Tank!", 200*SCALE, 100*SCALE);
    text("Click to Add Fish\nHit ENTER to Add Seaweed", 200*SCALE, 200*SCALE);
        

    var drawPebbles = function() {

        var x;
        var y;
        var d;
        
        noStroke();

        for (var i = 0; i < 2000; i++) {
            x = random(0, 400*SCALE);
            y = random(350*SCALE, 400*SCALE);
            d = random(3*SCALE, 8*SCALE);
            fill(random(0, 255), random(0, 255), random(0, 255));
            ellipse(x, y, d, d);
        }
    };

    var drawFish = function(cenX, cenY, bodyL, bodyH, bodyColor, tailW, tailH, tailColor, eyeSize) {

        // flip a coin to decide left or right fish
        var sign = (round(random(0, 1000)) % 2) ? 1 : -1;
        
        noStroke();
        // body
        fill(bodyColor);
        ellipse(cenX, cenY, bodyL, bodyH);
        // tail
        fill(tailColor);
        triangle(cenX-sign*bodyL/2, cenY,
                 cenX-sign*bodyL/2-sign*tailW, cenY-sign*tailH,
                 cenX-sign*bodyL/2-sign*tailW, cenY+sign*tailH);
        // eye
        fill(0,0,0);
        ellipse(cenX+sign*bodyL/4, cenY, eyeSize, eyeSize);
    };

    var drawSeaweed = function() {
        noFill();
        stroke(0, 255, 0);
        strokeWeight(5*SCALE);
        var x = random(0, 400)*SCALE;
        var y = random(200, 400)*SCALE;
        beginShape();
        curveVertex(x + random(-100, 100)*SCALE, random(500, 1000)*SCALE);
        curveVertex(x, random(350, 375)*SCALE);
        curveVertex(x, y);
        curveVertex(x, random(0, 100)*SCALE);
        endShape();
    };

    var mouseClicked = function() {
        
        if (firstClick) {

            // clear title screen

            background(water);
            drawPebbles();
            firstClick = false;
        }
        else {

            // add random fish at mouse location

            var cenX = mouseX;
            var cenY = mouseY;
            var bodyL = random(20*SCALE, 100*SCALE);
            var bodyH = random(20*SCALE, 100*SCALE);
            var bodyColor = color(random(0,255), random(0,255), random(0,255));
            var tailW = random(10*SCALE, 100*SCALE);
            var tailH = bodyH/2;
            var tailColor = color(random(0,255), random(0,255), random(0,255));
            var eyeSize = random(10*SCALE, 20*SCALE);
            drawFish(cenX, cenY, bodyL, bodyH, bodyColor, tailW, tailH, tailColor, eyeSize);
        }
    };

    keyPressed = function() {

        // Add random seaweed strand 

        if (keyCode === ENTER) { 
            drawSeaweed();
        }
    };
}}


// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.

var processingInstance = new Processing(canvas, sketchProc); 
