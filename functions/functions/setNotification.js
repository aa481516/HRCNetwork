const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

module.exports = functions.https.onRequest(async (req, response) => {
  const notificationRef = admin.firestore().collection("notification");
  const usersRef = admin.firestore().collection("users");
  const reqData = req.body?.data;

  const notificationTypes = ["BASIC", "NEW-RESTAURANT", "DEDLINE"];

  try {
    if (!notificationTypes.includes(reqData.type)) {
      response.send({"status": constants.RESPONSE_TYPES.fail, "data": "incorect type"});
    }

    const newNotificationId = Date.now();

    const newNotification = reqData.notificationId ? {id: reqData.notificationId} :
    await notificationRef
        .doc("notification-" + newNotificationId)
        .set({"type": reqData.type || "basic", "id": newNotificationId, "objectId": reqData.id, "content": reqData.content, "title": reqData.title, "createdAt": Date.now()});

    let userToSend = [];
    if (reqData.users) {
      userToSend = reqData.users;
    } else {
      for (const doc of (await usersRef.get()).docs) {
        userToSend.push(doc.id);
      }
    }

    userToSend?.forEach(async (userId) => {
      const user = (await usersRef.doc(userId).get()).data();
      const userNotification = user?.notification || [];
      userNotification.push({id: newNotification.id});
      usersRef.doc(userId).update({notification: userNotification});

      if (user.notification_token) {
        const payload = {
          token: user.notification_token,
          notification: {
            title: reqData.title,
            body: reqData.content,
          },
          data: {
            body: reqData.content,
          },
        };

        admin.messaging().send(payload).then((response) => {
          console.log("Successfully sent message to user:", user.id, "Response is: ", response);
        }).catch((error) => {
          return {error: error.code};
        });
      }
    });

    response.send({"status": constants.RESPONSE_TYPES.success, "data": "newNotification"});
  } catch (e) {
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": "fail"});
  }
});
