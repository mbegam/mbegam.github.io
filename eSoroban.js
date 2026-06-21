var sketchProc = function(processingInstance) {
    with (processingInstance) {
        //
        //  Electronic Soroban       --mcb Mar 2026 
        // 
        //         Beads:  click and drag
        //  Power button:  toggle numerical display on/off
        //    Red Button:  clear
        //

        var SIZE = min(window.innerWidth, window.innerHeight) - 35;
        size(SIZE, SIZE);

        smooth();
        textAlign(CENTER, CENTER);

        var bckgdColor = color(166, 208, 230);
        var SCALE = SIZE/400;

        var clearX = 200*SCALE;
        var clearY = 363*SCALE;

        var powerX = 50*SCALE;
        var powerY = 363*SCALE;
        var powerOn = false;

        var power = String.fromCodePoint(0x23fb);

        var buttonSize = 24*SCALE;

        var digits = [];

        var beads = [[], [], [], [], [], [], [], [], []];

        // Position limits for each digit

        var limits = [{upper: 210*SCALE, lower: 270*SCALE},
                      {upper: 230*SCALE, lower: 290*SCALE},
                      {upper: 250*SCALE, lower: 310*SCALE},
                      {upper: 270*SCALE, lower: 330*SCALE},
                      {upper: 130*SCALE, lower: 170*SCALE}];

        //  Bead constructor

        var Bead = function(rod, y, digit) {
            
            this.rod = rod;
            this.digit = digit;
            this.x = 50*SCALE + this.rod * 30*SCALE;
            this.y = y;
            this.w = 25*SCALE;
            this.h = 20*SCALE;
            this.upper = limits[digit-1].upper;
            this.lower = limits[digit-1].lower;
            this.on = false;
            this.off = true;
            this.selected = false;
        };

        //  Bead methods

        Bead.prototype.draw = function() {
            
            fill(0, 0, 0);
            ellipse(this.x, this.y, this.w, this.h);
        };

        Bead.prototype.isMouseInside = function() {
            
            return (mouseX > this.x - this.w/2 && 
                    mouseX < this.x + this.w/2 &&
                    mouseY > this.y - this.h/2 && 
                    mouseY < this.y + this.h/2);
        };

        Bead.prototype.isOn = function() {
            
            return (this.digit === 5) ? this.y === this.lower : this.y === this.upper;
        };

        Bead.prototype.isOff = function(c) {
            
            return (this.digit === 5) ? this.y === this.upper : this.y === this.lower;
        };

        //  Utility functions

        var drawFrame = function() {
            
            stroke(0);
            
            // Frame
            
            fill(176, 176, 153);
            rect(20*SCALE, 60*SCALE, 360*SCALE, 326*SCALE, 20*SCALE);
            
            fill(200, 200, 200);
            rect(40*SCALE, 120*SCALE, 320*SCALE, 60*SCALE);
            rect(40*SCALE, 200*SCALE, 320*SCALE, 140*SCALE);
            
            // Rods
            
            for (var i = 0; i < 9; i++) {
                line(80*SCALE + i*30*SCALE, 120*SCALE, 80*SCALE + i*30*SCALE, 180*SCALE);
                line(80*SCALE + i*30*SCALE, 200*SCALE, 80*SCALE + i*30*SCALE, 340*SCALE);
            }
            
            // Power
            
            fill((powerOn) ? color(200, 200, 200) : color(150, 150, 150));
            
            // Numerical display
            rect(60*SCALE, 75*SCALE, 280*SCALE, 30*SCALE);
            
            // Button
            ellipse(powerX, powerY, buttonSize, buttonSize);
            fill(0, 0, 0);
            textSize(20*SCALE);
            text(power, powerX, powerY-1);
            
            // Clear button
            
            fill(255, 0, 0);
            ellipse(clearX, clearY, buttonSize, buttonSize);
        };

        var updateRod = function(rod) {
            
            //  The .y properties of the other beads on the same rod (r) as the selected
            //  bead are constrained by that of the selected bead.  The .y property of 
            //  the selected bead is updated in mouseDragged, using the value of mouseY, 
            //  constrained to the bead's .lower and .upper limits.
            
            //  Shorthand references for improved readability 
            //  (these are not copies--changing b1.y changes beads[rod][0].y)
            
            var b1 = beads[rod][0];
            var b2 = beads[rod][1];
            var b3 = beads[rod][2];
            var b4 = beads[rod][3];
            
            var  h = 20*SCALE;
            
            //  Update positions of non-selected beads only
            
            b1.y = (b1.selected) ? b1.y : constrain(b1.y,  b1.upper,  b2.y - h);
            b2.y = (b2.selected) ? b2.y : constrain(b2.y,  b1.y + h,  b3.y - h);
            b3.y = (b3.selected) ? b3.y : constrain(b3.y,  b2.y + h,  b4.y - h);
            b4.y = (b4.selected) ? b4.y : constrain(b4.y,  b3.y + h,  b4.lower); 
        };

        var updateDigits = function() {
            
            digits = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    
                    if (beads[r][d].on && !beads[r][d].off) {
                        digits[r] += (d === 4) ? 5 : 1;
                    }
                    else if (!beads[r][d].off && !beads[r][d].on) {
                        digits[r] = '?';
                        break;
                    }
                }
            }
        };

        var clear = function() {
            
            digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            for (var rod = 1; rod <= 9; rod++) {
                for (var digit = 1; digit <= 5; digit++) {
                    
                    if (digit < 5) {
                        // lower beads
                        beads[rod - 1][digit - 1] = new Bead(rod, 250*SCALE+digit*20*SCALE, digit);
                    } 
                    else {
                        // upper beads
                        beads[rod - 1][digit - 1] = new Bead(rod, 130*SCALE, digit);
                    }
                }
            }
        };

        //
        //  Main program
        //

        clear();

        draw = function() {
            
            background(bckgdColor); 
            
            textSize(30*SCALE);
            text("e S o r o b a n", width/2, 30*SCALE);
            
            // Draw abacus
            drawFrame();
            
            // Draw beads

            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    beads[r][d].draw();
                }
            }
            
            //  Show numeric display
            
            if (powerOn) {
                fill(0, 0, 0);
                textSize(25*SCALE);
                // textFont(createFont("monospace"));
                for (var i = 0; i < 9; i++) {
                    text(digits[i], 80*SCALE + i*30*SCALE, 90*SCALE);
                }
            }
        };
          
        mousePressed = function() {
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    if (beads[r][d].isMouseInside()) {
                       beads[r][d].selected = true;
                    }
                }
            }
        };

        mouseReleased = function() {
            
            // Resets bead status
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    
                    beads[r][d].selected = false;
                    
                    beads[r][d].on  = beads[r][d].isOn();
                    beads[r][d].off = beads[r][d].isOff();
                }
            }
            updateDigits();
        };

        mouseDragged = function() {
            
            // Locate & move the selected bead
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    
                    if (beads[r][d].selected) {
                        
                        // Keep mouseY within the limits for the selected bead.
                        beads[r][d].y = constrain(mouseY, beads[r][d].upper, beads[r][d].lower);
                        
                        // Update the positions of the other beads on the same rod.
                        updateRod(r);
                    }
                }
            } 
        };

        mouseClicked = function() {

            // Toggle power
            
            if (abs(dist(powerX, powerY, mouseX, mouseY)) <= buttonSize/2) {
                powerOn = !powerOn;
            }
            
            // Clear
            
            if (abs(dist(clearX, clearY, mouseX, mouseY)) <= buttonSize/2) {
                clear();
            }
        };
    }
}


// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.

var processingInstance = new Processing(canvas, sketchProc); 
