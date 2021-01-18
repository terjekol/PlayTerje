const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const labyrinthSize = 6;
const cornerSize = 10;
const wallToCornerRatio = 4;
const directions = ['north', 'south', 'east', 'west'];
const oppositeDirection = {
    'north': 'south',
    'south': 'north',
    'west': 'east',
    'east': 'west',
};
const roomCount = labyrinthSize * labyrinthSize;
const openWalls = {};
openWalls['north0'] = true;
openWalls['south' + (roomCount - 1)] = true;
const wallSize = cornerSize * wallToCornerRatio;
const pixels = calcWallSize(labyrinthSize + 1);
canvas.setAttribute('width', pixels);
canvas.setAttribute('height', pixels);
let character = {
    roomIndex: 0,
    direction: 'west',
};
const commandQueue = [];
const timer = null;

generateLabyrinth();
drawLabyrinth();

function generateLabyrinth() {
    const rooms = [];
    rooms[0] = true;
    const stack = [];
    stack.push(0);

    while (stack.length > 0) {
        let currentRoom = stack.pop();
        let neighbourNotVisited = getNeighbourNotVisited(currentRoom, rooms);
        if (neighbourNotVisited === null) continue;
        stack.push(currentRoom);
        openWalls[neighbourNotVisited.direction + currentRoom] = true;
        const directionFromNeighbour = oppositeDirection[neighbourNotVisited.direction];
        openWalls[directionFromNeighbour + neighbourNotVisited.roomIndex] = true;
        rooms[neighbourNotVisited.roomIndex] = true;
        stack.push(neighbourNotVisited.roomIndex);
    }
}

function getNeighbourNotVisited(roomIndex, rooms) {
    shuffle(directions);
    const rowIndex = Math.floor(roomIndex / labyrinthSize);
    const colIndex = roomIndex % labyrinthSize;
    for (let direction of directions) {
        if (direction == 'north' && rowIndex > 0 && !rooms[roomIndex - labyrinthSize])
            return { roomIndex: roomIndex - labyrinthSize, direction };
        if (direction == 'west' && colIndex > 0 && !rooms[roomIndex - 1])
            return { roomIndex: roomIndex - 1, direction };
        if (direction == 'east' && colIndex < labyrinthSize - 1 && !rooms[roomIndex + 1])
            return { roomIndex: roomIndex + 1, direction };
        if (direction == 'south' && rowIndex < labyrinthSize - 1 && !rooms[roomIndex + labyrinthSize])
            return { roomIndex: roomIndex + labyrinthSize, direction };
    }
    return null;
}

function drawLabyrinth() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let roomIndex = 0; roomIndex < roomCount; roomIndex++) {
        drawRoom(roomIndex);
    }
    drawCharacter();
}

function drawCharacter() {
    const rowIndex = Math.floor(character.roomIndex / labyrinthSize);
    const colIndex = character.roomIndex % labyrinthSize;
    let x = calcWallSize(colIndex) + 1.5 * cornerSize;
    let y = calcWallSize(rowIndex) + 1.5 * cornerSize;
    const size = wallSize - cornerSize;
    ctx.beginPath();
    if (character.direction == 'east') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x, y + size);
    } else if (character.direction == 'west') {
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size);
    } else if (character.direction == 'north') {
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x + size, y + size);
    } else if (character.direction == 'south') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y + size);
    }
    ctx.fill();

}

function drawRoom(roomIndex) {
    const rowIndex = Math.floor(roomIndex / labyrinthSize);
    const colIndex = roomIndex % labyrinthSize;
    const isFirstCol = colIndex == 0;
    const isFirstRow = rowIndex == 0;
    if (isFirstRow) drawWall(rowIndex, colIndex, roomIndex, 'north');
    if (isFirstCol) drawWall(rowIndex, colIndex, roomIndex, 'west');
    drawWall(rowIndex, colIndex, roomIndex, 'east');
    drawWall(rowIndex, colIndex, roomIndex, 'south');
    drawCorner(rowIndex, colIndex, 0, 0);
    drawCorner(rowIndex, colIndex, 0, 1);
    drawCorner(rowIndex, colIndex, 1, 0);
    drawCorner(rowIndex, colIndex, 1, 1);
}

function drawWall(rowIndex, colIndex, roomIndex, direction) {
    const doorKey = direction + roomIndex;
    if (openWalls[doorKey]) return;
    const isDoorHorizontal = direction == 'north' || direction == 'south';
    let x = calcWallSize(colIndex);
    let y = calcWallSize(rowIndex);
    if (direction == 'north') { x += cornerSize; }
    if (direction == 'west') { y += cornerSize; }
    if (direction == 'east') {
        x += wallSize + cornerSize;
        y += cornerSize;
    }
    if (direction == 'south') {
        y += wallSize + cornerSize;
        x += cornerSize;
    }
    const width = isDoorHorizontal ? wallSize : cornerSize;
    const height = isDoorHorizontal ? cornerSize : wallSize;
    ctx.fillRect(x, y, width, height);
}

function drawCorner(rowIndex, colIndex, addX, addY) {
    let x = calcWallSize(colIndex) + addX * (cornerSize + wallSize);
    let y = calcWallSize(rowIndex) + addY * (cornerSize + wallSize);
    ctx.fillRect(x, y, cornerSize, cornerSize);
}

function calcWallSize(index) {
    return index * wallSize + (index + 1) * cornerSize;
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function snuVenstre() {
    //pause(400);
    character.direction = {
        'north': 'west',
        'east': 'north',
        'south': 'east',
        'west': 'south',
    }[character.direction];
    drawLabyrinth();
    return character.direction;
}

function snuHøyre() {
    //pause(400);
    character.direction = {
        'north': 'east',
        'east': 'south',
        'south': 'west',
        'west': 'north',
    }[character.direction];
    drawLabyrinth();
    return character.direction;
}

function gå() {
    //pause(400);
    if (!openWalls[character.direction + character.roomIndex]) return false;
    const position = getRowAndCol(character.roomIndex);

    if (character.direction == 'north' && position.rowIndex > 0) character.roomIndex -= labyrinthSize;
    else if (character.direction == 'west' && position.colIndex > 0) character.roomIndex -= 1;
    else if (character.direction == 'east' && position.colIndex < labyrinthSize - 1) character.roomIndex += 1;
    else if (character.direction == 'south' && position.rowIndex < labyrinthSize - 1) character.roomIndex += labyrinthSize;
    drawLabyrinth();
    return true;
}

function getRowAndCol(roomIndex) {
    const rowIndex = Math.floor(roomIndex / labyrinthSize);
    const colIndex = roomIndex % labyrinthSize;
    return { rowIndex, colIndex };
}


function pause(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while (curDate - date < millis);
}

function følgVeggx() {
    snuHøyre();
    if (!gå()) {
        snuVenstre();
        if (!gå()) {
            snuVenstre();
        }
    }
}