const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const app = express();
const cors = require('cors');
const firebaseApp = firebase.initializeApp();


// Automatically allow cross-origin requests
app.use(cors({ origin: true }));



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

exports.harvest = functions.https.onRequest(async (req, res) => {
    try {
        // Grab the text parameter and deviceID.
        const status = req.query.status;
        const deviceID = req.query.id;
        // Push the new message into the Realtime Database using the Firebase Admin SDK.
        const snapshot = await firebase.database().ref('/devices/' + deviceID).push({status: status});
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.json({'status':'pushed'});
    } catch(err) {
        console.log("HARVEST/ERROR: " + err);
        res.json({'status':'errored'});
    }
  });

// test endpoint to check if deployed server is live or network is reachable
app.get('/test', (request, response) => {
    response.send("Device connected !");
});

// get data from the realtime database based in deviceid
app.get('/:id', (request, response) => {
    const ref = firebaseApp.database().ref('/devices/' + request.params.id);
    return response.json(ref);
});

exports.app = functions.https.onRequest(app);
