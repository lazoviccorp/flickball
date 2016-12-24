function Score(){
  this.team_one_score = 0;
  this.team_two_score = 0;
  this.team_one_col = color(100, 100, 255);
  this.team_two_col = color(255, 100, 100);
  this.team_one_show_col = color(100, 100, 255);
  this.team_two_show_col = color(255, 100, 100);
  this.stroke_weight = 0.5;
  this.lerp_amount = 0.1;
  this.restarting = false;

  this.update = function(score_data){
    this.stroke_weight = lerp(this.stroke_weight, 0.5, this.lerp_amount);
    this.team_one_show_col = lerpColor(this.team_one_show_col, this.team_one_col);
    this.team_two_show_col = lerpColor(this.team_two_show_col, this.team_two_col);
    this.team_one_score = score_data.team_one;
    this.team_two_score = score_data.team_two;
  }

  this.flicker = function() {
    this.stroke_weight = 5;
    this.team_one_show_col = color(255, 255, 255);
    this.team_two_show_col = color(255, 255, 255);
  }

  this.slowMotion = function(b) {
    this.lerp_amount = b ? 0.01 : 0.1;
  }

  this.show = function(){
    strokeWeight(this.stroke_weight);
    textSize(40);
    stroke(this.team_one_col);
    text(this.team_one_score, width/2 + 150, 50);
    stroke(this.team_two_col)
    text(this.team_two_score, width/2 - 150, 50);
  }
}
