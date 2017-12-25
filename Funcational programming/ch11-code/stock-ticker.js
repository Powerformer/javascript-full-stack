// curry( reverseArgs( getElemAttr ), 2 )
// to compare partialRight() enhance performance
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

function matchingStockId(id) {
  return function isStock(node){
      return getStockId( node ) == id;
  };
}

function isStockInfoChildElem(elem) {
  return /\bstock-/i.test( getClassName( elem ) );
}

// dom operate util function
function isTextNode(node) {
  return node && node.nodeType == 3;
}

function setElemAttr(elem,prop,val) {
  // 副作用！！
  return elem.setAttribute( prop, val );
}

function getElemAttr(elem, prop) {
  return elem.getAttribute( prop );
}



function appendDOMChild(parentNode,childNode) {
  // 副作用！！
  parentNode.appendChild( childNode );
  return parentNode;
}

var createElement = document.createElement.bind( document );


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

function setDOMContent(elem,html) {
  // 副作用！！
  elem.innerHTML = html;
  return elem;
}

var stockTickerUI = {
  updateStock(tickerElem, data) {
    var getStockElemFromId = curry(getStockElem)(tickerElem);
    var stockInfoChildElemList = pipe(
      getStockElemFromId,
      getStockInfoChildElems,
    )(data.id);

    return stockTickerUI.updateStockElems(
      stockInfoChildElemList,
      data,
    );
  },
  updateStockElems(stockInfoChildElemList, data) {
    var getDataVal = curry(reverseArgs(prop), 2)(data);
    var extractInfoChildElemVal = pipe(
      getClassName,
      stripPrefix(/\bstock-/i),
      getDataVal,
    );
    var orderedDataVals = map(extractInfoChildElemVal)(stockInfoChildElemList);
    var elemsValsTuples = filterOut(function updateValueMissing([infoChildElem, val]) {
      return val === undefined;
    })
    (zip(stockInfoChildElemList, orderedDataVals));

    compose(each, spreadArgs)
    (setDOMContent)
    (elemsValsTuples);
  },
  addStock(tickerElem, data) {
    var [stockElem, ...infoChildElems] = map(createElement)(
      ['li', 'span', 'span', 'span'],
    );
    var attrValTuples = [
      [ ["class","stock"], ["data-stock-id",data.id] ],
      [ ["class","stock-name"] ],
      [ ["class","stock-price"] ],
      [ ["class","stock-change"] ]
    ];
    var elemsAttrsTuples = zip(
      [stockElem, ...infoChildElems],
      attrValTuples,
    );

    each(function setElemAttrs([elem, attrValTupleList]) {
      each(spreadArgs(partial(setElemAttr, elem)))(attrValTupleList);
    })(elemsAttrsTuples);
  }
}