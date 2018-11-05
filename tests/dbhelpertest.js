const path = require('path');


const Recipe = require(path.join(__dirname, '..', 'src', 'Recipe.js'));
const RecipeDBHelper =
    require(path.join(__dirname, '..', 'src', 'RecipeDBHelper.js'));
const Ingredient = require(path.join(__dirname, '..', 'src', 'Ingredient.js'));
const Item = require(path.join(__dirname, '..', 'src', 'Item.js'));


var item1 = new Item();
var item2 = new Item();

var ingredient1 = new Ingredient();
var ingredient2 = new Ingredient();

var recipe = new Recipe();

item1.setDbId(1);
item1.setItemName('item1');
item1.setNote('item1 note');
item1.setDepartment('dept1');

item2.setDbId(2);
item2.setItemName('item2');
item2.setNote('item2 note');
item2.setDepartment('dept2');

ingredient1.setId(1);
ingredient1.setAmount('1/2');
ingredient1.setItem(item1);
ingredient1.setDescriptor('cup');
ingredient1.setNote('shredded');

ingredient2.setId(2);
ingredient2.setAmount('1');
ingredient2.setItem(item2);
ingredient2.setDescriptor('oz');
ingredient2.setNote('packaged');

recipe.setName('recipe1');
recipe.setServings(4);
recipe.setMealType('mealtype');
recipe.setMealCategory('mealCategory');
recipe.setMeatLevel('meatLevel');
recipe.addIngredient(ingredient1);
recipe.addIngredient(ingredient2);
recipe.addDirection('cook');
recipe.addDirection('prepare');

var dbhelper = new RecipeDBHelper(recipe);
dbhelper.saveRecipe();