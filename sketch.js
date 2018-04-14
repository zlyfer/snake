var score, speed, stime, length, borderkill;
var snake, body, food;
var oldsecond, newdir;
var speedslider, borderkillcheckbox;
var gameover, time;
var dir;

function preload() {}

function setup() {
  createCanvas(854, 604);

  initInputs();
  newGame();
}

function draw() {
  translate(2, 2);
  frameRate(60);
  background(100);

  showField();
  showSidebar();

  gameover = snake.gameover(body);
  if (gameover) {
    endGame();
  } else {
    playGame();
  }
}

function initInputs() {
  speedslider = createSlider(5, 25, 22);
  speedslider.position(720, 550);
  speedslider.style('width', '125px');
  borderkillcheckbox = createCheckbox('', true);
  borderkillcheckbox.style('background-color', 'rgb(244, 67, 54)');
  borderkillcheckbox.position(830, 580);
}

function newGame() {
  var ix = random([2, 7, 12]) * 40;
  var iy = random([2, 7, 12]) * 40;
  body = [];
  snake = new Snake(ix, iy, 40);
  food = new Food(snake, body);
  time = score = stime = length = 0;
  gameover = dir = newdir = false;
  oldsecond = second();
  speed = 30 - (speedslider.value());
  borderkill = borderkillcheckbox.checked();
}

function showSidebar() {
  strokeWeight(0);
  fill(244, 67, 54);
  rect(602, -2, 250, 604);

  fill(33);
  textAlign(LEFT);

  textSize(20);
  text('Settings', 610, 535);

  textSize(18);
  text('Speed', 610, 560);
  text('Borderkill', 610, 585);

  textSize(20);

  textAlign(LEFT);
  text('Speed:', 610, 25);
  text('Time:', 610, 50);
  text('Score:', 610, 75);
  text('Food:', 610, 100);

  textAlign(RIGHT);
  text(speedslider.value() / (25 / 100) + "%", 840, 25);
  text(stime, 840, 50);
  text(score, 840, 75);
  text(length, 840, 100);
}

function showField() {
  strokeWeight(0);
  fill(200);
  for (let i = 0; i < 600; i += 40) {
    for (let j = 0; j < 600; j += 40) {
      rect(i + 1, j + 1, 38, 38);
    }
  }
}

function showGame() {
  food.show();
  snake.show();
  body.forEach(part => {
    part.show();
  });
}

function endGame() {
  stroke(255);
  strokeWeight(3);
  fill(229, 57, 53);
  textAlign(CENTER);

  textSize(64);
  text('GAME OVER!', 300, 300);
  textSize(32);
  text('PRESS \'R\' TO RESTART', 300, 350);
}

function playGame() {
  if (gameover || stime == 0) {
    speed = 30 - (speedslider.value());
  }
  if (time < speed) {
    time++;
  }

  if (time == speed) {
    dir = newdir;
    if (body.length > 0) {
      for (let i = body.length - 1; i >= 0; i--) {
        body[i].follow();
      }
    }
    snake.move(dir);
    time = 0;
  }

  if (!(food)) {
    food = new Food(snake, body);
    length++;
    if (body.length == 0) {
      body.push(new Body(snake));
    } else {
      body.push(new Body(body[body.length - 1]));
    }
  }

  food.pulsate();
  if (!(borderkill)) {
    snake.teleport();
  }
  showGame();

  food = snake.eat(food);
  if (borderkill) {
    score = round((26 - speed) * length);
  } else {
    score = round((26 - speed) * (length / 2));
  }
  if (!(dir)) {
    oldsecond = second();
  }
  if (oldsecond != second()) {
    stime++;
    oldsecond = second();
  }
}

function keyPressed() {
  if ([37, 38, 39, 40].indexOf(keyCode) != -1) {
    if (dir - keyCode != 2 && dir - keyCode != -2) {
      newdir = keyCode;
    }
  } else if (["R", "r"].indexOf(key) != -1) {
    newGame();
  }
}