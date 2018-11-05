const path = require('path');
const Item = require(path.join(__dirname, 'Item.js'));
const Converter = require(path.join(__dirname, 'Converter.js'));


module.exports = class Ingredient {
  constructor() {
    this._amount = null;
    this._descriptor = null;  // how much of this ingredient
    this._item = new Item();  // item
    this._note = null;        // note on ingredient chopped-sliced-pickled-etc
  }


  getAmount() {
    return this._amount;
  }

  getHumanAmount() {
    return this.convertAmountToString(this._amount);
  }

  getItem() {
    return this._item;
  }
  getDescriptor() {
    return this._descriptor;
  }
  getNote() {
    return this._note;
  }


  // returns object of scaled amount, descriptor, and item;
  getScaledAmountDescriptorItem(recipeServings, servingsNeeded) {
    var converter = new Converter(
        this.scaleAmount(recipeServings, servingsNeeded), this._descriptor);
    var converted = converter.getConversion();
    return {
      amount: converted.amount, descriptor: converted.descriptor,
          item: this._item
    }
  }

  setAmount(amount) {
    this._amount = this.convertAmountToNum(amount);
  }

  setItem(item) {
    this._item = item;
  }

  setDescriptor(descriptor) {
    this._descriptor = descriptor;
  }

  setNote(note) {
    this._note = note;
  }

  scaleAmount(recipeServings, servingsNeeded) {
    return (servingsNeeded / recipeServings) * this._amount;
  }

  convertAmountToNum(toNum) {
    var num = toNum;
    if (typeof toNum != 'number') {
      if (num.indexOf(' ') > 0) {
        var whole = num.slice(0, num.indexOf(' '));
        var frac = num.slice(num.indexOf(' '), num.length);
        num = eval(whole) + eval(frac);
      } else {
        num = eval(toNum);
      }
    }

    return num
  }

  convertAmountToString(num) {
    // FIXME 8th's  and 3rd's
    var strNum = String(num);
    if (strNum.indexOf('.') == -1) {
      return strNum
    } else {
      var whole = strNum.slice(0, strNum.indexOf('.'))
      var dec = strNum.slice(strNum.indexOf('.') + 1, strNum.length)
      if (dec.length > 3) {
        dec = dec.slice(0, 3);
      }
      if (dec.length < 3) {
        if (dec.length < 2) {
          dec = dec * 100
        } else {
          dec = dec * 10
        }
      }

      dec = this.findEigthThird(dec);

      var great = this.reduce(dec)
      var numerator = dec / great;
      var denom = 1000 / great;
      var frac;
      // console.log(numerator / denom)

      if (numerator / denom == .3 || numerator / denom == .33 ||
          numerator / denom == .333) {
        frac = '1/3'
      } else if (
          numerator / denom == .6 || numerator / denom == .66 ||
          numerator / denom == .666) {
        frac = '2/3'
      } else if (
          numerator / denom == .9 || numerator / denom == .99 ||
          numerator / denom == .999) {
        return String(eval(whole) + 1)
      } else {
        frac = String(dec / great) + '/' + String(1000 / great)
      }
      if (eval(whole) == 0) {
        return frac
      } else {
        return whole + ' ' + frac
      }
    }
  }

  reduce(numerator) {
    var numInt = parseInt(numerator);

    // find greatest common factor
    var great = 0;
    for (var i = 1; i <= numInt; i++) {
      if (numInt % i == 0 && 1000 % i == 0) {
        great = i;
      }
    }
    return great;
  }

  findEigthThird(numerator) {
    var numInt = parseInt(numerator);
    var third_diff = 9999;
    var eighth_diff = 9999;
    var t_round = 0;
    var e_round = 0;

    for (var turd = 333; turd < 1000; turd += 333) {
      if (Math.abs(turd - numInt) < third_diff) {
        third_diff = Math.abs(turd - numInt)
        t_round = turd;
      }
    }

    for (var eighth = 125; eighth < 1000; eighth += 125) {
      if (eighth - numInt > -1 && eighth - numInt < eighth_diff) {
        eighth_diff = eighth - numInt;
        e_round = eighth;
      }
    }

    if (Math.abs(numInt - t_round) < Math.abs(numInt - e_round)) {
      return t_round
    } else {
      return e_round
    }
  }
};
