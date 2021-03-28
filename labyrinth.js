const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let labyrinthSize;
let cornerSize = 20;
const wallToCornerRatio = 4;
const directions = ['opp', 'ned', 'høyre', 'venstre'];
const oppositeDirection = {
    'opp': 'ned',
    'ned': 'opp',
    'venstre': 'høyre',
    'høyre': 'venstre',
};
let roomCount;
const openWalls = {};
const wallSize = cornerSize * wallToCornerRatio;
let pixels;
let character = {
    roomIndex: 0,
    direction: 'ned',
};
const commandQueue = [];
const timer = null;

function init(size) {
    labyrinthSize = size;
    roomCount = labyrinthSize * labyrinthSize;
    openWalls['opp0'] = true;
    openWalls['ned' + (roomCount - 1)] = true;
    pixels = calcWallSize(labyrinthSize + 1);
    canvas.setAttribute('width', pixels);
    canvas.setAttribute('height', pixels);
    generateLabyrinth();
    drawLabyrinth();
}

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
        if (direction == 'opp' && rowIndex > 0 && !rooms[roomIndex - labyrinthSize])
            return { roomIndex: roomIndex - labyrinthSize, direction };
        if (direction == 'venstre' && colIndex > 0 && !rooms[roomIndex - 1])
            return { roomIndex: roomIndex - 1, direction };
        if (direction == 'høyre' && colIndex < labyrinthSize - 1 && !rooms[roomIndex + 1])
            return { roomIndex: roomIndex + 1, direction };
        if (direction == 'ned' && rowIndex < labyrinthSize - 1 && !rooms[roomIndex + labyrinthSize])
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
    if (character.direction == 'høyre') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x, y + size);
    } else if (character.direction == 'venstre') {
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size);
    } else if (character.direction == 'opp') {
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x + size, y + size);
    } else if (character.direction == 'ned') {
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
    if (isFirstRow) drawWall(rowIndex, colIndex, roomIndex, 'opp');
    if (isFirstCol) drawWall(rowIndex, colIndex, roomIndex, 'venstre');
    drawWall(rowIndex, colIndex, roomIndex, 'høyre');
    drawWall(rowIndex, colIndex, roomIndex, 'ned');
    drawCorner(rowIndex, colIndex, 0, 0);
    drawCorner(rowIndex, colIndex, 0, 1);
    drawCorner(rowIndex, colIndex, 1, 0);
    drawCorner(rowIndex, colIndex, 1, 1);
}

function drawWall(rowIndex, colIndex, roomIndex, direction) {
    const doorKey = direction + roomIndex;
    if (openWalls[doorKey]) return;
    const isDoorHorizontal = direction == 'opp' || direction == 'ned';
    let x = calcWallSize(colIndex);
    let y = calcWallSize(rowIndex);
    if (direction == 'opp') { x += cornerSize; }
    if (direction == 'venstre') { y += cornerSize; }
    if (direction == 'høyre') {
        x += wallSize + cornerSize;
        y += cornerSize;
    }
    if (direction == 'ned') {
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
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// function snuVenstre() {
//     //pause(400);
//     character.direction = {
//         'opp': 'venstre',
//         'høyre': 'opp',
//         'ned': 'høyre',
//         'venstre': 'ned',
//     }[character.direction];
//     drawLabyrinth();
//     return character.direction;
// }

function snuHøyre() {
    //pause(400);
    character.direction = {
        'opp': 'høyre',
        'høyre': 'ned',
        'ned': 'venstre',
        'venstre': 'opp',
    }[character.direction];
    drawLabyrinth();
    return character.direction;
}

function gå() {
    //pause(400);
    if (!openWalls[character.direction + character.roomIndex]) return false;
    const position = getRowAndCol(character.roomIndex);

    if (character.direction == 'opp' && position.rowIndex > 0) character.roomIndex -= labyrinthSize;
    else if (character.direction == 'venstre' && position.colIndex > 0) character.roomIndex -= 1;
    else if (character.direction == 'høyre' && position.colIndex < labyrinthSize - 1) character.roomIndex += 1;
    else if (character.direction == 'ned' && position.rowIndex < labyrinthSize - 1) character.roomIndex += labyrinthSize;
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

function erVedUtgang() {
    return character.roomIndex == labyrinthSize * labyrinthSize - 1;
}