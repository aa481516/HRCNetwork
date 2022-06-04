const functions = require("firebase-functions");
const admin = require("firebase-admin");
const constants = require("../constants/constands");


module.exports = functions.https.onRequest(async (req, response) => {
  const treeRef = admin.firestore().collection("users");
  const reqData = req.body?.data;
  let childLevel = [];

  const getValidParent = async (id) => {
    const node = (await treeRef.doc(id).get()).data();

    if (node.children?.length >= (node.maxChildCount || constants.DEFAULT_CHILD_COUNT)) {
      childLevel = node.children;
    } else {
      return node;
    }

    for (let i = 0; i < childLevel.length; i++) {
      const node = (await treeRef.doc(childLevel[i]).get()).data();

      if (node.children?.length >= (node.maxChildCount || constants.DEFAULT_CHILD_COUNT)) {
        childLevel = node.children;
      } else {
        return node;
      }
    }

    for (let i = 0; i < childLevel.length; i++) {
      const node = (await treeRef.doc(childLevel[i]).get()).data();

      if (node.children?.length >= (node.maxChildCount || constants.DEFAULT_CHILD_COUNT)) {
        childLevel = node.children;
      } else {
        return node;
      }
    }

    for (let i = 0; i < childLevel.length; i++) {
      const node = (await treeRef.doc(childLevel[i]).get()).data();

      if (node.children?.length >= (node.maxChildCount || constants.DEFAULT_CHILD_COUNT)) {
        childLevel = node.children;
      } else {
        return node;
      }
    }

    for (let i = 0; i < childLevel.length; i++) {
      const node = (await treeRef.doc(childLevel[i]).get()).data();

      if (node.children?.length >= (node.maxChildCount || constants.DEFAULT_CHILD_COUNT)) {
        childLevel = node.children;
      } else {
        return node;
      }
    }

    return "full";
  };

  try {
    const parentNodeData = await getValidParent(reqData.parentId);

    if (!parentNodeData || parentNodeData === "full") {
      response.send({"status": constants.RESPONSE_TYPES.fail, "data": "Could not find correct parent or al children are full"});
      return;
    }
    const user = (await (treeRef.doc(reqData.id.trim()).get())).data();
    if (!user.parentId && !user.children?.length) {
      await treeRef.doc(reqData.id.trim()).update({"parentId": parentNodeData.id});
    } else {
      response.send({"status": constants.RESPONSE_TYPES.fail, "data": {message: "User already has a parent !"}});
      return;
    }

    if (!parentNodeData.children) {
      parentNodeData.children = [];
    }

    parentNodeData.children.push(reqData.id);
    treeRef.doc(parentNodeData.id).update({"children": parentNodeData.children});

    response.send({"status": constants.RESPONSE_TYPES.success, "data": {}});
  } catch (e) {
    console.log(e);
    response.send({"status": constants.RESPONSE_TYPES.fail, "data": "fail"});
  }
});
