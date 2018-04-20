var snake, food, body, deadbody;
var oldsecond, newdir, newbody;
var gameover, time, dir;
var seed, seedset, ticklimit, scorelimit;
var speedslider, borderscheckbox, infinitycheckbox;
var replayinput;
var seedcheckbox, seedinput;
var ticklimitcheckbox, ticklimitinput;
var scorelimitcheckbox, scorelimitinput;
var speed, ticks, score, highscore;
var borders, infinity, biteoff;
var ftime, rtime, rindex, doReplay, replaySettings, replay;

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
  createCanvas(950, 632);
  rectMode(CENTER);
  frameRate(60);

  highscore = 0; // Move to initVars()?
  initInputs();
  newSeed();
  newGame();
}

function draw() {
  background(bgColor1);
  showField();
  showSidebar();
  playGame();
}

function keyPressed() {
  if ([37, 38, 39, 40].indexOf(keyCode) != -1) {
    seedinput.value(seed);
    if (
      ((dir - keyCode == 2 || dir - keyCode == -2)) && body.length > 0 &&
      infinity && biteoff
    ) {
      deadbody.push(new DeadBody(body[0], snake));
      body.splice(0, 1);
    }
    if ((dir - keyCode != 2 && dir - keyCode != -2) || infinity) {
      newdir = keyCode;
    }
  } else if (['R', 'r'].indexOf(key) != -1) {
    doReplay = false;
    if (!(seedcheckbox.checked())) {
      newSeed();
    }
    newGame();
    applySettings();
  } else if (['F', 'f'].indexOf(key) != -1) {
    if (gameover || (replayinput.value() != "" && isValidJson(replayinput.value()))) {
      doReplay = true;
      applyReplaySettings();
      newGame();
    }
  } else if (['K', 'k'].indexOf(key) != -1) {
    replay.push(ticks + 1, 0);
    gameover = true;
  }
}

function isValidJson(js) {
  try {
    JSON.parse(js);
  } catch (e) {
    return false;
  }
  return true;
}

function initInputs() {
  speedslider = createSlider(0, 29, 25);
  speedslider.position(765, 249);
  speedslider.style('width', '100px');
  speedslider.style('height', '25px');
  speedslider.style('background-color', bgColor3);

  borderscheckbox = createCheckbox('', true);
  borderscheckbox.position(910, 280);
  borderscheckbox.style('background-color', bgColor3);

  biteoffcheckbox = createCheckbox('', false);
  biteoffcheckbox.position(910, 305);
  biteoffcheckbox.style('background-color', bgColor3);

  infinitycheckbox = createCheckbox('', false);
  infinitycheckbox.position(910, 330);
  infinitycheckbox.style('background-color', bgColor3);

  seedcheckbox = createCheckbox('', false);
  seedcheckbox.position(910, 355);
  seedcheckbox.style('background-color', bgColor3);
  seedinput = createInput('');
  seedinput.position(770, 354);
  seedinput.style('width', '105px');
  seedinput.style('height', '21px');
  seedinput.style('background-color', bgColor3);
  seedinput.style('color', textColor1);
  seedinput.style('border-color', bgColor2);
  seedinput.style('border-style', 'solid');
  seedinput.style('text-align', 'center');
  seedinput.style('outline', 'none');
  seedinput.attribute('maxlength', '12');

  ticklimitcheckbox = createCheckbox('', false);
  ticklimitcheckbox.position(910, 380);
  ticklimitcheckbox.style('background-color', bgColor3);
  ticklimitinput = createInput('');
  ticklimitinput.position(770, 379);
  ticklimitinput.style('width', '105px');
  ticklimitinput.style('height', '21px');
  ticklimitinput.style('background-color', bgColor3);
  ticklimitinput.style('color', textColor1);
  ticklimitinput.style('border-color', bgColor2);
  ticklimitinput.style('border-style', 'solid');
  ticklimitinput.style('text-align', 'center');
  ticklimitinput.style('outline', 'none');
  ticklimitinput.attribute('maxlength', '12');

  scorelimitcheckbox = createCheckbox('', false);
  scorelimitcheckbox.position(910, 405);
  scorelimitcheckbox.style('background-color', bgColor3);
  scorelimitinput = createInput('');
  scorelimitinput.position(770, 404);
  scorelimitinput.style('width', '105px');
  scorelimitinput.style('height', '21px');
  scorelimitinput.style('background-color', bgColor3);
  scorelimitinput.style('color', textColor1);
  scorelimitinput.style('border-color', bgColor2);
  scorelimitinput.style('border-style', 'solid');
  scorelimitinput.style('text-align', 'center');
  scorelimitinput.style('outline', 'none');
  scorelimitinput.attribute('maxlength', '12');

  replayinput = createElement('textarea');
  replayinput.position(660, 480);
  replayinput.style('width', '280px');
  replayinput.style('height', '150px');
  replayinput.style('background-color', bgColor3);
  replayinput.style('color', textColor1);
  replayinput.style('border-color', bgColor2);
  replayinput.style('border-style', 'solid');
  replayinput.style('outline', 'none');
  replayinput.style('resize', 'none');
  replayinput.style('overflow', 'hidden');
  replayinput.id('ri');
  document.getElementById('ri').onclick = function() {
    this.focus();
    this.select();
  }
}

function applyCustomReplay() {
  let r, rs, js;
  if (replayinput.value() != "" && isValidJson(replayinput.value())) {
    js = JSON.parse(replayinput.value());
    rs = js['replaySettings'];
    r = js['replay'];
    if (
      r != undefined &&
      r.length % 2 == 0 &&
      rs['borders'] != undefined &&
      rs['biteoff'] != undefined &&
      rs['infinity'] != undefined &&
      rs['seed'] != undefined &&
      rs['seedlocked'] != undefined &&
      rs['scorelimit'] != undefined &&
      rs['ticklimit'] != undefined
    ) {
      replaySettings = rs;
      replay = r;
    }
  }
}

function applySettings() {
  speed = 30 - (speedslider.value());
  borders = borderscheckbox.checked();
  biteoff = biteoffcheckbox.checked();
  infinity = infinitycheckbox.checked();
  if (ticklimitinput.value() < 0) {
    ticklimitinput.value(0);
  }
  if (scorelimitinput.value() < 0) {
    scorelimitinput.value(0);
  }
  if (seed != int(seedinput.value()) && !(isNaN(int(seedinput.value())))) {
    if (seedinput.value()) {
      seed = int(seedinput.value());
      if (!(gameover)) {
        newGame();
      }
    }
  }
  if (ticklimitcheckbox.checked() && !(isNaN(int(ticklimitinput.value())))) {
    ticklimit = int(ticklimitinput.value());
    if (ticklimit == 0) {
      ticklimit = false;
    }
  } else {
    ticklimit = false;
  }
  if (
    scorelimitcheckbox.checked() && !(isNaN(int(scorelimitinput.value())))
  ) {
    scorelimit = int(scorelimitinput.value());
  } else {
    scorelimit = false;
  }
  if (!(gameover)) {
    applyCustomReplay();
    replaySettings['borders'] = borders;
    replaySettings['biteoff'] = biteoff;
    replaySettings['infinity'] = infinity;
    replaySettings['seed'] = seed;
    replaySettings['seedlocked'] = seedcheckbox.checked();
    replaySettings['scorelimit'] = scorelimit;
    replaySettings['ticklimit'] = ticklimit;
  }
}

function applyReplaySettings() {
  applyCustomReplay();
  borders = replaySettings['borders'];
  biteoff = replaySettings['biteoff'];
  infinity = replaySettings['infinity'];
  seed = replaySettings['seed'];
  scorelimit = replaySettings['scorelimit'];
  ticklimit = replaySettings['ticklimit'];

  borderscheckbox.checked(borders);
  biteoffcheckbox.checked(biteoff);
  infinitycheckbox.checked(infinity);
  seedcheckbox.checked(replaySettings['seedlocked']);
  seedinput.value(seed);
  if (ticklimit) {
    ticklimitinput.value(ticklimit);
    ticklimitcheckbox.checked(true);
  } else {
    ticklimitcheckbox.checked(false);
  }
  if (scorelimit) {
    scorelimitcheckbox.checked(true);
  } else {
    scorelimitcheckbox.checked(false);
  }
}

function newSeed() {
  seed = round(random(999999999999));
  seedinput.value(seed);
}

function calcScore(l) {
  return ((31 - speed) * l);
}

function newGame() {
  body = [];
  deadbody = [];
  if (!(doReplay)) {
    replay = [];
    replaySettings = {};
    replayinput.value("");
  }
  gameover = dir = newdir = seedset = false;
  snake = new Snake();
  food = new Food(snake, []);
  time = score = rtime = ftime = ttime = 0;
  if (ticklimit) {
    ticks = ticklimit;
  } else {
    ticks = 0;
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
      if (dir) {
        ttime++;
      }
    }
    if (time == speed) {
      if (ticklimit && ticks == 0) {
        endGame();
      }
      ftime++;
      if (doReplay) {
        speed = 30 - (speedslider.value());
        rindex = replay.indexOf(ftime);
        if (rindex != -1) {
          if (replay[rindex + 1] == 0) {
            gameover = true;
          } else {
            dir = abs(replay[rindex + 1]);
          }
        }
      } else {
        dir = newdir;
      }
      if (dir) {
        ticks++;
        rtime++;
        if (
          replay[replay.length - 1] != dir - (dir * 2) &&
          dir != 0 && newdir != 0
        ) {
          replay.push(rtime);
          replay.push(newdir - (newdir * 2));
        }
      }
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
      if (highscore <= score) {
        highscore++;
      }
      if (body.length == 0) {
        newbody = new Body(snake);
      } else {
        newbody = new Body(body[body.length - 1])
      }
      newbody.rotation = 1;
      body.push(newbody);
    }
    if (!(borders)) {
      snake.teleport();
    }
  }

  score = body.length;
  if (scorelimit && score == scorelimit) {
    endGame();
  }
  gameover = snake.gameover(body);

  if (gameover) {
    endGame();
  } else {
    showGame();
    food = snake.eat(food, body);
  }
}

function showGame() {
  deadbody.forEach(deadpart => {
    deadpart.show();
    deadpart.decay();
  });
  body.forEach(part => {
    part.rotate();
    part.show();
  });
  snake.show();
  snake.rotate();
  food.pulsate();
  food.show();
}

function showSidebar() {
  fill(bgColor3);
  strokeWeight(0);
  rect(791, 316, 318, 632);

  fill(textColor1);

  textAlign(CENTER);
  textSize(20);
  text('Stats', 795, 30);
  text('Controls', 795, 145);
  text('Settings', 795, 235);
  text('Replay Data', 795, 460);

  textAlign(LEFT);
  textSize(18);
  text('Time:', 640, 55);
  text('Score:', 640, 80);
  text('Highscore:', 640, 105);
  text('Movement:', 640, 170);
  text('Restart:', 640, 195);
  text('Speedboost:', 640, 260);
  text('Borders:', 640, 285);
  text('Bite Off Mode:', 640, 310);
  text('Infinity Mode:', 640, 335);
  text('Seed:', 640, 360);
  text('Ticklimit:', 640, 385);
  text('Scorelimit:', 640, 410);

  textAlign(RIGHT);
  text(((ticks * speed) / 60).toFixed(3), 940, 55);
  text(score, 940, 80);
  text(highscore, 940, 105);
  text('Arrow Keys', 940, 170);
  text('R', 940, 195);
  text(speedslider.value() / (25 / 100) + "%", 940, 260);
}

function showField() {
  fill(bgColor2);
  strokeWeight(0);
  for (let i = 2; i < 600; i += 42) {
    for (let j = 2; j < 600; j += 42) {
      rect(i + 20, j + 20, 40, 40);
    }
  }
}

function endGame() {
  doReplay = false;
  gameover = true;
  dir = false;

  replayinput.value(JSON.stringify({
    'replaySettings': replaySettings,
    'replay': replay
  }));

  fill(bgColor4);
  strokeWeight(0);
  rect(316, 295, 632, 254);

  fill(textColor2);
  textAlign(CENTER);
  stroke(textColor3);

  textSize(64);
  strokeWeight(3);
  text('GAME OVER!', 316, 260);

  textSize(32);
  strokeWeight(2);
  text('PRESS \'R\' TO RESTART', 316, 320);
  text('PRESS \'F\' TO WATCH REPLAY', 316, 375);
}