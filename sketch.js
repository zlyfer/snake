// jshint esversion: 6

var snake,
  food,
  body,
  deadbody,
  oldsecond,
  newdir,
  newbody,
  oldfield,
  gameover,
  paused,
  time,
  dir,
  seed,
  seedset,
  timelimit,
  scorelimit,
  speedslider,
  borderscheckbox,
  infinitycheckbox,
  squarefieldcheckbox,
  replayinput,
  seedcheckbox,
  seedinput,
  timelimitcheckbox,
  timelimitinput,
  scorelimitcheckbox,
  scorelimitinput,
  speed,
  ticks,
  score,
  highscore,
  realscore,
  borders,
  infinity,
  biteoff,
  ftime,
  rtime,
  rindex,
  doReplay,
  replaySettings,
  replay,
  sidebarWidth,
  fieldSize;

const snakeColor = "rgb(25, 118, 210)",
  bodyColor = "rgb(30, 136, 229)",
  foodColor = "rgb(244, 67, 54)",
  textColor1 = "rgb(255, 255, 255)",
  textColor2 = "rgb(229, 57, 53)",
  textColor3 = "rgb(250, 250, 250)",
  bgColor1 = "rgb(139, 195, 74)",
  bgColor2 = "rgb(76, 175, 80)",
  bgColor3 = "rgb(27, 94, 32)",
  bgColor4 = "rgba(0, 0, 0, 0.3)",
  bgColor5 = "rgb(22, 22, 22)";

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sidebarWidth = windowWidth / 6.5;
  fieldSize = {
    w: floor((width - sidebarWidth) / 40),
    h: floor(height / 42),
  };
  console.log(fieldSize);
  sidebarWidth += (width - sidebarWidth) / 42;
  // createCanvas(950, 632);
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
  if ([37, 38, 39, 40].indexOf(keyCode) != -1 && !paused) {
    seedinput.value(seed);
    if ((dir - keyCode == 2 || dir - keyCode == -2) && body.length > 0 && infinity && biteoff) {
      deadbody.push(new DeadBody(body[0], snake));
      body.splice(0, 1);
    }
    if ((dir - keyCode != 2 && dir - keyCode != -2) || infinity) {
      newdir = keyCode;
    }
  } else if (key == "R") {
    doReplay = false;
    if (!seedcheckbox.checked()) {
      newSeed();
    }
    newGame();
    applySettings();
  } else if (key == "F") {
    if (gameover || (replayinput.value() != "" && isValidJson(replayinput.value()))) {
      doReplay = true;
      applyReplaySettings();
      newGame();
    }
  } else if (key == "K") {
    replay.push(ticks + 1, 0);
    gameover = true;
  } else if (key == " ") {
    paused = !paused;
  } else if (key == "E") {
    snake.rotation = 1;
    body.forEach((part) => {
      part.rotation = 1;
    });
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
  const boxPos = width - 30;
  const sliderPos = width - 180;
  const inputPos = width - 180;
  const replayPos = width - 300;

  speedslider = createSlider(0, 25, 25);
  speedslider.position(sliderPos, 240);

  borderscheckbox = createCheckbox("", true);
  borderscheckbox.position(boxPos, 266);

  biteoffcheckbox = createCheckbox("", false);
  biteoffcheckbox.position(boxPos, 291);

  infinitycheckbox = createCheckbox("", false);
  infinitycheckbox.position(boxPos, 316);

  seedcheckbox = createCheckbox("", false);
  seedcheckbox.position(boxPos, 341);
  seedinput = createInput("");
  seedinput.position(inputPos, 342);
  seedinput.attribute("maxlength", "12");

  timelimitcheckbox = createCheckbox("", false);
  timelimitcheckbox.position(boxPos, 366);
  timelimitinput = createInput("");
  timelimitinput.position(inputPos, 367);
  timelimitinput.attribute("maxlength", "12");

  scorelimitcheckbox = createCheckbox("", false);
  scorelimitcheckbox.position(boxPos, 391);
  scorelimitinput = createInput("");
  scorelimitinput.position(inputPos, 392);
  scorelimitinput.attribute("maxlength", "12");

  squarefieldcheckbox = createCheckbox("", false);
  squarefieldcheckbox.position(boxPos, 416);

  replayinput = createElement("textarea");
  replayinput.size(280, height - 510 - 20);
  replayinput.position(replayPos, 510);
}

function disableSettings(t) {
  if (t) {
    borderscheckbox.attribute("disabled", "");
    biteoffcheckbox.attribute("disabled", "");
    infinitycheckbox.attribute("disabled", "");
    squarefieldcheckbox.attribute("disabled", "");
    seedcheckbox.attribute("disabled", "");
    timelimitcheckbox.attribute("disabled", "");
    scorelimitcheckbox.attribute("disabled", "");
    seedinput.attribute("disabled", "");
    timelimitinput.attribute("disabled", "");
    scorelimitinput.attribute("disabled", "");
  } else {
    borderscheckbox.removeAttribute("disabled");
    biteoffcheckbox.removeAttribute("disabled");
    infinitycheckbox.removeAttribute("disabled");
    squarefieldcheckbox.removeAttribute("disabled");
    seedcheckbox.removeAttribute("disabled");
    timelimitcheckbox.removeAttribute("disabled");
    scorelimitcheckbox.removeAttribute("disabled");
    seedinput.removeAttribute("disabled");
    timelimitinput.removeAttribute("disabled");
    scorelimitinput.removeAttribute("disabled");
  }
}

function applyCustomReplay() {
  let r, rs, js;
  if (replayinput.value() != "" && isValidJson(replayinput.value())) {
    js = JSON.parse(replayinput.value());
    rs = js["replaySettings"];
    r = js["replay"];
    if (r != undefined && r.length % 2 == 0 && rs["borders"] != undefined && rs["biteoff"] != undefined && rs["infinity"] != undefined && rs["seed"] != undefined && rs["seedlocked"] != undefined && rs["scorelimit"] != undefined && rs["timelimit"] != undefined) {
      replaySettings = rs;
      replay = r;
    }
  }
}

function applySettings() {
  speed = 30 - speedslider.value();
  borders = borderscheckbox.checked();
  biteoff = biteoffcheckbox.checked();
  infinity = infinitycheckbox.checked();
  squarefield = squarefieldcheckbox.checked();
  if (timelimitinput.value() < 0) {
    timelimitinput.value(0);
  }
  if (scorelimitinput.value() < 0) {
    scorelimitinput.value(0);
  }
  if (seed != int(seedinput.value()) && !isNaN(int(seedinput.value()))) {
    if (seedinput.value()) {
      seed = int(seedinput.value());
      if (!gameover) {
        newGame();
      }
    }
  }
  if (timelimitcheckbox.checked() && !isNaN(int(timelimitinput.value()))) {
    timelimit = round((int(timelimitinput.value()) / speed) * 60);
    if (timelimit == 0) {
      timelimit = false;
    }
  } else {
    timelimit = false;
  }
  if (scorelimitcheckbox.checked() && !isNaN(int(scorelimitinput.value()))) {
    scorelimit = int(scorelimitinput.value());
  } else {
    scorelimit = false;
  }
  if (!gameover) {
    applyCustomReplay();
    replaySettings["borders"] = borders;
    replaySettings["biteoff"] = biteoff;
    replaySettings["infinity"] = infinity;
    replaySettings["squarefield"] = squarefield;
    replaySettings["seed"] = seed;
    replaySettings["seedlocked"] = seedcheckbox.checked();
    replaySettings["scorelimit"] = scorelimit;
    if (timelimit) {
      replaySettings["timelimit"] = round((timelimit * speed) / 60);
    } else {
      replaySettings["timelimit"] = false;
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
  borders = replaySettings["borders"];
  biteoff = replaySettings["biteoff"];
  infinity = replaySettings["infinity"];
  squarefield = replaySettings["squarefield"];
  seed = replaySettings["seed"];
  scorelimit = replaySettings["scorelimit"];
  timelimit = replaySettings["timelimit"];

  borderscheckbox.checked(borders);
  biteoffcheckbox.checked(biteoff);
  infinitycheckbox.checked(infinity);
  squarefieldcheckbox.checked(squarefield);
  seedcheckbox.checked(replaySettings["seedlocked"]);
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
  return (31 - speed) * l;
}

function newGame() {
  body = [];
  deadbody = [];
  oldfield = {};
  if (!doReplay) {
    replay = [];
    replaySettings = {};
    replayinput.value("");
  }
  gameover = dir = newdir = seedset = paused = false;
  snake = new Snake();
  food = new Food();
  time = score = rtime = ftime = ttime = realscore = 0;
}

function showOldfield() {
  oldfield["snake"].rotate();
  oldfield["snake"].show();
  oldfield["food"].pulsate();
  oldfield["food"].show();
  for (let i = 0; i < oldfield["body"].length; i++) {
    oldfield["body"][i].rotate();
    oldfield["body"][i].show();
  }
}

function saveOldfield() {
  let ns, nf;
  ns = new Snake(snake);
  ns.x = snake.x;
  ns.y = snake.y;
  oldfield["snake"] = ns;

  nf = new Food(food);
  nf.x = food.x;
  nf.y = food.y;
  nf.size = food.size;
  nf.pulsation = nf.pulsation;
  oldfield["food"] = nf;

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
  oldfield["body"] = nb;
}

function playGame() {
  if (!dir) {
    applySettings();
  }
  if (infinity) {
    borders = false;
    borderscheckbox.checked(false);
  }
  if (!gameover) {
    saveOldfield();
    if (time < speed) {
      if (!paused) {
        time++;
        if (dir) {
          ttime++;
        }
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
          ticks--;
        } else {
          ticks++;
        }
        rtime++;
        if (replay[replay.length - 1] != dir - dir * 2 && dir != 0 && newdir != 0) {
          replay.push(rtime);
          replay.push(newdir - newdir * 2);
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
    if (!food) {
      food = new Food();
      realscore++;
      if (highscore <= score) {
        highscore++;
      }
      if (body.length == 0) {
        newbody = new Body(snake);
      } else {
        newbody = new Body(body[body.length - 1]);
      }
      newbody.rotation = 1;
      body.push(newbody);
    }
    if (!borders) {
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
  deadbody.forEach((deadpart) => {
    deadpart.show();
    deadpart.decay();
  });
  snake.show();
  snake.rotate();
  food.pulsate();
  food.show();
  body.forEach((part) => {
    part.rotate();
    part.show();
  });
  if (paused) {
    pausedGame();
  }
}

function showSidebar() {
  const captionPos = width - sidebarWidth / 2;
  const labelPos = width - sidebarWidth + 10;
  const valuePos = width - 10;

  push();
  rectMode(CORNER);
  fill(bgColor3);
  strokeWeight(0);
  rect(width - sidebarWidth, 0, sidebarWidth, height);

  fill(textColor1);

  textAlign(CENTER);
  textSize(20);
  text("Stats", captionPos, 25);
  text("Settings", captionPos, 225);
  text("Replay Data", captionPos, 490);

  textAlign(LEFT);
  textSize(18);
  text("Time:", labelPos, 55);
  text("Length:", labelPos, 80);
  text("Score:", labelPos, 105);
  text("Highscore:", labelPos, 130);
  text("Speedboost:", labelPos, 260);
  text("Borders:", labelPos, 285);
  text("Bite Off Mode:", labelPos, 310);
  text("Infinity Mode:", labelPos, 335);
  text("Seed:", labelPos, 360);
  text("Timelimit:", labelPos, 385);
  text("Scorelimit:", labelPos, 410);
  text("Square Field:", labelPos, 435);

  textAlign(RIGHT);
  text(((ticks * speed) / 60).toFixed(3), valuePos, 55);
  text(score, valuePos, 80);
  text(realscore, valuePos, 105);
  text(highscore, valuePos, 130);
  text(speedslider.value() / (25 / 100) + "%", valuePos, 260);
  pop();
}

function showField() {
  fill(bgColor2);
  strokeWeight(0);
  for (let i = 2; i < width - sidebarWidth; i += fieldSize.w) {
    for (let j = 2; j < height; j += fieldSize.w) {
      rect(i + 20, j + 20, fieldSize.w - 2, fieldSize.w - 2);
    }
  }

  // for (let i = 2; i < width - 350; i += 42) {
  //   for (let j = 2; j < height - 40; j += 42) {
  //     rect(i + 20, j + 20, 40, 40);
  //   }
  // }
}

function pausedGame() {
  push();
  rectMode(CORNER);
  fill(bgColor4);
  strokeWeight(0);
  rect(0, height / 6, width - sidebarWidth, 254);
  translate((width - sidebarWidth) / 2, 0);

  fill(textColor2);
  textAlign(CENTER);
  stroke(textColor3);

  textSize(64);
  strokeWeight(3);
  text("GAME PAUSED!", 0, 260);

  textSize(32);
  strokeWeight(2);
  text("PRESS 'SPACE' TO RESUME", 0, 350);
  pop();
}

function endGame() {
  doReplay = false;
  gameover = true;
  paused = false;
  dir = false;

  showOldfield();

  replayinput.value(
    JSON.stringify({
      replaySettings: replaySettings,
      replay: replay,
    })
  );

  push();
  rectMode(CORNER);
  fill(bgColor4);
  strokeWeight(0);
  rect(0, height / 6, width - sidebarWidth, 254);
  translate((width - sidebarWidth) / 2, 0);

  fill(textColor2);
  textAlign(CENTER);
  stroke(textColor3);

  textSize(64);
  strokeWeight(3);
  text("GAME OVER!", 0, 260);

  textSize(32);
  strokeWeight(2);
  text("PRESS 'R' TO RESTART", 0, 320);
  text("PRESS 'F' TO WATCH REPLAY", 0, 375);
  pop();
}
