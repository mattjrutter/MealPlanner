// const path = require('path');
// const Recipe = require(path.join(__dirname, 'Recipe.js'));
// const Trip = require(path.join(__dirname, 'Trip.js'));

// const TripDBHelper = require(path.join(__dirname, 'TripDBHelper.js'));
const TripDBHelper = require('../src/TripDBHelper.js');

// var PouchDB = require('pouchdb-browser');



// event listener for collapse toggle
var toggleListBtn = document.querySelector('.toggleListBtn');
toggleListBtn.addEventListener('click', function(e) {
  var tripContents = document.querySelector('.tripContents');

  // check if the trip title exists
  var checkTripName = document.getElementById('entry_tripName');
  if (checkTripName == null) {
    var tripDBHelper = new TripDBHelper(activeTrip);
    tripDBHelper.saveTrip();
    expandRight(tripContents);
  } else {
    if (!checkTripName.value == '' &&
        checkTripName.value.replace(/\s/g, '').length) {
      // save new trip
      var tripDBHelper = new TripDBHelper(activeTrip);
      tripDBHelper.saveTrip();
      expandRight(tripContents);
    } else {
      alert('Trip name cannot be blank');
    }
  }
});



// Event Listener for new trip button
var createTripBtn = document.querySelector('.createTripBtn');
createTripBtn.addEventListener('click', newTrip);


// function that creates new trip
function newTrip() {
  collapseLeft();
  var tripContents = document.querySelector('.tripContents');
  // clear inner html
  tripContents.innerHTML = '';
  activeTrip = new Trip();
  // allTripsArray.push(activeTrip)
  editTrip(undefined, activeTrip);
}

// main function to edit/create trips
function editTrip(e, activeTrip) {
  var tripContentsTop = document.createElement('div');
  tripContentsTop.className = 'tripContentsTop row';
  // get trip contents tag to populate it
  var tripContents = document.querySelector('.tripContents');
  // clear inner html
  tripContents.innerHTML = '';
  //** create trip display **//
  // createand append recipe name as h2
  if (activeTrip.getTripName() != null) {
    var h2_tripName = document.createElement('h2');
    h2_tripName.appendChild(document.createTextNode(activeTrip.getTripName()));
    h2_tripName.className = 'row';
    tripContentsTop.appendChild(h2_tripName);
  } else {
    var entry_tripName = document.createElement('input');
    entry_tripName.id = 'entry_tripName';
    entry_tripName.placeholder = 'Enter trip name...'
    entry_tripName.addEventListener('keyup', function(tripNameEvent) {
      activeTrip.setTripName(entry_tripName.value);
      populateTripsSidebar();
    });


    tripContentsTop.appendChild(entry_tripName);
  }

  const electron = require('electron');
  const {ipcRenderer} = electron;

  // Gen PDF button
  var genPdfBtn = document.createElement('button');
  genPdfBtn.className = 'genPdfBtn btn-primary row';
  genPdfBtn.appendChild(document.createTextNode('Generate PDF'));
  genPdfBtn.addEventListener('click', function() {
    ipcRenderer.send('saveFile', false);
  });

  // Listen for async-reply message from main process
  ipcRenderer.on('saveFileReply', (event, fileName) => {
    console.log(typeof fileName);
    genPdf(fileName);
  });

  function genPdf(fileName) {
    activeTrip.printTrip(fileName);
  }

  tripContentsTop.appendChild(genPdfBtn);
  tripContents.appendChild(tripContentsTop);


  // div_headCountRow
  var div_headCountRow = document.createElement('div');
  div_headCountRow.className = 'headTitleInput row';
  // create and append headcount p tag
  var p_tripHeadCount = document.createElement('p');
  // create input for number
  var input_headCount = document.createElement('input');
  input_headCount.type = 'number';
  input_headCount.min = '0';
  input_headCount.value =
      activeTrip.getHeadCount();  // populate with current head count
  // reset headcount to changed amount
  input_headCount.addEventListener('change', function(evt) {
    activeTrip.setHeadCount(input_headCount.value);
  });
  // add to trip contents
  p_tripHeadCount.appendChild(document.createTextNode('Head Count:'));
  div_headCountRow.appendChild(p_tripHeadCount);
  div_headCountRow.appendChild(input_headCount);
  tripContents.appendChild(div_headCountRow);

  var div_daysRow = document.createElement('div');
  div_daysRow.className = 'daysTitleInput row';
  // input box for number of days
  var p_num_days = document.createElement('p');
  p_num_days.appendChild(document.createTextNode('Number of Days:'));

  input_dayAdder = document.createElement('input');
  input_dayAdder.type = 'number';
  input_dayAdder.min = '0';
  input_dayAdder.value = activeTrip.getDays().length;
  input_dayAdder.addEventListener('change', function() {
    dayAdder(tripContents)
  });
  div_daysRow.appendChild(p_num_days);
  div_daysRow.appendChild(input_dayAdder);
  tripContents.appendChild(div_daysRow)
  // loop through days and populate
  displayDays(tripContents);
}



// function that expands side bbar with trips right
function expandRight(tripContents) {
  var toggleListBtn = document.querySelector('.toggleListBtn');
  // clear inner html
  tripContents.innerHTML = '';
  // hide the Plus button expander
  toggleListBtn.style.visibility = 'hidden';
  // uncollapse the list
  var colDiv = document.querySelector('.left');
  colDiv.style.width = '20%';
  colDiv.style.overflow = 'scroll';
  // resize the middle column
  var colDivM = document.querySelector('.middle');
  colDivM.style.width = '70%';
  $(colDivM).css('border-radius', '0px 10px 10px 0px');
  // resize the right column
  var colDivR = document.querySelector('.right');
  colDivR.style.width = '0%';
  // make list visible again
  var ul = document.querySelector('.tripsList');
  ul.style.visibility = 'visible';
  // make add button visible again
  var addBtn = document.querySelector('.createTripBtn');
  addBtn.style.visibility = 'visible';
  window.location.reload();
}



// function to add or subtract days
function dayAdder(tripContents) {
  if (activeTrip.getDays().length > input_dayAdder.value) {
    while (activeTrip.getDays().length > input_dayAdder.value) {
      activeTrip.removeDay()
    }
  } else {
    var i = 0;
    while (i < input_dayAdder.value &&
           activeTrip.getDays().length < input_dayAdder.value) {
      activeTrip.addDay(new Day());
      i++;
    }
  }
  displayDays(tripContents);
}



// function do display the different days of the trip
function displayDays(tripContents) {
  var daysDiv = document.getElementById('daysContainer');
  if (daysDiv == null) {
    daysDiv = document.createElement('div');
    daysDiv.id = 'daysContainer';
  } else {
    daysDiv.innerHTML = '';
  }
  // var tripContents = document.querySelector('.tripContents');
  activeTrip.getDays().forEach(function(day, idx) {
    var h4_dayHeader = document.createElement('h4');
    h4_dayHeader.appendChild(document.createTextNode('Day ' + (idx + 1)));
    daysDiv.appendChild(h4_dayHeader);
    // tripContents.appendChild(h4_dayHeader);

    // create ondrop/dragonver attributes
    var onDropAtt = document.createAttribute('ondrop');
    onDropAtt.value = 'drop(event)';
    var onDragoverAtt = document.createAttribute('ondragover');
    onDragoverAtt.value = 'allowDrop(event)';

    // create class attribute
    var dropMealClass = document.createAttribute('class');
    dropMealClass.value = 'mealDrop';


    var ul_days = document.createElement('ul');


    // breakfast
    var li_meal = document.createElement('li');
    li_meal.className = 'row';
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Breakfast:'));
    var div_dropMeal = document.createElement('div');
    div_dropMeal.setAttributeNode(onDropAtt);
    div_dropMeal.setAttributeNode(onDragoverAtt);
    div_dropMeal.id = 'B' + (idx + 1);
    div_dropMeal.setAttributeNode(dropMealClass);
    // populate div field with recipe name, or with drop recipe here if recipe
    // is null;
    if (day.getBreakfast().getName() == null) {
      div_dropMeal.textContent = 'Drop Recipe here...'
    } else {
      div_dropMeal.textContent = day.getBreakfast().getName();
    }


    // event listener to catch drop and add to activeTrip;
    div_dropMeal.addEventListener('drop', function(dropEvent) {
      console.log(dropEvent.target);
      console.log('dropped', dropEvent.dataTransfer.getData('Text'));
      console.log(idx, activeTrip.getDays()[idx].getBreakfast().getName());

      var newrec = allRecipesArray.find(function(rec) {
        if (rec.getName() == dropEvent.dataTransfer.getData('Text')) return rec;
      })
      activeTrip.getDays()[idx].setBreakfast(newrec);
    });
    // remove recipe event listner
    div_dropMeal.addEventListener('dblclick', function(dblClickEvent) {
      activeTrip.getDays()[idx].setBreakfast(new Recipe());
      dblClickEvent.target.textContent = 'Drag Recipe here...'
    });

    // append p to list elm
    li_meal.appendChild(p);
    // append to list elm
    li_meal.appendChild(div_dropMeal);
    // append li to ul elm
    ul_days.appendChild(li_meal);

    // lunch

    // create ondrop/dragonver attributes
    var onDropAtt = document.createAttribute('ondrop');
    onDropAtt.value = 'drop(event)';
    var onDragoverAtt = document.createAttribute('ondragover');
    onDragoverAtt.value = 'allowDrop(event)';

    // create class attribute
    var dropMealClass = document.createAttribute('class');
    dropMealClass.value = 'mealDrop';


    li_meal = document.createElement('li');
    li_meal.className = 'row';
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Lunch:'));
    li_meal.appendChild(p);
    var div_dropMeal = document.createElement('div');
    div_dropMeal.setAttributeNode(onDropAtt);
    div_dropMeal.setAttributeNode(onDragoverAtt);
    div_dropMeal.id = 'L' + (idx + 1);
    div_dropMeal.setAttributeNode(dropMealClass);
    // populate div field with recipe name, or with drop recipe here if recipe
    // is null;
    if (day.getLunch().getName() == null) {
      div_dropMeal.textContent = 'Drop Recipe here...'
    } else {
      div_dropMeal.textContent = day.getLunch().getName();
    }

    div_dropMeal.addEventListener('drop', function(dropEvent) {
      console.log(dropEvent.target);
      console.log('dropped', dropEvent.dataTransfer.getData('Text'));
      console.log(idx, activeTrip.getDays()[idx].getLunch().getName());

      var newrec = allRecipesArray.find(function(rec) {
        if (rec.getName() == dropEvent.dataTransfer.getData('Text')) return rec;
      })
      activeTrip.getDays()[idx].setLunch(newrec);
    });
    // remove recipe event listner
    div_dropMeal.addEventListener('dblclick', function(dblClickEvent) {
      activeTrip.getDays()[idx].setLunch(new Recipe());
      dblClickEvent.target.textContent = 'Drag Recipe here...'
    });
    // append to list elm
    li_meal.appendChild(div_dropMeal);
    // append li to ul elm
    ul_days.appendChild(li_meal);



    // dinner

    // create ondrop/dragonver attributes
    var onDropAtt = document.createAttribute('ondrop');
    onDropAtt.value = 'drop(event)';
    var onDragoverAtt = document.createAttribute('ondragover');
    onDragoverAtt.value = 'allowDrop(event)';

    // create class attribute
    var dropMealClass = document.createAttribute('class');
    dropMealClass.value = 'mealDrop';

    li_meal = document.createElement('li');
    li_meal.className = 'row';
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Dinner:'));
    li_meal.appendChild(p);
    var div_dropMeal = document.createElement('div');
    div_dropMeal.setAttributeNode(onDropAtt);
    div_dropMeal.setAttributeNode(onDragoverAtt);
    div_dropMeal.id = 'D' + (idx + 1);
    div_dropMeal.setAttributeNode(dropMealClass);
    // populate div field with recipe name, or with drop recipe here if recipe
    // is null;
    if (day.getDinner().getName() == null) {
      div_dropMeal.textContent = 'Drop Recipe here...'
    } else {
      div_dropMeal.textContent = day.getDinner().getName();
    }
    div_dropMeal.addEventListener('drop', function(dropEvent) {
      console.log(dropEvent.target);
      console.log('dropped', dropEvent.dataTransfer.getData('Text'));
      console.log(idx, activeTrip.getDays()[idx].getDinner().getName());

      var newrec = allRecipesArray.find(function(rec) {
        if (rec.getName() == dropEvent.dataTransfer.getData('Text')) return rec;
      })
      activeTrip.getDays()[idx].setDinner(newrec);
    });

    // remove recipe event listner
    div_dropMeal.addEventListener('dblclick', function(dblClickEvent) {
      activeTrip.getDays()[idx].setDinner(new Recipe());
      dblClickEvent.target.textContent = 'Drag Recipe here...'
    });

    // append to list elm
    li_meal.appendChild(div_dropMeal);
    // append li to ul elm
    ul_days.appendChild(li_meal);
    daysDiv.appendChild(ul_days);
    tripContents.appendChild(daysDiv);
    // append all to tripContents
    // tripContents.appendChild(ul_days);
  });
}
