var snake, body, food;
var oldsecond, newdir;
var gameover, time, dir;
var seed, seedset, timelimit, scorelimit;
var speedslider, borderscheckbox, infinitycheckbox;
var seedcheckbox, seedinput;
var timelimitcheckbox, timelimitinput;
var scorelimitcheckbox, scorelimitinput;
var speed, stime, score;
var borders, infinity, biteoff;

const snakeColor = 'rgb(25, 118, 210)';
const bodyColor = 'rgb(30, 136, 229)';
const foodColor = 'rgb(244, 67, 54)';

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
  newSeed();
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
  speedslider.position(735, 226);
  speedslider.style('width', '100px');

  borderscheckbox = createCheckbox('', true);
  borderscheckbox.position(880, 255);
  borderscheckbox.style('background-color', bgColor3);

  biteoffcheckbox = createCheckbox('', false);
  biteoffcheckbox.position(880, 280);
  biteoffcheckbox.style('background-color', bgColor3);

  infinitycheckbox = createCheckbox('', false);
  infinitycheckbox.position(880, 305);
  infinitycheckbox.style('background-color', bgColor3);

  seedcheckbox = createCheckbox('', false);
  seedcheckbox.position(880, 330);
  seedcheckbox.style('background-color', bgColor3);
  seedinput = createInput('');
  seedinput.position(725, 329);
  seedinput.style('width', '105px');
  seedinput.style('height', '21px');
  seedinput.style('background-color', bgColor3);
  seedinput.style('color', textColor1);
  seedinput.style('border-color', bgColor2);
  seedinput.style('border-style', 'solid');
  seedinput.style('text-align', 'center');
  seedinput.attribute('maxlength', '12');

  timelimitcheckbox = createCheckbox('', false);
  timelimitcheckbox.position(880, 355);
  timelimitcheckbox.style('background-color', bgColor3);
  timelimitinput = createInput('');
  timelimitinput.position(725, 354);
  timelimitinput.style('width', '105px');
  timelimitinput.style('height', '21px');
  timelimitinput.style('background-color', bgColor3);
  timelimitinput.style('color', textColor1);
  timelimitinput.style('border-color', bgColor2);
  timelimitinput.style('border-style', 'solid');
  timelimitinput.style('text-align', 'center');
  timelimitinput.attribute('maxlength', '12');

  scorelimitcheckbox = createCheckbox('', false);
  scorelimitcheckbox.position(880, 380);
  scorelimitcheckbox.style('background-color', bgColor3);
  scorelimitinput = createInput('');
  scorelimitinput.position(725, 379);
  scorelimitinput.style('width', '105px');
  scorelimitinput.style('height', '21px');
  scorelimitinput.style('background-color', bgColor3);
  scorelimitinput.style('color', textColor1);
  scorelimitinput.style('border-color', bgColor2);
  scorelimitinput.style('border-style', 'solid');
  scorelimitinput.style('text-align', 'center');
  scorelimitinput.attribute('maxlength', '12');
}

function newGame() {
  body = [];
  gameover = dir = newdir = seedset = false;
  snake = new Snake();
  food = new Food(snake, []);
  time = score = stime = 0;
  oldsecond = second();
}

function newSeed() {
  seed = round(random(999999999999));
  seedinput.value(seed);
}

function calcScore(l) {
  return ((31 - speed) * l);
}

function showSidebar() {
  fill(bgColor3);
  strokeWeight(0);
  rect(601, -1, 301, 602);

  fill(textColor1);

  textAlign(CENTER);
  textSize(20);
  text('Stats', 755, 30);
  text('Controls', 755, 120);
  text('Settings', 755, 210);

  textAlign(LEFT);
  textSize(18);
  text('Time:', 610, 55);
  text('Score:', 610, 80);
  text('Movement:', 610, 145);
  text('Restart:', 610, 170);
  text('Speedboost:', 610, 235);
  text('Borders:', 610, 260);
  text('Bite Off Mode:', 610, 285);
  text('Infinity Mode:', 610, 310);
  text('Seed:', 610, 335);
  text('Timelimit:', 610, 360);
  text('Scorelimit:', 610, 385);

  textAlign(RIGHT);
  text(stime, 890, 55);
  text(score, 890, 80);
  text('Arrow Keys', 890, 145);
  text('R', 890, 170);
  text(speedslider.value() / (25 / 100) + "%", 890, 235);
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
  dir = false;

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
  if (timelimitinput.value() < 0) {
    timelimitinput.value(0);
  }
  if (scorelimitinput.value() < 0) {
    scorelimitinput.value(0);
  }
  if (seed != int(seedinput.value())) {
    if (seedinput.value()) {
      seed = int(seedinput.value());
      if (!(gameover)) {
        newGame();
      }
    }
  }
  if (timelimitcheckbox.checked() && !(isNaN(int(timelimitinput.value())))) {
    timelimit = int(timelimitinput.value());
    if (timelimit == 0) {
      timelimit = false;
    }
  } else {
    timelimit = false;
  }
  if (timelimit) {
    stime = timelimit;
  } else {
    stime = 0;
  }
  if (
    scorelimitcheckbox.checked() && !(isNaN(int(scorelimitinput.value())))
  ) {
    scorelimit = int(scorelimitinput.value());
  } else {
    scorelimit = false;
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
  score = body.length;
  if (scorelimit && score == scorelimit) {
    endGame();
  }
  gameover = snake.gameover(body);

  if (gameover) {
    endGame();
  } else {
    showGame();
    food = snake.eat(food);
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
    seedinput.value(seed);
    if ((dir - keyCode != 2 && dir - keyCode != -2) || infinity) {
      newdir = keyCode;
    }
  } else if (["R", "r"].indexOf(key) != -1) {
    if (!(seedcheckbox.checked())) {
      newSeed();
    }
    newGame();
    applySettings();
  }
}