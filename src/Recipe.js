const path = require('path');
const Ingredient = require(path.join(__dirname, 'Ingredient.js'));
const Item = require(path.join(__dirname, 'Item.js'));

module.exports = class Recipe {
  constructor() {
    this._id = null;
    this._name = null;          // name of recipe
    this._servings = null;      // servings of 1 recipe
    this._mealType = null;      // type of meal -- breakfast/lunch/dinner
    this._mealCategory = null;  // category of meal -- backpacking/car camping
    this._meatLevel = {
      Dairy: false,
      Gluten: false,
      Vegan: false,
      Vegetarian: false
    };                               // vegan, vegetarian, meat lovers, etc
    this._containsAllergen = false;  // boolean just checks if one of the
                                     // ingredients is considered an allergen
    this._allergenCache =
        false;  // cache so we don't have to keep checking all ingredients
    this._ingredients = new Array();  // list of ingredients
    this._directions = new Array();   // list of directions
  }

  // setters
  setId(id) {
    this._id = id;
  }
  setName(name) {
    this._name = name;
  }
  setServings(servings) {
    this._servings = servings;
  }
  setMealType(mealType) {
    this._mealType = mealType;
  }
  setMealCategory(mealCategory) {
    this._mealCategory = mealCategory;
  }

  setMeatLevel(key, value) {
    this._meatLevel[key] = value;
  }

  initMeatLevel(arrayFromDb) {
    if (typeof arrayFromDb === 'string') {
      this._meatLevel =
          {Dairy: false, Gluten: false, Vegan: false, Vegetarian: false};
    } else {
      this._meatLevel = arrayFromDb;
    }
    console.log(typeof this._meatLevel);
  }

  // getters
  getId() {
    return this._id;
  }
  getName() {
    return this._name;
  }
  getServings() {
    return this._servings;
  }
  getMealType() {
    return this._mealType;
  }
  getIngredients() {
    return this._ingredients;
  }
  getDirections() {
    return this._directions;
  }

  getMealCategory() {
    return this._mealCategory;
  }

  getMeatLevel() {
    return this._meatLevel;
  }

  addIngredient(ingredient) {
    this._ingredients.push(ingredient);
  }

  removeIngredientAt(index) {
    this._ingredients.splice(index, 1);
  }

  addDirection(direction) {
    this._directions.push(direction);
  }

  replaceDirectionAt(index, newText) {
    this._directions[index] = newText;
  }

  removeDirectionAt(index) {
    this._directions.splice(index, 1);
  }

  // methods
  hasAllergen() {
    if (!this._allergenCache) {
      for (var i = 0; i < this._ingredients.length(); i++) {
        // FIXME check what getAllergens() returns if nothing is in array
        if (this._ingredients[i].getAllergens() != null) {
          this._containsAllergen = true;
        }
        this._allergenCache = true;
      }
    }
    return this._containsAllergen
  }

  scaleRecipe(servingsNeeded) {
    for (var i = 0; i < this._ingredients.length; i++) {
      this._ingredients[i].getScaledAmountDescriptorItem(
          this._servings, servingsNeeded);
    }
  }

  // function to copy object made when sending over to edit page
  copyFromObject(obj) {
    this._id = obj.id;
    this._name = obj.name;
    this._servings = obj.servings;
    this._mealType = obj.mealType;
    this._mealCategory = obj.mealCategory;
    this._meatLevel = obj.meatLevel;
    for (var i in obj.ingredients) {
      var newIngredient = new Ingredient();
      newIngredient.setAmount(obj.ingredients[i]._amount);
      newIngredient.setDescriptor(obj.ingredients[i]._descriptor);
      newIngredient.setNote(obj.ingredients[i]._note);
      var newItem = new Item();
      newItem.setDbId(obj.ingredients[i]._item._dbId);
      newIngredient.setItem(newItem);
      this.addIngredient(newIngredient);
    }
    this._directions = obj.directions;
  }

  printRecipe(fileName) {
    console.log(this);
    var pdf = require('pdfkit');
    var fs = require('fs');
    var myDoc = new pdf;
    var notes;
    myDoc.pipe(fs.createWriteStream(fileName));
    myDoc.font('Times-Roman', 18)
        .text(this._name, {align: 'center'})
        .fontSize(12)
        .text('Servings: ' + this._servings)
        .moveDown()
        .moveDown()
        .fontSize(15)
        .text('Ingredients', {align: 'center'})
        .moveDown()
        .fontSize(12);
    for (var i = 0; i < this._ingredients.length; i++) {
      if (this._ingredients[i].getItem().getNote() == null) {
        notes = '';
      } else {
        notes = this._ingredients[i].getItem.getNote();
      }
      myDoc.text(
          this._ingredients[i].getAmount() + ' ' +
          this._ingredients[i].getDescriptor() + ' ' +
          this._ingredients[i].getItem().getDbId() + ' ' + notes);
    }
    myDoc.fontSize(15)
        .moveDown()
        .text('Directions', {align: 'center'})
        .moveDown()
        .fontSize(12);
    for (var i = 0; i < this._directions.length; i++) {
      myDoc.text((i + 1) + '. ' + this._directions[i]).moveDown();
    }
    myDoc.end();
  }
}
