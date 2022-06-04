const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

module.exports = functions.https.onRequest(async (req, response) => {
  const data = req.body.data ? req.body.data : req.body;
  const db = admin.firestore();
  const usersRef = db.collection("users");
  const treeRef = db.collection("tree");

  const existingUser = (await usersRef.doc(data.id).get()).data();

  if (existingUser) {
    response.send({
      "status": constants.RESPONSE_TYPES.success,
      "data": existingUser,
    });
    return;
  }

  usersRef.doc(data.id).set(data)
      .then(() => {
        treeRef.doc(data.id).set({
          "children": [],
        });

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
