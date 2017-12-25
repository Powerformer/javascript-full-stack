// data { id: "AAPL", price: 121.7, change: 0.01 }

function formatCurrency(val) {
  return `$${val}`;
}

function formatSign(val) {
  if (Number(val) > 0) {
      return `+${val}`;
  }
  return val;
}

function addStockName(stock) {
  return setProp( "name", stock, stock.id );
}

function formatStockNumbers(stock) {
  var updateTuples = [
      [ "price", formatPrice( stock.price ) ],
      [ "change", formatChange( stock.change ) ]
  ];

  return reduce( function formatter(stock,[propName,val]){
      return setProp( propName, stock, val );
  } )
  ( stock )
  ( updateTuples );
}

var formatDecimal = unboundMethod( "toFixed" )( 2 );
var formatPrice = pipe( formatDecimal, formatCurrency );
var formatChange = pipe( formatDecimal, formatSign );
var processNewStock = pipe( addStockName, formatStockNumbers );

// get the name of the event
var makeObservableFromEvent = curry( Rx.Observable.fromEvent, 2 )( server );

var observableMapperFns = [ processNewStock, formatStockNumbers ];

function transformObservable(mapperFn,obsv){
  // return the observable, produce side effects
  return obsv.map( mapperFn );
}

var [ newStocks, stockUpdates ] = pipe(
    map( makeObservableFromEvent ),
    curry( zip )( observableMapperFns ),
    map( spreadArgs( transformObservable ) )
)
( [ "stock", "stock-update" ] );


