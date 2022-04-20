const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

exports.getUser = functions.https.onRequest((req, response) => {
  const db = admin.firestore();
  const usersRef = db.collection("users");

  if (!req.body.data.id) {
    response.send({
      "status": constants.RESPONSE_TYPES.fail,
      "data": {},
    });
  }

  usersRef.where("id", "==", req.body.data.id).get().then((snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });

    response.json({
      "status": constants.RESPONSE_TYPES.success,
      "data": users,
    });
  }, () => {
    response.send({
      "status": constants.RESPONSE_TYPES.fail,
      "data": {},
    });
  });
});
