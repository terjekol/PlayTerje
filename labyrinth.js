const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const openDoors = {
    north0: true,
    east0: true,
    west1: true,
    east1: true,
    west2: true,
    south2: true,
};
const labyrinthSize = 5;
const cornerSize = 10;
const wallToCornerRatio = 4;
const wallSize = cornerSize * wallToCornerRatio;
const roomCount = labyrinthSize * labyrinthSize;
const pixels = calcWallSize(labyrinthSize + 1);
canvas.setAttribute('width', pixels);
canvas.setAttribute('height', pixels);

drawLabyrinth();
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

function drawCorner(rowIndex, colIndex, addX, addY){
    let x = calcWallSize(colIndex) + addX * (cornerSize+wallSize);
    let y = calcWallSize(rowIndex) + addY * (cornerSize+wallSize);
    ctx.fillRect(x, y, cornerSize, cornerSize);
}

function calcWallSize(index) {
    return index * wallSize + (index + 1) * cornerSize;
}
