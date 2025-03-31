//
// Make it Rain
//
// M. Begam     4 Dec 2015
// updated     30 Mar 2025
//

let xPos = [];
let yPos = [];
let speeds = [];
let colors = [];

let firstClick;

let star;
let ohNoes;
let hopper;

let SIZE;
let SCALE;

function preload() {
        ohNoes = loadImage("https://cdn.kastatic.org/third_party/javascript-khansrc/live-editor/build/images/creatures/OhNoes.png");
        hopper = loadImage("https://cdn.kastatic.org/third_party/javascript-khansrc/live-editor/build/images/creatures/Hopper-Jumping.png");
        star = loadImage("https://cdn.kastatic.org/third_party/javascript-khansrc/live-editor/build/images/cute/Star.png");
}

function setup() {

    SIZE = min(windowWidth, windowHeight) - 35;
    SCALE = SIZE / 400;

    createCanvas(SIZE, SIZE);

    for (let i = 0; i < 25; i++) {
        xPos[i] = round(random(0, 400)*SCALE);
        yPos[i] = round(random(-400, 0)*SCALE);
        speeds[i] = round(random(3, 5)*SCALE);
        colors[i] = color(round(random(0, 255)),
                          round(random(0, 255)),
                          round(random(0, 255)));
    }
    firstClick = true;
}

function draw() {
    
    background(204, 247, 255);
    noStroke();
    
    for (let i = 0; i < xPos.length; i++) {

        fill(colors[i]);

        // 5 different "drops" for now

        switch (i % 5) {
            case 0:
                ellipse(xPos[i], yPos[i], 10*SCALE, 10*SCALE);
                break;
            case 1:
                rect(xPos[i], yPos[i], 15*SCALE, 15*SCALE);
                break;
            case 2:
                image(star, xPos[i], yPos[i], 30*SCALE, 40*SCALE);
                break;
            case 3:
                image(hopper, xPos[i], yPos[i], 30*SCALE, 30*SCALE);
                break;
            case 4:
                image(ohNoes, xPos[i], yPos[i], 30*SCALE, 30*SCALE);
                break;
            default:
                break;
        }
        
        // restore "drop" to top of screen if necessary

        if (yPos[i] > round(400*SCALE)) {
            yPos[i] = round(-20*SCALE);
        }
        else {
            yPos[i] += speeds[i];
        }
    }
    
    // Display message only until user clicks

    if (firstClick) {
        fill(207, 19, 207);
        textSize(20*SCALE);
        textAlign(CENTER, CENTER);
        text("Click or Tap to Add More Rain", 200*SCALE, 200*SCALE);
    }
}

// click or tap to add more "drops"

function mousePressed() {
    xPos.push(mouseX);
    yPos.push(mouseY);
    speeds.push(round(random(3, 5)*SCALE));
    colors.push(color(round(random(0, 255)),
                      round(random(0, 255)),
                      round(random(0, 255))));
    if (firstClick) {
        firstClick = !firstClick;
    }
}
