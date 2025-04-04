//
//  Gess Board 
//
//  M.C. Begam     20 Nov 2022
//
// 

///////////////////////////////////////////
//
//        External Variables
//
///////////////////////////////////////////

var board1 = [];
var board2 = [];
var board3 = [];
var piece1 = [];
var piece2 = [];
var boardX;
var boardY;
var boardN;
var scanBoxX;
var scanBoxY;
var pieceBoxX;
var pieceBoxY;
var white = 0;
var black = 1;
var blank = -1;
var fadeOut = 0;
var started = false;
var selected = false;
var helpOn = false;
var indicesOn = true;
var boxOn = true;
var rulesOn = true;
var tallyOn = false;
var switched = false;
var rulesClr;
var fadeMsg;
var fromAddr;
var toAddr;
var boardScale;
var saveScale;
var Xcen;
var Ycen;

/////////////////////////////////////////////////////
//
//        Function Definitions
//
/////////////////////////////////////////////////////

// Function to create the initial board configuration

function initialize() {
    
    var i;
    var n;
    
    // The initial X coordinates

    var initX = [  
        3,  5,  7,  8,  9, 10, 11, 12, 13, 14, 16, 18,
        2,  3,  4,  6,  8,  9, 10, 11, 13, 15, 17, 18, 19,
        3,  5,  7,  8,  9, 10, 11, 12, 13, 14, 16, 18,
        3,  6,  9, 12, 15, 18,
        3,  6,  9, 12, 15, 18,
        3,  5,  7,  8,  9, 10, 11, 12, 13, 14, 16, 18,
        2,  3,  4,  6,  8,  9, 10, 11, 13, 15, 17, 18, 19,
        3,  5,  7,  8,  9, 10, 11, 12, 13, 14, 16, 18  ];
                   
    // The initial Y coordinates          

    var initY = [  
        2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,
        3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,
        4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,
        7,  7,  7,  7,  7,  7,
        14, 14, 14, 14, 14, 14,
        17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17,
        18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19  ];
                  
    // Initialize the virtual boards with all blanks

    for (i = 0; i < 484; i++) {
            board1[i] = blank;
            board2[i] = blank;
            board3[i] = blank;
    }
    
    // Initialize the virtual pieces with all blanks

    for (i = 0; i < 9; i++) {
        piece1[i] = blank;
        piece2[i] = blank;
    }
    
    // Load the stones into the main boards

    var n;
    for (i = 0; i < 86; i++) {
        n = initY[i] * 22 + initX[i];
        board1[n] = (initY[i] < 13) ? white : black;
        board2[n] = (initY[i] < 13) ? white : black;
    }
    
    // Set rules enforcement on
    
    rulesOn = true;
}
     
// Function to convert rectangular coords to board index

function getBoardN(x, y) {

        return(y * 22 + x);
}

// Function to test whether a given piece is blank

function isAllBlank(piece) {

    for (var n = 0; n < piece.length; n++) {
        if (piece[n] !== blank) {
            return 0;
        }
    }
    return 1;
}

// Function to draw the empty board

function drawBoard() {
    
    var x = boardScale * 20.0;
    var y = boardScale * 20.0;
    var xEnd = boardScale * 380.0;
    var yEnd = boardScale * 380.0;
    
    background(222, 162, 66);
    
    //draw the grid

    stroke(0, 0, 0);
    strokeWeight(1);
    
    for (var i = 0; i < 19; i++) {
        line (x, y+i*y, xEnd, y+i*y);
        line (x+i*x, y, x+i*x, yEnd);
    }
}

// Function to draw the indices

function drawIndices() {
    
    var alpha = ['b','c','d','e','f','g','h','i','j',
                 'k','l','m','n','o','p','q','r','s'];
                 
    var numer = [19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2];
    
    var x = boardScale * 10.0;
    var y = boardScale * 10.0;
    var xEnd = boardScale * 390.0;
    var yEnd = boardScale * 390.0;
    
    var Alpha;
    var Numer;
    
    var White = color(255, 255, 255);
    var Black = color(0, 0, 0);
    
    textAlign(CENTER, CENTER);
    textSize(boardScale*12);
    fill(Black);
    
    for (var i = 0; i < 18; i++) {
        
        // top and bottom indices
        
        if (started && i + 2 === boardX) {
            fill(White);
        }
        else { 
            fill(Black);
        }
        if (started && boardX === 1 && i === 0) {
            fill(White);
            Alpha = (switched) ? 't' : 'a';
        }
        else if (started && boardX === 20 && i === 17) {
            fill(White);
            Alpha = (switched) ? 'a' : 't';
        }
        else {
            Alpha = (switched) ? alpha[17-i] : alpha[i];
        }
        text(Alpha, 3*x + i*2*x, y);
        text(Alpha, 3*x + i*2*x, yEnd);
        
        // left and right indices
        
        if (started && i + 2 === boardY) {
            fill(White);
        }
        else { 
            fill(Black);
        }
        if (started && boardY === 1 && i === 0) {
            fill(White);
            Numer = (switched) ? 1 : 20;
        }
        else if (started && boardY === 20 && i === 17) {
            fill(White);
            Numer = (switched) ? 20 : 1;
        }
        else {
            Numer = (switched) ? numer[17-i] : numer[i];
        }
        text(Numer, x, 3*y + i*2*y);
        text(Numer, xEnd, 3*y + i*2*y);
    }
}
    
// Function to display the game

function displayGame() {
    
    if (indicesOn) {
        drawIndices();
    }
    noStroke();
    
    var x = boardScale * 10.0;
    var y = boardScale * 10.0;
    var diam = boardScale * 18.0;
    var side = boardScale * 60.0;
    
    var n = 0;
    for (var i = 0; i < 22; i++) {
        for (var j = 0; j < 22; j++) {
            if (board1[n] === white) {
                fill(255, 255, 255);
                ellipse(j*2*x-x, i*2*y-y, diam, diam);
            } 
            else if (board1[n] === black) {
                fill(0, 0, 0);
                ellipse(j*2*x-x, i*2*y-y, diam, diam);
            }
            n++;
        }
    }
    if (selected) {
        if (boxOn) {
            noStroke();
            fill(0, 0, 255, 100);
            rect(pieceBoxX, pieceBoxY, side, side);
        }
    }
}

// Function to get board coords from cursor coords

function getCoords() {
    
    var x = boardScale * 20.0;
    var y = boardScale * 20.0;
    
    boardX = (mouseX - mouseX % x) / x + 1;
    boardY = (mouseY - mouseY % y) / y + 1;
    
    boardX = constrain(boardX, 1, 20);
    boardY = constrain(boardY, 1, 20);

    boardX = round(boardX);
    boardY = round(boardY);
    boardN = boardY * 22 + boardX;
}

// Function to get box coords and draw box

function drawBox() {
    
    var x = boardScale * 20.0;
    var y = boardScale * 20.0;
    
    var side = boardScale * 60.0;
    
    scanBoxX = x * boardX - x*2.0;
    scanBoxY = y * boardY - y*2.0;
    stroke(0, 0, 255);
    strokeWeight(3);
    noFill();
    rect(scanBoxX, scanBoxY, side, side);
}

// Function to select a piece for moving

function getPiece(board, piece, addr) {
    
    // Load contents of selected 
    // location into piece array

    var row1 = addr - 23;
    var row2 = addr - 1;
    var row3 = addr + 21;

    for (var i = 0; i < 3; i++) {
        piece[i]   = board[row1++];
        piece[i+3] = board[row2++];
        piece[i+6] = board[row3++];
    }
}

// Function to test if board location 
// selected contains a valid piece

function isAPiece() {

    var nBlack = 0;
    var nWhite = 0;
    for (var i = 0; i < 9; i++) {
        if (piece1[i] === black) {
            nBlack++;
        }
        else if (piece1[i] === white) {
            nWhite++;
        }
        else {
            continue;
        }
    }
    if (nBlack === 0 && nWhite === 0 || 
        nBlack !== 0 && nWhite !== 0 ||
        nBlack + nWhite === 1 && piece1[4] !== -1) {
            return 0;
    }
    return 1;
}
        
// Function to move piece to selected destination

function putPiece(board, piece, from, to) {
    
    // Copy the board first

    for (var i = 0; i < 484; i++) {
        board2[i] = board[i];
    }
    
    //  Erase piece from old position

    var row1 = from - 23;
    var row2 = from - 1;
    var row3 = from + 21;
    for (var i = 0; i < 3; i++) {
        board[row1++] = blank;
        board[row2++] = blank;
        board[row3++] = blank;
    }
    
    // Load piece into new position

    var row1 = to - 23;
    var row2 = to - 1;
    var row3 = to + 21;
    for (var i = 0; i < 3; i++) {
        board[row1++] = piece[i];
        board[row2++] = piece[i+3];
        board[row3++] = piece[i+6];
    }
    
    // Remove any off-edge stones

    for (var i = 0; i < 22; i++) {
        board[i]     = blank;
        board[i+22]  = blank;
        board[i+440] = blank;
        board[i+462] = blank;
    }
    for (var i = 0; i < 18; i++) {
        board[44+i*22] = blank;
        board[45+i*22] = blank;
        board[64+i*22] = blank;
        board[65+i*22] = blank;
    }
};

// Function to test if move is legal

function isLegal() {
    
    var temp = [];
    
    // Convert addresses to rectangular coords

    var x1 = fromAddr % 22;
    var y1 = (floor(fromAddr / 22));
    var x2 = toAddr % 22;
    var y2 = (floor(toAddr / 22));
    
    // Compute distance of move in each dimension

    var dx = x2 - x1;
    var dy = y2 - y1;
    var adx = abs(dx);
    var ady = abs(dy);
    
    // No move specified

    if (adx === 0 && ady=== 0) {
        return 0;
    }
    
    // Move is neither orthogonal nor diagonal

    if ((adx > 0 && ady > 0) && adx !== ady) {
        return 0;
    }
    
    // Piece cannot move more than 3 spaces

    if ((adx > 3 || ady > 3) && piece1[4] === blank) {
        return 0;
    }
    
    // Piece cannot move in desired orthogonal direction

    if ((dx === 0 && dy < 0) && piece1[1] === blank) {
        return 0;
    }
    if ((dx < 0 && dy === 0) && piece1[3] === blank) {
        return 0;
    }
    if ((dx > 0 && dy === 0) && piece1[5] === blank) {
        return 0;
    }
    if ((dx === 0 && dy > 0) && piece1[7] === blank) {
        return 0;
    }
    
    // Piece cannot move in desired diagonal direction

    if ((dx < 0 && dy < 0) && piece1[0] === blank) {
        return 0;
    }
    if ((dx > 0 && dy < 0) && piece1[2] === blank) {
        return 0;
    }
    if ((dx < 0 && dy > 0) && piece1[6] === blank) {
        return 0;
    }
    if ((dx > 0 && dy > 0) && piece1[8] === blank) {
        return 0;
    }
    
    // Move is blocked by another piece...

    for (var n = 0; n < 483; n++) {
        temp[n] = board1[n];
    }
    for (var j = -1; j <= 1; j++) {
        for (var i = -1; i <= 1; i++) {
            n = (y1 + j) * 22 + (x1 + i);
            temp[n] = blank;
        }
    }
    
    // ...in the orthogonal direction
    
    if (dy < 0 && dx === 0) {
        for (var n = 1; n < ady; n++) {
            getPiece(temp, piece2, getBoardN(x1, y1-n));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    if (dy === 0 && dx > 0) {
        for (var n = 1; n < adx; n++) {
            getPiece(temp, piece2, getBoardN(x1+n, y1));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    if (dy > 0 && dx === 0) {
        for (var n = 1; n < ady; n++) {
            getPiece(temp, piece2, getBoardN(x1, y1+n));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    if (dy === 0 && dx < 0) {
        for (var n = 1; n < adx; n++) {
            getPiece(temp, piece2, getBoardN(x1-n, y1));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    
    // ...in the diagonal direction
    
    if (dy < 0 && dx < 0) {
        for (var n = 1; n < adx; n++) {
            getPiece(temp, piece2, getBoardN(x1-n, y1-n));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    if (dy < 0 && dx > 0) {
        for (var n = 1; n < adx; n++) {
            getPiece(temp, piece2, getBoardN(x1+n, y1-n));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    if (dy > 0 && dx < 0) {
        for (var n = 1; n < adx; n++) {
            getPiece(temp, piece2, getBoardN(x1-n, y1+n));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    if (dy > 0 && dx > 0) {
        for (var n = 1; n < adx; n++) {
            getPiece(temp, piece2, getBoardN(x1+n, y1+n));
            if (!isAllBlank(piece2)) {
                return 0;
            }
        }
    }
    
    // Move takes piece entirely off the board

    for (var n = 0; n < 483; n++) {
        temp[n] = board1[n];
    }
    putPiece(temp, piece1, fromAddr, toAddr);
    getPiece(temp, piece2, toAddr);
    if (isAllBlank(piece2)) {
        return 0;
    }
    
    // Move is legal

    return 1;
}

// Function to display the Help page

function showHelp() {
    
    var x = boardScale * 10.0;
    var y = boardScale * 10.0;
    var size = boardScale * 10.0;
    
    background(222, 206, 222);
    fill(255, 0, 0);
    textSize(size * 2.8);
    textAlign(CENTER, CENTER);
    text("Gess Help", x*20.0, y*2.0);
    textSize(size * 2.2);
    text("Hit h to go back...", x*20.0, y*38.0);
    textSize(size * 2.0);
    textAlign(LEFT, BASELINE);
    text("Rules", x*2.0, y*6.0);
    text("Mouse", x*2.0, y*11.0);
    text("Keyboard", x*2.0, y*20.0);
    fill(0,0,0);
    textSize(size * 1.5);
    text("www.archive.is/9Mvi", x*2.0, y*8.0);
    text("Move box using cursor", x*2.0, y*13.0);
    text("Click to select piece", x*2.0, y*15.0);
    text("Click again to select destination", x*2.0, y*17.0);
    text("u", x*2.0, y*22.0);
    text("undo previous move", x*5.0, y*22.0);
    text("c", x*2.0, y*24.0);
    text("clear the current selection", x*5.0, y*24.0);
    text("i", x*2.0, y*26.0);
    text("toggle board indices on/off", x*5.0, y*26.0);
    text("b", x*2.0, y*28.0);
    text("toggle box on/off", x*5.0, y*28.0);
    text("r", x*2.0, y*30.0);
    text("toggle rules enforcement on/off", x*5.0, y*30.0);
    text("s", x*2.0, y*32.0);
    text("switch sides", x*5.0, y*32.0);
    text("t", x*2.0, y*34.0);
    text("toggle stones tally on/off", x*5.0, y*34.0);
    text("h", x*2.0, y*36.0);
    text("toggle help on/off", x*5.0, y*36.0);
}

function showTally() {
    
    var x = boardScale * 10.0;
    var y = boardScale * 10.0;
    var size = boardScale * 10.0;
    
    var nWhite = 0;
    var nBlack = 0;
    
    background(222, 206, 222);
    fill(0, 0, 0);
    textSize(boardScale * 28.0);
    
    for (var i = 0; i < 484; i++) {
        if (board1[i] === white) {
            nWhite++;
        }
        if (board1[i] === black) {
            nBlack++;
        }
    }
    
    var lineB = "Black " + (43 - nBlack);
    var lineW = "White " + (43 - nWhite);
    textAlign(CENTER, BOTTOM);
    
    text("Stones Tally", Xcen, y*5.0);
    text("Hit t to go back...", Xcen, y*30.0);
    textSize(boardScale * 18.0);
    text("Removed     Remaining", Xcen, y*10.0);
    text("Black:", x*5.0, y*15.0);
    text(43-nBlack, x*15.0, y*15.0);
    text(nBlack, x*25.0, y*15.0);
    text("White:", x*5.0, y*20.0);
    text(43-nWhite, x*15.0, y*20.0);
    text(nWhite, x*25.0, y*20.0);
    //text("Stones Removed:", Xcen, Ycen);
    //textAlign(CENTER, TOP);
    //text(lineB, Xcen, Ycen);
    //text(lineW, Xcen, Ycen + boardScale * 30.0);
}

// Function to undo the previous move

function undoLast() {

    for (var i = 0; i < 484; i++) {
        board3[i] = board1[i];
        board1[i] = board2[i];
        board2[i] = board3[i];
    }
}

// Function to switch sides

function switchSides() {
 
    var i;
    var temp1 = [];
    var temp2 = [];
    var temp3 = [];
     
    for (i = 0; i < 484; i++) {
        temp1[i] = board1[483 - i];
        temp2[i] = board2[483 - i];
        temp3[i] = board3[483 - i];
    }

    for (i = 0; i < 484; i++) {
        board1[i] = temp1[i];
        board2[i] = temp2[i];
        board3[i] = temp3[i];
    }
}
     

// Function to show the welcome message

function showWelcome() {
    
    var x = boardScale * 20.0;
    var y = boardScale * 20.0;
    
    fill(222,162,66);
    rect(Xcen-6.0*x, Ycen-3.0*y, 12.0*x, 6.0*y);
    noFill();
    stroke(0, 0, 0);
    strokeWeight(1);
    rect(Xcen-6.0*x, Ycen-3.0*y, 12.0*x, 6.0*y);
    textSize(boardScale * 28.0);
    fill(0, 0, 255);
    textAlign(CENTER, CENTER);
    text("Welcome to Gess!\nClick to Start\n(Hit h for Help)", Xcen, Ycen);
}

/////////////////////////////////////////////
//
//            Main program
//
/////////////////////////////////////////////

function setup() {

     boardSize = min(window.innerWidth, window.innerHeight); - 35;
     boardScale = width / 400.0;
     Xcen = width / 2.0;
     Ycen = height / 2.0;

     createCanvas(boardSize, boardSize);
     frameRate(30);
     initialize();
}

// Main loop

function draw() {

    if (helpOn) {
        noLoop();
        showHelp();
    }
    else if (tallyOn) {
        noLoop();
        showTally();
    }
    else {
        drawBoard();
        displayGame(); 
        if (started) {
            getCoords();
            if (boxOn) {
                drawBox();
            }
            if (fadeOut > 0) {
                fill(255, 0, 0, fadeOut);
                textAlign(CENTER, CENTER);
                textSize(boardScale * 60.0);
                text(fadeMsg, Xcen, Ycen);
                fadeOut -= 16;
            }
        }
        else {
            showWelcome();
        }
    }
}

// Mouse functionality

function mousePressed() {

    // mousePressed() responds to touch events as well

    if (started) {
        if (!selected) {
            fromAddr = boardN;
            pieceBoxX = scanBoxX;
            pieceBoxY = scanBoxY;
            getPiece(board1, piece1, fromAddr);
            if (isAPiece() || !rulesOn) {
                selected = !selected;
            }
            else {
                if (!helpOn) {
                    fadeMsg = "Nope!";
                    fadeOut = 255;
                }
            }
        }
        else {
            toAddr = boardN;
            if (isLegal() || !rulesOn) {
                putPiece(board1, piece1, fromAddr, toAddr);
                selected = !selected;
            }
            else {
                if (!helpOn) {
                    fadeMsg = "Nope!";
                    fadeOut = 255;
                }
            }
        }
    }
    else {
        started = !started;
    }
}

// Keyboard functionality

function keyTyped() {
    
    switch(key) {
        
        // u: undo previous move

        case 'u':  
            undoLast();
            break;

        // c: clear the current selection

        case 'c':
            selected = false;
            break;

        // i: toggle board indices on/off

        case 'i':
            indicesOn = !indicesOn;
            break;

        // b: toggle box on/off

        case 'b':
            boxOn = !boxOn;
            break;

        // r: toggle rules enforcement on/off

        case 'r':
            rulesOn = !rulesOn;
            fadeMsg = (rulesOn) ? "Rules On" : "Rules Off";
            fadeOut = 255;
            break;

        // s: switch sides

        case 's':
            switchSides();
            switched = !switched;
            break;

        // t: toggle stones tally on/off

        case 't':
            if (tallyOn) {
                loop();
            }
            tallyOn = !tallyOn;
            break;

        // h: toggle help on/off

        case 'h':
            if (helpOn) {
                loop();
            }
            helpOn = !helpOn;
            break;

        // uncomment to see key codes

        default:
            //println(key);
            break;
    }
    return false;
}
