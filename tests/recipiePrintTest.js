const path = require('path');
const Recipe = require('../src/Recipe.js');
const Ingredient = require('../src/Ingredient.js');
const Item = require('../src/Item.js');

//   ITEMS
var dbId = "Tomato sauce";
var itemName = "Tomato sauce";
var note = "";
var department = "Canned goods";
var allergen = "can";
var item = new Item();
item.setDbId(dbId);
item.setNote(note);
item.setItemName(itemName);
item.setDepartment(department);

var dbId1 = "Mozzarella cheese";
var itemName1 = "Mozzarella cheese";
var note1 = "shredded";
var department1 = "Dairy";
var allergen1 = "Dairy";
var item1 = new Item();
item1.setDbId(dbId1);
item1.setItemName(itemName1);
item1.setNote(note1);
item1.setDepartment(department1);
item1.addAllergen(allergen1);

var dbId2 = "Meatball";
var itemName2 = "Meatball";
var note2 = "beef";
var department2 = "Meat";
var allergen2 = "Meat";
var item2 = new Item();
item2.setDbId(dbId2);
item2.setItemName(itemName2);
item2.setNote(note2);
item2.setDepartment(department2);
item2.addAllergen(allergen2);

var dbId3 = "Dough";
var itemName3 = "Dough";
var department3 = "Grains";
var allergen3 = "Gluten";
var item3 = new Item();
item3.setDbId(dbId3);
item3.setItemName(itemName3);
item3.setDepartment(department3);
item3.addAllergen(allergen3);

//   INGREDIENTS
var id = "Tomatoe sauce";
var amount = 16;
var descriptor = "oz";
var ingredient = new Ingredient();
ingredient.setId(id);
ingredient.setAmount(amount);
ingredient.setDescriptor(descriptor);
ingredient.setItem(item);

var id1 = "Mozzarella cheese";
var amount1 = 4;
var descriptor1 = "cup";
var ingredient1 = new Ingredient();
ingredient1.setId(id1);
ingredient1.setAmount(amount1);
ingredient1.setDescriptor(descriptor1);
ingredient1.setItem(item1);

var id2 = "Meatball";
var amount2 = 200;
var descriptor2 = "each";
var ingredient2 = new Ingredient();
ingredient2.setId(id2);
ingredient2.setAmount(amount2);
ingredient2.setDescriptor(descriptor2);
ingredient2.setItem(item2);
// ingredient2.getScaledAmountDescriptorItem(3, 6);

var id3 = "Dough";
var amount3 = 10;
var descriptor3 = "ounce";
var ingredient3 = new Ingredient();
ingredient3.setId(id3);
ingredient3.setAmount(amount3);
ingredient3.setDescriptor(descriptor3);
ingredient3.setItem(item3);


//  RECIPE
var name = "Meatball Pizza";
var servings = 3;
var mealType = "Dinner";
var mealCategory = "Backpacking";
var direction = "Roll out dough to about 1/4 inch thick."
var direction1 = "Add layer of pizza sauce to dough having it be an even layer of sauce evenly distributed throughout the entire layer of dough, while not having to much sauce on, but also not having to little amount of sauce";
var direction2 = "Add cheese to dough and sauce, again make sure to have an even layer of cheese so some people don't get a slice that has no cheese(no one likes that)";
var direction3 = "Add meatballs to pizza, now it says 200, but as my grandpappy use to tell me there is no such thing as to many meatballs. So go ahead an pile on as many as you want until you feel there is an appropriate amount of meatballs on the pizza.";
var direction4 = "Bake at 425 F for 1 hour. This will change proportionatly to the amount of extra meatballs you put on the pizza.";
var direction5 = "Take out and let sit for approx. 30 seconds before cutting pizza into exaclty 9 slices.";
var recipe = new Recipe();
recipe.setName(name);
recipe.setServings(servings);
recipe.setMealType(mealType);
recipe.setMealCategory(mealCategory);
recipe.addIngredient(ingredient);
recipe.addIngredient(ingredient1);
recipe.addIngredient(ingredient2);
recipe.addIngredient(ingredient3);
recipe.addDirection(direction);
recipe.addDirection(direction1);
recipe.addDirection(direction2);
recipe.addDirection(direction3);
recipe.addDirection(direction4);
recipe.addDirection(direction5);

// recipe.scaleRecipe(6);

//   PDF
var pdf = require('pdfkit');
var fs = require('fs');
var myDoc = new pdf;
myDoc.pipe(fs.createWriteStream('testRecipie.pdf'));
// HEADER
myDoc.font('Times-Roman', 18)
     .text(recipe.getName(), {
       align: 'center'
     })
     .fontSize(12)
     .text("Servings: " + recipe.getServings(), 100)
     .moveDown()
     .moveDown()
     .fontSize(14)
     .text("Ingredients", {
       align: 'center'
     })
     .moveDown()
     .fontSize(12);
// INGREDIENTS
var ingredients = recipe.getIngredients();
var i;
var j;
var length = ingredients.length;
var amounts;
var scaledIngredient;
var descriptors;
var itemNames;
var notes;
var allergens = new Array();
for(i = 0; i < length; i++)
{
  scaledIngredient = ingredients[i].getScaledAmountDescriptorItem(3, 12);
  amounts = scaledIngredient.amount;
  descriptors = scaledIngredient.descriptor;
  itemNames = scaledIngredient.item.getItemName();
  if(ingredients[i].getItem().getNote() == null){
    notes = "";
  }
  else{
    notes = ingredients[i].getItem().getNote();
  }
  myDoc.text(amounts + " " + descriptors + " " + itemNames + " " + notes, 100);
  for(j = 0; j < ingredients[i].getItem().getAllergens().length; j++)
  {
    allergens.push(ingredients[i].getItem().getAllergens()[j]);
  }
}
// DIRECTIONS
myDoc.fontSize(14)
     .moveDown()
     .text("Directions", {
       align: 'center'
     })
     .moveDown()
     .fontSize(12);
var directions = recipe.getDirections();
var dirLength = directions.length;
for (i = 0; i < dirLength; i++)
{
  myDoc.text((i + 1) + ". " + directions[i], 100)
       .moveDown();
}
// ALLERGENS
myDoc.fontSize(8)
     .text("*contains " + allergens, {
       align: 'right'
     });
myDoc.end();
