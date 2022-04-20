const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

exports.updateUser = functions.https.onRequest((req, response) => {
  const db = admin.firestore();
  const usersRef = db.collection("users");

  if (!Object.keys(req.body.data).length) {
    response.send({
      "status": constants.RESPONSE_TYPES.fail,
      "data": {
        "message": "no data found",
      },
    });
    return;
  }

  usersRef.where("id", "==", req.body.data.id).get().then((data) => {
    const users = [];
    data.forEach((doc) => users.push(doc.data()));

    if (!users.length) {
      response.send({
        "status": constants.RESPONSE_TYPES.fail,
        "data": {},
      });
      return;
    }

    const editData = Object.assign(users[0], req.body.data, {});

    usersRef.doc(req.body.data.id).set(editData).then(() => {
      response.json({
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
});
