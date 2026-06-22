var sketchProc = function(processingInstance) {
    with (processingInstance) {
        //
        //  Electronic Soroban            --mcb Mar 2026 
        // 
        //  Based on "digital abacus" by @hannasantos632:
        //
        //  https://www.khanacademy.org/computer-programming/
        //  digital-abacus-old-version/6626363796209664
        //   
        //         Beads:  click and drag
        //  Power button:  numerical display on/off
        //    Red Button:  clear
        //

        size(400, 400);
        smooth();
        textAlign(CENTER, CENTER);

        var clearX = 200;
        var clearY = 363;

        var powerX = 50;
        var powerY = 363;
        var powerOn = false;

        var power = String.fromCodePoint(0x23fb);  // Unicode power icon
            
        var buttonSize = 24;

        var display = [];

        var beads = [[], [], [], [], [], [], [], [], []];

        // Position limits for each digit

        var limits = [{upper: 210, lower: 270},
                      {upper: 230, lower: 290},
                      {upper: 250, lower: 310},
                      {upper: 270, lower: 330},
                      {upper: 130, lower: 170}];

        //  Bead constructor

        var Bead = function(rod, y, digit) {
            
            this.rod = rod;
            this.digit = digit;
            this.x = 50 + this.rod * 30;
            this.y = y;
            this.w = 25;
            this.h = 20;
            this.upper = limits[digit-1].upper;
            this.lower = limits[digit-1].lower;
            this.on = false;
            this.off = true;
            this.selected = false;
        };

        //
        //  Bead methods
        //

        Bead.prototype.draw = function() {
            
            fill(0, 0, 0);
            ellipse(this.x, this.y, this.w, this.h);
        };

        Bead.prototype.clear = function() {
            
            this.y = (this.digit === 5) ? this.upper : this.lower;
            this.on = false;
            this.off = true;
            this.selected = false;
        };

        Bead.prototype.isMouseInside = function() {
            
            return mouseX > this.x - this.w/2 && 
                   mouseX < this.x + this.w/2 &&
                   mouseY > this.y - this.h/2 && 
                   mouseY < this.y + this.h/2;
        };

        Bead.prototype.isOn = function() {
            
            return (this.digit === 5) ? this.y === this.lower : this.y === this.upper;
        };

        Bead.prototype.isOff = function(c) {
            
            return (this.digit === 5) ? this.y === this.upper : this.y === this.lower;
        };

        //
        //  Utility functions
        //

        var drawFrame = function() {
            
            stroke(0);
            
            // Frame
            
            fill(176, 176, 153);
            rect(20, 60, 360, 326, 20);
            
            fill(200, 200, 200);
            rect(40, 120, 320, 60);
            rect(40, 200, 320, 140);
            
            // Rods
            
            for (var i = 0; i < 9; i++) {
                line(80 + i*30, 120, 80 + i*30, 180);
                line(80 + i*30, 200, 80 + i*30, 340);
            }
            
            //  Power
            
            fill((powerOn) ? color(200, 200, 200) : color(150, 150, 150));
            
            // Numerical-display window
            rect(60, 75, 280, 30);
            
            // Power button
            ellipse(powerX, powerY, buttonSize, buttonSize);
            fill(0, 0, 0);
            textSize(20);
            text(power, powerX, powerY);
            
            // Clear button
            
            fill(255, 0, 0);
            ellipse(clearX, clearY, buttonSize, buttonSize);
        };

        var updateRod = function(rod) {
            
            //  The .y properties of the other beads on the same rod as the selected
            //  bead are constrained by that of the selected bead. The .y property of 
            //  the selected bead is updated in mouseDragged, using the value of mouseY, 
            //  constrained to that bead's .lower and .upper limits.
            
            //  Shorthand references for improved readability 
            //  (these are not copies--changing b1.y changes beads[rod][0].y)
            
            var b1 = beads[rod][0];
            var b2 = beads[rod][1];
            var b3 = beads[rod][2];
            var b4 = beads[rod][3];
            
            var  h = 20;
            
            //  Update positions of non-selected beads only
            
            b1.y = (b1.selected) ? b1.y : constrain(b1.y,  b1.upper,  b2.y - h);
            b2.y = (b2.selected) ? b2.y : constrain(b2.y,  b1.y + h,  b3.y - h);
            b3.y = (b3.selected) ? b3.y : constrain(b3.y,  b2.y + h,  b4.y - h);
            b4.y = (b4.selected) ? b4.y : constrain(b4.y,  b3.y + h,  b4.lower); 
        };

        var updateDisplay = function() {
            
            display = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    
                    if (beads[r][d].on && !beads[r][d].off) {
                        display[r] += (d === 4) ? 5 : 1;
                    }
                    else if (!beads[r][d].off && !beads[r][d].on) {
                        display[r] = '?';
                        break;
                    }
                }
            }
        };

        var init = function() {
            
            display = [0, 0, 0, 0, 0, 0, 0, 0, 0];

            for (var rod = 1; rod <= 9; rod++) {
                for (var digit = 1; digit <= 5; digit++) {
                    
                    if (digit < 5) {
                        // lower beads
                        beads[rod - 1][digit- 1] = new Bead(rod, 250+digit*20, digit);
                    } 
                    else {
                        // upper beads
                        beads[rod - 1][digit - 1] = new Bead(rod, 130, digit);
                    }
                }
            }
        };

        //
        //  Main program
        //

        init();
        textFont(createFont("monospace"));

        draw = function() {
            
            background(120, 191, 235); 

            textSize(30);
            text("eSoroban", 200, 30);
            
            // Draw abacus
            
            drawFrame();

            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    beads[r][d].draw();
                }
            }
            
            //  Show numeric display
            
            if (powerOn) {
                fill(0, 0, 0);
                textSize(25);
                for (var i = 0; i < 9; i++) {
                    text(display[i], 80 + i*30, 90);
                }
            }
            updateDisplay();
        };

        //
        //  Event handlers
        //
          
        mousePressed = function() {
            
            //  Detect a bead selection
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    if (beads[r][d].isMouseInside()) {
                       beads[r][d].selected = true;
                    }
                }
            }
        };

        mouseReleased = function() {
            
            // Reset bead status
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    
                    beads[r][d].selected = false;
                    
                    beads[r][d].on  = beads[r][d].isOn();
                    beads[r][d].off = beads[r][d].isOff();
                }
            }
        };

        mouseDragged = function() {
            
            // Locate & move the selected bead
            
            for (var r = 0; r < 9; r++) {
                for (var d = 0; d < 5; d++) {
                    
                    if (beads[r][d].selected) {
                        
                        // Keep .y property within the limits for the selected bead.
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
                
                display = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                
                for (var r = 0; r < 9; r++) {
                    for (var d = 0; d < 5; d++) {
                        beads[r][d].clear();
                    }
                }
            }
        };
    }
}
    

// Get the canvas that Processing-js will use

var canvas = document.getElementById("mycanvas"); 

// Pass the function sketchProc to Processing's constructor.

var processingInstance = new Processing(canvas, sketchProc); 
