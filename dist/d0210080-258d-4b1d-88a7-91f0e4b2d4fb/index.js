/*
function sleep(msec) {
  var promise = new Promise(function(resolve, reject){
    if (msec < 0) {
      return reject(new Error('msec must be greater than 0'));
    }
    setTimeout(function(){
      resolve(`you sleep ${msec}`);
    }, msec);
  });

  return promise;
}
*/

'use strict';

var marked0$0 = [genFunc].map(regeneratorRuntime.mark);
function genFunc() {
  var x;
  return regeneratorRuntime.wrap(function genFunc$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return sleep(-1);

      case 3:
        x = context$1$0.sent;

        console.log(x);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);

        console.log(context$1$0.t0.message);

      case 10:
        context$1$0.next = 12;
        return sleep(2000);

      case 12:
        x = context$1$0.sent;

        console.log(x);

        return context$1$0.abrupt('return', 'done genFunc');

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[0], this, [[0, 7]]);
}

/*
function async(genFunc) {
  var gen = genFunc();
  
  return new Promise(function(resolve, reject){
    onFulfilled();
    
    function onFulfilled(val) {
      try {
        var result = gen.next(val); 
      } catch (e) {
        return reject(e);
      }
      return chain(result);
    }
    
    function onRejected(e) {
      try {
        var result = gen.throw(e);        
      } catch (e) {
        return reject(e);
      }
      return chain(result);
    }
    
    function chain(result) {
      if (result.done) {
        return resolve(result.value);
      }
      
      var promise = result.value;
      if (promise instanceof Promise) {
        return promise.then(onFulfilled).catch(onRejected);        
      } else {
        reject(new Error('should be promise'));
      }

    }
  });
}

async(genFunc).then(function(val){
  console.log(val);
}).catch(function(e){
  console.log('done: ' + e.message);
});
*/

/*
you sleep 1000
you sleep 2000
done genFunc
*/

