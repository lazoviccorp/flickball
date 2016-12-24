var json_db = require('node-json-db');
var db_helper = require('./db_helper.js');
var interval_builder = require('./interval_builder.js');
var GenericData = require('./generic_data.js');
var ball_generator = require('./balls.js');
var posts = require('./posts.js');
var MathHelper = require('./math_helper.js');

var db = new json_db("my_base", true, true);
var DbHelper = new db_helper(db);
var IntervalBuilder = new interval_builder();
var BallGenerator = new ball_generator();
var PostsGenerator = new posts();

var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

const RUNNING = 0;
const PREPARING = 1;
const RESTARTING = 2;

function restartServer() {
  DbHelper.restartRooms();
}

restartServer();

io.on('connection', function(socket) {

  var room_id = getEmptyRoom();
  socket.join(room_id);
  socket.room = room_id;
  joinSpectators(socket);

  socket.emit('start_data', GenericData);
  socket.emit('posts', PostsGenerator.postsObj());

  socket.on('start', function(name) {
    joinMembers(socket, name);
  });

  socket.on('update', function(data) {
    updateBlob(socket, data);
  });

  socket.on('hit', function(collision_data) {
    handleCollision(socket, collision_data);
  });

  socket.on('power_up', function () {
    powerUpBlob(socket);
  });

  socket.on('disconnect', function(){
    removeBlob(socket);
  });
});

function updateBlob(socket, data) {
  var blob = DbHelper.getMember(socket.room, socket.id);
  if (blob) {
    blob.x = data.x;
    blob.y = data.y;
    blob.r = data.r;
  }
}

function handleCollision(socket, collision_data) {
  var ball = BallGenerator.get(socket.room);
  if (ball) {
    ball.addVel(collision_data.vel, collision_data.ang);
  }
}

function powerUpBlob(socket) {
  var room = DbHelper.getRoom(socket.room);
  var blob = DbHelper.getMember(socket.room, socket.id);
  if (blob && room.super_power) {
    blob.super_power = room.super_power.power;
    room.super_power = undefined;
    setTimeout(removeSuperPower, 20000, blob);
  }
}

function removeSuperPower(blob) {
  blob.super_power = 0;
}

function joinSpectators(socket) {
  var blob = { id: socket.id};
  DbHelper.setSpectator(socket.room, socket.id, blob);
}

function joinMembers(socket, name) {
  var room = DbHelper.getRoom(socket.room);
  if (!room.members.hasOwnProperty(socket.id)) {
    var blob = DbHelper.getSpectator(socket.room, socket.id);

    var empty_team = getEmptyTeam(socket.room);
    var spawn = getSpawn(empty_team.team, empty_team.count);

    blob.team = empty_team.team;
    blob.index = empty_team.count;
    blob.name = name;
    blob.x = spawn.x;
    blob.y = spawn.y;
    blob.r = 25;
    blob.super_power = 0;

    DbHelper.setMember(socket.room, socket.id, blob);
    DbHelper.removeSpectator(socket.room, socket.id);
  }
}

function removeBlob(socket) {
  DbHelper.removeSpectator(socket.room, socket.id);
  DbHelper.removeMember(socket.room, socket.id);
}

function getEmptyTeam(room_id) {

  var members_info = getMembersInfo(room_id);

  if (members_info.team_one_count > members_info.team_two_count) {
    return {team: "team_two", count: members_info.team_two_count};
  }else{
    return {team: "team_one", count: members_info.team_one_count };
  }
}

function getMembersInfo(room_id) {
  var team_one = 0;
  var team_two = 0;
  var room = DbHelper.getRoom(room_id);
  if (room) {
    for (var i in room.members) {
      if (room.members.hasOwnProperty(i)) {
        if (room.members[i].team === "team_one") {
          team_one += 1;
        }else if(room.members[i].team === "team_two"){
          team_two += 1;
        }
      }
    }
  }

  return { 'team_one_count': team_one, 'team_two_count': team_two};
}

function getSpawn(team, index) {
  var x;
  var y;
  if (team === "team_two") {
    if (index === 0) {
      x = GenericData.width/2 + GenericData.width/4;
      y = GenericData.height/2;
    }else if (index === 1){
      x = GenericData.width/2 + GenericData.width/3;
      y = GenericData.height/2 - GenericData.height/3;
    }else if (index === 2){
      x = GenericData.width/2 + GenericData.width/3;
      y = GenericData.height/2 + GenericData.height/3;
    }
  }else if (team === "team_one") {
    if (index === 0) {
      x = GenericData.width/2 - GenericData.width/4;
      y = GenericData.height/2;
    }else if (index === 1){
      x = GenericData.width/2 - GenericData.width/3;
      y = GenericData.height/2 - GenericData.height/3;
    }else if (index === 2){
      x = GenericData.width/2 - GenericData.width/3;
      y = GenericData.height/2 + GenericData.height/3;
    }
  }
  return { x : x, y : y};
}


function getEmptyRoom() {
  var rooms = DbHelper.getRooms();
  for (var i in rooms) {
    if (rooms.hasOwnProperty(i)) {
      var room = rooms[i];
      if (room.hasOwnProperty("members") && room.hasOwnProperty("spectators")) {
        var spectators = room.spectators;
        var members = room.members;
        if (Object.keys(spectators).length + Object.keys(members).length < 6) {
          return i;
        }
      }
    }
  }

  return createNewRoom();
}

function createNewRoom() {
  var rooms = DbHelper.getRooms();
  var id = "";
  do{
    id = Math.random().toString(36).substr(2, 9);
  } while (id.length < 9 && rooms.hasOwnProperty(id));

  IntervalBuilder.set(id, roomHeartbeat, 10);
  BallGenerator.set(id);

  var ball = BallGenerator.get(id);
  var timer = IntervalBuilder.getTimer(id);

  var room = {
    state: RUNNING,
    ball: ball.getObj(),
    time: timer.getTime(),
    score: {team_one: 0, team_two: 0},
    members: {},
    spectators: {},
   };

  DbHelper.setRoom(id, room);

  console.log("New room created: " + id);
  return id;
}

function roomHeartbeat(room_id) {
  var room = DbHelper.getRoom(room_id);

  var state = room.state;
  var ball = BallGenerator.get(room_id);
  var timer = IntervalBuilder.getTimer(room_id);

  if (Object.keys(room.members).length > 1) {
    if (!timer.running) {
      room.state = RUNNING;
      room.score["team_one"] = 0;
      room.score["team_two"] = 0;
      timer.startTimer();
    }
  }else {
    room.state = RESTARTING;
    timer.stopTimer();
  }

  room.time = timer.getTime();

  if (state === RUNNING) {
    ball.slowMotion(false);
  }else if (state === PREPARING) {
    ball.slowMotion(true);
  }else if (state === RESTARTING) {
    ball.restart();
  }

  ball.update();

  var posts = PostsGenerator.posts();
  var post_id = ball.hits(posts);
  if (post_id){
    io.to(room_id).emit('post_hit', post_id);
  }

  var team_id = ball.goal();
  if (team_id) {
    io.to(room_id).emit('goal');
    room.score[team_id] += 1;
    prepareForRestart(room, room_id);
  }
  ball.constr();

  room.ball = ball.getObj();

  if (Math.random() < 0.001) {
    if (!room.super_power) {
      var super_power = {
        x: MathHelper.getRandom(0, GenericData.width),
        y: MathHelper.getRandom(0, GenericData.height),
        power: MathHelper.getRandomFromArray([1, 2, 3])
      }
      room.super_power = super_power;
    }
  }

  io.to(room_id).emit('state_heartbeat', state);

  var spectators = room.spectators;
  io.to(room_id).emit('spectators_heartbeat', spectators);

  var members = room.members;
  io.to(room_id).emit('members_heartbeat', members);

  var ball = room.ball;
  io.to(room_id).emit('ball_heartbeat', ball);

  var time = room.time;
  io.to(room_id).emit('time_heartbeat', time);

  var score = room.score;
  io.to(room_id).emit('score_heartbeat', score);

  var super_power = room.super_power;
  io.to(room_id).emit('super_power_heartbeat', super_power);
}

function prepareForRestart(room) {
  room.state = PREPARING;
  setTimeout(function(){
    restartingGame(room);
  }, 3000);
}

function restartingGame(room) {
  room.state = RESTARTING;
  setTimeout(function(){
    runningGame(room);
  }, 3000);
}

function runningGame(room) {
  room.state = RUNNING;
}
