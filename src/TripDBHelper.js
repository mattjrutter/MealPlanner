var PouchDB = require('pouchdb-browser');

var localDb = new PouchDB('trips')
var db = new PouchDB(
    'https://fcca7173-27dd-4d0c-b7f7-e4338966059d-bluemix.cloudant.com/trips',
    {skip_setup: true});



const path = require('path');
const Trip = require(path.join(__dirname, 'Trip.js'));
const Day = require(path.join(__dirname, 'Day.js'));

module.exports = class TripDBHelper {
  constructor(trip) {
    this._trip = trip;
  }


  gatherDays() {
    var days = new Array();
    this._trip.getDays().forEach(function(element) {
      days.push({
        breakfast:
            element.getBreakfast().getId(),  // recipe ID for each day recipe
        lunch: element.getLunch().getId(),
        dinner: element.getDinner().getId()
      })
    });
    return days;
  }


  saveTrip() {
    if (this._trip.getTripId() != null) {
      localDb.get(this._trip.getTripId())
          .then(function(doc) {
            return localDb.put({
              _id: doc._id,
              _rev: doc._rev,
              doc_type: 'trip',
              trip_name: this._trip.getTripName(),
              headCount: this._trip.getHeadCount(),
              days: this.gatherDays()
            })
          }.bind(this))
          .then(function(response) {
            localDb.sync(db)
                .on('complete',
                    function() {
                      console.log('dbsync');
                    })
                .on('error', function(err) {
                  console.log(err)
                });
            console.log(response)
          })
          .catch(function(err) {
            console.log(err);
          });
    } else {
      localDb
          .put({
            _id: this._trip.getTripName(),
            doc_type: 'trip',
            trip_name: this._trip.getTripName(),
            headCount: this._trip.getHeadCount(),
            days: this.gatherDays()

          })
          .then(function(response) {
            localDb.sync(db)
                .on('complete',
                    function() {
                      console.log('dbsync');
                    })
                .on('error', function(err) {
                  console.log(err)
                });
            console.log(response);
          })
          .catch(function(err) {
            console.log(err);
          })
    }
  }
}
