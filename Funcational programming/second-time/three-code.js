// reduce function parameter
function partial(fn, ...presetArgs) {
  return function partialApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}