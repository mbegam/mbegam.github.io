//
//  MARS 8400  V5               --m.c. begam  Sep 2026
//
//  A switch-panel interface for loading and executing
//  programs in Redcode, the toy assembly language of 
//  the game Core War. 
//
//  See https://en.wikipedia.org/wiki/Core_War
//
//  Uses the original 1984 instruction set and address
//  modes.  The 32-bit instructions inhabit a "circular" 
//  array of size 4096 (a 12-bit address space).
//
//  Instructions must be "hand assembled" into machine
//  code and entered manually into memory, bit-by-bit.
//  
//  The annunciator displays the unassembled instruction,
//  along with decimal representations of the address
//  and assembled instruction.  The output corresponds
//  to the switch settings or the contents of memory,
//  depending on context.
//
//  Inspired by the Altair 8800 Simulator at:
//
//  https://wixette.github.io/8800-simulator/
//

//  The game array

let core = [];
let SIZE = 4096;

//  1984 instruction set and address modes

let opcodes = ["DAT", "MOV", "ADD",
               "SUB", "JMP", "JMZ",
               "JMG", "DJZ", "CMP"];
               
let modes = ["#", " ", "@"];

    
//  Bit-object arrays

let addr = [];
let   op = [];
let modA = [];
let modB = [];
let argA = [];
let argB = [];

//  Bit-field decimal values

let   opVal = 0;
let modAVal = 0;
let modBVal = 0;
let argAVal = 0;
let argBVal = 0;

//  Address and bit-field y-coordinates

let addrY;
let   opY;
let modAY;
let modBY;
let argAY;
let argBY;
let anncY;

//  Function-switch objects

let rd;
let rdNxt;
let wr;
let wrNxt;
let cl;
let clNxt;
let run;
let step;
let power;
let p1Set;
let p2Set;

//  Misc variables

let canvasSize;
let SCALE;

let turn;
let handOn = false;
let addrIn = false;
let readIn = false;
let halted = false;
let resetStart = 0;

let p1Addr = 0;
let p2Addr = 0;
let currAddr = 0;

let click;

let myCanvas;

function setup() {

    click = document.getElementById("clink");

    canvasSize = min(windowWidth, windowHeight) - 35;
    createCanvas(canvasSize, canvasSize);

    SCALE = canvasSize / 600;

    addrY = 125 * SCALE;
      opY = 200 * SCALE;
    modAY = 200 * SCALE;
    modBY = 200 * SCALE;
    argAY = 270 * SCALE;
    argBY = 340 * SCALE;
    anncY = 400 * SCALE;

    // initialize the memory array

    for (let i = 0; i < SIZE; i++) {
        
        core[i] = 0;
    }

    //  Initialize the bit arrays and function switches

    for (let i = 0; i < 4; i++) {
        
        op[i] = new Bit((100 + i * 36) * SCALE, opY, false);

    }

    for (let i = 0; i < 2; i++) {
        
        modA[i] = new Bit((316 + i * 36) * SCALE, modAY, false);
        modB[i] = new Bit((460 + i * 36) * SCALE, modBY, false);
    }

    for (let i = 0; i < 12; i++) {
        
        addr[i] = new Bit((100 + i * 36) * SCALE, addrY, false);
        argA[i] = new Bit((100 + i * 36) * SCALE, argAY, false);
        argB[i] = new Bit((100 + i * 36) * SCALE, argBY, false);
    }

    p1Set = new Bit(450 * SCALE, 470 * SCALE, false);
    p2Set = new Bit(450 * SCALE, 530 * SCALE, false);

    wr = new Switch(100 * SCALE, 450 * SCALE, true, "WR");
    rd = new Switch(100 * SCALE, 500 * SCALE, true, "RD");
    cl = new Switch(100 * SCALE, 550 * SCALE, true, "CL");

    wrNxt = new Switch(180 * SCALE, 450 * SCALE, true, "WR NXT");
    rdNxt = new Switch(180 * SCALE, 500 * SCALE, true, "RD NXT");
    clNxt = new Switch(180 * SCALE, 550 * SCALE, true, "CL NXT");

    run = new Switch(330 * SCALE, 450 * SCALE, false, "RUN");
    step = new Switch(330 * SCALE, 500 * SCALE, true, "STEP");
    power = new Switch(330 * SCALE, 550 * SCALE, false, "POWER");

    //  "Flip a coin" to see who goes first

    turn = floor(random(0, 2));

    smooth();
}
//
//  Switch constructor and methods
//

class Switch {

    constructor(x, y, reset, label) {
    
        //  The "reset" boolean specifies
        //  an automatic reset-type switch
        
        this.x = x;
        this.y = y;
        this.label = label;
        this.reset = reset;
        
        this.d = 14 * SCALE;
        this.on = false;
        this.touched = false;
        this.throw = 10 * SCALE;
    }

    draw() {

        textFont('monospace');
        
        let delay = millis() - resetStart;
        
        //  Set throw for reset-type switches
        
        if (this.reset && this.on) {
            if (delay < 250) {
                this.throw = -10 * SCALE;
            }
            else if (delay >= 250 && delay < 300) {
                click.play();
                resetStart = 0;
            }
            else {
                this.throw = 10 * SCALE;
                this.on = false;
            }
        }
        
        //  Housing
        
        stroke(255);
        strokeWeight(1 * SCALE);
        
        fill(0);
        ellipse(this.x, this.y, this.d, this.d);
        
        //  Lever
        
        stroke(150);
        strokeWeight(5 * SCALE);
        line(this.x, this.y, this.x - 8 * SCALE, this.y + this.throw);
        
        //  Round tip with highlight detail
        
        strokeWeight(10 * SCALE);
        point(this.x - 8 * SCALE, this.y + this.throw);
        stroke(255);
        strokeWeight(4 * SCALE);
        point(this.x - 10 * SCALE, (this.y + this.throw) - 2 * SCALE);
        
        //  Label
        
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(18 * SCALE);
        fill(0, 0, 200);
        text(this.label, this.x + 20 * SCALE, this.y);
    }

    sense() {
    
        //  Distance from center of housing
        let d1 = dist(mouseX, mouseY, this.x, this.y);
        
        //  Distance from center of round tip
        let d2 = dist(mouseX, mouseY, this.x - 6 * SCALE, this.y + this.throw);
        
        this.touched = d1 < this.d / (2 * SCALE) || d2 < (5 * SCALE);
    }

    toggle() {
    
        this.throw = -this.throw;
    }
}

//
//  LED constructor and methods
//

class LED {

    constructor(x, y) {
    
        this.x = x;
        this.y = y;
        this.d = 16 * SCALE;
        this.on = false;
    }

    draw() {
    
        //  LED with highlight detail
        
        stroke(120, 0, 0);
        strokeWeight(1 * SCALE);
        
        if (power.on && this.on) {
            fill(255, 0, 0);
        }
        else {
            fill(120, 0, 0);
        }
        ellipse(this.x, this.y, this.d, this.d);
        stroke(255);
        strokeWeight(4 * SCALE);
        point(this.x - 3 * SCALE, this.y - 3 * SCALE);
    }
}

//  Bit constructor

class Bit {

    constructor(x, y, reset) {
    
        this.sw = new Switch(x, y + 10 * SCALE, reset, "");
        this.led = new LED(x, y - 10 * SCALE);
    }
}

//
//  Utility functions
//

function handOnSet() {
    
    for (let i = 0; i < 4; i++) {
        if (op[i].sw.touched) {
            
            handOn = true;
            return;
        }
    }

    for (let i = 0; i < 2; i++) {
        if (modA[i].sw.touched || modB[i].sw.touched) {
            
            handOn = true;
            return;
        }
    }

    for (let i = 0; i < 12; i++) {
        if (addr[i].sw.touched || 
            argA[i].sw.touched || 
            argB[i].sw.touched) {
                
            handOn = true;
            return;
        }
    }
    
    if (   wr.touched || wrNxt.touched || 
           rd.touched || rdNxt.touched ||
           cl.touched || clNxt.touched ||
         step.touched ||   run.touched ||
        power.touched) {
    
        handOn = true;
        return;
    }
    
    if (p1Set.sw.touched || p2Set.sw.touched) {
        handOn = true;
        return;
    }
}

function encodeSW(arr) {
    
    let n = 0;
    let e = arr.length - 1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].sw.on) {
            n += pow(2, e);
        }
        e--;
    }
    return n;
}

function encodeLED(arr) {
    
    let n = 0;
    let e = arr.length - 1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].led.on) {
            n += pow(2, e);
        }
        e--;
    }
    return n;
}

function decode(n) {
    
      opVal =  n / pow(2, 28);
    modAVal = (n / pow(2, 26)) % pow(2,  2);
    modBVal = (n / pow(2, 24)) % pow(2,  2);
    argAVal = (n / pow(2, 12)) % pow(2, 12);
    argBVal =  n % pow(2, 12);
    
      opVal = floor(opVal);
    modAVal = floor(modAVal);
    modBVal = floor(modBVal);
    argAVal = floor(argAVal);
    argBVal = floor(argBVal);
}

function assemble() {
    
    let code = 0;
    
    if (encodeSW(op)   < 9 && 
        encodeSW(modA) < 3 && 
        encodeSW(modB) < 3) {
            
        code = encodeSW(op)   * pow(2, 28) +
               encodeSW(modA) * pow(2, 26) +
               encodeSW(modB) * pow(2, 24) +
               encodeSW(argA) * pow(2, 12) +
               encodeSW(argB);
    }
    else {
        code = -1;
    }
    return code;
}

function readAddr(n) {
    
    let bits = [];
    
    for (let i = 0; i < 12; i++) {
        bits[i] = false;
    }
    
    let i = 11;
    
    while (n > 0) {
        
        if (n % 2) {
            bits[i] = true;
            n = floor(n / 2);
        }
        else {
            n /= 2;
        }
        i--;
    }
    
    for (let i = 0; i < 12; i++) {
        addr[i].led.on = bits[i];
    }
}

function readInst(n) {
    
    let bits = [];
    
    for (let i = 0; i < 32; i++) {
        bits[i] = false;
    }
    
    let i = 31;
    
    while (n > 0) {
        
        if (n % 2) {
            bits[i] = true;
            n = floor(n / 2);
        }
        else {
            n /= 2;
        }
        i--;
    }
    
    for (let i = 0; i < 32; i++) {
        
        if (i < 4) {
            op[i].led.on = bits[i];
        }
        else if (i < 6) {
            modA[i - 4].led.on = bits[i];
        }
        else if (i < 8) {
            modB[i - 6].led.on = bits[i];
        }
        else if (i < 20) {
            argA[i - 8].led.on = bits[i];
        }
        else {
            argB[i - 20].led.on = bits[i];
        }
    }
}

function showAnnc() {

    fill(0);
    stroke(150);
    strokeWeight(4 * SCALE);
    
    rectMode(CENTER);
    rect(300 * SCALE, 400 * SCALE, 400 * SCALE, 30 * SCALE);

    textAlign(RIGHT, CENTER);
    textSize(20 * SCALE);
    fill((power.on) ? color(255, 0, 0) : color(0));
    noStroke();
    
    if (halted) {
        
        text(currAddr + ":", 165 * SCALE, anncY);
        textAlign(LEFT, CENTER);
        text("Halted", 180 * SCALE, anncY);
    }
    else {

        if (run.on || step.on) {
            
            decode(core[currAddr]);
            
            //  Address
            
            text(currAddr +":", 165 * SCALE, anncY);
            
            //  Mnemonic
            
            if (opVal < 9) {
                text(opcodes[opVal], 210 * SCALE, anncY);
            }
            else {
                text("???", 210 * SCALE, anncY);
            }
            
            //  Mode A
            
            if (modAVal < 3) {
                text(modes[modAVal], 240 * SCALE, anncY);
            }
            else {
                text("?", 240 * SCALE, anncY);
            }
            
            //  Argument A
            
            text(argAVal, 285 * SCALE, anncY);
            
            //  Mode B

            if (modBVal < 3) {
                text(modes[modBVal], 315 * SCALE, anncY);
            }
            else {
                text("?", 315 * SCALE, anncY);
            }
            
            //  Argument B
            
            text(argBVal, 360 * SCALE, anncY);
            
            //  Decimal code
            
            if (core[currAddr] !== -1) {
                text(core[currAddr], 490 * SCALE, anncY);
            }
            else {
                text("??????????", 490 * SCALE, anncY);
            }
        }
        else {

            let n;
    
            //  Address
            
            n = (addrIn) ? encodeSW(addr) : currAddr; 
            text(n.toFixed(0) +":", 165 * SCALE, anncY);
            
            //  Mnemonic
            
            n = (readIn) ? encodeLED(op) : encodeSW(op);
            if (n < 9) {
                text(opcodes[n], 210 * SCALE, anncY);
            }
            else {
                text("???", 210 * SCALE,  anncY);
            }
            
            //  Mode A
            
            n = (readIn) ? encodeLED(modA) : encodeSW(modA);
            if (n < 3) {
                text(modes[n], 240 * SCALE, anncY);
            }
            else {
                text("?", 240 * SCALE, anncY);
            }
            
            //  Argumenet A
            
            n = (readIn) ? encodeLED(argA) : encodeSW(argA);
            text(n.toFixed(0), 285 * SCALE, anncY);
            
            //  Mode B
            n = (readIn) ? encodeLED(modB) : encodeSW(modB);
            if (n < 3) {
                text(modes[n], 315 * SCALE, anncY);
            }
            else {
                text("?", 315 * SCALE, anncY);
            }
            
            //  Argument B
            
            n = (readIn) ? encodeLED(argB) : encodeSW(argB);
            text(n.toFixed(0), 360 * SCALE, anncY);
            
            //  Decimal code
            
            let code = (readIn) ? core[currAddr] : assemble();
            
            if (code !== -1) {
                text(code.toFixed(), 490 * SCALE, anncY);
            }
            else {
                text("??????????", 490 * SCALE, anncY);
            }
        }
    }
}

function toggAll(arr) {
    
    for (let i = 0; i < arr.length; i++) {
        arr[i].sw.toggle();
        arr[i].sw.on = !arr[i].sw.on;
    }
}

//
//  Instruction-set functions
//

function halt() {
    
    run.on = false;
    
    if (millis() - resetStart > 250) {
        step.on = false;
    }
    halted = true;
}

function relat(n) {
    
    //  Return index for relative addressing
    
    return (currAddr + n) % SIZE;
}

function indir(n) {
    
    //  Return index for indirect addressing
    
    let tmp = (currAddr + n) % SIZE;
    return (tmp + core[tmp]) % SIZE;
}

function  mov() {
    
    if (modAVal === 0 && modBVal === 1) {
        core[relat(argBVal)] = argAVal;
    }
    else if (modAVal === 0 && modBVal === 2) {
       // println(indir(argBVal));
        core[indir(argBVal)] = argAVal;
    }
    else if (modAVal === 1 && modBVal === 1) {
        core[relat(argBVal)] = core[relat(argAVal)];
    }
    else if (modAVal === 1 && modBVal === 2) {
        core[indir(argBVal)] = core[relat(argAVal)];
    }
    else if (modAVal === 2 && modBVal === 1) {
        core[relat(argBVal)] = core[indir(argAVal)];
    }
    else if (modAVal === 2 && modBVal === 2) {
        core[indir(argBVal)] = core[indir(argAVal)];
    }
    else {
        halt();
    }
}

function add() {
    
    if (modAVal === 0 && modBVal === 1) {
        core[relat(argBVal)] += argAVal;
    }
    else if (modAVal === 0 && modBVal === 2) {
        core[indir(argBVal)] += argAVal;
    }
    else if (modAVal === 1 && modBVal === 1) {
        core[relat(argBVal)] += core[relat(argAVal)];
    }
    else if (modAVal === 1 && modBVal === 2) {
        core[indir(argBVal)] += core[relat(argAVal)];
    }
    else if (modAVal === 2 && modBVal === 1) {
        core[relat(argBVal)] += core[indir(argAVal)];
    }
    else if (modAVal === 2 && modBVal === 2) {
        core[indir(argBVal)] += core[indir(argAVal)];
    }
    else {
        halt();
    }
}

function sub() {
    
    if (modAVal === 0 && modBVal === 1) {
        core[relat(argBVal)] -= argAVal;
    }
    else if (modAVal === 0 && modBVal === 2) {
        core[indir(argBVal)] -= argAVal;
    }
    else if (modAVal === 1 && modBVal === 1) {
        core[relat(argBVal)] -= core[relat(argAVal)];
    }
    else if (modAVal === 1 && modBVal === 2) {
        core[indir(argBVal)] -= core[relat(argAVal)];
    }
    else if (modAVal === 2 && modBVal === 1) {
        core[relat(argBVal)] -= core[indir(argAVal)];
    }
    else if (modAVal === 2 && modBVal === 2) {
        core[indir(argBVal)] -= core[indir(argAVal)];
    }
    else {
        halt();
    }
}

function jmp() {
    
    if (modAVal === 1) {
        currAddr = (currAddr + argAVal) % SIZE;
    }
    else if (modAVal === 2) {
        currAddr = indir(argAVal);
    }
    else {
        halt();
    }
}

function jmz() {
    
    if (modBVal === 0) {
        if (argBVal === 0) {
            jmp();
        }
        else {
            currAddr++;
        }
    }
    else if (modBVal === 1) {
        if (core[relat(argBVal)] === 0) {
            jmp();
        }
        else {
            currAddr++;
        }
    }
    else if (modBVal === 2) {
        if (core[indir(argBVal)] === 0) {
            jmp();
        }
        else {
            currAddr++;
        }
    }
    else {
        halt();
    }
}

function jmg() {
    
    if (modBVal === 0) {
        if (argBVal > 0) {
            jmp();
        }
        else {
            currAddr++;
        }
    }
    else if (modBVal === 1) {
        if (core[relat(argBVal)] > 0) {
            jmp();
        }
        else {
            currAddr++;
        }
    }
    else if (modBVal === 2) {
        if (core[indir(argBVal)] > 0) {
            jmp();
        }
        else {
            currAddr++;
        }
    }
    else {
        halt();
    }
}

function djz() {
    
    if (modBVal === 0) {
        argBVal--;
    }
    else if (modBVal === 1) {
        core[relat(argBVal)]--;
    }
    else if (modBVal === 2) {
        core[indir(argBVal)]--;
    }
    
    jmz();
}

function cmp() {
    
    if (modAVal === 0 && modBVal === 0) {
        if (argAVal !== argBVal) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 0 && modBVal === 1) {
        if (argAVal !== core[relat(argBVal)]) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 0 && modBVal === 2) {
        if (argAVal !== core[indir(argBVal)]) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 1 && modBVal === 0) {
        if (core[relat(argAVal)] !== argBVal) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 1 && modBVal === 1) {
        if (core[relat(argAVal)] !== core[relat(argBVal)]) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 1 && modBVal === 2) {
        if (core[relat(argAVal)] !== core[indir(argBVal)]) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 2 && modBVal === 0) {
        if (core[indir(argAVal)] !== argBVal) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 2 && modBVal === 1) {
        if (core[indir(argAVal)] !== core[relat(argBVal)]) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else if (modAVal === 2 && modBVal === 2) {
        if (core[indir(argAVal)] !== core[indir(argBVal)]) {
            currAddr += 2;
        }
        else {
            currAddr++;
        }
    }
    else {
        halt();
    }
}

function execute() {
    
    decode(core[currAddr]);
    
    switch(opVal) {
        
        case 0: {
            halt();
            break;
        }
        case 1: {
            mov();
            currAddr++;
            break;
        }
        case 2: {
            add();
            currAddr++;
            break;
        }
        case 3: {
            sub();
            currAddr++;
            break;
        }
        case 4: {
            jmp();
            break;
        }
        case 5: {
            jmz();
            break;
        }
        case 6: {
            jmg();
            break;
        }
        case 7: {
            djz();
            break;
        }
        case 8: {
            cmp();
            break;
        }
        default: {
            halt();
        }
    }
    currAddr %= 4096;
}

function admin() {
    
    //  Time share between P1 and P2
        
    if (p1Set.sw.on && p2Set.sw.on) {
        
        currAddr = (turn % 2) ? p1Addr : p2Addr;
        p1Set.led.on = (turn % 2) ? true : false;
        p2Set.led.on = (turn % 2) ? false : true;
    }
    
    //  Execute P1 only
    
    else if (p1Set.sw.on) {
        
        currAddr = p1Addr;
        p1Set.led.on = true;
    }
    
    //  Execute P2 only
    
    else if (p2Set.sw.on) {
        
        currAddr = p2Addr;
        p2Set.led.on = true;
    }
    
    execute();
    
    if (p1Set.sw.on && p2Set.sw.on) {
        if (turn % 2) {
            p1Addr = currAddr;
        }
        else {
            p2Addr = currAddr;
        }
    }
    else if (p1Set.sw.on) {
        p1Addr = currAddr;
    }
    else if (p2Set.sw.on) {
        p2Addr = currAddr;
    }
    turn++;
}

//
//  Main program
//


function draw() {
    
    textFont('monospace');
    handOn = false;
    background(130);
    
    //  Panel face and outline
    
    stroke(0, 0, 200);
    strokeWeight(6*SCALE);
    fill(200);
    rectMode(CORNER);
    rect(2*SCALE, 2*SCALE, 595*SCALE, 595*SCALE, 30*SCALE);
    strokeWeight(1*SCALE);
    line(100*SCALE, 160*SCALE, 496*SCALE, 160*SCALE);
    
    //  Panel labels
    
    textAlign(CENTER, CENTER);
    fill(0, 0, 200);
    noStroke();
    
    textSize(35*SCALE);
    text("MARS 8400", 300*SCALE, 40*SCALE);
    textSize(20*SCALE);
    text("Memory Array Redcode Simulator", 300*SCALE, 70*SCALE);
    
    textSize(18*SCALE);
    textAlign(RIGHT, CENTER);
    
    text("ADDR", 70*SCALE, addrY);
    text("  OP", 70*SCALE, opY);
    text("MODA", 286*SCALE, opY);
    text("A", 70*SCALE, argAY);
    text("MODB", 430*SCALE, opY);
    text("B", 70*SCALE, argBY);
    
    textAlign(LEFT, CENTER);
    
    text("P1", 475*SCALE, 470*SCALE);
    text("P2", 475*SCALE, 530*SCALE);
    
    if (run.on || step.on) {
        readAddr(currAddr);
        readInst(core[currAddr]);
    }
    
    //  Opcode bits
    
    for (let i = 0; i < 4; i++) {
        
        op[i].sw.draw();
        op[i].sw.sense();
        op[i].led.draw();
    }
    
    //  Mode bits
    
    for (let i = 0; i < 2; i++) {
        
        modA[i].sw.draw();
        modA[i].sw.sense();
        modA[i].led.draw();
        
        modB[i].sw.draw();
        modB[i].sw.sense();
        modB[i].led.draw();
    }
    
    //  Address and argument bits
    
    for (let i = 0; i < 12; i++) {
        
        addr[i].sw.draw();
        addr[i].sw.sense();
        addr[i].led.draw();
        
        argA[i].sw.draw();
        argA[i].sw.sense();
        argA[i].led.draw();
        
        argB[i].sw.draw();
        argB[i].sw.sense();
        argB[i].led.draw();
    }
    
    //  Function switches
    
    wr.draw();
    wr.sense();
    
    wrNxt.draw();
    wrNxt.sense();
    
    rd.draw();
    rd.sense();
    
    rdNxt.draw();
    rdNxt.sense();
    
    cl.draw();
    cl.sense();
    
    clNxt.draw();
    clNxt.sense();
    
    run.draw();
    run.sense();
    
    step.draw();
    step.sense();
    
    power.draw();
    power.sense();
    
    //  Program switches
    
    p1Set.sw.draw();
    p1Set.sw.sense();
    p1Set.led.draw();
    
    p2Set.sw.draw();
    p2Set.sw.sense();
    p2Set.led.draw();
    
    //  Change cursor to HAND at first touch detected
    
    handOnSet();
    cursor((handOn) ? HAND : "default");
    
    //  Annunciator 
    
    showAnnc();
     
    //  Admin
    
    if (run.on) {
        frameRate(10);
        admin();
    }  
    else {
        frameRate(60);
    }
}   

//
//  Switch inputs
//

function mousePressed() {
    
    //  Opcode input
    
    for (i = 0; i < 4; i++) {
        
        if (op[i].sw.touched) {
            op[i].sw.on = !op[i].sw.on;
            op[i].sw.toggle();
            click.play();
            readIn = false;
            break;
        }
    }
    
    //  Mode inputs
    
    for (i = 0; i < 2; i++) {
        
        if (modA[i].sw.touched) {
            modA[i].sw.on = !modA[i].sw.on;
            modA[i].sw.toggle();
            click.play();
            readIn = false;
            break;
        }
        else if (modB[i].sw.touched) {
            modB[i].sw.on = !modB[i].sw.on;
            modB[i].sw.toggle();
            click.play();
            readIn = false;
            break;
        }
    }
    
    //  Address and argument inputs
    
    for (i = 0; i < 12; i++) {
        
        if (addr[i].sw.touched) {
            addr[i].sw.on = !addr[i].sw.on;
            addr[i].sw.toggle();
            click.play();
            addrIn = true;
            break;
        }
        else if (argA[i].sw.touched) {
            argA[i].sw.on = !argA[i].sw.on;
            argA[i].sw.toggle();
            click.play();
            readIn = false;
            break;
        }
        else if (argB[i].sw.touched) {
            argB[i].sw.on = !argB[i].sw.on;
            argB[i].sw.toggle();
            click.play();
            readIn = false;
            break;
        }
    }
    
    //  Function inputs
    
    if (wr.touched) {
        wr.on = true;
        resetStart = millis();
        currAddr = encodeSW(addr);
        core[currAddr] = assemble();
        readAddr(currAddr);
        readInst(core[currAddr]);
        addrIn = false;
        readIn = true;
    }
    else if (wrNxt.touched) {
        wrNxt.on = true;
        resetStart = millis();
        currAddr = (currAddr + 1) % SIZE;
        core[currAddr] = assemble();
        readAddr(currAddr);
        readInst(core[currAddr]);
        addrIn = false;
        readIn = true;
    }
    else if (rd.touched) {
        rd.on = true;
        resetStart = millis();
        currAddr = encodeSW(addr);
        readAddr(currAddr);
        readInst(core[currAddr]);
        addrIn = false;
        readIn = true;
    }
    else if (rdNxt.touched) {
        rdNxt.on = true;
        resetStart = millis();
        currAddr = (currAddr + 1) % SIZE;
        readAddr(currAddr);
        readInst(core[currAddr]);
        addrIn = false;
        readIn = true;
    }
    else if (cl.touched) {
        cl.on = true;
        readIn = true;
        resetStart = millis();
        currAddr = encodeSW(addr);
        core[currAddr] = 0;
        readAddr(currAddr);
        readInst(core[currAddr]);
    }
    else if (clNxt.touched) {
        clNxt.on = true;
        readIn = true;
        resetStart = millis();
        currAddr = (currAddr + 1) % SIZE;
        core[currAddr] = 0;
        readAddr(currAddr);
        readInst(core[currAddr]);
    }
    else if (run.touched) {
        run.on = !run.on;
        run.toggle();
        click.play();
        decode(core[currAddr]);
    }
    else if (step.touched) {
        step.on = !step.on;
        resetStart = millis();
        admin();
    }
    else if (power.touched) {
        power.on = !power.on;
        power.toggle();
        resetStart = millis();
        click.play();
        if (halted) {
            halted = false;
        }
    }
    else if (p1Set.sw.touched) {
        p1Set.sw.on = !p1Set.sw.on;
        p1Set.led.on = (p1Set.sw.on) ? true : false;
        p1Set.sw.toggle();
        click.play();
        p1Addr = encodeSW(addr);
    }
    else if (p2Set.sw.touched) {
        p2Set.sw.on = !p2Set.sw.on;
        p2Set.led.on = (p2Set.sw.on) ? true : false;
        p2Set.sw.toggle();
        click.play();
        p2Addr = encodeSW(addr);
    }
}

function keyPressed() {
    
    if (key.toString() === " ") {
    
        //  Opcode input
        
        for (i = 0; i < 4; i++) {
            
            if (op[i].sw.touched) {
                toggAll(op);
                click.play();
                readIn = false;
                break;
            }
        }
        
        //  Mode inputs
        
        for (i = 0; i < 2; i++) {
            
            if (modA[i].sw.touched) {
                toggAll(modA);
                click.play();
                readIn = false;
                break;
                
            }
            else if (modB[i].sw.touched) {
                toggAll(modB);
                click.play();
                readIn = false;
                break;
            }
        }
        
        //  Address and argument inputs
        
        for (i = 0; i < 12; i++) {
            
            if (addr[i].sw.touched) {
                toggAll(addr);
                click.play();
                addrIn = true;
                break;
            }
            else if (argA[i].sw.touched) {
                toggAll(argA);
                click.play();
                readIn = false;
                break;
            }
            else if (argB[i].sw.touched) {
                toggAll(argB);
                click.play();
                readIn = false;
                break;
            }
        }
    }
}
