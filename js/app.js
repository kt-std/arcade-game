let allEnemies = [];
const numRows = 6;
      numCols = 7,
      rowHeight = 70,
      verticalStep = 70,
      horizontalStep = 70,
      initialPositionX = horizontalStep*Math.floor(numCols/2),
      initialPositionY = (numRows-1)*verticalStep,
      canvaStart = 0,
      CANVAS_WIDTH = numCols*horizontalStep,
      CANVAS_HEIGHT = numRows*horizontalStep+20,
      amountOfLives = 3,
      heartSpritePath = 'images/heart.svg',
      randomSpeedSeed = 100,
      speedIncrement = 0.01,
      horizotalVisibilityArea = horizontalStep/2,
      verticalVisibilityArea = verticalStep/2;

var Enemy = function(index) {
    this.x = canvaStart;
    this.y = verticalStep*(index);    
    this.speed = Math.random()*randomSpeedSeed;
    this.sprite = 'images/yeti.png';
};


/* This function displays each Enemy instance sprite on the canvas
 * due to its current X and Y coodinates
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Enemy.prototype.update = function(dt) {
    // Speed up the enemy during the game
    this.speed += speedIncrement; 
    // Update Enemy's horizontal position
    this.x = this.updateHorizontalPosition(this.x + dt*this.speed); 
};


Enemy.prototype.updateHorizontalPosition = function(position){
    /* If the Enemy moves right off the visible canvas area 
     * place it back to the beginning of the row in other cases 
     * move right
     */
    return position > CANVAS_WIDTH + horizotalVisibilityArea 
      ? canvaStart - horizotalVisibilityArea
      : position;
}


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
    if(!haveLives(player.lives)){
        displayMessage('lose', 'flex');
    }else{
        allEnemies.forEach(enemy =>{
            if (Math.abs(player.x - enemy.x) < horizotalVisibilityArea && 
                Math.abs(player.y - enemy.y) < verticalVisibilityArea) {
                player.lives.pop();
                updateLives(player.lives);
                resetPosition(player, initialPositionX, initialPositionY);
            }
        });
    }
   
};


Player.prototype.handleInput = function(key) {
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
    appendLives(obj.lives);
}

function appendLives(livesArray){
    const heartsContainer = document.getElementById('hearts');
    const fragment = document.createDocumentFragment();
    if(heartsContainer.children.length){
        clearNodes(heartsContainer);
    }
    for (var i = 0; i < livesArray.length; i++) {
        const img = document.createElement('img');
        img.src = heartSpritePath;
        img.classList.add('hearts__image');
        fragment.appendChild(img);
    }
    document.getElementById('hearts').appendChild(fragment);
    

}

function clearNodes(node){
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

function updateLives(livesArray){
    const fragment = document.getElementById('hearts');
    fragment.removeChild(fragment.lastChild);
}
