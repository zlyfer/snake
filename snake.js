class Snake {
  constructor(s) {
    if (seed && !(seedset)) {
      randomSeed(seed);
      seedset = true;
    }
    if (s) {
      this.x = s.x;
      this.y = s.y;
    } else {
      this.x = random([2, 7, 12]);
      this.y = random([2, 7, 12]);
    }
    this.rotation = 0;
  }
  eat(food, body) {
    if (food.x == this.x && food.y == this.y) {
      this.rotation = 1;
      body.forEach(part => {
        part.rotation = 1;
      });
      return false;
    } else {
      return food;
    }
  }
  teleport() {
    if (this.x + 1 > 15) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = 14;
    }
    if (this.y < 0) {
      this.y = 14;
    }
    if (this.y + 1 > 15) {
      this.y = 0;
    }
  }
  gameover(body) {
    if (gameover) {
      return true;
    }
    if (borders && !(infinity)) {
      if (
        this.x + 1 > 15 ||
        this.x < 0 ||
        this.y < 0 ||
        this.y + 1 > 15
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
  rotate() {
    if (this.rotation != 0) {
      this.rotation += 18;
    }
    if (this.rotation >= 360) {
      this.rotation = 0;
    }
  }
  move(dir) {
    switch (dir) {
      case 37:
        this.x -= 1;
        break;
      case 38:
        this.y -= 1;
        break;
      case 39:
        this.x += 1;
        break;
      case 40:
        this.y += 1;
        break;
    }
  }
  show() {
    push();
    translate(this.x * 42 + 22, this.y * 42 + 22);
    rotate(radians(this.rotation));
    strokeWeight(0);
    fill(255);
    rect(0, 0, 38, 38);
    fill(snakeColor);
    rect(0, 0, 36, 36);
    pop();
  }
}

class Food {
  constructor(f) {
    this.size = 30;
    this.pulsation = 1 / 8;
    if (f) {
      this.x = f.x;
      this.y = f.y;
    } else {
      this.x = round(random(14));
      this.y = round(random(14));
    }
  }
  pulsate() {
    if (this.size >= 35) {
      this.pulsation = -1 / 8;
    } else if (this.size <= 20) {
      this.pulsation = 1 / 8;
    }
    this.size += this.pulsation;
  }
  show() {
    push();
    translate(this.x * 42 + 22, this.y * 42 + 22);
    strokeWeight(0);
    fill(255);
    rect(0, 0, (this.size) + 2, (this.size) + 2);
    fill(foodColor);
    rect(0, 0, (this.size), (this.size));
    pop();
  }
}

class Body {
  constructor(attach = {
    x: -40,
    y: -40
  }) {
    this.x = -40;
    this.y = -40;
    this.rotation = 0;
    this.attach = attach;
    this.h = round(hue(bodyColor));
    this.s = round(saturation(bodyColor));
    this.b = round(brightness(bodyColor));
  }
  rotate() {
    this.rotation = this.attach.rotation;
  }
  follow() {
    this.x = this.attach.x;
    this.y = this.attach.y;
  }
  show() {
    push();
    translate(this.x * 42 + 22, this.y * 42 + 22);
    rotate(radians(this.rotation));
    strokeWeight(0);
    fill(255);
    rect(0, 0, 30, 30);
    colorMode(HSB, 360, 100, 100, 1);
    fill(this.h, this.s, this.b);
    rect(0, 0, 28, 28);
    pop();
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
    this.decaytimer = 28;
  }
  decay() {
    this.decaytimer -= 2;
    if (this.decaytimer <= 0) {
      deadbody.splice(deadbody.indexOf(this), 1);
    }
  }
  show() {
    push();
    translate(this.x * 42 + 22, this.y * 42 + 22);
    strokeWeight(0);
    fill(255);
    rect(0, 0, this.decaytimer + 2, this.decaytimer + 2);
    colorMode(HSB, 360, 100, 100, 1);
    fill(this.h, this.s, this.b);
    rect(0, 0, this.decaytimer, this.decaytimer);
    pop();
  }
}