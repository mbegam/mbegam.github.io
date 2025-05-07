// Music Slide Rule
//
// M. Begam    May 2025
//

let R;
let cen;
let SIZE;
let SCALE;
let thetaMode;
let thetaPitch;
let thetaInterval;
let CW;
let CCW;
let intervalOn;
let modeOn;
let pitchOn;
let modeSelect;

function setup() {

    SIZE = min(windowWidth, windowHeight) - 35;
    SCALE = SIZE / 400;
    createCanvas(SIZE, SIZE);

    R = 100*SCALE;      // radius of interval scale
    cen = 200*SCALE;
    thetaMode = 0;
    thetaPitch = 0;
    thetaInterval = 0;
    CW = 30;
    CCW = 30;
    intervalOn = false;
    modeOn = false;
    pitchOn = false;
    modeSelect = 4;

    angleMode(DEGREES);
    ellipseMode(RADIUS);

    textAlign(CENTER);

    strokeWeight((SCALE > 1.0) ? SCALE : 1.0 / SCALE);
    frameRate(60);
}

function drawMode() {

    translate(cen, cen);
    rotate(thetaMode);

    // Mode Pitch Scale

    textSize(16*SCALE);

    for (let i = 0; i < 12; i++) {
        
        switch(i) {
            case 1:
            case 3:
            case 6:
            case 8:
            case 10:
                fill(50, 50, 50);
                break;
            default:
                fill(250, 245, 235);
                break;
        }
        arc(0, 0, 1.5*R, 1.5*R, 255, 285, PIE);
        rotate(30);
    }

    // Mode Scale Labels

    if (modeSelect % 4 == 0) {
        fill(0, 0, 0);
        text("Major", 0, -1.25*R);
    }
    else if (modeSelect % 4 == 1) {
        fill(0, 0, 0);
        rotate(270);
        text("Minor", 0, -1.25*R);
    }
    else if (modeSelect % 4 == 2) {
        fill(0, 0, 0);
        text("C", 0, -1.25*R);
        rotate(60);
        text("D", 0, -1.25*R);
        rotate(60);
        text("E", 0, -1.25*R);
        rotate(30);
        text("F", 0, -1.25*R);
        rotate(60);
        text("G", 0, -1.25*R);
        rotate(60);
        text("A", 0, -1.25*R);
        rotate(60);
        text("B", 0, -1.25*R);
        rotate(30);
    }
    else {
        fill(0, 0, 0);
        text("Ion", 0, -1.25*R);
        // text("(M)", 0, -1.05*R);
        rotate(60);
        text("Dor", 0, -1.25*R);
        rotate(60);
        text("Phry", 0, -1.25*R);
        rotate(30);
        text("Lyd", 0, -1.25*R);
        rotate(60);
        text("Mixo", 0, -1.25*R);
        rotate(60);
        text("Aeol", 0, -1.25*R);
        // text("(m)", 0, -1.05*R);
        rotate(60);
        text("Locr", 0, -1.25*R);
        rotate(30);
        rotate(90);
    }
    resetMatrix();
}

function drawInterval() {

    translate(cen, cen);
    rotate(thetaInterval);

    //  Interval Scale

    //  white background for tranparent colors
    fill(255, 255, 255);
    ellipse(0, 0, R, R);

    // 1
    fill(0, 255, 0, 150); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(45);

    // 2
    fill(230, 0, 0, 120);
    arc(0, 0, R, R, 240, 300, PIE);
    rotate(60);

    // 3
    fill(200, 150, 0, 150);
    arc(0, 0, R, R, 240, 300, PIE);
    rotate(45);

    // 4
    fill(0, 255, 0, 150); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(30);

    // Tritone
    fill(255, 0, 0, 200); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(30);

    // 5
    fill(0, 255, 0, 150); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(45);

    // 6
    fill(200, 150, 0, 150); 
    arc(0, 0, R, R, 240, 300, PIE);
    rotate(60);

    // 7
    fill(230, 0, 0, 120);
    arc(0, 0, R, R, 240, 300, PIE);
    rotate(45);

    // Interval Scale Labels

    fill(0, 0, 0);

    text("1", 0, -0.75*R);
    text("(8)", 0, -0.5*R);
    rotate(45);
    text("2", 0, -0.75*R);
    rotate(60);
    text("3", 0, -0.75*R);
    rotate(45);
    text("4", 0, -0.75*R);
    rotate(30);

    // textSize(7*SCALE);
    // text("T", 0, -0.85*R);
    // text("R", 0, -0.75*R);
    // text("I", 0, -0.65*R);
    // text("T", 0, -0.55*R);
    // text("O", 0, -0.45*R);
    // text("N", 0, -0.35*R);
    // text("E", 0, -0.25*R);

    text("+/-", 0, -0.75*R);
    rotate(30);

    text("5", 0, -0.75*R);
    rotate(45);
    text("6", 0, -0.75*R);
    rotate(60);
    text("7", 0, -0.75*R);

    resetMatrix();
}

function drawPitch() {

    translate(cen, cen);
    rotate(thetaPitch);

    //  Pitch Scale

    textSize(16*SCALE);
    for (let i = 0; i < 12; i++) {
        
        switch(i) {
            case 1:
            case 3:
            case 6:
            case 8:
            case 10:
                fill(50, 50, 50);
                break;
            default:
                fill(250, 245, 235);
                break;
        }
        arc(0, 0, 2.0*R, 2.0*R, 255, 285, PIE);
        rotate(30);
    }

    //  Pitch Scale Labels

    fill(0, 0, 0);
    text("C", 0, -1.75*R);
    rotate(60);
    text("D", 0, -1.75*R);
    rotate(60);
    text("E", 0, -1.75*R);
    rotate(30);
    text("F", 0, -1.75*R);
    rotate(60);
    text("G", 0, -1.75*R);
    rotate(60);
    text("A", 0, -1.75*R);
    rotate(60);
    text("B", 0, -1.75*R);
    
    resetMatrix();

}

function drawModeSelect() {

     //fill(100, 150, 200);
     fill(50, 50, 50);
     ellipse(cen, cen, R/4.0, R/4.0);
     textSize(15.0*SCALE);
     textAlign(CENTER, CENTER);
     fill(250, 245, 235);
     text("Mode", cen, cen);
}

function draw() {

    background(100, 150, 200);

    if (CW < 30) {
        if (intervalOn) {
            thetaInterval++;
        }
        if (modeOn) {
            thetaMode++;
        }
        if (pitchOn) {
            thetaPitch++;
        }
        CW++;
    }
    else if (CCW < 30) {
        if (intervalOn) {
            thetaInterval--;
        }
        if (modeOn) {
            thetaMode--;
        }
        if (pitchOn) {
            thetaPitch--;
        }
        CCW++;
    }
    else {
        intervalOn = false;
        modeOn = false;
        pitchOn = false;
    }

    drawPitch();
    drawMode();
    drawInterval();
    drawModeSelect();
}

function mousePressed() {
    
    if (intervalOn || modeOn || pitchOn) {
        return;
    }

    let d = dist(mouseX, mouseY, cen, cen);

    // set direction

    if (mouseX > cen) {
        CW = 0;
    }
    else {
        CCW = 0;
    }

    // set wheel selection

    if (d < R/4.0) {
        modeSelect++;
    }
    else if (d > R/4.0 && d < R) {
        intervalOn = true;
    }
    else if (d > R && d < 1.5*R) {
        intervalOn = true;
        modeOn = true;
    }
    else if (d > 1.5*R && d < 2.0*R) {
        pitchOn = true;
    }
    else {
        intervalOn = true;
        modeOn = true;
        pitchOn = true;
    }
}
