function Blob(data) {
  this.pos = createVector(map(data.x, 0, server_height, 0, height), map(data.y, 0, server_width, 0, width));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.r = map(data.r, 0, server_height, 0, height);
  this.team = data.team;
  this.index = data.index;
  this.name = data.name;
  this.super_power = data.super_power;
  this.col = (data.team === "team_one") ? color(255, 100, 100) : color(100, 100, 255);
  this.mag = 2;
  this.lim = 60;
  this.vel_power = 0.15;
  this.lerp_amount = 0.1;
  this.stroke_weight = 1;
  this.radius = map(25, 0, server_height, 0, height);
  this.hit_safety = false;
  this.data = data;

  this.update = function(){
    var zero_vector = createVector(0, 0);
    this.vel = p5.Vector.lerp(this.vel, zero_vector, 0.01);

    var xoff = 0;
    var yoff = 0;
    if (keyIsDown(LEFT_ARROW)) xoff = -1;
    if (keyIsDown(RIGHT_ARROW)) xoff = 1;
    if (keyIsDown(UP_ARROW)) yoff = -1;
    if (keyIsDown(DOWN_ARROW)) yoff = 1;

    var pos = this.pos.copy();
    var mapped_xoff = xoff * (height/server_height);
    var mapped_yoff = yoff * (height/server_height);
    var dir = createVector(pos.x + mapped_xoff, pos.y + mapped_yoff);
    dir.sub(pos);

    var mapped_mag = this.mag * (height/server_height);
    var mapped_lim = this.lim * (height/server_height);

    dir.setMag(mapped_mag);
    this.vel.limit(mapped_lim);

    this.acc = dir;
    this.vel.add(this.acc);
    pos.add(this.vel);

    var r = lerp(this.r, this.radius, 0.1);

    var mapped_x = map(pos.x, 0, width, 0, server_width);
    var mapped_y = map(pos.y, 0, height, 0, server_height);
    var mapped_r = map(r, 0, height, 0, server_height);

    this.data.x = mapped_x;
    this.data.y = mapped_y;
    this.data.r = mapped_r;

    this.drawHeading();
  }

  this.updatePos = function(data) {
    var mapped_x = map(data.x, 0, server_width, 0, width);
    var mapped_y = map(data.y, 0, server_height, 0, height);

    this.pos.x = lerp(this.pos.x, mapped_x, 0.1);
    this.pos.y = lerp(this.pos.y, mapped_y, 0.1);
    this.r = map(data.r, 0, server_height, 0, height);

    this.super_power = data.super_power;
  }

  this.hits = function(ball) {
    var d = p5.Vector.dist(this.pos, ball.pos);
    if (d < this.r + ball.r) {

      var angle = Math.atan2(ball.pos.y - this.pos.y, ball.pos.x - this.pos.x);

      var pass_vel = this.vel.copy().mult(this.vel_power);

      var collision_data = { vel: { x: pass_vel.x, y: pass_vel.y }, ang: angle };

      if (!this.hit_safety) {
        this.hit_safety = true;
        this.flicker();
        return collision_data;
      }
    }else {
      this.hit_safety = false;
    }
  }

  this.flicker = function() {
    this.stroke_weight = 3;
  }

  this.powerUp = function(super_power) {
    var d = dist(this.pos.x, this.pos.y, super_power.x, super_power.y);
    if (d < this.r + 3) {
      if (this.super_power === 0) {
        return true;
      }
    }
  }

  this.updatePower = function() {
    if(this.super_power === 1){
      this.vel_power = 1.1;
    }else if (this.super_power === 2) {
      this.radius = map(50, 0, server_height, 0, height);
    }else if (this.super_power === 3) {
      this.mag = 6;
    }else {
      this.mag = 2;
      this.radius = map(25, 0, server_height, 0, height);;
      this.vel_power = 0.15;
    }
  }

  this.constr = function() {
    if (this.pos.x > width - this.r){
      this.pos.x = width - this.r;
      this.vel.x = 0;
    }

    if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x = 0;
    }

    if (this.pos.y > height - this.r){
      this.pos.y = height - this.r;
      this.vel.y = 0;
    }

    if( this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }
  }

  this.restart = function() {
    var spawn = this.getSpawn(this.team, this.index);
    this.pos.x = spawn.x;
    this.pos.y = spawn.y;
    this.vel.mult(0);
    this.acc.mult(0);
  }

  this.slowMotion = function(b) {
    this.mag = b ? 0.2 : 2;
    this.lim = b ? 4 : 60;
    this.lerp_amount = b ? 0.01 : 0.1;
  }

  this.getData = function(){
    return this.data;
  }

  this.drawHeading = function(){
    strokeWeight(0.5);
    noFill();
    stroke(255);
    arc(this.pos.x, this.pos.y, this.r*2 + this.r, this.r*2 + this.r, this.vel.heading() - PI/6, this.vel.heading() + PI/6);
  }


  this.show = function(){
    this.stroke_weight = lerp(this.stroke_weight, 1, this.lerp_amount);

    push();
    stroke(255);
    noFill();
    strokeWeight(this.stroke_weight);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);

    textSize(10);
    textAlign(CENTER);
    stroke(this.col);
    text(this.name, this.pos.x, this.pos.y);

    pop();
  }

  this.getSpawn = function(team, index) {
    var x;
    var y;
    if (team === "team_two") {
      if (index === 0) {
        x = server_width/2 + server_width/4;
        y = server_height/2;
      }else if (index === 1){
        x = server_width/2 + server_width/3;
        y = server_height/2 - server_height/3;
      }else if (index === 2){
        x = server_width/2 + server_width/3;
        y = server_height/2 + server_height/3;
      }
    }else if (team === "team_one") {
      if (index === 0) {
        x = server_width/2 - server_width/4;
        y = server_height/2;
      }else if (index === 1){
        x = server_width/2 - server_width/3;
        y = server_height/2 - server_height/3;
      }else if (index === 2){
        x = server_width/2 - server_width/3;
        y = server_height/2 + server_height/3;
      }
    }

    var mapped_x = map(x, 0, server_width, 0, width);
    var mapped_y = map(y, 0, server_height, 0, height);
    return { x : mapped_x, y : mapped_y};
  }
}
