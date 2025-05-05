// Music Slide Rule
//
// M. Begam    May 2025
//

let R;
let cen;
let SIZE;
let SCALE;
let thetaInner;
let thetaOuter;
let CW;
let CCW;
let innerOn;
let outerOn;

function setup() {

    SIZE = min(windowWidth, windowHeight) - 35;
    SCALE = SIZE / 400;
    createCanvas(SIZE, SIZE);

    R = 100*SCALE;      // radius of interval scale
    cen = 200*SCALE;
    thetaInner = 0;
    thetaOuter = 0;
    CW = 30;
    CCW = 30;
    innerOn = false;
    outerOn = false;

    angleMode(DEGREES);
    ellipseMode(RADIUS);

    textAlign(CENTER);

    strokeWeight((SCALE > 1.0) ? SCALE : 1.0 / SCALE);
    frameRate(60);
}

function drawInner() {

    translate(cen, cen);
    rotate(thetaInner);

    // Inner Pitch Scale

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

    // Inner Pitch Scale Labels

    fill(0, 0, 0);
    text("C", 0, -1.25*R);
    text("M", 0, -1.05*R);
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
    text("m", 0, -1.05*R);
    rotate(60);
    text("B", 0, -1.25*R);
    rotate(30);

    //  Interval Scale

    // white background for tranparent colors
    fill(255, 255, 255);
    ellipse(0, 0, R, R);

    fill(0, 255, 0, 150); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(45);

    fill(200, 180, 150); 
    arc(0, 0, R, R, 240, 300, PIE);
    rotate(60);

    arc(0, 0, R, R, 240, 300, PIE);
    rotate(45);

    fill(0, 255, 0, 150); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(30);

    fill(255, 0, 0, 180); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(30);

    fill(0, 255, 0, 150); 
    arc(0, 0, R, R, 255, 285, PIE);
    rotate(45);

    fill(200, 180, 150); 
    arc(0, 0, R, R, 240, 300, PIE);
    rotate(60);

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

function drawOuter() {

    translate(cen, cen);
    rotate(thetaOuter);

    // Outer Pitch Scale

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

    // Outer Pitch Scale Labels

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

function draw() {

    background(100, 150, 200);

    if (CW < 30) {
        if (innerOn) {
            thetaInner++;
        }
        if (outerOn) {
            thetaOuter++;
        }
        CW++;
    }
    else if (CCW < 30) {
        if (innerOn) {
            thetaInner--;
        }
        if (outerOn) {
            thetaOuter--;
        }
        CCW++;
    }
    else {
        innerOn = false;
        outerOn = false;
    }

    drawOuter();
    drawInner();
}

function mousePressed() {
    
    if (innerOn || outerOn) {
        return;
    }

    let d = dist(mouseX, mouseY, cen, cen);

    if (mouseX > cen) {
        CW = 0;
    }
    else {
        CCW = 0;
    }
    if (d < 1.5*R) {
        innerOn = true;
    }
    else if (d > 1.5*R && d < 2.0*R) {
        outerOn = true;
    }
    else {
        innerOn = true;
        outerOn = true;
    }
}
