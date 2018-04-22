var
  snake, food, body, deadbody,
  oldsecond, newdir, newbody, oldfield,
  gameover, time, dir,
  seed, seedset, timelimit, scorelimit,
  speedslider, borderscheckbox, infinitycheckbox,
  replayinput,
  seedcheckbox, seedinput,
  timelimitcheckbox, timelimitinput,
  scorelimitcheckbox, scorelimitinput,
  speed, ticks, score, highscore, realscore,
  borders, infinity, biteoff,
  ftime, rtime, rindex, doReplay, replaySettings, replay;

const
  snakeColor = 'rgb(25, 118, 210)',
  bodyColor = 'rgb(30, 136, 229)',
  foodColor = 'rgb(244, 67, 54)',
  textColor1 = 'rgb(255, 255, 255)',
  textColor2 = 'rgb(229, 57, 53)',
  textColor3 = 'rgb(250, 250, 250)',
  bgColor1 = 'rgb(139, 195, 74)',
  bgColor2 = 'rgb(76, 175, 80)',
  bgColor3 = 'rgb(27, 94, 32)',
  bgColor4 = 'rgba(0, 0, 0, 0.3)',
  bgColor5 = 'rgb(224, 224, 224)';

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
  speedslider = createSlider(0, 25, 25);
  speedslider.position(768, 250);

  borderscheckbox = createCheckbox('', true);
  borderscheckbox.position(910, 276);

  biteoffcheckbox = createCheckbox('', false);
  biteoffcheckbox.position(910, 301);

  infinitycheckbox = createCheckbox('', false);
  infinitycheckbox.position(910, 326);

  seedcheckbox = createCheckbox('', false);
  seedcheckbox.position(910, 351);
  seedinput = createInput('');
  seedinput.position(770, 352);
  seedinput.attribute('maxlength', '12');

  timelimitcheckbox = createCheckbox('', false);
  timelimitcheckbox.position(910, 376);
  timelimitinput = createInput('');
  timelimitinput.position(770, 377);
  timelimitinput.attribute('maxlength', '12');

  scorelimitcheckbox = createCheckbox('', false);
  scorelimitcheckbox.position(910, 401);
  scorelimitinput = createInput('');
  scorelimitinput.position(770, 402);
  scorelimitinput.attribute('maxlength', '12');

  replayinput = createElement('textarea');
  replayinput.position(660, 480);
}

function disableSettings(t) {
  if (t) {
    borderscheckbox.attribute('disabled', '');
    biteoffcheckbox.attribute('disabled', '');
    infinitycheckbox.attribute('disabled', '');
    seedcheckbox.attribute('disabled', '');
    timelimitcheckbox.attribute('disabled', '');
    scorelimitcheckbox.attribute('disabled', '');
    seedinput.attribute('disabled', '');
    timelimitinput.attribute('disabled', '');
    scorelimitinput.attribute('disabled', '');
  } else {
    borderscheckbox.removeAttribute('disabled');
    biteoffcheckbox.removeAttribute('disabled');
    infinitycheckbox.removeAttribute('disabled');
    seedcheckbox.removeAttribute('disabled');
    timelimitcheckbox.removeAttribute('disabled');
    scorelimitcheckbox.removeAttribute('disabled');
    seedinput.removeAttribute('disabled');
    timelimitinput.removeAttribute('disabled');
    scorelimitinput.removeAttribute('disabled');
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
      rs['timelimit'] != undefined
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
  if (timelimitinput.value() < 0) {
    timelimitinput.value(0);
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
  if (timelimitcheckbox.checked() && !(isNaN(int(timelimitinput.value())))) {
    timelimit = round((int(timelimitinput.value()) / speed) * 60);
    if (timelimit == 0) {
      timelimit = false;
    }
  } else {
    timelimit = false;
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
    if (timelimit) {
      replaySettings['timelimit'] = round(((timelimit * speed) / 60));
    } else {
      replaySettings['timelimit'] = false;
    }
  }
  if (timelimit) {
    ticks = timelimit;
  } else {
    ticks = 0;
  }
}

function applyReplaySettings() {
  applyCustomReplay();
  borders = replaySettings['borders'];
  biteoff = replaySettings['biteoff'];
  infinity = replaySettings['infinity'];
  seed = replaySettings['seed'];
  scorelimit = replaySettings['scorelimit'];
  timelimit = replaySettings['timelimit'];

  borderscheckbox.checked(borders);
  biteoffcheckbox.checked(biteoff);
  infinitycheckbox.checked(infinity);
  seedcheckbox.checked(replaySettings['seedlocked']);
  seedinput.value(seed);
  if (timelimit) {
    timelimitinput.value(timelimit);
    timelimitcheckbox.checked(true);
  } else {
    timelimitcheckbox.checked(false);
  }
  if (scorelimit) {
    scorelimitinput.value(scorelimit);
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
  oldfield = {};
  if (!(doReplay)) {
    replay = [];
    replaySettings = {};
    replayinput.value("");
  }
  gameover = dir = newdir = seedset = false;
  snake = new Snake();
  food = new Food();
  time = score = rtime = ftime = ttime = realscore = 0;
}

function showOldfield() {
  oldfield['snake'].rotate();
  oldfield['snake'].show();
  oldfield['food'].pulsate();
  oldfield['food'].show();
  for (let i = 0; i < oldfield['body'].length; i++) {
    oldfield['body'][i].rotate();
    oldfield['body'][i].show();
  }
}

function saveOldfield() {
  let ns, nf;
  ns = new Snake(snake);
  ns.x = snake.x;
  ns.y = snake.y;
  oldfield['snake'] = ns;

  nf = new Food(food);
  nf.x = food.x;
  nf.y = food.y;
  nf.size = food.size;
  nf.pulsation = nf.pulsation;
  oldfield['food'] = nf;

  let nb = [];
  for (let i = 0; i < body.length; i++) {
    let p = body[i];
    let np = new Body();
    np.x = p.x;
    np.y = p.y;
    np.rotation = p.rotation;
    np.h = p.h;
    np.s = p.s;
    np.b = p.b;
    nb.push(np);
  }
  oldfield['body'] = nb;
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
    saveOldfield();
    if (time < speed) {
      time++;
      if (dir) {
        ttime++;
      }
    }
    if (time == speed) {
      if (timelimit && ticks == 0) {
        endGame();
      }
      ftime++;
      if (doReplay) {
        disableSettings(true);
        speed = 30 - speedslider.value();
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
        disableSettings(false);
      }
      if (dir) {
        if (timelimit) {
          ticks--
        } else {
          ticks++;
        }
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
      food = new Food();
      realscore++;
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
  text('Settings', 795, 235);
  text('Replay Data', 795, 460);

  textAlign(LEFT);
  textSize(18);
  text('Time:', 640, 55);
  text('Length:', 640, 80);
  text('Score:', 640, 105);
  text('Highscore:', 640, 130);
  text('Speedboost:', 640, 260);
  text('Borders:', 640, 285);
  text('Bite Off Mode:', 640, 310);
  text('Infinity Mode:', 640, 335);
  text('Seed:', 640, 360);
  text('Timelimit:', 640, 385);
  text('Scorelimit:', 640, 410);

  textAlign(RIGHT);
  text(((ticks * speed) / 60).toFixed(3), 940, 55);
  text(score, 940, 80);
  text(realscore, 940, 105);
  text(highscore, 940, 130);
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

  showOldfield();

  replayinput.value(JSON.stringify({
    'replaySettings': replaySettings,
    'replay': replay
  }, null, 1));

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