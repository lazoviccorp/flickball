var socket;
var pg;

var server_width = 0;
var server_height = 0;

var state_data;
var spectators_data;
var members_data;
var ball_data;
var time_data;
var score_data;
var posts_data;
var post_hit_id;
var goal = false;
var super_power_data;

var blobs = {};
var ball;
var super_power;
var name;
var timer;
var score;
var posts = {};

const RUNNING = 0;
const PREPARING = 1;
const RESTARTING = 2;

function setup() {
  var c = createCanvas(windowWidth, windowHeight);
  c.position(0, 0);

  socket = io.connect("http://207.154.201.95:3000");

  drawBackground();
  createDialog();
  showDialog();
  setHeaderText("flickball.xyz");
  startListeners();
}

function windowResized() {
  var old_width = width;
  var old_height = height;

  var new_width = windowWidth;
  var new_height = windowHeight;

  if (new_width < (server_width/1.5)) {
    new_width = server_width/1.5;
  }

  if (new_height < (server_height/1.5)) {
    new_height = server_height/1.5;
  }

  if (new_height / new_width > server_height / server_width) {
    new_height = new_width * (server_height / server_width);
  }else {
    new_width = new_height / (server_height / server_width);
  }

  if (blobs.hasOwnProperty(socket.id)) {
    var blob = blobs[socket.id];
    blob.pos.x /= old_width/new_width;
    blob.pos.y /= old_height/new_height;
    blob.radius /= old_height/new_height;
  }

  if (super_power) {
    super_power.x /= old_width/new_width;
    super_power.y /= old_height/new_height;
  }

  resizeCanvas(new_width, new_height);
  drawBackground();
  remakeDialog();
}

function startGame() {
  socket.emit('start', name);
}

function draw() {
  image(pg, 0, 0);
  updateDialog();
  updatePosts();
  updateBlobs();
  updateMyBlob();
  updateBall();
  updateTime();
  updateScore();
  updateSuperPower();
  flicker();
}

function startListeners() {

  socket.on('start_data', function(server_data) {
    server_height = server_data.height;
    server_width = server_data.width;
    windowResized();
  });

  socket.on('posts', function(server_posts){
    posts_data = server_posts;
  });

  socket.on('post_hit', function(server_post_id) {
    post_hit_id = server_post_id;
  });

  socket.on('goal', function() {
    goal = true;
  });

  socket.on('state_heartbeat', function (server_state) {
    state_data = server_state;
  });

  socket.on('spectators_heartbeat', function(server_spectators) {
    spectators_data = server_spectators;
});

  socket.on('members_heartbeat', function(server_members) {
    members_data = server_members;
  });

  socket.on('ball_heartbeat', function(server_ball){
    ball_data = server_ball;
  });

  socket.on('time_heartbeat', function(server_time) {
    time_data = server_time;
  });

  socket.on('score_heartbeat', function(server_score){
    score_data = server_score;
  });

  socket.on('super_power_heartbeat', function (server_super_power) {
    super_power_data = server_super_power;
  });
}

function updateDialog() {
  if (spectators_data && members_data) {
    var spectators_count = Object.keys(spectators_data).length;
    var members_count = Object.keys(members_data).length;

    setTeamStatusText("In game: " + members_count + " Spectators: " + spectators_count);

    if (members_data.hasOwnProperty(socket.id)) {
      setButtonText("Waiting for other players...");
    }else {
      setButtonText("Go");
    }

    if (members_count > 1 && members_data.hasOwnProperty(socket.id)) {
      hideDialog();
    }else {
      showDialog();
    }
  }
}

function updateBlobs() {
  if (members_data) {

    for (var i in members_data) {

      if (!blobs.hasOwnProperty(i)) {
        blobs[i] = new Blob(members_data[i])
      }

      blobs[i].updatePos(members_data[i]);
      blobs[i].show();
    }
  }
}

function updateMyBlob() {
  if (blobs.hasOwnProperty(socket.id)) {
    var my_blob = blobs[socket.id];

    if (state_data !== undefined) {
      if (state_data === RUNNING) {
        my_blob.slowMotion(false);
      }else if (state_data === PREPARING) {
        my_blob.slowMotion(true);
      }else if (state_data === RESTARTING) {
        my_blob.restart();
      }
    }

    if (ball) {
      var collision_data = my_blob.hits(ball);
      if (collision_data) {
        my_blob.flicker();
        socket.emit('hit', collision_data);
      }
    }

    if (super_power) {
      if(my_blob.powerUp(super_power)){
        socket.emit('power_up');
      }

    }

    my_blob.updatePower();

    my_blob.update();
    my_blob.constr();

    socket.emit('update', my_blob.getData());
  }
}

function updateBall() {
  if (ball_data) {
    if (!ball) {
      ball = new Ball(ball_data);
    }

    ball.updatePos(ball_data);
    ball.show();
  }
}

function updateTime() {
  if (time_data) {
    if (!timer) {
      timer = new MyTimer();
    }

    if (state_data !== undefined) {
      if (state_data === RUNNING) {
        timer.slowMotion(false);
      }else if (state_data === PREPARING) {
        timer.slowMotion(true);
      }
    }

    timer.update(time_data);
    timer.show();
  }
}

function updateScore() {
  if (score_data) {
    if (!score) {
      score = new Score();
    }

    if (state_data !== undefined) {
      if (state_data === PREPARING) {
        score.slowMotion(true);
      }else if (state_data === RUNNING) {
        score.slowMotion(false);
      }
    }

    score.update(score_data);
    score.show();
  }
}

function updatePosts() {
  if (posts_data) {
    for (var i in posts_data) {
      if (!posts.hasOwnProperty(i)) {
        posts[i] = new Post(posts_data[i]);
      }

      if (state_data !== undefined) {
        if (state_data === PREPARING) {
          posts[i].slowMotion(true);
        }else if (state_data === RUNNING) {
          posts[i].slowMotion(false);
        }
      }

      if (post_hit_id === i) {
        posts[i].flicker();
        post_hit_id = undefined;
      }

      posts[i].update();
      posts[i].show();
    }
  }
}

function updateSuperPower() {
  if (super_power_data) {
    if (!super_power) {
      super_power = new SuperPower(super_power_data);
    }
    super_power.show();
  }else {
    super_power = undefined;
  }
}

function flicker() {
  if (goal) {
    for (var i in blobs) {
      if (blobs.hasOwnProperty(i)) {
        blobs[i].flicker();
      }
    }

    for (var i in posts) {
      if (posts.hasOwnProperty(i)) {
        posts[i].flicker();
      }
    }

    if (score) score.flicker();
    if (timer) timer.flicker();

    goal = false;
  }
}

function drawBackground() {
  pg = createGraphics(width, height);

  var scl = 15;
  var cols = pg.width / scl;
  var rows = pg.height / scl;

  pg.noFill();
  pg.stroke(255, 15);
  pg.background(0);
  var xoffset = 0;
  var yoffset = 0;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {

      pg.quad((x+xoffset)*scl, (y+1+yoffset)*scl,
      (x+1+xoffset)*scl, (y+yoffset)*scl,
       (x+2+xoffset)*scl, (y+yoffset)*scl,
        (x+3+xoffset)*scl, (y+1+yoffset)*scl);

      pg.quad((x+xoffset)*scl, (y+1+yoffset)*scl,
       (x+1+xoffset)*scl, (y+2+yoffset)*scl,
        (x+2+xoffset)*scl, (y+2+yoffset)*scl,
         (x+3+xoffset)*scl, (y+1+yoffset)*scl);

      xoffset += 3;
    }
    xoffset = 0;
    yoffset += 2;
  }
  pg.strokeWeight(3);
  pg.line(width/2, 0, width/2, height);
  pg.ellipse(width/2, height/2, (width/2)*(height/width), height/2);

  pg.ellipse(0, height/2, (width/2)*(height/width), height/2);
  pg.ellipse(width, height/2, (width/2)*(height/width), height/2);
}
