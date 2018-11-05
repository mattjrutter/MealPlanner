const path = require('path');
const Recipe = require('../src/Recipe.js');
const Ingredient = require('../src/Ingredient.js');
const Item = require('../src/Item.js');
const Day = require('../src/Day.js');
const Trip = require('../src/Trip.js');
const Converter = require('../src/Converter.js');

module.exports = class ShoppingList {
  constructor() {
    this._list = new Array();
  }

  getList() {
    return this._list;
  }

  createShppingList(trip) {
    console.log(trip);
    var breakfast;
    var lunch;
    var dinner;
    var days = trip.getDays();
    for (var i = 0; i < days.length; i++) {
      breakfast = days[i].getBreakfast();
      lunch = days[i].getLunch();
      dinner = days[i].getDinner();
      this.addIngredients(trip, breakfast);
      this.addIngredients(trip, lunch);
      this.addIngredients(trip, dinner);
    }
  }

  addIngredients(trip, recipe) {
    var ingredients = recipe.getIngredients();
    for (var i = 0; i < ingredients.length; i++) {
      this.consolidate(ingredients[i].getScaledAmountDescriptorItem(
          recipe.getServings(), trip.getHeadCount()));
    }
  }

  consolidate(ingredient) {
    var found = false;
    var i = 0;
    var converter = new Converter();
    var temp;

    while (!found && (i < this._list.length)) {
      if (ingredient.item.getItemName() == this._list[i].item.getItemName()) {
        if (ingredient.descriptor == this._list[i].descriptor) {
          this._list[i].amount = this._list[i].amount + ingredient.amount;
          converter.setAmount(this._list[i].amount);
          converter.setDescriptor(this._list[i].descriptor);
          temp = converter.getConversion();
          this._list[i].amount = temp.amount;
          this._list[i].descriptor = temp.descriptor;
          found = true;
        } else {
          converter.normalize(ingredient, this._list[i]);
          var temp;
          temp = converter.getConversion();
          if (temp.amount != -1) {
            this._list[i].amount = temp.amount;
            this._list[i].descriptor = temp.descriptor;
            found = true;
          }
        }
      }
      i = i + 1;
    }
    if (!found) {
      this._list.push(ingredient);
    }
  }

  print(trip, fileName) {
    var breadPastaGrains = new Array();
    var dairy = new Array();
    var produce = new Array();
    var meatProtein = new Array();
    var packagedFrozen = new Array();
    var spicesOils = new Array();
    var condimentsDessings = new Array();
    var canned = new Array();
    var misc = new Array();
    var pdf = require('pdfkit');
    var fs = require('fs');
    var myDoc = new pdf;
    myDoc.pipe(fs.createWriteStream(fileName));
    for (var i = 0; i < this._list.length; i++) {
      switch (this._list[i].item.getDepartment()) {
        case 'Bread/Pasta/Grains':
          breadPastaGrains.push(this._list[i]);
          break;
        case 'Dairy':
          dairy.push(this._list[i]);
          break;
        case 'Produce':
          produce.push(this._list[i]);
          break;
        case 'Meat/Protein':
          meatProtein.push(this._list[i]);
          break;
        case 'Packaged/Frozen':
          packagedFrozen.push(this._list[i]);
          break;
        case 'Spices/Oils':
          spicesOils.push(this._list[i]);
          break;
        case 'Condiments/Dressings':
          condimentsDessings.push(this._list[i]);
          break;
        case 'Canned':
          canned.push(this._list[i]);
          break;
        case 'Misc':
          misc.push(this._list[i]);
          break;
      }
    }

    //  SCHEDULE
    var schedule = trip.getSchedule();
    var j = 1;
    var k = 0;
    myDoc.font('Times-Roman', 18)
        .text(trip.getTripName(), {align: 'center'})
        .text(trip.getDate(), {align: 'center'})
        .text('Schedule', {align: 'center'})
        .moveDown()
        .fontSize(12);
    for (var i = 0; i < schedule.length; i++) {
      if (k == 8) {
        myDoc.addPage()
            .font('Times-Roman', 18)
            .text(trip.getTripName(), {align: 'center'})
            .text(trip.getDate(), {align: 'center'})
            .text('Schedule', {align: 'center'})
            .moveDown()
            .fontSize(12);
        k = 0;
      }
      myDoc.fontSize(14)
          .text('Day ' + (j))
          .fontSize(12)
          .text('Breakfast: ' + schedule[i])
          .text('Lunch: ' + schedule[i + 1])
          .text('Dinner: ' + schedule[i + 2])
          .moveDown();
      i = i + 2;
      j = j + 1;
      k = k + 1;
    }
    myDoc.addPage();


    //  PRINTING THE SHOPPING LIST
    myDoc.font('Times-Roman', 18)
        .text(trip.getTripName(), {align: 'center'})
        .text(trip.getDate(), {align: 'center'})
        .text('Shopping List', {align: 'center'})
        .moveDown()
        .fontSize(15)
        .text('Bread/Pasta/Grains')
        .moveDown()
        .fontSize(12);
    for (var i = 0; i < breadPastaGrains.length; i++) {
      myDoc.text(
          breadPastaGrains[i].item.getItemName() + ' ' +
          this.convertAmountToString(breadPastaGrains[i].amount) + ' ' +
          breadPastaGrains[i].descriptor);
    }
    myDoc.moveDown().fontSize(15).text('Dairy').moveDown().fontSize(12);
    for (var i = 0; i < dairy.length; i++) {
      myDoc.text(
          dairy[i].item.getItemName() + ' ' +
          this.convertAmountToString(dairy[i].amount) + ' ' +
          dairy[i].descriptor);
    }
    myDoc.moveDown().fontSize(15).text('Produce').moveDown().fontSize(12);
    for (var i = 0; i < produce.length; i++) {
      myDoc.text(
          produce[i].item.getItemName() + ' ' +
          this.convertAmountToString(produce[i].amount) + ' ' +
          produce[i].descriptor);
    }
    myDoc.moveDown().fontSize(15).text('Meat/Protein').moveDown().fontSize(12);
    for (var i = 0; i < meatProtein.length; i++) {
      myDoc.text(
          meatProtein[i].item.getItemName() + ' ' +
          this.convertAmountToString(meatProtein[i].amount) + ' ' +
          meatProtein[i].descriptor);
    }
    myDoc.moveDown()
        .fontSize(15)
        .text('Packaged/Frozen')
        .moveDown()
        .fontSize(12);
    for (var i = 0; i < packagedFrozen.length; i++) {
      myDoc.text(
          packagedFrozen[i].item.getItemName() + ' ' +
          this.convertAmountToString(packagedFrozen[i].amount) + ' ' +
          packagedFrozen[i].descriptor);
    }
    myDoc.moveDown().fontSize(15).text('Spices/Oils').moveDown().fontSize(12);
    for (var i = 0; i < spicesOils.length; i++) {
      myDoc.text(
          spicesOils[i].item.getItemName() + ' ' +
          this.convertAmountToString(spicesOils[i].amount) + ' ' +
          spicesOils[i].descriptor);
    }
    myDoc.moveDown()
        .fontSize(15)
        .text('Condiments/Dressings')
        .moveDown()
        .fontSize(12);
    for (var i = 0; i < condimentsDessings.length; i++) {
      myDoc.text(
          condimentsDessings[i].item.getItemName() + ' ' +
          this.convertAmountToString(condimentsDessings[i].amount) + ' ' +
          condimentsDessings[i].descriptor);
    }
    myDoc.moveDown().fontSize(15).text('Canned').moveDown().fontSize(12);
    for (var i = 0; i < canned.length; i++) {
      myDoc.text(
          canned[i].item.getItemName() + ' ' +
          this.convertAmountToString(canned[i].amount) + ' ' +
          canned[i].descriptor);
    }
    myDoc.moveDown().fontSize(15).text('Misc.').moveDown().fontSize(12);
    for (var i = 0; i < misc.length; i++) {
      myDoc.text(
          misc[i].item.getItemName() + ' ' +
          this.convertAmountToString(misc[i].amount) + ' ' +
          misc[i].descriptor);
    }

    //  PRINTING THE RECIPES
    var recipeList = trip.getRecipes();
    var notes;
    var allergens = new Array();
    var scaledIngredient;
    for (var i = 0; i < recipeList.length; i++) {
      var ingredients = recipeList[i].getIngredients();
      myDoc.addPage()
          .font('Times-Roman', 18)
          .text(trip.getTripName(), {align: 'center'})
          .text(trip.getDate(), {align: 'center'})
          .text(recipeList[i].getName(), {align: 'center'})
          .fontSize(12)
          .text('Servings: ' + trip.getHeadCount())
          .moveDown()
          .moveDown()
          .fontSize(15)
          .text('Ingredients', {align: 'center'})
          .moveDown()
          .fontSize(12);
      for (var j = 0; j < ingredients.length; j++) {
        scaledIngredient = ingredients[j].getScaledAmountDescriptorItem(
            recipeList[i].getServings(), trip.getHeadCount());
        if (ingredients[j].getItem().getNote() == null) {
          notes = '';
        } else {
          notes = ingredients[j].getItem().getNote();
        }
        myDoc.text(
            this.convertAmountToString(scaledIngredient.amount) + ' ' +
            scaledIngredient.descriptor + ' ' +
            scaledIngredient.item.getItemName() + ' ' + notes);
        for (var k = 0; k < ingredients[j].getItem().getAllergens().lenght;
             k++) {
          allergens.push(ingredients[j].getItem().getAllergens()[k]);
        }
      }
      myDoc.fontSize(15)
          .moveDown()
          .text('Directions', {align: 'center'})
          .moveDown()
          .fontSize(12);
      for (var j = 0; j < recipeList[i].getDirections().length; j++) {
        myDoc.text((j + 1) + '. ' + recipeList[i].getDirections()[j])
            .moveDown();
      }
      // myDoc.fontSize(8).text('*contains ' + allergens, {align: 'right'});
    }
    myDoc.end();
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
}
