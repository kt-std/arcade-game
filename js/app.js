const allEnemies = [],
      ENEMIES_AMOUNT = 3,
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


const Enemy = function(index) {
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

const Player = function() {
    this.y = INITIAL_Y;
    this.x = INITIAL_X;
    this.lives = LIVES_AMOUNT;
    this.sprite = 'images/santa.png';
};


/* This function displays Player sprite on the canvas
 * due to its current X and Y coodinates
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* This function checks if there are left any Player lives.  
 * If there remain no lives, display a loss message. 
 * If Player still left lives and it has crossed the border of any Enemy, 
 * then decrease Player lives amount, delete live item from the LIVES_CONTAINER 
 * and reset Player position to the initial state.
 */
Player.prototype.update = function() {
    if(!this.lives){
        displayMessage('lose', 'flex');
    }else{
        allEnemies.forEach(enemy => {
            if (Math.abs(this.x - enemy.x) < X_GAP && 
                Math.abs(this.y - enemy.y) < Y_GAP) {
                this.lives--;
                removeLivesFromContainer();
                resetPosition(this, INITIAL_X, INITIAL_Y);
            }
        });
    }   
};

/* This function resets Player lives to the initial state
 * and calls the function to append lives to the LIVES_CONTAINER 
 */
Player.prototype.resetLives = function (livesAmount){
    this.lives = livesAmount;
    appendLivesToContainer(this.lives);
}


/* This function handles user input and moves Player to the  
 * special position depending on condition. If user reached the first(finish) row
 * it displays greeting message. If Player reached the left/right canvas edge it 
 * transfers Player to the oposite canvas side. If Player reached canvas bottom it 
 * remains on its place.
 */
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


/*
 * This function sets Player coordinate depending on the key pressed 
 */
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

document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


/*
 * This function resets Player and Enemies position, Player's lives 
 * and Enemies speed to restart the game if the reset button is pressed
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

/*
 * This function appends lives to LIVES_CONTAINER.
 * It clears the container if some lives remainded from previous game attempt.
 */
function appendLivesToContainer(livesAmount){
    const fragment = document.createDocumentFragment();
    if(LIVES_CONTAINER.children.length){
        clearLivesContainer();
    }
    for (let i = 0; i < livesAmount; i++) {
        const img = document.createElement('img');
        img.src = LIVE_SPRITE;
        img.classList.add('hearts__image');
        fragment.appendChild(img);
    }
    LIVES_CONTAINER.appendChild(fragment);
}

/*
 * This function removes one live from the LIVES_CONTAINER.
 */
function removeLivesFromContainer(){
    LIVES_CONTAINER.removeChild(LIVES_CONTAINER.lastChild);
}

/*
 * This function removes all lives from the LIVES_CONTAINER.
 */
function clearLivesContainer(){
    while (LIVES_CONTAINER.firstChild) {
        LIVES_CONTAINER.removeChild(LIVES_CONTAINER.lastChild);
    }
}

function displayMessage(id, displayStyle){
    document.getElementById(id).style.display = displayStyle;
    //const fragment
}

const player = new Player();

for(let i = 0; i < ENEMIES_AMOUNT; i++){
    allEnemies.push(new Enemy(i+1));
}

/*
<div id="win" class="win message">
            <img src="images/bell.svg" class="message__border">
            <h1 class="message__header">Congrats!</h1>
            <p class="message__text">You've just successfully saved Xmas!</p>
            <button id="reset" class="reset-btn">
                <span class="reset-btn__box" id="reset">Play again!</span>
            </button>
        </div>*/