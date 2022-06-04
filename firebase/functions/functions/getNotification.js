const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

module.exports = functions.https.onRequest(async (req, response) => {
  const notificationRef = admin.firestore().collection("notification");
  const usersRef = admin.firestore().collection("users");
  const reqData = req.body?.data;

  try {
    const userNotification = (await usersRef.doc(reqData.id).get()).data()?.notification;
    const messages = [];

    for (let i = 0; i < userNotification.length; i++) {
      const message = (await notificationRef.doc(userNotification[i].id).get()).data();
      messages.push({...message, seen: userNotification[i].seen});
    }

    response.send({"status": constants.RESPONSE_TYPES.success, "data": messages});
  } catch (e) {
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": "fail"});
  }
});
