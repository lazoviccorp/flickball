var MyTimer = require('./timer.js');

module.exports = function(){

  this.room_intervals = {};
  this.timers = {};

  this.set = function(room_id, callback_method, rate){
    var timer = new MyTimer(5);
    this.timers[room_id] = timer;

    var room_interval = setInterval(callback_method, rate, room_id);
    this.room_intervals[room_id] = room_interval;
  }

  this.get = function(room_id){
    if (this.room_intervals.hasOwnProperty(room_id)) {
      var room_interval = this.room_intervals[room_id];
      return room_interval;
    }
  }

  this.getTimer = function(room_id) {
    if (this.timers.hasOwnProperty(room_id)) {
      return this.timers[room_id];
    }
  }

}
