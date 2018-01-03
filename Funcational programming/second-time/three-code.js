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