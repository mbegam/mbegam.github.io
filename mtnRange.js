// Project Mountain Range
//
// M. C. Begam    7 Jan 2016
// p5.js version 17 Jan 2025
//
// Refresh the browser to get a different mountain range.
// Hit <Restart> to get a different flock of birds.

let nBirds = 20;
let phase = 0;
let birdX = [];
let birdY = [];
let birdSize = [];
let birdPhase = [];
let SIZE;
let SCALE;

function setup() {

   SIZE = min(windowWidth, windowHeight) - 35;
   SCALE = SIZE / 400;
   createCanvas(SIZE, SIZE);

   for (let i = 0; i < nBirds; i++) {
       birdX.push(random(25*SCALE, 200*SCALE));
       birdY.push(random(100*SCALE, 190*SCALE));
       birdSize.push(random(10*SCALE, 20*SCALE));
       birdPhase.push(random(360));
   }
   angleMode(DEGREES);
   strokeWeight((SCALE > 1.0) ? SCALE : 1.0 / SCALE);
   frameRate(10);
}

function draw() {

    background(0, 213, 255);
    drawBackground();
      
    for (let i = 0; i < birdX.length; i++) {
        if (birdSize[i] > 0) {
            drawBird(birdX[i], birdY[i], birdSize[i], birdPhase[i]+=12);
        }
        if (frameCount % 25 === 0 && birdSize[i] > 0) {
            birdSize[i]--;
            if (birdY[i] < SIZE/2) {
                birdY[i]++;
            }
            if (birdY[i] > SIZE/2) {
                birdY[i]--;
            }
        }
    }
    drawRange(920, 367, color(69, 54, 11, 255), 400*SCALE);
    drawRange(873, 451, color(33, 89, 23, 255), 270*SCALE);
    drawRange(481, 2282, color(92, 107, 16, 255), 200*SCALE);
    drawRange(721, 2041, color(22, 110, 51, 255), 150*SCALE);
    drawRange(666, 2041, color(43, 133, 27, 255), 75*SCALE);
}

function drawBackground() {
    
    // sunrise
    let from = color(92, 113, 219);
    let to = color(232, 147, 28);
    let lerpStep = 2.0 / SIZE;
    for (let y = 1; y <= SIZE/2; y++) {
        stroke(lerpColor(from, to, y*lerpStep));
        line(0, y, SIZE, y);
    }
    
    // sun
    noStroke();
    fill(255, 55, 5);
    ellipse(50*SCALE, 200*SCALE, 54*SCALE, 54*SCALE);
    
    // sea
    fill(11, 125, 143);
    rect(0, SIZE/2, SIZE, SIZE);
    
    // reflections
    stroke(255, 55, 5);
    let refX;
    let refY;
    let a;
    for (let i = 0; i < 500; i++) {
        refY = SIZE/2 + abs(randomGaussian()) * 15 * SCALE;;
        a = ((SIZE/2)/refY) * 27 * SCALE;
        refX = round(random(50*SCALE-a, 50*SCALE+a));
        point(refX, refY);
    }
    
    // crescent moon
    noStroke();
    fill(255, 255, 255);
    ellipse(89*SCALE, 122*SCALE, 50*SCALE, 50*SCALE);
    fill(148, 148, 148);
    ellipse(90*SCALE, 120*SCALE, 50*SCALE, 50*SCALE);
    
    // Venus
    fill(255, 255, 255);
    ellipse(135*SCALE, 43*SCALE, 5*SCALE, 5*SCALE);
}

function drawBird(x, y, size, phi) {

    let a = x;
    let b = y;
    let c = x;
    let d = y;
    
    // maximum wing angle
    phi = sin(phi * 2.0) * 30.0;
    
    // left wing
    let ljointX = x - abs(cos(phi)) * size / 3;
    let ljointY = y - sin(phi) * size / 3;
    if (ljointY > y) {
        ljointX = x - size / 3;
    }
    ljointY = constrain(ljointY, 0, y);
    let ltipX = ljointX - abs(cos(phi)) * size / 2;
    let ltipY = ljointY + sin(phi+180) * size / 2;
    
    // right wing
    let rjointX = x + abs(cos(phi)) * size / 3;
    let rjointY = y - sin(phi) * size / 3;
    if (rjointY > y) {
        rjointX = x + size / 3;
    }
    rjointY = constrain(rjointY, 0, y);
    let rtipX = rjointX + abs(cos(phi)) * size / 2;
    let rtipY = rjointY + sin(phi+180) * size / 2;
    
    fill(0, 0, 0);
    ellipse(x, y, size/8, size/8);
    
    noFill();
    stroke(0, 0, 0);
    beginShape();
    curveVertex(a, b);
    curveVertex(ltipX , ltipY);
    curveVertex(ljointX, ljointY);
    curveVertex(x, y);
    curveVertex(rjointX, rjointY);
    curveVertex(rtipX, rtipY);
    curveVertex(c, d);
    endShape();
}

function drawRange(ty, tz, mtnColor, mtnHeight) {
    noiseDetail(3, 0.5);
    let incAmount = 0.02;
    for (let tx = 0; tx < SIZE; tx++) {
        let n = noise(tx*incAmount, ty, tz);
        let grade = map(tx, 0, SIZE-1, 30, 90);
        let y = map(n, 0.0, 1.0, mtnHeight/4, mtnHeight);
        y *= sin(grade);
        stroke(mtnColor);
        line(tx, SIZE, tx, SIZE - y);
        ty += incAmount / 3;
        tz += incAmount / 2;
    }
}
