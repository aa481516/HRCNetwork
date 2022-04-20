/* eslint-disable new-cap */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");
const userModel = require("../models/User");
const SHA256 = require("crypto-js/sha256");

// import { getAuth, onAuthStateChanged } from "firebase/auth";
// const getAuth
// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     var uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

exports.getUsers = functions.https.onRequest((req, response) => {
  const db = admin.firestore();
  const usersRef = db.collection("users");
  const arr = [];
  if (req.body.data.email && req.body.data.password) {
    usersRef
        .where("email", "==", req.body.data.email)
        .where("password", "==", SHA256(req.body.data.password).toString())
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => arr.push(userModel(doc)));
          response.json(arr);
        }, () => {
          response.status(500)
              .send(JSON.stringify(constants.RESPONSE_TYPES.fail));
        });
  } else {
    usersRef.get().then((snapshot) => {
      snapshot.forEach((doc) => arr.push(userModel(doc)));
      response.json(arr);
    }, () => {
      response.status(500).send(JSON.stringify(constants.RESPONSE_TYPES.fail));
    });
  }
});
