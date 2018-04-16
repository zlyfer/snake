class Snake {
  constructor() {
    if (seed && !(seedset)) {
      randomSeed(seed);
      seedset = true;
    }
    this.x = random([2, 7, 12]) * 40;
    this.y = random([2, 7, 12]) * 40;
  }
  eat(food) {
    if (food.x == this.x && food.y == this.y) {
      return false;
    } else {
      return food;
    }
  }
  teleport() {
    if (this.x + 40 > 600) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = 560;
    }
    if (this.y < 0) {
      this.y = 560;
    }
    if (this.y + 40 > 600) {
      this.y = 0;
    }
  }
  gameover(body) {
    if (gameover) {
      return true;
    }
    if (borders && !(infinity)) {
      if (
        this.x + 40 > 600 ||
        this.x < 0 ||
        this.y < 0 ||
        this.y + 40 > 600
      ) {
        return true;
      }
      foodColor
    }
    for (let i = 0; i < body.length; i++) {
      if (this.x == body[i].x && this.y == body[i].y) {
        if (biteoff) {
          for (let j = i; j < body.length; j++) {
            deadbody.push(new DeadBody(body[j]));
          }
          body.splice(i, body.length - i);
          return false;
        }
        if (infinity) {
          return false;
        }
        return true;
      }
    }
    return false;
  }
  move(dir) {
    switch (dir) {
      case 37:
        this.x -= 40;
        break;
      case 38:
        this.y -= 40;
        break;
      case 39:
        this.x += 40;
        break;
      case 40:
        this.y += 40;
        break;
    }
  }
  show() {
    stroke(250);
    strokeWeight(1);
    fill(snakeColor);
    rect(this.x + 1, this.y + 1, 37, 37);
  }
}

class Food {
  constructor(snake, body) {
    this.size = round(random(250, 350));
    this.pulsation = -1;
    this.x = round(random(14)) * 40;
    this.y = round(random(14)) * 40;
    while (this.x == snake.x && this.y == snake.y) {
      this.x = round(random(14)) * 40;
      this.y = round(random(14)) * 40;
    }
    if (body.length > 0) {
      for (let i = 0; i < body.length; i++) {
        while (
          (this.x == body[i].x && this.y == body[i].y) ||
          (this.x == snake.x && this.y == snake.y)
        ) {
          this.x = round(random(14)) * 40;
          this.y = round(random(14)) * 40;
          i = 0;
        }
      }
    }
  }
  pulsate() {
    if (this.size == 350) {
      this.pulsation = -1;
    } else if (this.size == 250) {
      this.pulsation = 1;
    }
    this.size += this.pulsation;
  }
  show() {
    stroke(250);
    strokeWeight(1);
    fill(foodColor);
    rect(
      this.x - 1 + (20 - (this.size / 20)),
      this.y - 1 + (20 - (this.size / 20)),
      this.size / 10 + 1,
      this.size / 10 + 1
    );
  }
}

class Body {
  constructor(attach) {
    this.x = -40;
    this.y = -40;
    this.attach = attach;
    this.h = round(hue(bodyColor));
    this.s = round(
      random(saturation(bodyColor) - 10,
        saturation(bodyColor) + 10)
    );
    this.b = round(brightness(bodyColor));
  }
  follow() {
    this.x = this.attach.x;
    this.y = this.attach.y;
  }
  show() {
    stroke(250);
    strokeWeight(1);
    colorMode(HSB, 360, 100, 100, 1);
    fill(this.h, this.s, this.b);
    colorMode(RGB, 255);
    rect(this.x + 5, this.y + 5, 29, 29);
  }
}

class DeadBody {
  constructor(deadbody, s = false) {
    if (s) {
      this.x = s.x;
      this.y = s.y
    } else {
      this.x = deadbody.x;
      this.y = deadbody.y;
    }
    this.h = deadbody.h;
    this.s = deadbody.s;
    this.b = deadbody.b;
    this.decaytimer = 50;
  }
  decay() {
    this.decaytimer--;
    if (this.decaytimer == 0) {
      deadbody.splice(deadbody.indexOf(this), 1);
    }
  }
  show() {
    strokeWeight(1);
    stroke(250);
    colorMode(HSB, 360, 100, 100, 1);
    fill(this.h, this.s, this.b);
    colorMode(RGB, 255);
    rect(
      this.x + ((50 - (this.decaytimer)) / 2) / 2 + 5,
      this.y + ((50 - (this.decaytimer)) / 2) / 2 + 5,
      29 - ((50 - (this.decaytimer)) / 2),
      29 - ((50 - (this.decaytimer)) / 2)
    );
  }
}