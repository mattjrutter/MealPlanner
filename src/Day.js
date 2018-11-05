const path = require('path');
const Recipe = require(path.join(__dirname, 'Recipe.js'));


module.exports = class Day {
  constructor() {
    this._id = null;  // db id
    this._breakfast = new Recipe();
    this._lunch = new Recipe();
    this._dinner = new Recipe();
  }

  // setters
  setId(id) {
    this._id = id;
  }
  setBreakfast(breakfastRecipe) {
    this._breakfast = breakfastRecipe;
  }
  setLunch(lunchRecipe) {
    this._lunch = lunchRecipe;
  }
  setDinner(dinnerRecipe) {
    this._dinner = dinnerRecipe;
  }


  // getters
  getId() {
    return this._id;
  }

  getBreakfast() {
    return this._breakfast;
  }
  getLunch() {
    return this._lunch;
  }

  getDinner() {
    return this._dinner;
  }
}