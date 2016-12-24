module.exports = function(db){
  this.db = db;

  this.getRooms = function() {
    var rooms;
    try {
      rooms = this.db.getData("/rooms");
    } catch (e) {}
    return rooms;
  }

  this.setRoom = function(room_id, room) {
    this.db.push("/rooms/" + room_id, room);
  }

  this.getRoom = function(room_id) {
    var room;
    try {
      room = this.db.getData("/rooms/" + room_id);
    } catch (e) {}
    return room;
  }

  this.removeRoom = function(room_id) {
    try {
      db.delete("/rooms/" + room_id);
    } catch (e) {}
  }

  this.getSpectator = function(room_id, socket_id){
    var blob;
    try {
      blob = this.db.getData("/rooms/" + room_id + "/spectators/" + socket_id);
    } catch (e) {}
    return blob;
  }

  this.getMember = function(room_id, socket_id){
    var blob;
    try {
      blob = this.db.getData("/rooms/" + room_id + "/members/" + socket_id);
    } catch (e) {}
    return blob;
  }

  this.setSpectator = function(room_id, socket_id, blob) {
    this.db.push("/rooms/" + room_id + "/spectators/" + socket_id, blob);
  }

  this.setMember = function(room_id, socket_id, blob){
    this.db.push("/rooms/" + room_id + "/members/" + socket_id, blob);
  }

  this.removeMember = function(room_id, socket_id) {
    this.db.delete("/rooms/" + room_id + "/members/" + socket_id);
  }

  this.removeSpectator = function(room_id, socket_id){
    this.db.delete("/rooms/" + room_id + "/spectators/" + socket_id);
  }

}
