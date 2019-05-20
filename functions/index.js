const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const app = express();
const cors = require('cors');
const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);


// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
// Set the view engine
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');




function getDevices(id) {
    const ref = firebaseApp.database().ref('devices/' + id);
    return ref.once('value').then(snap =>snap.val());
  }


// // set the status according to deviceid
// function setStatus(deviceid) {
//     const ref = firebaseApp.database().ref('/`{ $deviceid }`');

// }
// // get status corresponding to deviceid
// function getStatus(deviceid) {
//     const ref = firebaseApp.database().ref('/`{ $deviceid }`');
//     return ref.once('status').then(snap => snap.val());
// }

// Take the status and id parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /devices/:pushId/status
// status : records status of the device at the moment
//        qualifiers:
//            active: running on power 
//            onBattery: running on battery
//            failure: malfunctioning hardware
//            critical: accident/emergency 
exports.harvest = functions.https.onRequest(async (req, res) => {
    if (!req.path) {
        req.url = `/${req.url}`
    }

    try {
        // Grab the text parameter and deviceID.
        const status = req.query.status;
        const deviceID = req.query.id;
        // Push the new message into the Realtime Database using the Firebase Admin SDK.
        const snapshot = await firebase.database().ref('/devices/' + deviceID).push({status: status});
        res.json({'status':'pushed'});
    } catch(err) {
        console.log("HARVEST/ERROR:", err);
        res.json({'status':'errored'});
    }
});


exports.beaconiee = functions.https.onRequest(async (req, res) => {
    try {
        // Grab the deviceID, latitude and longitude.
        const deviceID = req.query.id;
        const lat = req.query.lat;
        const lon = req.query.lon;
        // Push the new message into the Realtime Database using the Firebase Admin SDK.
        const snapshot = await firebase.database().ref('/devices/geo_location/' + deviceID).push({'latitude': lat, 'longitude': lon});
        res.json({'geo_status':'pushed'});
    } catch(err) {
        console.log("BEACONIEE/ERROR:", err);
        res.json({'status':'errored'});
    }
});

app.get('/', (req, res) => {
    res.send('home works with or without trailing slash');
});
  
// test endpoint to check if deployed server is live or network is reachable
app.get('/test', (request, response) => {
    if (!request.path) {
		request.url = `/${request.url}`
	}
    response.send("Device connected !");
});

// get data from the realtime database based on deviceid
app.get('/:id', (request, response) => {
    if (!request.path) {
		request.url = `/${request.url}`
	}
    getDevices(request.params.id).then(data => {
        response.json(data);
  });
});

exports.app = functions.https.onRequest(app);
