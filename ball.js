var Victor = require('victor');
var generic_data = require('./generic_data.js');

module.exports = function () {
  this.pos = new Victor(generic_data.width/2, generic_data.height/2);
  this.vel = new Victor(0, 0);
  this.r = 10;
  this.hit_safety = false;
  this.lim = 20;
  this.mult = 0.75;

  this.update = function() {
    var zero_vector = new Victor(0, 0);
    this.vel.mix(zero_vector, 0.01);
    this.vel.limit(this.lim, this.mult);
    this.pos.add(this.vel);
  }

  this.addVel = function(vel, angle) {
    var copy_vel = new Victor(vel.x, vel.y);

    var final_vel = copy_vel.subtract(this.vel);
    var final_angle = angle - final_vel.angle();

    final_vel.rotate(final_angle);

    this.vel.add(final_vel);
  }

  this.constr = function () {
    if (this.pos.x > generic_data.width - this.r){
      this.pos.x = generic_data.width - this.r;
      if (this.vel.x > 0) {
        this.vel.invertX();
      }
    }

    if(this.pos.x < this.r) {
        this.pos.x = this.r;
        if (this.vel.x < 0) {
          this.vel.invertX();
        }
    }

    if (this.pos.y > generic_data.height - this.r){
      this.pos.y = generic_data.height - this.r;
      if (this.vel.y > 0) {
        this.vel.invertY();
      }
    }

    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      if (this.vel.y < 0) {
        this.vel.invertY();
      }
    }
  }


  this.hits = function (posts) {
    for (var i in posts) {
      if (posts.hasOwnProperty(i)) {
        var d = this.pos.distance(posts[i].pos);
        if (d < this.r + posts[i].r) {
          var angle = Math.atan2(this.pos.y - posts[i].pos.y, this.pos.x - posts[i].pos.x);
          if (!this.hit_safety) {
            this.addVel(posts[i].vel, angle);
            this.hit_safety = true;
            return i;
          }
        }else {
          this.hit_safety = false;
        }
      }
    }
  }

  this.goal = function() {
    if (this.pos.x < this.r && this.pos.y > generic_data.height/2 - 100 + 20 && this.pos.y < generic_data.height/2 + 100 - 20) {
      return "team_one";
    }else if (this.pos.x > generic_data.width - this.r && this.pos.y > generic_data.height/2 - 100 + 20 && this.pos.y < generic_data.height/2 + 100 - 20) {
      return "team_two";
    }
  }

  this.restart = function(){
    this.pos.x = generic_data.width/2;
    this.pos.y = generic_data.height/2;
    this.vel = new Victor(0, 0);
  }

  this.slowMotion = function(b) {
    this.lim = b ? 4 : 20;
    this.mag = b ? 0.3 : 0.75;
  }

  this.getObj = function() {
    var obj = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r,
    }
    return obj;
  }
}
