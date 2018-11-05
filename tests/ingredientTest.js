const Ingredient = require('../src/Ingredient.js');
const Item = require('../src/Item.js');

var flour = new Item();
flour.setItemName('Flour');
flour.setDepartment('Bread/Pasta/Grains');
flour.setNote('comes in 1lb bags');

var ingredient = new Ingredient();

ingredient.setDescriptor('cup');
ingredient.setItem(flour);

var testPassed = new Array();
var testValue;
var expComp;
var expHum;
var compPass;
var humPass;

//++++++++++1++++++++
testValue = '1 1/2';
expComp = 1.5;
expHum = '1 1/2'
ingredient.setAmount(testValue);
compPass = ingredient.getAmount() == expComp;
humPass = ingredient.getHumanAmount() == expHum;
testPassed.push({compPass: compPass, humPass: humPass});

//++++++++++2++++++++
testValue = 1.5;
expComp = 1.5;
expHum = '1 1/2'
ingredient.setAmount(testValue);
compPass = ingredient.getAmount() == expComp;
humPass = ingredient.getHumanAmount() == expHum;
testPassed.push({compPass: compPass, humPass: humPass});

//++++++++++3++++++++
testValue = .6275;
expComp = .6275;
expHum = '2/3'
ingredient.setAmount(testValue);
compPass = ingredient.getAmount() == expComp;
humPass = ingredient.getHumanAmount() == expHum;
testPassed.push({compPass: compPass, humPass: humPass});

//++++++++++4++++++++
testValue = '1/3';
expComp = .3333333333333333;
expHum = '1/3'
ingredient.setAmount(testValue);
compPass = ingredient.getAmount() == expComp;
console.log(ingredient.getAmount())
humPass = ingredient.getHumanAmount() == expHum;
testPassed.push({compPass: compPass, humPass: humPass});

//++++++++++5++++++++
testValue = '2 2/3';
expComp = 2.6666666666666666;
expHum = '2 2/3'
ingredient.setAmount(testValue);
compPass = ingredient.getAmount() == expComp;
humPass = ingredient.getHumanAmount() == expHum;
testPassed.push({compPass: compPass, humPass: humPass});

//++++++++++6++++++++
testValue = '2 2/3';
expComp = 2.6666666666666666;
expHum = '2 2/3'
ingredient.setAmount(testValue);
compPass = ingredient.getAmount() == expComp;
humPass = ingredient.getHumanAmount() == expHum;
testPassed.push({compPass: compPass, humPass: humPass});

//++++++++++7++++++++
testValue = '1.9';
expComp = 1.9;
expHum = '2'
ingredient.setAmount(testValue);
compPass = ingredient.getAmount() == expComp;
humPass = ingredient.getHumanAmount() == expHum;
testPassed.push({compPass: compPass, humPass: humPass});



for (var i in testPassed) {
  console.log(
      '++++++++++' + (eval(i) + 1) + '+++++++++\n' +
      'CompPassed = ' + testPassed[i].compPass +
      '\nHumPassed = ' + testPassed[i].humPass + '\n' +
      'Both passed = ' + (testPassed[i].compPass && testPassed[i].humPass));
}