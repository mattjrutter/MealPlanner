const path = require('path');
var PouchDB = require('pouchdb-browser');
var db = new PouchDB(
    'https://fcca7173-27dd-4d0c-b7f7-e4338966059d-bluemix.cloudant.com/recipes',
    {skip_setup: true});
var localDb = new PouchDB('recipes');


const Ingredient = require(path.join(__dirname, 'Ingredient.js'));
const Recipe = require(path.join(__dirname, 'Recipe.js'));


module.exports = class RecipeDBHelper {
  constructor(recipe) {
    this._recipe = recipe;
  }

  gatherIngredients() {
    var ingredients = new Array();
    this._recipe.getIngredients().forEach(function(element) {
      ingredients.push({
        amount: element.getAmount(),
        descriptor: element.getDescriptor(),
        itemID: element.getItem().getDbId(),
        note: element.getNote()
      })
    });
    return ingredients;
  }

  saveRecipe() {
    if (this._recipe.getId() == null) {
      localDb
          .put({
            _id: this._recipe.getName(),
            doc_type: 'recipe',
            recipe_name: this._recipe.getName(),
            servings: this._recipe.getServings(),
            mealType: this._recipe.getMealType(),
            mealCategory: this._recipe.getMealCategory(),
            meatLevel: this._recipe.getMeatLevel(),
            ingredients: this.gatherIngredients(),
            directions: this._recipe.getDirections()
          })
          .then(function(response) {
            console.log(response);
          })
          .catch(function(err) {
            console.log(err);
          })
    } else if (this._recipe.getId() == this._recipe.getName()) {
      localDb.get(this._recipe.getId())
          .then(function(doc) {
            return localDb.put({
              _id: this._recipe.getId(),
              _rev: doc._rev,
              doc_type: 'recipe',
              recipe_name: this._recipe.getName(),
              servings: this._recipe.getServings(),
              mealType: this._recipe.getMealType(),
              mealCategory: this._recipe.getMealCategory(),
              meatLevel: this._recipe.getMeatLevel(),
              ingredients: this.gatherIngredients(),
              directions: this._recipe.getDirections()
            });
          }.bind(this))
          .then(function(response) {
            console.log(response)
          })
          .catch(function(err) {
            console.log(err);
          });

    } else if (this._recipe.getId() != this._recipe.getName()) {
      localDb.get(this._recipe.getId())
          .then(function(doc) {
            return localDb.remove(doc._id, doc._rev);
          }.bind(this))
          .then(localDb.put({
            _id: this._recipe.getName(),
            doc_type: 'recipe',
            recipe_name: this._recipe.getName(),
            servings: this._recipe.getServings(),
            mealType: this._recipe.getMealType(),
            mealCategory: this._recipe.getMealCategory(),
            meatLevel: this._recipe.getMeatLevel(),
            ingredients: this.gatherIngredients(),
            directions: this._recipe.getDirections()
          }))
          .then(function(result) {
            console.log(result);
          })
          .catch(function(err) {
            console.log(err);
          });
    } else {
      alert('Something went Wrong!')
    }
  }
}
