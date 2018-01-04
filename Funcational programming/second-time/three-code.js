// reduce function parameter
function partial(fn, ...presetArgs) {
  return function partialApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  };
}

function partialRight(fn, ...presetArgs) {
  return reverseArgs(
    partial(reverseArgs(fn), ...presetArgs.reverse())
  );
}

function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(nextArgs) {
      var args = prevArgs.concat([nextArgs]);

      if (args.length >= arity) {
        return fn(...args); 
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}

function looseCurry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      var args = prevArgs.concat(nextArgs);

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}

function uncurry(fn) {
  return function uncurried(...args) {
    var ret = fn;

    for (const i = 0; i < args.length; i++) {
      ret = ret(args[i]);
    }

    return ret;
  };
}

function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
}

function identity(v) {
  return v;
}