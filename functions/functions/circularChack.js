/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

const licenseExpiredTitle = "Your license has expired";
const licenseExpiredMessage = "Your license has expired. Please asdf";

const licenseExpiredWaringTitleOne = "Your license will be expired after one day";
const licenseExpiredWaringMessageOne = "Your license will be expired after one day. Please asdf";

const licenseExpiredWaringTitleFore = "Your license will be expired after 4 day";
const licenseExpiredWaringMessageFore = "Your license will be expired after 4 day. Please asdf";

module.exports = functions.https.onRequest(async (req, response) => {
  const db = admin.firestore();
  const usersRef = db.collection("users");
  const notificationsRef = db.collection("notifications");

  const expireNotification = (await notificationsRef.doc("notification-expiration-0-day").get()).data();
  const expireNotificationOne = (await notificationsRef.doc("notification-1-day").get()).data();
  const expireNotificationFore = (await notificationsRef.doc("notification-4-day").get()).data();

  const sendNotification = (user, existingNotification, title, content) => {
    const userNotification = user?.notification || [];
    userNotification.push({id: existingNotification.id});
    usersRef.doc(user.id).update({notification: userNotification});

    if (user.notification_token) {
      const payload = {
        token: user.notification_token,
        notification: {
          title: title,
          body: content,
        },
        data: {
          body: content,
        },
      };

      admin.messaging().send(payload).then((response) => {
        console.log("Successfully sent message to user:", user.id, "Response is: ", response);
      }).catch((error) => {
        return {error: error.code};
      });
    }
  };

  const request = await usersRef.where("status", "==", "ACTIVE").get();
  for (const doc of request.docs) {
    const user = doc.data();
    if (user.updatedAt) {
      const t1 = new Date();
      const t2 = new Date(user.updatedAt);
      const diff = t2.getDay() - t1.getDay();

      if (diff < 0) {
        await usersRef.doc(user.id).update({status: "PASSIVE"});
        sendNotification(user, expireNotification, licenseExpiredTitle, licenseExpiredMessage);
      } else if (Number(diff) === 1) {
        sendNotification(user, expireNotificationOne, licenseExpiredWaringTitleOne, licenseExpiredWaringMessageOne);
      } else if (Number(diff) === 4) {
        sendNotification(user, expireNotificationFore, licenseExpiredWaringTitleFore, licenseExpiredWaringMessageFore);
      }
    }
  }

  response.json({
    "status": constants.RESPONSE_TYPES.success,
    "data": "Done",
  });
});
