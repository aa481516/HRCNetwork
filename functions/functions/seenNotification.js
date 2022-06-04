const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

module.exports = functions.https.onRequest(async (req, response) => {
  const usersRef = admin.firestore().collection("users");
  const reqData = req.body?.data;

  try {
    const userNotification = (await usersRef.doc(reqData.userId).get()).data()?.notification;
    const index = userNotification.findIndex((not) => not.id === reqData.notificationId);

    if (index !== -1) {
      userNotification.splice(index, 1);
    }

    await usersRef.doc(reqData.userId).update({notification: userNotification});

    response.send({"status": constants.RESPONSE_TYPES.success, "data": "success"});
  } catch (e) {
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": "fail"});
  }
});
