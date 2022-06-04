const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

module.exports = functions.https.onRequest(async (req, response) => {
  const db = admin.firestore();
  const reqData = req.body?.data;

  const usersRef = db.collection("users");
  const objectsRef = db.collection("objects");

  if (!req.body.data.id) {
    response.send({
      "status": constants.RESPONSE_TYPES.fail,
      "data": {},
    });
  }

  let data = (await usersRef.doc(reqData.id?.trim()).get()).data();
  data.type = "user";

  if (!data) {
    data = (await objectsRef.doc(reqData.id?.trim()).get()).data();
    data.type = "Object";
  }

  response.json({
    "status": constants.RESPONSE_TYPES.success,
    "data": data,
  });
});
