'use strict';

var a = Symbol('test');

console.log(a); // Symbol(test)
console.log(typeof a); // symbol

var b = Symbol('test');

console.log(a === b); // false

var c = Symbol['for']('test');
console.log(c); // Symbol(test);

console.log(Symbol.keyFor(b)); // undefined
console.log(Symbol.keyFor(c)); // 'test'

