var snake, body, food;
var oldsecond, newdir;
var gameover, time, dir;
var speedslider, borderscheckbox, infinitycheckbox;
var score, speed, stime, length, borders, infinity, biteoff;

const snakeColor = 'rgb(25, 118, 210)';
const bodyColor = 'rgb(30, 136, 229)';
const foodColor1 = 'rgb(244, 67, 54)';
const foodColor2 = 'rgb(244, 67, 54)';
const textColor1 = 'rgb(255, 255, 255)';
const textColor2 = 'rgb(229, 57, 53)';
const textColor3 = 'rgb(250, 250, 250)';
const bgColor1 = 'rgb(139, 195, 74)';
const bgColor2 = 'rgb(76, 175, 80)';
const bgColor3 = 'rgb(27, 94, 32)';
const bgColor4 = 'rgba(0, 0, 0, 0.3)';

function preload() {}

function setup() {
  createCanvas(902, 602);
  initInputs();
  newGame();
}

function draw() {
  translate(1, 1);
  frameRate(60);
  background(bgColor1);

  showField();
  showSidebar();
  playGame();
}

function initInputs() {
  speedslider = createSlider(0, 29, 25);
  speedslider.style('width', '100px');
  speedslider.position(735, 251);
  borderscheckbox = createCheckbox('', true);
  borderscheckbox.style('background-color', bgColor3);
  borderscheckbox.position(880, 280);
  biteoffcheckbox = createCheckbox('', false);
  biteoffcheckbox.style('background-color', bgColor3);
  biteoffcheckbox.position(880, 305);
  infinitycheckbox = createCheckbox('', false);
  infinitycheckbox.style('background-color', bgColor3);
  infinitycheckbox.position(880, 330);
}

function newGame() {
  body = [];
  snake = new Snake();
  food = new Food(snake, []);
  time = score = stime = length = 0;
  gameover = dir = newdir = false;
  applySettings();
  oldsecond = second();
}

function calcScore(l) {
  let m = 1.0;
  if (!(borders)) {
    m -= 0.5;
  }
  if (biteoff) {
    m -= 0.40;
  }
  if (infinity && biteoff) {
    m = 0.05;
  } else if (infinity && (!biteoff)) {
    m = 0.01;
  }
  return (round((31 - speed) * l * 100 * m));
}

function showSidebar() {
  fill(bgColor3);
  strokeWeight(0);
  rect(601, -1, 301, 602);

  fill(textColor1);

  textAlign(CENTER);
  textSize(20);
  text('Stats', 755, 30);
  text('Controls', 755, 145);
  text('Settings', 755, 235);
  text('Info', 755, 375);

  textAlign(LEFT);
  textSize(18);
  text('Time:', 610, 55);
  text('Score:', 610, 80);
  text('Length:', 610, 105);
  text('Movement:', 610, 170);
  text('Restart:', 610, 195);
  text('Speedboost:', 610, 260);
  text('Borders:', 610, 285);
  text('Bite Off Mode:', 610, 310);
  text('Infinity:', 610, 335);
  text('Score per length:', 610, 400);

  textAlign(RIGHT);
  text(stime, 890, 55);
  text(score, 890, 80);
  text(length, 890, 105);
  text('Arrow Keys', 890, 170);
  text('R', 890, 195);
  text(speedslider.value() / (25 / 100) + "%", 890, 260);
  text(calcScore(1), 890, 400);
}

function showField() {
  fill(bgColor2);
  strokeWeight(0);
  for (let i = 0; i < 600; i += 40) {
    for (let j = 0; j < 600; j += 40) {
      rect(i + 1, j + 1, 38, 38);
    }
  }
}

function showGame() {
  food.show();
  body.forEach(part => {
    part.show();
  });
  snake.show();
}

function endGame() {
  fill(bgColor4);
  strokeWeight(0);
  rect(-1, 199, 602, 202);

  fill(textColor2);
  textAlign(CENTER);
  stroke(textColor3);

  textSize(64);
  strokeWeight(3);
  text('GAME OVER!', 300, 300);

  textSize(32);
  strokeWeight(2);
  text('PRESS \'R\' TO RESTART', 300, 350);
}

function applySettings() {
  speed = 30 - (speedslider.value());
  borders = borderscheckbox.checked();
  biteoff = biteoffcheckbox.checked();
  infinity = infinitycheckbox.checked();
}

function playGame() {
  if (gameover || stime == 0) {
    applySettings();
  }
  if (infinity) {
    borders = false;
    borderscheckbox.checked(false);
  }

  if (!(gameover)) {
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
      if (body.length == 0) {
        body.push(new Body(snake));
      } else {
        body.push(new Body(body[body.length - 1]));
      }
    }
    if (!(borders)) {
      snake.teleport();
    }
  }

  food.pulsate();
  length = body.length;
  gameover = snake.gameover(body);

  if (gameover) {
    endGame();
  } else {
    showGame();
    food = snake.eat(food);
    score = calcScore(length);
    if (!(dir)) {
      oldsecond = second();
    }
    if (oldsecond != second()) {
      stime++;
      oldsecond = second();
    }
  }
}

function keyPressed() {
  if ([37, 38, 39, 40].indexOf(keyCode) != -1) {
    if ((dir - keyCode != 2 && dir - keyCode != -2) || infinity) {
      newdir = keyCode;
    }
  } else if (["R", "r"].indexOf(key) != -1) {
    newGame();
  }
}