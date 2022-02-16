const field = document.getElementById('field')
const ctx = field.getContext("2d");

let direction;
let fraim = 25;
let score = 0;
let highScore = 0; 

let ground = new Image()
ground.src = "src/images/ground.png"


let img = new Image()
img.src = "src/images/food.png"

var snake = []
snake[0] = {x: 0,
            y: 0};

var food = {
    x: 25,
    y: 0
}

function generateFood() {
    let field = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 24; j++) {
        field.push({ x: i * 25, y: j * 25 });
      }
    }

    field = field.filter(
      (item) => !snake.find((body) => item.x === body.x && item.y === body.y)
    );
    food = field[getRandomInt(field.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function keyOptions(e){
    if(e.keyCode === 38 && direction !== "down"){
        direction = "up";
    }
    else if(e.keyCode === 40 && direction !== "up"){
        direction = "down";
    }
    else if(e.keyCode === 37 && direction !== "right"){
        direction = "left";
    }
    else if(e.keyCode === 39 && direction !== "left"){
        direction = "right";
    }
}

document.addEventListener("keydown", keyOptions);

function limitField(j){
    if(j >= 600){
        return 0;
    }
    if(j < 0){
        return 575;
    }

    return j;
}

function checkCollisionWithBody() {
    return snake.find((item, index) => index !== 0 && item.x === snake[0].x && item.y === snake[0].y)
}

function save(score){
    window.localStorage.getItem('BestScore', 0)
    if(window.localStorage.getItem('BestScore') < score){
        window.localStorage.removeItem('BestScore');
        window.localStorage.setItem('BestScore',score);
    }
    return window.localStorage.getItem('BestScore');
}

function touchWithBody() {
	if(checkCollisionWithBody()){
		clearInterval(game);
        if(score == 576){
            document.getElementById("endScreen").style.display = "flex"
            document.getElementById("title").innerText = "Game complete"
            document.getElementById("score").innerText = `Score: ${score}.BestScore: ${save(score)}`
        }else{
            document.getElementById("endScreen").style.display = "flex"
            document.getElementById("title").innerText = "Snake died"
            document.getElementById("score").innerText = `Score: ${score}.BestScore: ${save(score)}`
        }   
	}
}

function DrawMain(){
    ctx.drawImage(ground, 0,0,600,600);

    ctx.drawImage(img, food.x,food.y,25,25);
    
    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = i == 0? 'orange' : i % 2 == 0 ? 'yellow' : 'red';
        ctx.fillRect(snake[i].x, snake[i].y, 25, 25);
    }

    ctx.fillStyle = "red";
    ctx.font = "bold 25px serif";
    ctx.fillText(score, 550, 40);
    ctx.drawImage(img,  500, 17, 25, 25);

    let snakeX = snake[0].x
    let snakeY = snake[0].y

    if(snakeX === food.x && snakeY === food.y) {
        score++;
		generateFood()
	} else{
		snake.pop();
    }
    
    if(direction == "left") snakeX = limitField(snakeX - fraim);
    if(direction == "right") snakeX = limitField(snakeX + fraim);
    if(direction == "up") snakeY = limitField(snakeY - fraim);
    if(direction == "down") snakeY = limitField(snakeY + fraim);

    let newHead = {
        x: snakeX,
        y: snakeY
    };
    
    touchWithBody();
    
    snake.unshift(newHead);
}

let game = setInterval(DrawMain, 100)


