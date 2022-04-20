const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

exports.getUsers = functions.https.onRequest((req, response) => {
  const db = admin.firestore();
  const usersRef = db.collection("users");
  let request = usersRef.get();

  if (Object.keys(req.body).length) {
    request = usersRef.where(
        Object.keys(req.body.data.search)[0],
        "==",
        req.body.data.search[Object.keys(req.body.data.search)[0]]
    ).get();
  }

  request.then((snapshot) => {
    const arr = [];
    snapshot.forEach((doc) => arr.push(doc.data()));
    response.json({
      "status": constants.RESPONSE_TYPES.success,
      "data": arr,
    });
  }, () => {
    response.send({
      "status": constants.RESPONSE_TYPES.fail,
      "data": {},
    });
  });
});
