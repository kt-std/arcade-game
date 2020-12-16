const numRows = 6;
const numCols = 5;
const rowHeight = 60;
const verticalStep = 60;
const horizontalStep = 70;/*
const initialPositionX = horizontalStep*Math.floor(numCols/2);
const initialPositionY = 100*(numRows-2);
*/
const initialPositionX = horizontalStep*Math.floor(numCols/2);
const initialPositionY = (numRows-1)*verticalStep;
const canvaStart = 0;
const CANVAS_WIDTH = numCols*horizontalStep;
const CANVAS_HEIGHT = numRows*horizontalStep;

// Enemies our player must avoid
var Enemy = function(index) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = canvaStart;
    this.speed = Math.random()*100;
    this.y = verticalStep*(index);
    this.sprite = 'images/yeti.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (Math.abs(player.x - this.x) < horizontalStep/2 && Math.abs(player.y - this.y) < verticalStep/2) {
        alert('game over');
    }
    this.speed += 0.05; 
    this.x = this.checkPosition(this.x + dt*this.speed);


};


Enemy.prototype.checkPosition = function(position){
    return position > CANVAS_WIDTH + horizontalStep/2 
      ? canvaStart - horizontalStep
      : position;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player our player must avoid
var Player = function() {
    this.y = initialPositionY;
    this.x = initialPositionX;
    this.sprite = 'images/santa.png';
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function(dt) {
   
};

Player.prototype.handleInput = function(key) {

    move(this, key);
    if(!this.y){
        alert('Win!');
    }else if(this.y > initialPositionY) {
        this.y = initialPositionY; 
    }else if(this.x >= CANVAS_WIDTH){
        this.x = canvaStart;
    }else if(this.x < canvaStart){
        this.x = CANVAS_WIDTH - horizontalStep;
    }
    console.log(`x:${this.x} y:${this.y}`);
};

var allEnemies = [];
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
for(var i = 1; i < 4; i++){
    allEnemies.push(new Enemy(i));
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