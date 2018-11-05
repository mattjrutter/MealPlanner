module.exports = class Converter {
  constructor(amount, descriptor) {
    this._amount = amount;
    this._descriptor = descriptor;
    this._tsTOtbs = 3;
    this._tbsTOoz = 2;
    this._ozTOcup = 8;
    this._cupTOquart = 4;
    this._quartTOgallon = 4;
    this._ozTOlb = 16;
  }

  setAmount(amount) {
    this._amount = amount;
  }
  getAmount() {
    return this._amount;
  }

  setDescriptor(descriptor) {
    this._descriptor = descriptor;
  }

  getDescriptor() {
    return this._descriptor;
  }


  convert() {
    if (this._amount < 1 && this._amount > 0) {
      switch (this._descriptor) {
        case 'tbs':
          this._amount = this._amount * this._tsTOtbs;
          this._descriptor = 'tsp';
          break;
        case 'fl-oz':
          this._amount = this._amount * this._tbsTOoz;
          this._descriptor = 'tbs';
          break;
        case 'cup':
          this._amount = this._amount * this._ozTOcup;
          this._descriptor = 'fl-oz';
          break;
        case 'qt':
          this._amount = this._amount * this._cupTOquart;
          this._descriptor = 'cup';
          break;
        case 'gal':
          this._amount = this._amount * this._quartTOgallon;
          this._descriptor = 'qt';
          break;
        case 'lb':
          this._amount = this._amount * this._ozTOlb;
          this._descriptor = 'oz'
          break;
      }
    } else {
      switch (this._descriptor) {
        case 'tsp':
          if (this._amount >= this._tsTOtbs) {
            this._amount = this._amount / this._tsTOtbs;
            this._descriptor = 'tbs';
          }
          break;
        case 'tbs':
          if (this._amount >= this._tbsTOoz) {
            this._amount = this._amount / this._tbsTOoz;
            this._descriptor = 'fl-oz';
          }
          break;
        case 'fl-oz':
          if (this._amount >= this._ozTOcup) {
            this._amount = this._amount / this._ozTOcup;
            this._descriptor = 'cup';
          }
          break;
        case 'cup':
          if (this._amount >= this._cupTOquart) {
            this._amount = this._amount / this._cupTOquart;
            this._descriptor = 'qt';
          }
          break;
        case 'qt':
          if (this._amount >= this._quartTOgallon) {
            this._amount = this._amount / this._quartTOgallon;
            this._descriptor = 'gal';
          }
          break;
        case 'oz':
          if (this._amount >= this._ozTOlb) {
            this._amount = this._amount / this._ozTOlb;
            this._descriptor = 'lb';
          }
          break;
      }
    }
  }

  getConversion() {
    this.convert();
    return {amount: this._amount, descriptor: this._descriptor};
  }

  normalize(ingredient1, ingredient2) {
    var descriptor = ['tsp', 'tbs', 'fl-oz', 'cup', 'qt', 'gal', 'oz', 'lb'];

    var from = -1;
    var to = -1;
    var amount = ingredient2.amount;
    for (var i = 0; i < descriptor.length; i++) {
      if (descriptor[i] == ingredient1.descriptor) {
        to = i;
      }
      if (descriptor[i] == ingredient2.descriptor) {
        from = i;
      }
    }

    if ((from > -1 && to > -1) && (from < 6 && to < 6)) {
      if (from < to) {
        while (from != to) {
          switch (from) {
            case 0:
              amount = amount / this._tsTOtbs;
              from = from + 1;
              break;
            case 1:
              amount = amount / this._tbsTOoz;
              from = from + 1;
              break;
            case 2:
              amount = amount / this._ozTOcup;
              from = from + 1;
              break;
            case 3:
              amount = amount / this._cupTOquart;
              from = from + 1;
              break;
            case 4:
              amount = amount / this._quartTOgallon;
              from = from + 1;
              break;
          }
        }
      } else {
        while (from != to) {
          switch (from) {
            case 1:
              amount = amount * this._tsTOtbs;
              from = from - 1;
              break;
            case 2:
              amount = amount * this._tbsTOoz;
              from = from - 1;
              break;
            case 3:
              amount = amount * this._ozTOcup;
              from = from - 1;
              break;
            case 4:
              amount = amount * this._cupTOquart;
              from = from - 1;
              break;
            case 5:
              amount = amount * this._quartTOgallon;
              from = from - 1;
              break;
          }
        }
      }
    } else if ((from > -1 && to > -1) && (from >= 6 && to >= 6)) {
      if (from > to) {
        amount = amount * this._ozTOlb;
        from = from - 1;
      } else {
        amount = amount / this._ozTOlb;
        from = from + 1;
      }
    }
    this._descriptor = ingredient1.descriptor;
    if (to == from) {
      this._amount = amount + ingredient1.amount;
    } else {
      this._amount = -1;
    }
  }
}
