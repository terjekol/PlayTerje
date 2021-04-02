const globals = {};

function init(size) {
    globals.canvas = document.getElementById("myCanvas");
    globals.ctx = globals.canvas.getContext("2d");
    const model = globals.model = {};
    model.labyrinthSize = size;
    model.cornerSize = 20;
    model.wallToCornerRatio = 4;
    model.directions = ['opp', 'ned', 'høyre', 'venstre'];
    model.oppositeDirection = {
        'opp': 'ned',
        'ned': 'opp',
        'venstre': 'høyre',
        'høyre': 'venstre',
    };
    model.openWalls = {};
    model.wallSize = model.cornerSize * model.wallToCornerRatio;
    model.character = {
        roomIndex: 0,
        direction: 'ned',
    };
    model.commandQueue = [];
    globals.timer = null;

    model.roomCount = model.labyrinthSize * model.labyrinthSize;
    model.openWalls['opp0'] = true;
    model.openWalls['ned' + (model.roomCount - 1)] = true;
    model.pixels = calcWallSize(model.labyrinthSize + 1);
    globals.canvas.setAttribute('width', model.pixels);
    globals.canvas.setAttribute('height', model.pixels);
    generateLabyrinth();
    drawLabyrinth();
}

function generateLabyrinth() {
    const model = globals.model;
    const rooms = [];
    rooms[0] = true;
    const stack = [];
    stack.push(0);

    while (stack.length > 0) {
        let currentRoom = stack.pop();
        let neighbourNotVisited = getNeighbourNotVisited(currentRoom, rooms);
        if (neighbourNotVisited === null) continue;
        stack.push(currentRoom);
        model.openWalls[neighbourNotVisited.direction + currentRoom] = true;
        const directionFromNeighbour = model.oppositeDirection[neighbourNotVisited.direction];
        model.openWalls[directionFromNeighbour + neighbourNotVisited.roomIndex] = true;
        rooms[neighbourNotVisited.roomIndex] = true;
        stack.push(neighbourNotVisited.roomIndex);
    }
}

function getNeighbourNotVisited(roomIndex, rooms) {
    const model = globals.model;
    shuffle(model.directions);
    const rowIndex = Math.floor(roomIndex / model.labyrinthSize);
    const colIndex = roomIndex % model.labyrinthSize;
    for (let direction of model.directions) {
        if (direction == 'opp' && rowIndex > 0 && !rooms[roomIndex - model.labyrinthSize])
            return { roomIndex: roomIndex - model.labyrinthSize, direction };
        if (direction == 'venstre' && colIndex > 0 && !rooms[roomIndex - 1])
            return { roomIndex: roomIndex - 1, direction };
        if (direction == 'høyre' && colIndex < model.labyrinthSize - 1 && !rooms[roomIndex + 1])
            return { roomIndex: roomIndex + 1, direction };
        if (direction == 'ned' && rowIndex < model.labyrinthSize - 1 && !rooms[roomIndex + model.labyrinthSize])
            return { roomIndex: roomIndex + model.labyrinthSize, direction };
    }
    return null;
}

function drawLabyrinth() {
    const model = globals.model;
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    for (let roomIndex = 0; roomIndex < model.roomCount; roomIndex++) {
        drawRoom(roomIndex);
    }
    drawCharacter();
}

function drawCharacter() {
    const ctx = globals.ctx;
    const model = globals.model;
    const rowIndex = Math.floor(model.character.roomIndex / model.labyrinthSize);
    const colIndex = model.character.roomIndex % model.labyrinthSize;
    let x = calcWallSize(colIndex) + 1.5 * model.cornerSize;
    let y = calcWallSize(rowIndex) + 1.5 * model.cornerSize;
    const size = model.wallSize - model.cornerSize;
    ctx.beginPath();
    if (model.character.direction == 'høyre') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x, y + size);
    } else if (model.character.direction == 'venstre') {
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size);
    } else if (model.character.direction == 'opp') {
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x + size, y + size);
    } else if (model.character.direction == 'ned') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y + size);
    }
    ctx.fill();
}

function drawRoom(roomIndex) {
    const model = globals.model;
    const rowIndex = Math.floor(roomIndex / model.labyrinthSize);
    const colIndex = roomIndex % model.labyrinthSize;
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
    const model = globals.model;
    const doorKey = direction + roomIndex;
    if (model.openWalls[doorKey]) return;
    const isDoorHorizontal = direction == 'opp' || direction == 'ned';
    let x = calcWallSize(colIndex);
    let y = calcWallSize(rowIndex);
    if (direction == 'opp') { x += model.cornerSize; }
    if (direction == 'venstre') { y += model.cornerSize; }
    if (direction == 'høyre') {
        x += model.wallSize + model.cornerSize;
        y += model.cornerSize;
    }
    if (direction == 'ned') {
        y += model.wallSize + model.cornerSize;
        x += model.cornerSize;
    }
    const width = isDoorHorizontal ? model.wallSize : model.cornerSize;
    const height = isDoorHorizontal ? model.cornerSize : model.wallSize;
    globals.ctx.fillRect(x, y, width, height);
}

function drawCorner(rowIndex, colIndex, addX, addY) {
    const model = globals.model;
    let x = calcWallSize(colIndex) + addX * (model.cornerSize + model.wallSize);
    let y = calcWallSize(rowIndex) + addY * (model.cornerSize + model.wallSize);
    globals.ctx.fillRect(x, y, model.cornerSize, model.cornerSize);
}

function calcWallSize(index) {
    const model = globals.model;
    return index * model.wallSize + (index + 1) * model.cornerSize;
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
    const model = globals.model;
    //pause(400);
    model.character.direction = {
        'opp': 'høyre',
        'høyre': 'ned',
        'ned': 'venstre',
        'venstre': 'opp',
    }[model.character.direction];
    drawLabyrinth();
    return model.character.direction;
}

function gå() {
    const model = globals.model;
    //pause(400);
    if (!model.openWalls[model.character.direction + model.character.roomIndex]) return false;
    const position = getRowAndCol(model.character.roomIndex);

    if (model.character.direction == 'opp' && position.rowIndex > 0) model.character.roomIndex -= model.labyrinthSize;
    else if (model.character.direction == 'venstre' && position.colIndex > 0) model.character.roomIndex -= 1;
    else if (model.character.direction == 'høyre' && position.colIndex < model.labyrinthSize - 1) model.character.roomIndex += 1;
    else if (model.character.direction == 'ned' && position.rowIndex < model.labyrinthSize - 1) model.character.roomIndex += model.labyrinthSize;
    drawLabyrinth();
    return true;
}

function getRowAndCol(roomIndex) {
    const model = globals.model;
    const rowIndex = Math.floor(roomIndex / model.labyrinthSize);
    const colIndex = roomIndex % model.labyrinthSize;
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
    const model = globals.model;
    return model.character.roomIndex == model.labyrinthSize * model.labyrinthSize - 1;
}