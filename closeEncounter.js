// Close Encounter
//
// M. Begam 
//
// updated to p5.js 31 Mar 2025
//

let starsX = [];
let starsY = [];
let treesX = [];
let treesY = [];

let xStar;
let yStar;
let xStarAcc;
let yStarAcc;

let xSaucer;
let ySaucer;
let xSaucerAcc;

let windowSize;
let treeImg; 

let SIZE;
let SCALE;

function preload() {
    treeImg = loadImage("https://cdn.kastatic.org/third_party/javascript-khansrc/live-editor/build/images/cute/TreeTall.png");
}

function setup() {

    SIZE = min(windowWidth, windowHeight) - 34;
    SCALE = SIZE / 400;
  
    createCanvas(SIZE, SIZE);

    xStar = -10*SCALE;
    yStar = 40*SCALE;
    xStarAcc = 2*SCALE;
    yStarAcc = 4*SCALE;

    xSaucer = 300*SCALE;
    ySaucer = 300*SCALE;
    xSaucerAcc = 1*SCALE;
    windowSize = 10*SCALE;

    let i;
    // starry background
    for (i = 0; i < 150; i++) {
        starsX[i] = (random(1, 400)*SCALE);
        starsY[i] = (random(1, 400)*SCALE);
    }

    // tree line
    for (i = 0; i < 50; i++) {
        treesX[i] = random(0, 400)*SCALE;
        treesY[i] = random(290*SCALE-treesX[i]/5, 290*SCALE);
    }

    smooth();
    frameRate(30);
}

function drawSky() {

    strokeWeight(3*SCALE);
    stroke(255, 255, 255);
    background(29, 40, 115);

    for (let i = 0; i < 150; i++) {
        point(starsX[i], starsY[i]);
    }
}

function drawLandscape() {
    noStroke();
    fill(102, 45, 24);
    quad(0, 380*SCALE, 400*SCALE, 300*SCALE, 400*SCALE, 400*SCALE, 0, 400*SCALE);

    for (let i = 0; i < 50; i++) {
        image(treeImg, treesX[i], treesY[i], 15*SCALE, 100*SCALE);
    }
}

function drawMoon() {
    noStroke();
    fill(196, 222, 0);
    ellipse(33*SCALE, 259*SCALE, 150*SCALE, 150*SCALE);
}

function draw() {

    drawSky();
    drawMoon();

    // shooting star

    fill(255, 242, 0);
    ellipse(xStar, yStar, 7*SCALE, 7*SCALE);
    xStar += xStarAcc;
    if (xStar > 200*SCALE) {
        yStar += yStarAcc;
    }
    xStarAcc += SCALE;

    // flying saucer

    fill(0, 255, 0);
    ellipse(xSaucer, ySaucer, 80*SCALE, 30*SCALE);
    fill(255, 247, 0);

    // saucer windows

    ellipse(xSaucer - 20*SCALE, ySaucer, windowSize, windowSize);
    ellipse(xSaucer, ySaucer, windowSize, windowSize);
    ellipse(xSaucer + 20*SCALE, ySaucer, windowSize, windowSize);

    // saucer takeoff

    if (xStar > 500*SCALE) {
        xSaucer -= xSaucerAcc;
        xSaucerAcc += SCALE;
    }
    ySaucer -= 2*SCALE;

    drawLandscape();
}
