// higher-order function
// function input function
function forEach(list, fn) {
  for (const i = 0; i < list.length; i++) {
    fn(list[i]);
  }
}

forEach([1, 2, 3, 4, 5], function each(val) {
  console.log(val);
});

// function output function
function foo() {
  var fn = function inner(msg) {
    console.log(msg);
  };

  return fn;
}

var f = foo();
f('Hello!');

// the other form
function foo_second() {
  var fn = function inner(msg) {
    console.log(msg);
  };

  bar(fn);
}

function bar(func) {
  func('Hello!');
}

foo_second();

// Closure
function person(id) {
  var randNumber = Math.random();

  return function identity() {
    console.log('I am ' + id + ': ' + randNumber );
  };
}

var fred = person('Fred');
var susan = person('susan');

fred(); // I am Fred: 0.8331252801601532
susan(); // I am susan: 0.3940753308893741


// partial and curry
function makeAdder(x) {
  return function sum(y) {
    return x + y;
  };
}

var addTo10 = makeAdder(10);
var addTo37 = makeAdder(37);

addTo10(3);  // 13
addTo37(90); // 127


// if function is just value, memory it use function
function formatter(formatFn) {
  return function inner(str) {
    return formatFn(str);
  };
}

var lower = formatter(function formatting(v) {
  return v.toLowerCase();
});

var upperFirst = formatter(function formatting(v) {
  return v[0].toUpperCase() + v.substr(1).toLowerCase();
});

lower('WOW') // wow
upperFirst('hello') // Hello