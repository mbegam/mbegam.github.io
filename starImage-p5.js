// Star Image
//
// Create a Gaussian distribution of photons
// 
// Concentric circles indicate 1, 2 & 3
// standard deviations
//
//  m.c. begam      6 Dec 2015
//

var SIZE;
var SCALE;

var photonSize;
var sigmaScale;

var pause;

// display frame count & instructions

function drawCount() {

    textSize(15*SCALE);
    noStroke();
    fill(255, 255, 255);
    rect(0, 0, 100*SCALE, 30*SCALE);
    fill(0, 0, 0);
    text(frameCount, 20*SCALE, 20*SCALE);
    text("Click or Tap to Pause/Unpause",  180*SCALE, 20*SCALE);
}

function setup() {

     SIZE = min(window.innerWidth, window.innerHeight) - 35;
     SCALE = SIZE / 400;

     createCanvas(SIZE, SIZE);

     photonSize = 6 * SCALE;
     sigmaScale = 50 * SCALE;

     pause = false;

     background(255, 255, 255);

     // draw sigma circles

     noFill();
     ellipse(200*SCALE, 200*SCALE, 3*sigmaScale*2, 3*sigmaScale*2);
     ellipse(200*SCALE, 200*SCALE, 2*sigmaScale*2, 2*sigmaScale*2);
     ellipse(200*SCALE, 200*SCALE,   sigmaScale*2,   sigmaScale*2);
}

// main loop

function draw() {
    
    drawCount();
    fill(0, 0, 0, 50);
    
    // get pseudo random (approximately) double-precision floating point 
    // value with mean = 0.0 and sigma = 1.0

    var nextNum = randomGaussian();
    
    // create a vector to scale in a random direction
 
    var r = sigmaScale * abs(nextNum);
    var theta = 21600;  // arcmins in a circle
    while (theta === 21600) {
        theta = floor(random(0, 21600));
    }
    theta = (theta / 60.0) * (PI / 180.0);
    
    // convert to rectangular coordinates and draw
 
    var x = 200*SCALE + r * cos(theta);
    var y = 200*SCALE + r * sin(theta);

    ellipse(x, y, photonSize, photonSize);
}
    

// click to pause/unpause

function mouseClicked() {
    if (!pause) {
        noLoop();
    }
    else {
        loop();
    }
    pause = !pause;
}
