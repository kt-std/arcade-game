const numRows = 6;
const numCols = 5;
const rowHeight = 83;
const verticalStep = 83;
const horizontalStep = 101;/*
const initialPositionX = horizontalStep*Math.floor(numCols/2);
const initialPositionY = 100*(numRows-2);
*/const initialPositionX = 0;
const initialPositionY = (numRows-1)*(verticalStep-10);
const canvaStart = 0;
const CANVAS_WIDTH = 505;
const CANVAS_HEIGHT = 600;
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player our player must avoid
var Player = function() {
    /*this.x = 101*2;
    this.y = 101*4;*/
    this.y = initialPositionY;
    this.x = initialPositionX;
    this.sprite = 'images/char-boy.png';
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    console.log(`Player x:${this.x} y:${this.y}`);
};

Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.   

};

Player.prototype.handleInput = function(key) {
    if (this.y >= canvaStart && this.x >= canvaStart && this.y <= initialPositionY && this.x < CANVAS_WIDTH) {
        move(this, key);
    }else if(this.y > initialPositionY || this.y < canvaStart){
        this.y = initialPositionY;
    }else if(this.x >= CANVAS_WIDTH){
        this.x = canvaStart;
    }else if(this.x < canvaStart){
        this.x = CANVAS_WIDTH - horizontalStep;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
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
    console.log(allowedKeys[e.keyCode]);
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