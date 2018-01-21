function compose(...fns) {
  return function composed(result) {
    var list = fns.slice();

    while (list.length > 0) {
      result = list.pop()(result);
    }

    return result;
  };
}

// compose version 2
// functional way: reduce
function compose(...fns) {
  return function composed(result) {
    return fns.reverse().reduce(function reducers(result, fn) {
      return fn(result);
    }, result);
  };
}

// compose version 3
// multi params, lazy execuate
function compose(...fns) {
  return fns.reverse().reduce(function reducer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    };
  });
}

// compose version 4
// recursive define compose
function compose(...fns) {
  var [fn1, fn2, ...rest] = fns.reverse();

  var composedFn = function composed(...args) {
    return fn2(fn1(...args));
  };

  if (rest.length === 0) {
    return composedFn;
  }

  return compose(...rest.reverse(), composedFn);
}