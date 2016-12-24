function SuperPower(data) {
  this.x = map(data.x, 0, server_width, 0, width);
  this.y = map(data.y, 0, server_height, 0, height);
  this.power = data.power;
  this.r = 0;

  this.show = function() {
    var col;
    if (this.power === 1) {
      col = color(255, 150, 255);
    }else if (this.power === 2) {
      col = color(255, 255, 150);
    }else if (this.power === 3) {
      col = color(150, 255, 255);
    }
    stroke(col);
    ellipse(this.x, this.y, this.r, this.r);
    fill(col);
    ellipse(this.x, this.y, 3, 3);
    noFill();

    this.r += 0.4;
    if (this.r > 20) {
      this.r = 0;
    }
  }
}
