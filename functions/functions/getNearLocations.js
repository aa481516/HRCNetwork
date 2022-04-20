const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

exports.getUser = functions.https.onRequest((req, response) => {
  const db = admin.firestore();
  const usersRef = db.collection("users");

  if (!req.body.data) {
    response.send({
      "status": constants.RESPONSE_TYPES.fail,
      "data": {},
    });
  }

  usersRef.where("id", "==", req.body.data.id).get().then((currentUserArr) => {
    const cusrentUser = [];
    currentUserArr.forEach((doc) => cusrentUser.push(doc.data()));

    usersRef.where("id", "!=", req.body.data.id).get().then((allUsers) => {
      const arr = [];

      allUsers.forEach((user) => {
        const userData = user.data();
        const validDistance = distance(
            userData.lat,
            userData.lon,
            cusrentUser.lat,
            cusrentUser.lon,
            req.body.data.unit
        );
        if (validDistance) {
          arr.push(userData);
        }
      });
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
});


// eslint-disable-next-line require-jsdoc
function distance(lat1, lon1, lat2, lon2, unit) {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) *
  Math.sin(radlat2) +
  Math.cos(radlat1) *
  Math.cos(radlat2) *
  Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit=="K") {
    dist = dist * 1.609344;
  }
  if (unit=="N") {
    dist = dist * 0.8684;
  }
  return dist;
}
