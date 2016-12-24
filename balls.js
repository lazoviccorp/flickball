var Ball = require('./ball.js');
module.exports = function(){
  this.balls = {};

  this.set = function(room_id){
    this.balls[room_id] = new Ball();
  }

  this.get = function(room_id){
    if (this.balls.hasOwnProperty(room_id)) {
      return this.balls[room_id];
    }
  }
}
