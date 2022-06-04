const {RESPONSE_TYPES, USER_TYPES} = require("../constants/constands");

const userModel = (user, type = USER_TYPES.PERSON) => {
  try {
    return {
      "id": user.data().id,
      "name": user.data().name,
      "email": user.data().email,
      "type": type,
      "image": user.data().image,
      "parentId": user.data().parentId,
      "children": user.data().children,
    };
  } catch (e) {
    return RESPONSE_TYPES.fail;
  }
};

exports.userModel = userModel;
