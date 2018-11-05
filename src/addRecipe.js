// import {platform} from 'os';

// Java Script for addRecipeWindow.html

const path = require('path');
const Recipe = require(path.join(__dirname, 'Recipe.js'));
const Ingredient = require(path.join(__dirname, 'Ingredient.js'));
const RecipeDBHelper = require(path.join(__dirname, 'RecipeDBHelper.js'));

const electron = require('electron');

// get thee recipe passed on from edit button click and window creation
var currentWindow = electron.remote.getCurrentWindow();

var recipe = new Recipe();


// if it is the edit window
if (currentWindow.recipeId != undefined) {
  // copy contents of object  sent over to Recipe object
  recipe.copyFromObject(currentWindow.recipeId.recipeIdSend.recipeID);
  // change the header text of the page
  var pageHeader = document.getElementById('pageHeader');
  pageHeader.textContent = 'Edit Recipe';
  // bump buttons over for continuity with addRecipe (since 'Add new Recipe' is
  // wider than 'Edit Recipe')
  var addItemBtn = document.querySelector('.addNewIngredientBtn');
  addItemBtn.style.marginLeft = '47%';
}

// Event handler to save recipe
var saveButton = document.querySelector('.saveButton');
saveButton.addEventListener('click', function(e) {
  if (recipe.getName() == null) {
    alert('Please enter a "Name"');
  } else if (recipe.getServings() == null) {
    alert('Please enter "Servings"');
  } else if (recipe.getMealType() == null) {
    alert('Please select "Type"');
  } else if (recipe.getIngredients().length == 0) {
    alert('Please enter an "Ingredient"');
  } else {
    dbhelper = new RecipeDBHelper(recipe);
    dbhelper.saveRecipe();
    alert('Recipe added/edited');
  }
  // FIXME handle asyc of update function
  // location.reload();
});

const {ipcRenderer} = electron;

// Gen PDF button
var genPdfBtn = document.querySelector('.printPDFButton');
genPdfBtn.addEventListener('click', function() {
  ipcRenderer.send('printRecipe', false);
});

// Listen for async-reply message from main process
ipcRenderer.on('printRecipeReply', (event, fileName) => {
  console.log(typeof fileName);
  genPdf(fileName);
});

function genPdf(fileName) {
  recipe.printRecipe(fileName);
}


// Event handlers to build the text of the recipe

// get entry id
var recipeNameEntry = document.querySelector('#recipeNameEntry');
// if recipe name exists (editing a recipe) set the name and populate the recipe
// text
if (recipe.getName()) {
  recipeNameEntry.value = recipe.getName();
  popRecName();
}

// event handler for name entry
recipeNameEntry.addEventListener('keyup', popRecName);

function popRecName() {
  // get id to print text
  var recipeNamePrint = document.querySelector('#recipeNamePrint');
  // get value inside entry box
  var recipeName = document.createTextNode(recipeNameEntry.value);
  // clear the html as they type -- so text doesn't append on
  recipeNamePrint.innerHTML = '';
  // append the text to the recipe
  recipeNamePrint.appendChild(recipeName);
  // set name of recipe object
  recipe.setName(recipeName.textContent);
};

// recipe servings handle
var recipeServingsEntry = document.querySelector('#recipeServingsEntry');
// if servings exists (editing a recipe) populate the recipe side
if (recipe.getServings()) {
  recipeServingsEntry.value = recipe.getServings();
  popServings();
}
recipeServingsEntry.addEventListener('keyup', popServings);

function popServings() {
  var recipeServingsPrint = document.querySelector('#recipeServingsPrint');
  var recipeServings =
      document.createTextNode('Serves: ' + recipeServingsEntry.value);
  recipeServingsPrint.innerHTML = '';
  recipeServingsPrint.appendChild(recipeServings);
  // set servings of recipe object
  recipe.setServings(recipeServingsEntry.value);
};

// recipeType Dropdown
var recipeTypeDrop = document.querySelector('#recipeTypeDrop');
// if editing a recipe
if (recipe.getMealType()) {
  recipeTypeDrop.value = recipe.getMealType();
  popRecType();
}
recipeTypeDrop.addEventListener('click', popRecType);

function popRecType() {
  var recipeTypePrint = document.querySelector('#recipeTypePrint');
  var recipeType = document.createTextNode(recipeTypeDrop.value);
  recipeTypePrint.innerHTML = '';
  recipeTypePrint.appendChild(recipeType);
  // set recipe type of recipe object
  recipe.setMealType(recipeType.textContent);
};

var recipeCategoryDrop = document.querySelector('#recipeCategoryDrop');
// if eding a recipe
if (recipe.getMealCategory()) {
  recipeCategoryDrop.value = recipe.getMealCategory();
  popRecCategory();
}
recipeCategoryDrop.addEventListener('click', popRecCategory);

function popRecCategory() {
  var recipeCategoryPrint = document.querySelector('#recipeCategoryPrint');
  var recipeCategory = document.createTextNode(recipeCategoryDrop.value);
  recipeCategoryPrint.innerHTML = '';
  recipeCategoryPrint.appendChild(recipeCategory);
  // set recipe category of recipe object
  recipe.setMealCategory(recipeCategory.textContent);
};

// Event handlers to cathc change
var dairyCheck = document.getElementById('Dairy');
var glutenCheck = document.getElementById('Gluten');
var veganCheck = document.getElementById('Vegan');
var vegeCheck = document.getElementById('Vegetarian');
dairyCheck.addEventListener('change', function() {
  recipe.setMeatLevel('Dairy', document.getElementById('Dairy').checked);
  popMeatLevel();
});

glutenCheck.addEventListener('change', function() {
  recipe.setMeatLevel('Gluten', document.getElementById('Gluten').checked);
  popMeatLevel();
});

veganCheck.addEventListener('change', function() {
  recipe.setMeatLevel('Vegan', document.getElementById('Vegan').checked);
  popMeatLevel();
});
vegeCheck.addEventListener('change', function() {
  recipe.setMeatLevel(
      'Vegetarian', document.getElementById('Vegetarian').checked)
  popMeatLevel();
})


// if editing recipe

if (recipe.getMeatLevel()) {
  if (recipe.getMeatLevel().Dairy == true) {
    document.getElementById('Dairy').checked = true;
  }
  if (recipe.getMeatLevel().Gluten == true) {
    document.getElementById('Gluten').checked = true;
  }
  if (recipe.getMeatLevel().Vegan == true) {
    document.getElementById('Vegan').checked = true;
  }
  if (recipe.getMeatLevel().Vegetarian == true) {
    document.getElementById('Vegetarian').checked = true;
  }

  popMeatLevel();
}


function popMeatLevel() {
  var recipeMeatLevelPrint = document.querySelector('#recipeMeatLevelPrint');
  var text = '';
  if (recipe.getMeatLevel().Dairy == true) {
    text = text + 'Dairy Free' +
        ' ';
  }
  if (recipe.getMeatLevel().Gluten == true) {
    text = text + 'Gluten Free' +
        ' ';
  }
  if (recipe.getMeatLevel().Vegan == true) {
    text = text + 'Vegan' +
        ' ';
  }
  if (recipe.getMeatLevel().Vegetarian == true) {
    text = text + 'Vegetarian' +
        ' ';
  }
  var recipeMeatLevel = document.createTextNode(text);
  recipeMeatLevelPrint.innerHTML = '';
  recipeMeatLevelPrint.appendChild(recipeMeatLevel);
  // set meat level of recipe object
  // recipe.setMeatLevel(recipeMeatLevel.textContent);
};

// Add ingredient event handler
var addIngredientBtn = document.querySelector('#addIngredientBtn');
// if editing recipe handle populating each ingredient
if (recipe.getIngredients().length != 0) {
  // grab the entry boxes
  var ingredientAmount = document.querySelector('.entryIngAmountCol');
  var ingredientDescriptor = document.querySelector('.entryIngDescCol');
  var ingredientItem = document.querySelector('.entryIngItemCol');



  var ingredientNotes = document.querySelector('.noteCol');
  var ingArray = recipe.getIngredients();
  for (var i in ingArray) {
    // for each ingredient set the entry box value to the appropriate values
    ingredientAmount.value = ingArray[i].getHumanAmount();
    ingredientDescriptor.value = ingArray[i].getDescriptor();
    ingredientItem.value = ingArray[i].getItem().getDbId()
    // console.log(ingredientItem.value = ingArray[i].getItem().getDbId())
    ingredientNotes.value = ingArray[i].getNote()
    // call popIngredient with isEdit = true
    popIngredient(true);
  }
}
addIngredientBtn.addEventListener('click', function() {
  // since this is not edit recipe call popIngredient with isEdit = false
  popIngredient(false);
});

// populate the ingredients and (if not edit) add to recipe.
// isEdit set to true when recipe is being edit, false for new recipe
function popIngredient(isEdit) {
  // select text from entry boxes
  var ingredientAmount = document.querySelector('.entryIngAmountCol');
  var ingredientDescriptor = document.querySelector('.entryIngDescCol');
  var ingredientItem = document.querySelector('.entryIngItemCol');
  var ingredientNotes = document.querySelector('.noteCol');
  // validate entry
  if (ingredientAmount.value == '' || ingredientItem.value == '') {
    if (ingredientAmount.value == '' && ingredientItem.value == '')
      alert('Must Enter Amount and Ingredient');
    else if (ingredientItem.value == '')
      alert('Must Enter Ingredient')
      else alert('Must Enter Amount')
  } else {
    // check if ingredientItem is in approved list of items
    var found = false;
    var i = 0;
    while (!found && i < allItemsArray.length) {
      if (allItemsArray[i].getItemName() == ingredientItem.value) {
        found = true;
      }
      ++i;
    }
    // to aoid async conflict when editing a recipe,
    // go ahead and use the the DbId of the item in the recipe being edited.
    // (since isEdit would be true)
    if (found || isEdit) {
      // append to recipe
      // make ingredient header visible
      var headers = document.querySelectorAll('#ingredientHeader');
      headers.forEach(function(elm) {
        elm.style.visibility = 'visible';
      });
      var ul = document.querySelector('#recipeIngredientList');
      ul.addEventListener('contextmenu', ingredientRightClick);
      var li = document.createElement('li');
      // tool tip
      li.title = 'Right click for Options';
      var ingredientText = ingredientAmount.value + ' ' +
          ingredientDescriptor.value + ' ' + ingredientItem.value;
      if (ingredientNotes.value != '') {
        ingredientText += ' - ' + ingredientNotes.value;
      }
      // var item = new Item();
      // item.setDbId(ingredientItem.value);
      // var ingredient = new Ingredient();
      // ingredient.setAmount(ingredientAmount.value)
      li.appendChild(document.createTextNode(ingredientText));
      ul.appendChild(li);

      // if not editing make new ingredient Ingredient object
      if (!isEdit) {
        var ingredient = new Ingredient();
        ingredient.setAmount(ingredientAmount.value);
        ingredient.setDescriptor(ingredientDescriptor.value);
        // Poplate item obj from array
        ingredient.setItem(findItemInArray(ingredientItem.value));
        ingredient.setNote(ingredientNotes.value)
        // add ingredient to recipe object
        recipe.addIngredient(ingredient);
      }
      // reset ingredient form
      document.getElementById('ingredientForm').reset();
      // move cursor to first box
      ingredientAmount.focus();
      // console.log(recipe.getIngredients().length);
    }

    else {
      alert('invalid ingredient item');
    }
  }
};

function findItemInArray(compare) {
  for (var i in allItemsArray) {
    if (allItemsArray[i].getItemName() == compare) return allItemsArray[i];
  }
}

// add directions button event handler
var dirButton = document.querySelector('.dirButton');
// if editding recipe populate directions
if (recipe.getDirections().length != 0) {
  var directionEntry = document.querySelector('#directionEntry');
  var dirArray = recipe.getDirections();
  for (var i in dirArray) {
    directionEntry.value = dirArray[i];
    // isEdit flag set to true
    popDirection(true);
  }
}
dirButton.addEventListener('click', function() {
  // isEdit flag set to false
  popDirection(false)
});

function popDirection(isEdit) {
  var headers = document.querySelectorAll('#directionHeader')
  headers.forEach(function(elm) {
    elm.style.visibility = 'visible';
  });
  var directionEntry = document.querySelector('#directionEntry');
  if (directionEntry.value != '') {
    var ol = document.querySelector('#recipeDirectionList');


    ol.addEventListener('contextmenu', directionRightClick);


    var li = document.createElement('li');
    // tool tip
    li.title = 'Right Click for Options';
    var directionText = document.createTextNode(directionEntry.value);
    li.appendChild(directionText);
    li.style.marginBottom = '3%';
    ol.appendChild(li);
    // if not edditing add new direction to recipe object
    if (!isEdit) {
      recipe.addDirection(directionText.textContent);
    }
    //   reset directions form
    document.getElementById('directionForm').reset();
    // move cursor to directions box
    directionEntry.focus();
  } else {
    alert('Must enter a direction!');
  }
};


// event handler for the replace button
var dirReplaceButton = document.querySelector('.dirReplaceButton');
dirReplaceButton.addEventListener('click', replaceDir)

// global variable to capture the direction target
var dirIndex;
var dirTarget;
// event handlers for direction righclick popup
var div = document.getElementById('rightClickDirectionPopUp');
var li_edit = document.getElementById('editDir');
var li_del = document.getElementById('deleteDir');
div.addEventListener('mouseover', function() {
  div.addEventListener('mouseleave', function() {
    div.style.visibility = 'hidden';
  });
});
li_edit.addEventListener('click', function() {
  // edit direction fired with dirIndex event
  editDirection(dirTarget)
  div.style.visibility = 'hidden';
});
li_del.addEventListener('click', function() {
  removeDirection(dirTarget);
  div.style.visibility = 'hidden';
});

function directionRightClick(e) {
  // set dir index to the event which is then passed to the functions when
  // called
  dirTarget = e
  // reposition the menu and make visible
  div.style.visibility = 'visible';
  div.style.position = 'absolute';
  div.style.left = e.x + 'px';
  div.style.top = e.y + 'px';
  div.style.zIndex = '999';
  console.log(e.x, e.y);
}

function removeDirection(e) {
  e.preventDefault();
  e.stopPropagation();
  recipe.removeDirectionAt($(e.target).index());
  e.target.remove();
}


function editDirection(e) {
  var addBtn = document.querySelector('.dirButton');
  var replaceBtn = document.querySelector('.dirReplaceButton');

  // hide/show buttons
  addBtn.style.visibility = 'hidden';
  replaceBtn.style.visibility = 'visible';

  // set dir index to the target
  dirIndex = e.target;

  // set entry box to the direction that was clicked
  var directionEntry = document.querySelector('#directionEntry');
  directionEntry.value = e.target.textContent
}

function replaceDir() {
  var addBtn = document.querySelector('.dirButton');
  var replaceBtn = document.querySelector('.dirReplaceButton');
  var directionEntry = document.querySelector('#directionEntry');

  // replace direction in array
  recipe.replaceDirectionAt($(dirIndex).index(), directionEntry.value);
  // replace text in recipe builder
  $(dirIndex).text(directionEntry.value);

  // show/hide buttons again
  addBtn.style.visibility = 'visible';
  replaceBtn.style.visibility = 'hidden';
  // reset entry box
  document.getElementById('directionForm').reset();
}

// global variable to capture the ingredient target
var ingTarget;
// event handlers for direction righclick popup
var div_ing = document.getElementById('rightClickIngredientPopUp');
var li_edit_ing = document.getElementById('editIng');
var li_del_ing = document.getElementById('deleteIng');
div_ing.addEventListener('mouseover', function() {
  div_ing.addEventListener('mouseleave', function() {
    div_ing.style.visibility = 'hidden';
  });
});
li_edit_ing.addEventListener('click', function() {
  // edit direction fired with dirIndex event
  editIngredient(ingTarget);
  div_ing.style.visibility = 'hidden';
});
li_del_ing.addEventListener('click', function() {
  removeIngredient(ingTarget);
  div_ing.style.visibility = 'hidden';
});


function removeIngredient(e) {
  e.preventDefault();
  e.stopPropagation();
  // remove ingredient from recipe ingredients array
  recipe.removeIngredientAt($(e.target).index());
  // remove from html
  e.target.remove();
  var ingredientAmount = document.querySelector('.entryIngAmountCol');
  var ingredientDescriptor = document.querySelector('.entryIngDescCol');
  var ingredientItem = document.querySelector('.entryIngItemCol');
  var ingredientNotes = document.querySelector('.noteCol');
  ingredientAmount.value = '';
  ingredientDescriptor.value = '';
  ingredientItem.value = '';
  ingredientNotes.value = '';
}
var ingIndex;
function editIngredient(e) {
  var addBtn = document.querySelector('.ingButton');
  var replaceBtn = document.querySelector('.ingReplaceButton');

  // hide/show buttons
  addBtn.style.visibility = 'hidden';
  replaceBtn.style.visibility = 'visible';

  // set dir index to the target
  ingIndex = e.target;

  // set entry boxes to the ingredient that was clicked

  var ingredientAmount = document.querySelector('.entryIngAmountCol');
  var ingredientDescriptor = document.querySelector('.entryIngDescCol');
  var ingredientItem = document.querySelector('.entryIngItemCol');
  var ingredientNotes = document.querySelector('.noteCol');
  ingredientAmount.value =
      recipe.getIngredients()[$(e.target).index()].getAmount();
  ingredientDescriptor.value =
      recipe.getIngredients()[$(e.target).index()].getDescriptor();
  ingredientItem.value =
      recipe.getIngredients()[$(e.target).index()].getItem().getDbId();
  ingredientNotes.value =
      recipe.getIngredients()[$(e.target).index()].getNote();
}

// event handler for the replace button
var ingReplaceButton = document.querySelector('.ingReplaceButton');
ingReplaceButton.addEventListener('click', replaceIngredient)

function replaceIngredient() {
  var addBtn = document.querySelector('.ingButton');
  var replaceBtn = document.querySelector('.ingReplaceButton');
  var directionEntry = document.querySelector('#directionEntry');

  // edit ingredient in array
  var ingredientAmount = document.querySelector('.entryIngAmountCol');
  var ingredientDescriptor = document.querySelector('.entryIngDescCol');
  var ingredientItem = document.querySelector('.entryIngItemCol');
  var ingredientNotes = document.querySelector('.noteCol');
  recipe.getIngredients()[$(ingIndex).index()].setAmount(
      ingredientAmount.value);
  recipe.getIngredients()[$(ingIndex).index()].setDescriptor(
      ingredientDescriptor.value);
  recipe.getIngredients()[$(ingIndex).index()].setItem(
      findItemInArray(ingredientItem.value));
  recipe.getIngredients()[$(ingIndex).index()].setNote(ingredientNotes.value);

  // replace text in recipe builder
  var ingredientText = ingredientAmount.value + ' ' +
      ingredientDescriptor.value + ' ' + ingredientItem.value;
  if (ingredientNotes.value != '') {
    ingredientText = ingredientText + ' - ' + ingredientNotes.value;
  }
  $(ingIndex).text(ingredientText);

  // show/hide buttons again
  addBtn.style.visibility = 'visible';
  replaceBtn.style.visibility = 'hidden';

  // reset entry boxes
  // reset ingredient form
  document.getElementById('ingredientForm').reset();
  // move cursor to first box
  ingredientAmount.focus();
  // console.log(recipe.getIngredients().length);
}

function ingredientRightClick(e) {
  // set ingredient index to the target
  ingTarget = e;
  var div_ing = document.getElementById('rightClickIngredientPopUp');

  div_ing.style.visibility = 'visible';
  div_ing.style.position = 'absolute';
  div_ing.style.left = e.x + 'px';
  div_ing.style.top = e.y + 'px';
  div_ing.style.zIndex = '999';

  console.log(e.x, e.y);
}
