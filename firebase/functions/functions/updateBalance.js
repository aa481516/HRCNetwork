const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");

const LicenseAmount = 5000;
const parentCount = 6;

module.exports = functions.https.onRequest(async (req, response) => {
  const db = admin.firestore();
  const reqData = req.body?.data;
  const DBRef = db.collection("users");

  if (!Object.keys(req.body.data).length) {
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": {"message": "no data found"}});
    return;
  }

  const updateParentsReqursive = async (userId, amount, index) => {
    const user = (await DBRef.doc(userId).get()).data();

    if (!user) {
      response.send({
        "status": index === 0 ? constants.RESPONSE_TYPES.fail : constants.RESPONSE_TYPES.success,
        "data": index === 0 ? "no user fond :( !" : "no parent found in level" + index + 1,
      });
      return;
    }

    user.balance = (user.balance || 0) + Number(amount);
    user.updatedAt = Date.now();
    if (user.status === "PASSIVE" && user.balance >= LicenseAmount) {
      user.balance = user.balance - LicenseAmount;
      user.status = "ACTIVE";
    }

    await DBRef.doc(userId).set(user);
    if (index < parentCount && user.parentId) {
      index++;
      await updateParentsReqursive(user.parentId, 500, index);
    }
    return true;
  };

  const result = await updateParentsReqursive(reqData.id, reqData.balance, 0);

  response.send({"status": constants.RESPONSE_TYPES.success, "data": result});
});


