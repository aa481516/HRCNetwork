/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");


module.exports = functions.https.onRequest(async (req, response) => {
  const reqData = req.body?.data;
  try {
    const tree = await getChildrenReqursive(reqData.id);

    response.send({"status": constants.RESPONSE_TYPES.success, "data": tree});
  } catch (e) {
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": e});
  }
});

async function getChildrenReqursive(id, arr = [], level = 0) {
  const treeRef = admin.firestore().collection("users");
  const currentNode = (await treeRef.doc(id).get()).data();

  if (currentNode) {
    arr.push(currentNode);
  }

  if (level < constants.TREE_DEEP && currentNode?.children) {
    for (let i = 0; i < currentNode.children?.length; i++) {
      level++;
      await getChildrenReqursive(currentNode.children[i], arr, level);
    }
  }
  return arr;
}
