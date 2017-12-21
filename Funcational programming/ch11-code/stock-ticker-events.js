
// data format: { id: "AAPL", price: 121.7, change: 0.01 }

function addStockName(stock) {
  return setProp('name', stock, stock.id);
}

function formatSign(val) {
  if (Number(val) > 0) {
    return `+${val}`;
  }

  return val;
}

function formatCurrency(val) {
  return `$${val}`;
}

function transformObservable(mapperFn, obsv) {
  // side effect
  return obsv.map(mapperFn);
}

function formatStockNumbers(stock) {
  var updateTuples = [
    ['price', formatPrice(stock.price)],
    ['change', formatChange(stock.change)]
  ];

  return reduce(function formatter(stock, [propName, val]) {
    return setProp(propName, stock, val) ;
  })(stock)(updateTuples);
}