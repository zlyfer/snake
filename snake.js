class Snake {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
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

    if (borderkill) {
      if (
        this.x + 40 > 600 ||
        this.x < 0 ||
        this.y < 0 ||
        this.y + 40 > 600
      ) {
        return true;
      }
    }

    for (let i = 0; i < body.length; i++) {
      if (this.x == body[i].x && this.y == body[i].y) {
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
    strokeWeight(0);
    fill(46, 125, 50);
    rect(this.x + 1, this.y + 1, 38, 38);
  }
}

class Body {
  constructor(attach) {
    this.x = -40;
    this.y = -40;
    this.attach = attach;
  }
  follow() {
    this.x = this.attach.x;
    this.y = this.attach.y;
  }
  show() {
    strokeWeight(0);
    fill(76, 175, 80);
    rect(this.x + 1, this.y + 1, 38, 38);
  }
}

class Food {
  constructor(snake, body) {
    this.size = 350;
    this.pulsation = -1;
    this.x = round(random(14)) * 40;
    this.y = round(random(14)) * 40;
    while (this.x == snake.x && this.y == snake.y) {
      this.x = round(random(14)) * 40;
      this.y = round(random(14)) * 40;
    }
    if (body.length > 0) {
      for (let i = 0; i < body.length; i++) {
        while (this.x == body[i].x && this.y == body[i].y) {
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
    strokeWeight(0);
    fill(33, 150, 243);
    rect(
      this.x + 1 + (20 - (this.size / 20)),
      this.y + 1 + (20 - (this.size / 20)),
      this.size / 10 - 2,
      this.size / 10 - 2
    );
  }
}