const d3 = require('d3');

var PouchDB = require('pouchdb-browser');
var db = new PouchDB('http://localhost:5984/ingredients');


// db.destroy()
//     .then(function(response) {
//       console.log(response)
//     })
//     .catch(function(err) {
//       console.log(err);
//     });



d3.csv(
    'file:///home/rs/Projects/Software_Engineering/MealPlanner/dbstuff/produce.csv',
    function(data) {
      data.forEach(function(elm) {
        db.put({
            _id: elm.item_name,
            doc_type: 'ingredient',
            item_name: elm.item_name,
            descriptor: elm.descriptor,
            notes: elm.notes,
            dept: 'Produce'
          })
            .then(function(response) {
              console.log(response);
            })
            .catch(function(err) {
              console.log(err);
            })
        // console.log(elm.item_name + ' ' + elm.descriptor + ' ' +
        // elm.notes)
      });
    });