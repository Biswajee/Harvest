const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const app = express();
const firebaseApp = firebase.initializeApp();

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

exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter and deviceID.
    const status = req.query.status;
    const deviceID = req.query.id;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/devices/`$deviceID`').push({status: status});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
  });

app.get('/test', (request, response) => {
    response.send("Hey, working");
});

exports.app = functions.https.onRequest(app);
