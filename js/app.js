const numRows = 6;
const numCols = 7;
const rowHeight = 70;
const verticalStep = 70;
const amountOfLives = 3;
let allEnemies = [];
const horizontalStep = 70;
const initialPositionX = horizontalStep*Math.floor(numCols/2);
const initialPositionY = (numRows-1)*verticalStep;
const canvaStart = 0;
const CANVAS_WIDTH = numCols*horizontalStep;
const CANVAS_HEIGHT = numRows*horizontalStep+20;
const heartPath = 'images/heart.png';


var Enemy = function(index) {
    this.x = canvaStart;
    this.speed = Math.random()*100;
    this.y = verticalStep*(index);
    this.sprite = 'images/yeti.png';
};


Enemy.prototype.update = function(dt) {
    if(!haveLives(player.lives)){
        displayMessage('lose', 'flex');
    }else{
        this.speed += 0.01; 
        this.x = this.checkPosition(this.x + dt*this.speed); 
    }
};

var Lives = function(){
    this.sprite = 'images/heart.png';
}

Enemy.prototype.checkPosition = function(position){
    return position > CANVAS_WIDTH + horizontalStep/2 
      ? canvaStart - horizontalStep
      : position;
}


Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function() {
    this.y = initialPositionY;
    this.x = initialPositionX;
    this.lives = new Array(amountOfLives);
    this.sprite = 'images/santa.png';
};


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
    allEnemies.forEach(enemy =>{
        if (Math.abs(player.x - enemy.x) < horizontalStep/2 && 
            Math.abs(player.y - enemy.y) < verticalStep/2) {

            player.lives.pop();
            updateLives(player.lives);
            resetPosition(player, initialPositionX, initialPositionY);
            console.log(player.lives);
        }
    });
   
};


Player.prototype.handleInput = function(key) {
    console.log(this.lives);
    move(this, key);
    if(!this.y){
        displayMessage('win', 'flex');
    }else if(this.y > initialPositionY) {
        this.y = initialPositionY; 
    }else if(this.x >= CANVAS_WIDTH){
        this.x = canvaStart;
    }else if(this.x < canvaStart){
        this.x = CANVAS_WIDTH - horizontalStep;
    }else if(this.y < canvaStart){
        this.y = canvaStart;
    }
    console.log(`x:${this.x} y:${this.y}`);  
    
    
};


for(var i = 0; i < 3; i++){
    allEnemies.push(new Enemy(i+1));
}
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function move(obj, key){
    switch(key){
        case 'up':
            obj.y -= verticalStep;
            break;    
        case 'down':
            obj.y += verticalStep;
            break; 
        case 'left':
            obj.x -= horizontalStep;
            break;
        case 'right':
            obj.x += horizontalStep;
            break;
    }
}

function displayMessage(id, displayStyle){
    document.getElementById(id).style.display = displayStyle;
}

/*
 *Handle reset button event
 */
document.querySelector('body').addEventListener('click', function(e){
    console.log(e.target);
    if (e.target.id === 'reset') {
        displayMessage(e.target.offsetParent.id, 'none');
        
        resetPosition(player, initialPositionX, initialPositionY);
        resetLives(player, amountOfLives);
        allEnemies.map((enemy,index) =>{
            resetPosition(enemy, canvaStart, verticalStep*(index+1));
            enemy.speed = Math.random()*100;
        });
    }
});

 
function resetPosition(object, positionX, positionY){
    object.x = positionX;
    object.y = positionY;
}

function haveLives(livesArray){
    return livesArray.length;
}


function resetLives(obj, amountOfLives){
    obj.lives = new Array(amountOfLives);
}

function updateLives(livesArray){
    const fragment = document.createDocumentFragment();
    const img = document.createElement('img');

    for (var i = 0; i < livesArray.length; i++) {
        img.src = heartPath;
        img.style.height = '25px'; 
        fragment.appendChild(img);
    }
    document.getElementById('hearts').appendChild(fragment);

}

updateLives(player.lives);