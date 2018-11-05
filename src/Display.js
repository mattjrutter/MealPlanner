var PouchDB = require('pouchdb-browser');
var db = new PouchDB(
    'https://fcca7173-27dd-4d0c-b7f7-e4338966059d-bluemix.cloudant.com/ingredients',
    {skip_set: true});

var localDb = new PouchDB('ingredients');

function ToTop() {
  var container = document.getElementById('tab_content');
  container.scrollTop = 0;
}

function openAddWin() {
  var myWindow = window.open(
      'AddIngredient.html', 'Add Ingredient', 'height=410,width=350');
  return 0;  // Opens a new window
}

function openEditWin(department, name, notes) {
  var myWindow = window.open(
      'EditIngredient.html?name=' + name + '&dept=' + department +
          '&notes=' + notes,
      'Edit Ingredient', 'width=350,height=410');
  // //alert(department);
}

function EditIngredient() {
  var x = document.getElementById('frm2');
  // alert(y);
  z = document.getElementById('btn');

  if (z.name != x.elements[1].value) {
    localDb.get(z.name).then(function(doc) {
      return localDb.remove(doc);
    });

    localDb.post({
      _id: x.elements[1].value,
      doc_type: 'ingredient',
      item_name: x.elements[1].value,
      descriptor: 'cups',
      notes: x.elements[2].value,
      dept: x.elements[0].value,
    })
    alert('Succesfully added entry!');
  } else {
    localDb.get(z.name).then(function(doc) {
      // update their values
      doc.notes = x.elements[2].value;
      doc.dept = x.elements[0].value;
      // put them back
      return localDb.put(doc);
    })
    alert('Succesfully edited entry!')
  }
}


function AddIngredient() {
  var x = document.getElementById('frm');
  localDb.post({
    _id: x.elements[1].value,
    doc_type: 'ingredient',
    item_name: x.elements[1].value,
    descriptor: 'cups',
    notes: x.elements[2].value,
    dept: x.elements[0].value,
  })
  alert('Succesfully added ' + x.elements[1].value);
  var Ingredients = document.getElementById('Ingredients');
  Ingredients.reload();
}
