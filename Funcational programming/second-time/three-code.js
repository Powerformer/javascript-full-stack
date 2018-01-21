// reduce function parameter
function partial(fn, ...presetArgs) {
  return function partialApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

// object-styled partial
function partialProps(fn, presetArgsObj) {
  return function partiallyApplied(laterArgsObj) {
    return fn(Object.assign({}, presetArgsObj, laterArgsObj));
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

// object-styled curry
function curryProps(fn, arity = 1) {
  return (function nextCurried(prevArgsObj) {
    return function curried(nextArgObj = {}) {
      var [key] = Object.keys(nextArgObj);
      var allArgsObj = Object.assign({}, prevArgsObj, { [key]: nextArgObj[key] });

      if (Object.keys(allArgsObj).length >= arity) {
        return fn(allArgsObj);
      } else {
        return nextCurried(allArgsObj);
      }
    }
  })({});
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

// the Boolean is as the same effect as identity
Boolean

function constant(v) {
  return function value() {
    return v;
  };
}

// spread
function spreadArgs(fn) {
  return function spreadFn(argsArr) {
    return fn(...argsArr);
  };
}

// definitely order of args
function spreadArgProps(
	fn,
	propOrder =
		fn.toString()
		.replace( /^(?:(?:function.*\(([^]*?)\))|(?:([^\(\)]+?)\s*=>)|(?:\(([^]*?)\)\s*=>))[^]+$/, "$1$2$3" )
		.split( /\s*,\s*/ )
		.map( v => v.replace( /[=\s].*$/, "" ) )
) {
	return function spreadFn(argsObj) {
		return fn( ...propOrder.map( k => argsObj[k] ) );
	};
}

// gather
function gatherArgs(fn) {
  return function gatheredFn(...agrsArr) {
    return fn(argsArr);
  };
}

// in other functional library => complement
function not(predicate) {
  return function negated(...args) {
    return !predicate(...args);
  };
}

// when
function when(predicate, fn) {
  return function conditional(...args) {
    if (predicate(...args)) {
      return fn(...agrs);
    }
  };
}