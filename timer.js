module.exports = function(minutes) {
  this.minutes = 60000 * minutes;
  this.end_time = Date.parse(new Date());
  this.running = false;

  this.startTimer = function(){
    if (!this.running) {
      this.end_time = Date.parse(new Date()) + this.minutes;
      this.running = true;
    }
  }

  this.stopTimer = function(){
    if (this.running) {
      this.running = false;
    }
  }

  this.getTime = function(){
    var t = this.end_time - Date.parse(new Date());
    if (!this.running) {
      t = 0;
    }
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {
      'running': this.running,
      'total': t,
      'minutes': minutes,
      'seconds': seconds
    };
  }
}
