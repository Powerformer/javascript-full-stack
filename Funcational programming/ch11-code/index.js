function setProp(name,obj,val) {
	var o = Object.assign( {}, obj );
	o[name] = val;
	return o;
}

function addStockName(stock) {
  return setProp( "name", stock, stock.id );
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
function transformObservable(mapperFn,obsv){
  // return the observable, produce side effects
  return obsv.map( mapperFn );
}

// data { id: "AAPL", price: 121.7, change: 0.01 }

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

var unboundMethod = (methodName, argCount = 2) => (
  curry(
    (...args) => {
      var obj = args.pop();
      return obj[methodName](...args);
    },
    argCount,
  )
);

var formatDecimal = unboundMethod( "toFixed" )( 2 );
var formatPrice = pipe( formatDecimal, formatCurrency );
var formatChange = pipe( formatDecimal, formatSign );
var processNewStock = pipe( addStockName, formatStockNumbers );

// get the name of the event
var makeObservableFromEvent = curry( Rx.Observable.fromEvent, 2 )( server );

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

var observableMapperFns = [ processNewStock, formatStockNumbers ];

var [ newStocks, stockUpdates ] = pipe(
    map( makeObservableFromEvent ),
    curry( zip )( observableMapperFns ),
    map( spreadArgs( transformObservable ) )
)
( [ "stock", "stock-update" ] );


function isTextNode(node) {
  return node && node.nodeType == 3;
}
function getElemAttr(elem,prop) {
  return elem.getAttribute( prop );
}
function setElemAttr(elem,prop,val) {
  // 副作用！！
  return elem.setAttribute( prop, val );
}
function matchingStockId(id) {
  return function isStock(node){
      return getStockId( node ) == id;
  };
}
function isStockInfoChildElem(elem) {
  return /\bstock-/i.test( getClassName( elem ) );
}
function appendDOMChild(parentNode,childNode) {
  // 副作用！！
  parentNode.appendChild( childNode );
  return parentNode;
}
function setDOMContent(elem,html) {
  // 副作用！！
  elem.innerHTML = html;
  return elem;
}

var createElement = document.createElement.bind( document );

var getElemAttrByName = curry( reverseArgs( getElemAttr ), 2 );
var getStockId = getElemAttrByName( "data-stock-id" );
var getClassName = getElemAttrByName( "class" );

function stripPrefix(prefixRegex) {
  return function mapperFn(val) {
      return val.replace( prefixRegex, "" );
  };
}
function listify(listOrItem) {
  if (!Array.isArray( listOrItem )) {
      return [ listOrItem ];
  }
  return listOrItem;
}

var getDOMChildren = pipe(
  listify,
  flatMap(
      pipe(
          curry( prop )( "childNodes" ),
          Array.from
      )
  )
);

function filter(predicateFn,arr) {
  var newList = [];

  for (let idx = 0; idx < arr.length; idx++) {
      if (predicateFn( arr[idx], idx, arr )) {
          newList.push( arr[idx] );
      }
  }

  return newList;
}

var filterIn = filter;

function filterOut(predicateFn,arr) {
    return filterIn( not( predicateFn ), arr );
}

function getStockElem(tickerElem,stockId) {
  return pipe(
      getDOMChildren,
      filterOut( isTextNode ),
      filterIn( matchingStockId( stockId ) )
  )
  ( tickerElem );
}
function getStockInfoChildElems(stockElem) {
  return pipe(
      getDOMChildren,
      filterOut( isTextNode ),
      filterIn( isStockInfoChildElem )
  )
  ( stockElem );
}