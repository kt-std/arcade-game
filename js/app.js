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
      LIVE_SPRITE = 'images/heart.svg',
      LIVES_CONTAINER = document.getElementById('hearts'),
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
    this.lives = LIVES_AMOUNT;
    this.sprite = 'images/santa.png';
};


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
    if(!this.lives){
        displayMessage('lose', 'flex');
    }else{
        allEnemies.forEach(enemy => {
            if (Math.abs(this.x - enemy.x) < X_GAP && 
                Math.abs(this.y - enemy.y) < Y_GAP) {
                this.lives--;
                updateLivesContainer();
                resetPosition(this, INITIAL_X, INITIAL_Y);
            }
        });
    }   
};


Player.prototype.move = function (key){
    switch(key){
        case 'up':
            this.y -= Y_STEP;
            break;    
        case 'down':
            this.y += Y_STEP;
            break; 
        case 'left':
            this.x -= X_STEP;
            break;
        case 'right':
            this.x += X_STEP;
            break;
    }
}

Player.prototype.handleInput = function(key) {
    this.move(key);
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


for(let i = 0; i < 3; i++){
    allEnemies.push(new Enemy(i+1));
}
const player = new Player();

// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


function displayMessage(id, displayStyle){
    document.getElementById(id).style.display = displayStyle;
}

Player.prototype.resetLives = function (livesAmount){
    this.lives = livesAmount;
    appendLivesToContainer(this.lives);
}


/*
 *Handle reset button event
 */
document.querySelector('body').addEventListener('click', function(e){
    if (e.target.id === 'reset') {
        displayMessage(e.target.offsetParent.id, 'none');        
        resetPosition(player, INITIAL_X, INITIAL_Y);
        player.resetLives(LIVES_AMOUNT);
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


function appendLivesToContainer(livesAmount){
    const fragment = document.createDocumentFragment();
    if(LIVES_CONTAINER.children.length){
        clearNodes(LIVES_CONTAINER);
    }
    for (let i = 0; i < livesAmount; i++) {
        const img = document.createElement('img');
        img.src = LIVE_SPRITE;
        img.classList.add('hearts__image');
        fragment.appendChild(img);
    }
    LIVES_CONTAINER.appendChild(fragment);
}

function clearNodes(node){
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

function updateLivesContainer(){
    LIVES_CONTAINER.removeChild(LIVES_CONTAINER.lastChild);
}
