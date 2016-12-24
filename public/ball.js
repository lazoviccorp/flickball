function Ball(data) {
  this.pos = createVector(map(data.x, 0, server_width, 0, width), map(data.y, 0, server_height, 0, height));
  this.r = map(data.r, 0, server_height, 0, height);

  this.updatePos = function(data) {
    var mapped_x = map(data.x, 0, server_width, 0, width);
    var mapped_y = map(data.y, 0, server_height, 0, height);
    this.pos.x = lerp(this.pos.x, mapped_x, 0.6);
    this.pos.y = lerp(this.pos.y, mapped_y, 0.6);
    this.r = map(data.r, 0, server_height, 0, height);
  }

  this.show = function() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    noFill();
  }
}
