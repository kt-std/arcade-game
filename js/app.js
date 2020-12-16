const allEnemies = [],
      ROW_NUM = 6;
      COL_NUM = 7,
      ROW_HEIGHT = 70,
      Y_STEP = 70,
      X_STEP = 70,
      INITIAL_X = X_STEP * Math.floor(COL_NUM/2),
      INITIAL_Y = (ROW_NUM-1)*Y_STEP,
      CANVAS_START = 0,
      CANVAS_WIDTH = COL_NUM*X_STEP,
      CANVAS_HEIGHT = ROW_NUM*X_STEP+20,
      LIVES_AMOUNT = 3,
      HEART_SPRITE = 'images/heart.svg',
      RANDOM_BASE = 100,
      SPEED_INC = 0.01,
      X_GAP = X_STEP/2,
      Y_GAP = Y_STEP/2;

var Enemy = function(index) {
    this.x = CANVAS_START;
    this.y = Y_STEP*(index);    
    this.speed = Math.random()*RANDOM_BASE;
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
    this.speed += SPEED_INC; 
    // Update Enemy's horizontal position
    this.x = this.updateHorizontalPosition(this.x + dt*this.speed); 
};


Enemy.prototype.updateHorizontalPosition = function(position){
    /* If the Enemy moves right off the visible canvas area 
     * place it back to the beginning of the row in other cases 
     * move right
     */
    return position > CANVAS_WIDTH + X_GAP 
      ? CANVAS_START - X_GAP
      : position;
}


var Player = function() {
    this.y = INITIAL_Y;
    this.x = INITIAL_X;
    this.lives = new Array(LIVES_AMOUNT);
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
            if (Math.abs(player.x - enemy.x) < X_GAP && 
                Math.abs(player.y - enemy.y) < Y_GAP) {
                player.lives.pop();
                updateLives(player.lives);
                resetPosition(player, INITIAL_X, INITIAL_Y);
            }
        });
    }
   
};


Player.prototype.handleInput = function(key) {
    move(this, key);
    if(!this.y){
        displayMessage('win', 'flex');
    }else if(this.y > INITIAL_Y) {
        this.y = INITIAL_Y; 
    }else if(this.x >= CANVAS_WIDTH){
        this.x = CANVAS_START;
    }else if(this.x < CANVAS_START){
        this.x = CANVAS_WIDTH - X_STEP;
    }else if(this.y < CANVAS_START){
        this.y = CANVAS_START;
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
            obj.y -= Y_STEP;
            break;    
        case 'down':
            obj.y += Y_STEP;
            break; 
        case 'left':
            obj.x -= X_STEP;
            break;
        case 'right':
            obj.x += X_STEP;
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
        resetPosition(player, INITIAL_X, INITIAL_Y);
        resetLives(player, LIVES_AMOUNT);
        allEnemies.map((enemy,index) =>{
            resetPosition(enemy, CANVAS_START, Y_STEP*(index+1));
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


function resetLives(obj, LIVES_AMOUNT){
    obj.lives = new Array(LIVES_AMOUNT);
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
        img.src = HEART_SPRITE;
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
