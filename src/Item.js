

module.exports = class Item {
  constructor() {
    this._dbId = null;
    this._itemName = null;
    this._note = null;
    this._department = null;
    this._allergens = new Array();  // list of potential allergens
  }

  setDbId(dbId) {
    this._dbId = dbId;
  }
  setItemName(itemName) {
    this._itemName = itemName;
  }
  setNote(note) {
    this._note = note;
  }
  setDepartment(department) {
    this._department = department;
  }
  addAllergen(allergen) {
    this._allergens.push(allergen);
  }

  getDbId() {
    return this._dbId;
  }

  getItemName() {
    return this._itemName;
  }
  getNote() {
    return this._note;
  }
  getDepartment() {
    return this._department;
  }
  getAllergens() {
    return this._allergens;  // Can't do this doesn't work
  }
}
