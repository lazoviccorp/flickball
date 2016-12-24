
var Victor = require('victor');

module.exports = function(x, y, r, team) {
  this.pos = new Victor(x, y);
  this.vel = new Victor(0, 0);
  this.r = r;
  this.post_weight = 3;
  this.hit_safety = false;
  this.team = team;

  this.getObj = function() {
    var obj = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r,
      team: this.team
    }
    return obj;
  }

}
