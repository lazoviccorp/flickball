module.exports = {
  getRandom : function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getRandomFromArray : function(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
  },

  lerp : function(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
  },

  dist: function(x1, y1, x2, y2) {
    var xs = 0;
    var ys = 0;

    xs = x2 - x1;
    xs = xs * xs;

    ys = y2 - y1;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  }
}
