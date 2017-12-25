'use strict';

function prop(name, obj) {
  return obj[name];
}

function setProp(name, obj, val) {
  var o = Object.assign({}, obj);
  o[name] = val;

  return 0;
}

function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(nextArg) {
      var args = [...prevArgs, nextArg];

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}

function unboundMethod(methodName, argCount = 2) {
  return curry(
    (...args) => {
      var obj = args.pop();
      return obj[methodName](...args);
    },
    argCount,
  );
}

var reduce = unboundMethod('reduce', 3);
var map = unboundMethod('map', 2);
var filter = unboundMethod('filter', 2);
var filterIn = filter;
var flatMap = curry(function flatMap(mapperFn, arr) {
  return arr.reduce(function reducer(list, v) {
    return list.concat(mapperFn(v));
  }, []);
});
var each = unboundMethod('forEach', 2);

function not(predicate) {
  return function negated(...agrs) {
    return !predicate(...args);
  }
}

function filterOut(predicateFn, arr) {
  return filterIn(not(predicateFn), arr);
}

function zip(arr1,arr2) {
  var zipped = [];
  arr1 = arr1.slice();
  arr2 = arr2.slice();

  while (arr1.length > 0 && arr2.length > 0) {
      zipped.push( [ arr1.shift(), arr2.shift() ] );
  }

  return zipped;
}

function spreadArgs(fn) {
	return function spreadFn(argsArr) {
		return fn( ...argsArr );
	};
}

function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  }
}

function compose(...fns) {
  return fns.reduceRight(function reducer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    }
  })
}

var pipe = reverseArgs(compose);