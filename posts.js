
var GenericData = require('./generic_data.js');
var Post = require('./post.js');

module.exports = function(){
  this.post1 = new Post(0, GenericData.height/2 - 100, 20, "team_one");
  this.post2 = new Post(0, GenericData.height/2 + 100, 20, "team_one");
  this.post3 = new Post(GenericData.width, GenericData.height/2 - 100, 20, "team_two");
  this.post4 = new Post(GenericData.width, GenericData.height/2 + 100, 20, "team_two");

  this.posts = function(){
    var posts = {
      post1: this.post1,
      post2: this.post2,
      post3: this.post3,
      post4: this.post4
    };
    return posts;
  }

  this.postsObj = function(){
    var posts = {
      post1: this.post1.getObj(),
      post2: this.post2.getObj(),
      post3: this.post3.getObj(),
      post4: this.post4.getObj()
    }
    return posts;
  }
}
