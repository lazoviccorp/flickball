function MyTimer(){
  this.minutes = 0;
  this.seconds = 0;
  this.total = 0;
  this.formated_time = "0 : 00";
  this.running = false;
  this.stroke_weight = 0.5;
  this.lerp_amount = 0.1;

  this.update = function(room_time){
    this.stroke_weight = lerp(this.stroke_weight, 0.5, this.lerp_amount);
    this.minutes = room_time.minutes;
    this.seconds = room_time.seconds + "";
    if (this.seconds.length === 1) {
      this.seconds = "0" + this.seconds;
    }
    this.formated_time = this.minutes + " : " + this.seconds;
    this.total = room_time.total;
    this.running = room_time.running;
  }

  this.flicker = function() {
    this.stroke_weight = 5;
  }

  this.slowMotion = function(b) {
    this.lerp_amount = b ? 0.01: 0.1;
  }

  this.show = function() {
    noFill();
    strokeWeight(this.stroke_weight);
    stroke(255);
    textSize(25);
    textAlign(CENTER);
    text(this.formated_time, width/2, 50);
  }
}
