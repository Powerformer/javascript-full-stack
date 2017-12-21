'use strict';

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