const path = require('path');
const Converter = require('../src/Converter.js');


var amount = .33;
var unit = 'tbs';

var converter = new Converter(amount, unit);
console.log(converter.getConversion())

amount = 10;
unit = 'fl-oz';
converter.setAmount(amount);
converter.setDescriptor(unit);
console.log(converter.getConversion());

amount = 16;
unit = 'oz';
converter.setAmount(amount);
converter.setDescriptor(unit);
console.log(converter.getConversion());
