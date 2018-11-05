const electron = require('electron');
const url = require('url');
const path = require('path');

// Import Modules
const Recipe = require(path.join(__dirname, 'src', 'Recipe.js'));
const Ingredient = require(path.join(__dirname, 'src', 'Ingredient.js'));

// Set ENV
process.env.NODE_ENV = 'development';


const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addRecipeWindow;
let editRecipeWindow;



// Listen for app to be ready
app.on('ready', function() {
  // create new window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Expedition Menu',
    icon: path.join(__dirname, 'assets', 'icons', 'png', 'dutch-oven-64x64.png')
  });
  // load html file into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html-src', 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  // quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  });

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add Recipe window
function createRecipeAddWindow() {
  var screenElectron = electron.screen;

  var mainScreen = screenElectron.getPrimaryDisplay();
  var allScreens = screenElectron.getAllDisplays();

  console.log(mainScreen, allScreens);

  var mainScreen = screenElectron.getPrimaryDisplay();
  var dimensions = mainScreen.size;
  console.log(dimensions.width + 'x' + dimensions.height);
  // Outputs i.e : 1280x720
  // create window
  addRecipeWindow = new BrowserWindow({
    width: 1050,
    // height: process.platform == 'win32' ? 900 : 700,
    height: dimensions.height < 900 ? dimensions.height - 200 : 745,
    title: 'Add New Recipe',
  });
  // load html into window
  addRecipeWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html-src', 'addRecipeWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // garbage collection handle
  addRecipeWindow.on('closed', function() {
    addRecipeWindow = null;
  });
}

function createEditRecipeWindow(recipeId) {
  var screenElectron = electron.screen;

  var mainScreen = screenElectron.getPrimaryDisplay();
  var allScreens = screenElectron.getAllDisplays();

  console.log(mainScreen, allScreens);

  var mainScreen = screenElectron.getPrimaryDisplay();
  var dimensions = mainScreen.size;

  // create window
  editRecipeWindow = new BrowserWindow({
    width: 1050,
    height: dimensions.height < 900 ? dimensions.height - 200 : 745,
    title: 'Edit Recipe',
  });
  // load html into window
  editRecipeWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html-src', 'addRecipeWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // garbage collection handle
  editRecipeWindow.on('closed', function() {
    editRecipeWindow = null;
  });

  // recipeId obj being sent to edit window
  editRecipeWindow.recipeId = {recipeIdSend: recipeId};
}

function createSettingsWindow() {
  var screenElectron = electron.screen;

  var mainScreen = screenElectron.getPrimaryDisplay();
  var dimensions = mainScreen.size;

  settingsWindow =
      new BrowserWindow({width: 700, height: 800, title: 'Settings'});
  settingsWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html-src', 'settingsWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  settingsWindow.on('closed', function() {
    settingsWindow = null;
  });
}

ipcMain.on('addNewRecipeClicked', function(e) {
  createRecipeAddWindow();
});

ipcMain.on('editRecipeClicked', function(e, recipeId) {
  createEditRecipeWindow(recipeId);
});

ipcMain.on('saveFile', (event, path) => {
  const {dialog} = require('electron');
  const fs = require('fs')
  dialog.showSaveDialog(
      {filters: [{name: 'pdf', extensions: ['pdf']}]}, function(fileName) {
        if (fileName == undefined) return;
        event.sender.send('saveFileReply', fileName)
        console.log(fileName);
      });
});

ipcMain.on('printRecipe', (event, path) => {
  const {dialog} = require('electron');
  const fs = require('fs')
  dialog.showSaveDialog(
      {filters: [{name: 'pdf', extensions: ['pdf']}]}, function(fileName) {
        if (fileName == undefined) return;
        event.sender.send('printRecipeReply', fileName)
        console.log(fileName);
      });
});


// create menu template
const mainMenuTemplate = [{
  label: 'File',
  submenu: [
    {
      label: 'Settings',
      click() {
        createSettingsWindow();
      }
    },
    {type: 'separator'}, {
      label: 'Quit',
      accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      click() {
        app.quit();
      }
    }
  ]
}];

// Add developer tools item if not in prod
if (process.env.NODE_ENV != 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {role: 'reload'}, {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }

    ]
  });
}
