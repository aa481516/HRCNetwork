const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

module.exports = functions.https.onRequest(async (req, response) => {
  const db = admin.firestore();
  const reqData = req.body?.data;
  const DBRef = db.collection(
    reqData?.type === "objects" ? "objects" : "users",
  );
  if (!Object.keys(req.body.data).length) {
    response.send({
      "status": constants.RESPONSE_TYPES.fail,
      "data": {
        "message": "no data found",
      },
    });
    return;
  }

  const user = (await DBRef.doc(req.body.data.id).get()).data();

  if (!user) {
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": "No user found"});
    return;
  }

  const nonEmptyObj = {};
  Object.keys(req.body.data).forEach((key) => {
    if (req.body.data[key]) {
      nonEmptyObj[key] = req.body.data[key];
    }
  });

  const editData = Object.assign(user, nonEmptyObj);

  DBRef.doc(req.body.data.id).set(editData).then(() => {
    response.json({"status": constants.RESPONSE_TYPES.success, "data": editData});
  }, () => {
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": {}});
  });
});
