const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

module.exports = functions.https.onRequest(
    async (req, response) => {
      const db = admin.firestore();
      const reqData = req.body?.data;
      const userRef = db.collection("users");
      const objectRef = db.collection("objects");

      if (!reqData.id) {
        response.send({
          "status": constants.RESPONSE_TYPES.fail,
          "data": {},
        });
      }

      const userData = await userRef.doc(reqData.id.trim()).get();

      if (!userData.data()) {
        response.json({
          "status": constants.RESPONSE_TYPES.fail,
          "data": {},
        });
      }

      await objectRef.doc(reqData.id).set({...userData.data(), type: "OBJECT"});

      userData.ref.delete();

      response.json({
        "status": constants.RESPONSE_TYPES.success,
        "data": {},
      });
    });
