var babel = require('babel-core');

var res = babel.transformFileSync('app.js');
console.log('res', res);