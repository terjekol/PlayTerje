// 1. Tegne sirkel manuelt
ctx.beginPath();
ctx.arc(100, 75, 50, 0, 2 * Math.PI);
ctx.stroke();
// eller: ctx.fill();

// 2. Automatisere med en egen kommandofunksjon 

function fillCircle() {
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.fill();
}

// 3. Enklere tegning av sirkel - parametrisering - eksempel 1

function fillCircle(x, y, color) {
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x+radius, y+radius, radius, 0, 2 * Math.PI);
    ctx.fill();
}

// 3. Enklere tegning av sirkel - parametrisering - eksempel 2

function fillCircle(x, y, diameter, color) {
    const radius = diameter/2;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x+radius, y+radius, radius, 0, 2 * Math.PI);
    ctx.fill();
}

// 4. Tegne pil som peker mot høyre 

function drawPointer(x,y,color) {
    const radius = 50;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2);
    ctx.lineTo(4*radius+x,y);
    ctx.lineTo(5*radius+x,y+radius);
    ctx.lineTo(4*radius+x,y+2*radius);
    ctx.fill();
}

// 5. Tegne pil som peker mot venstre

function drawPointer2(x,y) {
    const radius = 50;
    ctx.beginPath();
    ctx.arc(x+radius*5, y+radius, radius, 3*Math.PI/2, Math.PI/2);
    ctx.lineTo(radius+x,y+2*radius);
    ctx.lineTo(x,y+radius);
    ctx.lineTo(radius+x,y);
    ctx.fill();
}

// 6. Kunne gjøre begge deler med samme funksjon - if-setning og logiske verdier

function drawPointer(x,y,pointToRight,color) {
    const radius = 50;
    ctx.fillStyle = color;
    ctx.beginPath();
    if(pointToRight) {
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2);
        ctx.lineTo(4*radius+x,y);
        ctx.lineTo(5*radius+x,y+radius);
        ctx.lineTo(4*radius+x,y+2*radius);
    } else {
        ctx.arc(x+radius*5, y+radius, radius, 3*Math.PI/2, Math.PI/2);
        ctx.lineTo(radius+x,y+2*radius);
        ctx.lineTo(x,y+radius);
        ctx.lineTo(radius+x,y);
    }
    ctx.fill();
}

//  7. Sammenligne tall: automatisk peke mot midten av skjermen

function drawPointer(x,y,color) {
    const radius = 50;
    const pointToRight = x < 400;
    ctx.beginPath();
    ctx.fillStyle = color;
    if(pointToRight) {
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2);
        ctx.lineTo(4*radius+x,y);
        ctx.lineTo(5*radius+x,y+radius);
        ctx.lineTo(4*radius+x,y+2*radius);
    } else {
        ctx.arc(x+radius*5, y+radius, radius, 3*Math.PI/2, Math.PI/2);
        ctx.lineTo(radius+x,y+2*radius);
        ctx.lineTo(x,y+radius);
        ctx.lineTo(radius+x,y);
    }
    ctx.fill();
}

//  8. Tilfeldig tall

function randomNumber(minIncl,maxExcl) {
    const delta = maxExcl - minIncl;
    return minIncl + Math.floor(Math.random() * delta);
}

//  9. Farger - og tilfeldig farge

function randomColor() {
    const red = randomNumber(0,255);
    const green = randomNumber(0,255);
    const blue = randomNumber(0,255);
    return `rgb(${red},${green},${blue})`;
}

// 10. Tilfeldig firkant

function drawRandomRect() {
    ctx.fillStyle = randomColor();
    const x = randomNumber(0,800);
    const y = randomNumber(0,600);
    const width = randomNumber(0,800) - x;
    const height = randomNumber(0,600) - y;
    ctx.fillRect(x,y,width,height);
}

// 11. Mange firkanter med tilfeldige firkanter på rekke og rad

count = 5;
while(count > 0) {
    drawRandomRect()
    count--;
}
    
for(i=0;i<500;i++){
    drawRandomRect();
}

function drawRandomColoredRect(x,y) {
    ctx.fillStyle = randomColor();
    ctx.fillRect(x,y,50,50);
}

function drawRect(x,y,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,50,50);
}

for(x=0; x<800; x+=50) drawRandomColoredRect(x,0)

for(y=0; y<800; y+=50)
    for(x=0; x<800; x+=50) 
        drawRect(x,y,`rgb(${y/4},${x/4},${255-x/4})`)
