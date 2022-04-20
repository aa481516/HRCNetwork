const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

exports.signUp = functions.https.onRequest((req, response) => {
  const data = req.body.data ? req.body.data : req.body;

  admin.firestore().collection("users").doc(data.id).set(data)
      .then(() => {
        response.send({
          "status": constants.RESPONSE_TYPES.success,
          "data": {},
        });
      }, () => {
        response.send({
          "status": constants.RESPONSE_TYPES.fail,
          "data": {},
        });
      });
});
