var boardSize;
var complexity;
var toggle;
var endGame;
var mineField = new Array();
var bombArray = new Array();
var userMoves = new Array();
function startGame(gameOptions) {
    setOptions(gameOptions);
    toggle = false;
    endGame = false;
    plantBombs(complexity);
    //border detection
    var blockEast = false;
    var blockWest = false;
    var blockNorth = false;
    var blockSouth = false;
    for(y = 0; y < boardSize; y++) {
        userMoves[y] = new Array(boardSize);
        mineField[y] = new Array(boardSize);
        for(x = 0; x < boardSize; x++) {
            userMoves[y][x] = 0;
            mineField[y][x] = 0;
            blockEast = false;
            blockWest = false;
            blockNorth = false;
            blockSouth = false;
            if(y == 0) {
                blockNorth = true;
            } else if(y == (boardSize-1)) {
                blockSouth = true;
            }
            if(x == 0) {
                blockWest = true;
            } else if(x == (boardSize-1)) {
                blockEast = true;
            }
            for(direction = 0; direction < 8; direction++) {
                switch(direction) {
                    case 0:
                    {//east
                        if(!blockEast) {
                            if(bombArray[y][x+1] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                    case 1:
                    {//northeast
                        if(!blockNorth && !blockEast) {
                            if(bombArray[y-1][x+1] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                    case 2:
                    {//north
                        if(!blockNorth) {
                            if(bombArray[y-1][x] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                    case 3:
                    {//northwest
                        if(!blockNorth && !blockWest) {
                            if(bombArray[y-1][x-1] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                    case 4:
                    {//west
                        if(!blockWest) {
                            if(bombArray[y][x-1] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                    case 5:
                    {//southwest
                        if(!blockSouth && !blockWest) {
                            if(bombArray[y+1][x-1] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                    case 6:
                    {//south
                        if(!blockSouth) {
                                if(bombArray[y+1][x] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                    case 7:
                    {//southeast
                        if(!blockSouth && !blockEast) {
                            if(bombArray[y+1][x+1] == 1) {
                                mineField[y][x] += 1;
                            }
                        }
                    } break;
                }
            }
        }
    }
    var z = 0;
    document.write('<div><table border="0" cellpadding="0" cellspacing="0">');
    for (y = 0; y < boardSize; y++) {
        document.write('<tr>');
        for (x = 0; x < boardSize; x++) {
            document.write('<td><img src="images/hidden.jpg" height="20" width="20" id="'+z+'" onmouseup="handleMouseEvent(id, event)" oncontextmenu="return false;"></td>');
            z++;
        }
        document.write('</tr>');
    }
    document.write('</table></div>');
    
    //exposeBoard();
}
function plantBombs(complexity) {
    for(y = 0; y < boardSize; y++) {
        bombArray[y] = new Array(boardSize);
        for(x = 0; x < boardSize; x++) {
            bombArray[y][x] = 0;
        }
    }
    var xr, yr;
    for(k = 0; k < complexity; k++) {
        //generate random coordinates between 0 and (boardSize-1)
        yr = Math.floor(Math.random()*boardSize);
        xr = Math.floor(Math.random()*boardSize);
        if(bombArray[yr][xr] == 1) {
            //if there is already a bomb here, decrement k and redo this loop count
            k--;
        } else {
            bombArray[yr][xr] = 1;
        }
    }
}
function handleMouseEvent(fid, event) {
    var id = parseFloat(fid);
    var y = Math.floor(id/boardSize);
    var x = id - (y*boardSize);
    var img;
    //document.write(event.button);
    if(!endGame) {
        if(event.button == 2) {
            //detect right mouse button event and toggle flagging
            img = document.getElementById(fid);
            switch(userMoves[y][x]) {
                case 0:
                {
                    userMoves[y][x] = 2;
                    img.src = 'images/flagged.jpg';
                } break;
                
                case 2:
                {
                    userMoves[y][x] = 0;
                    img.src = 'images/hidden.jpg';
                } break;
            }
        } else if(userMoves[y][x] != 2) {
            //if the user has not flagged this square proceed with checking for mines
            userMoves[y][x] = 1;
            img = document.getElementById(fid);
            if(bombArray[y][x] == 1) {
                img.src = 'images/bombed.jpg';
                gameOver();
            } else {
                openImage(y, x);
                recursiveExposure(y, x);
            }
            //document.write(y,x+"<br>");
        }
    }
}
function recursiveExposure(y, x) {
    //border detection
    var blockEast = false;
    var blockWest = false;
    var blockNorth = false;
    var blockSouth = false;
    if(y == 0) {
        blockNorth = true;
    } else if(y == (boardSize-1)) {
        blockSouth = true;
    }
    if(x == 0) {
        blockWest = true;
    } else if(x == (boardSize-1)) {
        blockEast = true;
    }
    for(direction = 0; direction < 8; direction++) {
        switch(direction) {
            case 0:
            {//east
                if(!blockEast) {
                    if(bombArray[y][x+1] != 1) {
                        openImage(y,x+1);
                    }
                }
            } break;
            case 1:
            {//northeast
                if(!blockNorth && !blockEast) {
                    if(bombArray[y-1][x+1] != 1) {
                        openImage(y-1,x+1);
                    }
                }
            } break;
            case 2:
            {//north
                if(!blockNorth) {
                    if(bombArray[y-1][x] != 1) {
                        openImage(y-1,x);
                    }
                }
            } break;
            case 3:
            {//northwest
                if(!blockNorth && !blockWest) {
                    if(bombArray[y-1][x-1] != 1) {
                        openImage(y-1,x-1);
                    }
                }
            } break;
            case 4:
            {//west
                if(!blockWest) {
                    if(bombArray[y][x-1] != 1) {
                        openImage(y,x-1);
                    }
                }
            } break;
            case 5:
            {//southwest
                if(!blockSouth && !blockWest) {
                    if(bombArray[y+1][x-1] != 1) {
                        openImage(y+1,x-1);
                    }
                }
            } break;
            case 6:
            {//south
                if(!blockSouth) {
                        if(bombArray[y+1][x] != 1) {
                        openImage(y+1,x);
                    }
                }
            } break;
            case 7:
            {//southeast
                if(!blockSouth && !blockEast) {
                    if(bombArray[y+1][x+1] != 1) {
                        openImage(y+1,x+1);
                    }
                }
            } break;
        }
    }
}
function openImage(y, x) {
    userMoves[y][x] = 1;
    var fid = (y*(boardSize-1)+y) + x;
    var img = document.getElementById(fid);
    switch(mineField[y][x]){
        case 0: {img.src = 'images/open.jpg';} break;
        case 1: {img.src = 'images/numbered/open1.jpg';} break;
        case 2: {img.src = 'images/numbered/open2.jpg';} break;
        case 3: {img.src = 'images/numbered/open3.jpg';} break;
        case 4: {img.src = 'images/numbered/open4.jpg';} break;
        case 5: {img.src = 'images/numbered/open5.jpg';} break;
        case 6: {img.src = 'images/numbered/open6.jpg';} break;
        case 7: {img.src = 'images/numbered/open7.jpg';} break;
        case 8: {img.src = 'images/numbered/open8.jpg';} break;
    }
    //document.write(fid+"<br>");
}
function gameOver() {
    var fid;
    var img;
    var p;
    for(y = 0; y < boardSize; y++) {
        for(x = 0; x < boardSize; x++) {
            if(userMoves[y][x] != 1 && bombArray[y][x] == 1) {
                fid = (y*(boardSize-1)+y) + x;
                img = document.getElementById(fid);
                img.src = 'images/exposed.jpg';
            }
        }
    }
    img = document.getElementById("face");
    img.src = 'images/sad-face_sm.bmp';
    p = document.getElementById("facecontainer");
    p.style.backgroundImage = 'url(images/sad-face_sm.bmp)';
    endGame = true;
}
function setOptions(gameOptions) {
    switch(gameOptions) {
        case 'beginner':
        {
            boardSize = 8;
            complexity = 10;
        } break;
        case 'intermediate':
        {
            boardSize = 16;
            complexity = 40;
        } break;
        case 'expert':
        {
            boardSize = 16;
            complexity = 90;
        } break;
        default:
        {
            boardSize = 8;
            complexity = 10;    
        } break;
    }
}
function toggleBombs() {
    if(!endGame) {
        for (y = 0; y < boardSize; y++) {
            for (x = 0; x < boardSize; x++) {
                if(bombArray[y][x] == 1 && userMoves[y][x] != 1) {
                    fid = (y*(boardSize-1)+y) + x;
                    img = document.getElementById(fid);
                    if(toggle){
                        img.src = 'images/hidden.jpg';
                    } else {
                        img.src = 'images/exposed.jpg';
                    }
                }
            }
        }
    }
    toggle = !toggle;
}
function exposeBoard() {
    for (y = 0; y < boardSize; y++) {
        for (x = 0; x < boardSize; x++) {
            if(bombArray[y][x] == 1) {
                fid = (y*(boardSize-1)+y) + x;
                img = document.getElementById(fid);
                img.src = 'images/exposed.jpg';
            } else {
                openImage(y, x);
            }
        }
    }
    endGame = true;
}
function validateGame() {
    var p;
    if(!endGame) {
        success = true;
        for (y = 0; y < boardSize; y++) {
            for (x = 0; x < boardSize; x++) {
                if(bombArray[y][x] == 1) {
                    if(userMoves[y][x] == 1) {
                        //if the user has selected a bomb, the game has been lost
                        success = false;
                    }
                } else if (userMoves[y][x] != 1) {
                    //if the user has not uncovered all squares, the game has been lost
                    success = false;
                }
            }
        }
    }
    if(!success) {
        gameOver();
    } else {
        p = document.getElementById("facecontainer");
        p.style.backgroundImage = 'url(images/you-won.bmp)';
    }
    endGame = true;
}