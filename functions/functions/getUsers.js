const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");
const getDistance = require("./getDistance");

module.exports = functions.https.onRequest(async (req, response) => {
  const db = admin.firestore();
  const reqData = req.body?.data;
  const DBRef = db.collection(
    reqData?.type === "objects" ? "objects" : "users",
  );
  const arr = [];
  const filter = [];

  const request = await DBRef.get();
  for (const doc of request.docs) {
    arr.push(doc.data());
  }

  if (reqData?.location) {
    arr.filter((user) => {
      const validDistance = getDistance(
          reqData.location.lat,
          reqData.location.lng,
          user.location?.lat,
          user.location?.lng,
          reqData.location.unit,
      );
      if (validDistance) {
        filter.push(user);
      }
    });
    response.json({
      "status": constants.RESPONSE_TYPES.success,
      "data": filter,
    });
    return;
  }

  if (!reqData.fullName && !reqData.locationName && !reqData.email) {
    response.json({
      "status": constants.RESPONSE_TYPES.success,
      "data": arr,
    });
  }

  if (reqData?.fullName) {
    arr.filter((user) => {
      if (
        user.fullName.toLowerCase().includes(reqData.fullName.toLowerCase())
      ) {
        if (!filter.find((usr) => usr.id === user.id)) {
          filter.push(user);
        }
      }
    });
  }
  if (reqData?.locationName) {
    arr.filter((user) => {
      if (
        user.locationName.toLowerCase()
            .includes(reqData.locationName.toLowerCase())
      ) {
        if (!filter.find((usr) => usr.id === user.id)) {
          filter.push(user);
        }
      }
    });
  }
  if (reqData?.email) {
    arr.filter((user) => {
      if (user.email.toLowerCase().includes(reqData.email.toLowerCase())) {
        if (!filter.find((usr) => usr.id === user.id)) {
          filter.push(user);
        }
      }
    });
  }

  response.json({
    "status": constants.RESPONSE_TYPES.success,
    "data": filter,
  });
});
