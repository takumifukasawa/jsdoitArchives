// Generated by CoffeeScript 1.9.3
(function() {
  var b, c, obj, str;

  obj = {
    num: 15,
    func: function() {
      console.log(this.num);
      return setTimeout((function(_this) {
        return function() {};
      })(this), 1000);
    }
  };

  obj.func();

  str = "私は" + obj.num + "歳です";

  alert(str);

  b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

}).call(this);