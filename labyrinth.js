const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const labyrinthSize = 5;
const cornerSize = 10;
const wallToCornerRatio = 4;
const directions = ['north', 'south', 'east', 'west'];
const roomCount = labyrinthSize * labyrinthSize;
const openDoors = {};
openDoors['north0'] = true;
openDoors['south' + (roomCount - 1)] = true;
const wallSize = cornerSize * wallToCornerRatio;
const pixels = calcWallSize(labyrinthSize + 1);
canvas.setAttribute('width', pixels);
canvas.setAttribute('height', pixels);

generateLabyrinth();
drawLabyrinth();

function generateLabyrinth() {
    const rooms = [];
    rooms[0] = true;
    const stack = [];
    stack.push(0);

    while (stack.length > 0) {
        let currentRoom = stack.pop();
        let neighbourNotVisited = getNeighbourNotVisited(currentRoom);
    }
}

function getNeighbourNotVisited(roomIndex) {
    shuffle(directions);
    const rowIndex = Math.floor(roomIndex / labyrinthSize);
    const colIndex = roomIndex % labyrinthSize;
    for (let direction of directions) {
        if (direction == 'north' && rowIndex > 0 && !rooms[roomIndex - labyrinthSize]) return roomIndex - labyrinthSize
        if (direction == 'west' && rowIndex > 0 && !rooms[roomIndex - labyrinthSize]) return roomIndex - labyrinthSize
        if (direction == 'east' && rowIndex > 0 && !rooms[roomIndex - labyrinthSize]) return roomIndex - labyrinthSize
        if (direction == 'south' && rowIndex > 0 && !rooms[roomIndex - labyrinthSize]) return roomIndex - labyrinthSize
    }
}

function 

function drawLabyrinth() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let roomIndex = 0; roomIndex < roomCount; roomIndex++) {
        drawRoom(roomIndex);
    }
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
    if (openDoors[doorKey]) return;
    const isDoorHorizontal = direction == 'north' || direction == 'south';
    let x = calcWallSize(colIndex);
    let y = calcWallSize(rowIndex);
    if (direction == 'north') { x += cornerSize; }
    if (direction == 'west') { y += cornerSize; }
    if (direction == 'east') { x += wallSize + cornerSize; y += cornerSize; }
    if (direction == 'south') { y += wallSize + cornerSize; x += cornerSize; }
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
    var currentIndex = array.length, temporaryValue, randomIndex;

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
