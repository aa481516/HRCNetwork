const signUp = require("./functions/signUp");
const getUsers = require("./functions/getUsers");
const getUser = require("./functions/getUser");
const updateUser = require("./functions/updateUser");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);

exports.updateUser = updateUser;
exports.signUp = signUp;
exports.getUsers = getUsers;
exports.getUser = getUser;
