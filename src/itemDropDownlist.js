

const path = require('path');
var PouchDB = require('pouchdb-browser');
var db = new PouchDB('ingredients');

const Item = require(path.join('..', 'src', '/Item.js'));

var ingredient;
var item;

// change to != when not testing on linux
if (process.platform != 'darwin') {
  var datalist = document.getElementById('itemsDataList');
} else {
  var entryRow = document.getElementById('entryBoxes')
  var div_macList = document.createElement('div');
  div_macList.className = 'macList';
  div_macList.style.visibility = 'hidden'
  entryRow.appendChild(div_macList);
  var ingredientItem = document.querySelector('.entryIngItemCol');
  ingredientItem.addEventListener('keyup', function() {
    div_macList.style.visibility = 'visible'
    var searchStr = ingredientItem.value;
    if (searchStr.length == 0) {
      div_macList.style.visibility = 'hidden';
    } else {
      // filter list of items
      var results = allItemsArray.filter(function(value) {
        return value.getItemName().toLowerCase().indexOf(
                   searchStr.toLowerCase()) >= 0;
      });
      console.log(results);
      // list the filterd results
      listMacList(results);
    }
  });
}

// Mac version of ingredient filter
function listMacList(arrayToList) {
  var item = new Item();
  var div_macList = document.querySelector('.macList');
  div_macList.innerHTML = ''
  var ul_macList = document.createElement('ul');
  if (arrayToList.length == 0) {
    div_macList.style.visibility = 'hidden';
  } else {
    for (var i in arrayToList) {
      item = arrayToList[i];
      var li_macList = document.createElement('li');
      li_macList.textContent = item.getItemName();
      li_macList.addEventListener('click', function(e) {
        var ingredientItem = document.querySelector('.entryIngItemCol');
        console.log($(e.target).text())
        ingredientItem.value = $(e.target).text()
        div_macList.style.visibility = 'hidden';
      });
      ul_macList.appendChild(li_macList);
    }
    div_macList.appendChild(ul_macList);
  }
}



function fetchIngredients() {
  allItemsArray.splice(0, allItemsArray.length);
  db.allDocs({
      include_docs: true,
    }).then(function(result) {
    ingredients = JSON.parse(JSON.stringify(result));
    for (ingredient in ingredients.rows) {
      item = new Item();
      item.setDbId(ingredients.rows[ingredient].doc._id);
      item.setItemName(ingredients.rows[ingredient].doc.item_name)
      item.setDepartment(ingredients.rows[ingredient].doc.dept);
      if (ingredients.rows[ingredient].doc.notes == undefined) {
        item.setNote('');
      } else {
        // console.log(ingredients.rows[ingredient].doc.notes);
        item.setNote(ingredients.rows[ingredient].doc.notes);
      }
      if (process.platform != 'darwin') {
        var option = document.createElement('option');
        option.value = item.getItemName();
        option.innerHTML = item.getItemName();
        datalist.appendChild(option);
      }

      allItemsArray.push(item);
    }
    if (process.platform == 'darwin') {
      listMacList(allItemsArray);
    }
  });
}

fetchIngredients();

db.changes({since: 'now', live: true}).on('change', function(change) {
  // clear out innter html to prevent duplicate after adding new
  // ingredient
  var datalist = document.getElementById('itemsDataList');
  datalist.innerHTML = ''
  fetchIngredients();
});
