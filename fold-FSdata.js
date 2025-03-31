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

let lineArr = [];
let raw = [];
let folded = [];
let nChans; 
let loChan;
let hiChan;
let offset; 
let sigLine;
let refLine;

let lineWidth;
let lineHeigh;
let halfWidth;
let lineStep; 

function setup() {

    SIZE = min(window.innerWidth, window.innerHeight) - 35;
    SCALE = SIZE / 400;
    createCanvas(SIZE, SIZE);

    frameRate(30);
    angleMode(DEGREES);

    lineWidth = SCALE * 9.0;
    lineHeight = SCALE * 80.0;

    let i;
    let x;
    let theta;

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
    loChan = 0;
    hiChan = offset;

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

    theta = (360.0 / nChans);
    for (i = 0; i < nChans; i++) {
        raw[i] = SCALE*30.0*sin(i*theta) + SCALE*15.0*sin(i*10.0*theta);
    }
    
    // Add line to baseline in sig & ref positions.
    
    for (i = 0; i < lineWidth; i++) {
        raw[i+sigLine-halfWidth] += lineArr[i];
        raw[i+refLine-halfWidth] -= lineArr[i];
    }
}


function fold() {
    
    let i; 

    // Refresh folded array with raw array

    for (i = 0; i < nChans; i++) {
        folded[i] = raw[i];
    }

    // Fold only channels < loChan

    for (i = 0; i < loChan; i++) {
         folded[i] = (raw[i] - raw[i+offset]) / 2.0;
    }
}

function plot() {
    
    let yZero = height - height / 3.0;
    let yOff = raw[sigLine];

    background(255, 255, 255);
    
    // Text output

    //strokeWeight(SCALE);
    noStroke();
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

    for (let i = 0; i < nChans-1; i++) {
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
    
}

//
// Main program
//
function draw() {

    plot();
    fold();
}

function mouseDragged() {

    // Drag to determine which two
    // channels are currently being folded.

    loChan = constrain(mouseX, 1, nChans-offset-1);
    hiChan = loChan + offset;
}
