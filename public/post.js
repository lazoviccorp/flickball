function Post(post) {
  this.server_post = post;
  this.x = post.x;
  this.y = post.y;
  this.r = post.r;
  this.stroke_weight = 3;
  this.col = (post.team === "team_one") ? color(255, 100, 100): color(100, 100, 255);
  this.show_col = color(post.red, post.green, post.blue);
  this.lerp_amount = 0.1;

  this.update = function () {
    this.x = map(this.server_post.x, 0, server_width, 0, width);
    this.y = map(this.server_post.y, 0, server_height, 0, height);
    this.r = map(this.server_post.r, 0, server_height, 0, height);
    this.stroke_weight = lerp(this.stroke_weight, 3, this.lerp_amount);
    this.show_col = lerpColor(this.show_col, this.col, this.lerp_amount);
  }

  this.flicker = function() {
    this.stroke_weight = 5;
    this.show_col = color(255, 255, 255);
  }

  this.slowMotion = function(b) {
    this.lerp_amount = b ? 0.01 : 0.1;
  }

  this.show = function () {
    noFill();
    stroke(this.col);
    strokeWeight(this.stroke_weight);
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }
}
