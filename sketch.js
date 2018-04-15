var snake, body, food;
var oldsecond, newdir;
var gameover, time, dir, seed, timelimit;
var speedslider, borderscheckbox, infinitycheckbox;
var seedcheckbox, seedinput;
var timelimitcheckbox, timelimitinput;
var lengthlimitcheckbox, lengthlimitinput;
var score, speed, stime, length;
var borders, infinity, biteoff;

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
  speedslider.position(735, 251);
  speedslider.style('width', '100px');

  borderscheckbox = createCheckbox('', true);
  borderscheckbox.position(880, 280);
  borderscheckbox.style('background-color', bgColor3);

  biteoffcheckbox = createCheckbox('', false);
  biteoffcheckbox.position(880, 305);
  biteoffcheckbox.style('background-color', bgColor3);

  infinitycheckbox = createCheckbox('', false);
  infinitycheckbox.position(880, 330);
  infinitycheckbox.style('background-color', bgColor3);

  seedcheckbox = createCheckbox('', false);
  seedcheckbox.position(880, 355);
  seedcheckbox.style('background-color', bgColor3);
  seedinput = createInput('');
  seedinput.position(735, 355);
  seedinput.style('width', '100px');
  seedinput.style('height', '20px');
  seedinput.style('background-color', bgColor3);
  seedinput.style('color', textColor1);
  seedinput.style('border-color', bgColor2);
  seedinput.style('border-style', 'solid');
  seedinput.style('text-align', 'center');
  seedinput.attribute('maxlength', '12');

  timelimitcheckbox = createCheckbox('', false);
  timelimitcheckbox.position(880, 380);
  timelimitcheckbox.style('background-color', bgColor3);
  timelimitinput = createInput('');
  timelimitinput.position(735, 380);
  timelimitinput.style('width', '100px');
  timelimitinput.style('height', '20px');
  timelimitinput.style('background-color', bgColor3);
  timelimitinput.style('color', textColor1);
  timelimitinput.style('border-color', bgColor2);
  timelimitinput.style('border-style', 'solid');
  timelimitinput.style('text-align', 'center');
  timelimitinput.attribute('maxlength', '12');

  lengthlimitcheckbox = createCheckbox('', false);
  lengthlimitcheckbox.position(880, 405);
  lengthlimitcheckbox.style('background-color', bgColor3);
  lengthlimitinput = createInput('');
  lengthlimitinput.position(735, 405);
  lengthlimitinput.style('width', '100px');
  lengthlimitinput.style('height', '20px');
  lengthlimitinput.style('background-color', bgColor3);
  lengthlimitinput.style('color', textColor1);
  lengthlimitinput.style('border-color', bgColor2);
  lengthlimitinput.style('border-style', 'solid');
  lengthlimitinput.style('text-align', 'center');
  lengthlimitinput.attribute('maxlength', '12');
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
  text('Info', 755, 450);

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
  text('Seed:', 610, 360);
  text('Timelimit:', 610, 385);
  text('Lengthlimit:', 610, 410);
  text('Score per length:', 610, 475);

  textAlign(RIGHT);
  text(stime, 890, 55);
  text(score, 890, 80);
  text(length, 890, 105);
  text('Arrow Keys', 890, 170);
  text('R', 890, 195);
  text(speedslider.value() / (25 / 100) + "%", 890, 260);
  text(calcScore(1), 890, 475);
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
  gameover = true;

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
  if (seedcheckbox.checked() && !(isNaN(int(seedinput.value())))) {
    seed = int(seedinput.value());
  } else {
    seed = false;
  }
  if (timelimitcheckbox.checked() && !(isNaN(int(timelimitinput.value())))) {
    timelimit = int(timelimitinput.value());
    if (timelimit == 0) {
      timelimit = false;
    }
  } else {
    timelimit = false;
  }
  if (lengthlimitcheckbox.checked() && !(isNaN(int(lengthlimitinput.value())))) {
    lengthlimit = int(lengthlimitinput.value());
  } else {
    lengthlimit = false;
  }
  if (timelimit) {
    stime = timelimit;
  } else {
    stime = 0;
  }
}

function playGame() {
  if (!(dir)) {
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
      if (timelimit && stime == 0) {
        endGame();
      }
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
  if (lengthlimit && length == lengthlimit) {
    endGame();
  }
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
      if (timelimit) {
        stime--;
      } else {
        stime++;
      }
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