const path = require('path');
const ShoppingList = require(path.join(__dirname, 'ShoppingList.js'));

module.exports = class Trip {
  constructor() {
    this._id = null;
    this._tripName = null;
    this._headCount = null;
    this._days = new Array();
    this._shoppingList = null;
    this._date = null;
  }

  setTripId(id) {
    this._id = id;
  }

  setTripName(tripName) {
    this._tripName = tripName;
  }

  setHeadCount(headCount) {
    this._headCount = headCount;
  }
  addDay(Day) {
    this._days.push(Day);
  }

  setDate(date) {
    this._date = date;
  }

  getTripId() {
    return this._id;
  }

  getTripName() {
    return this._tripName;
  }

  getHeadCount() {
    return this._headCount;
  }

  getDays() {
    return this._days;
  }

  getDate() {
    return this._date;
  }
  removeDay() {
    this._days.splice(-1, 1);
  }

  getRecipes() {
    var recipeList = new Array();
    var found = false;
    for (var i = 0; i < this._days.length; i++) {
      if (this._days[i].getBreakfast().getId() != null) {
        for(var j = 0; j < recipeList.length; j++){
          if(recipeList[j] == this._days[i].getBreakfast()){
            found = true;
          }
        }
        if(!found){
          recipeList.push(this._days[i].getBreakfast());
        }
        found = false;
      }
      if (this._days[i].getLunch().getId() != null) {
        for(var j = 0; j < recipeList.length; j++){
          if(recipeList[j] == this._days[i].getLunch()){
            found = true;
          }
        }
        if(!found){
          recipeList.push(this._days[i].getLunch());
        }
        found = false;
      }
      if (this._days[i].getDinner().getId() != null) {
        for(var j = 0; j < recipeList.length; j++){
          if(recipeList[j] == this._days[i].getDinner()){
            found = true;
          }
        }
        if(!found){
          recipeList.push(this._days[i].getDinner());
        }
        found = false;
      }
    }
    return recipeList;
  }

  getSchedule() {
    var schedule = new Array();
    for (var i = 0; i < this._days.length; i++) {
      if (this._days[i].getBreakfast().getName() != null) {
        schedule.push(this._days[i].getBreakfast().getName());
      } else {
        schedule.push('N/A');
      }
      if (this._days[i].getLunch().getName() != null) {
        schedule.push(this._days[i].getLunch().getName());
      } else {
        schedule.push('N/A');
      }
      if (this._days[i].getDinner().getName() != null) {
        schedule.push(this._days[i].getDinner().getName());
      } else {
        schedule.push('N/A');
      }
    }
    return schedule;
  }

  // methods

  printTrip(fileName) {
    console.log('printTrip "this"', this);
    console.log('printTrip breakfast', this._days[0].getBreakfast())
    var shoppingList = new ShoppingList();
    shoppingList.createShppingList(this);
    shoppingList.print(this, fileName);
  }
}
