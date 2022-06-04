const admin = require("firebase-admin");
const functions = require("firebase-functions");

const signUp = require("./functions/signUp");
const getUsers = require("./functions/getUsers");
const updateBalance = require("./functions/updateBalance");
const getUser = require("./functions/getUser");
const updateUser = require("./functions/updateUser");
const setTree = require("./functions/setTree");
const getTree = require("./functions/getTree");
const replaceToObject = require("./functions/createObjectFromUser");
const setNotification = require("./functions/setNotification");
const getNotification = require("./functions/getNotification");
const updateNotification = require("./functions/seenNotification");
const circularChack = require("./functions/circularChack");

admin.initializeApp(functions.config().firebase);

exports.updateBalance = updateBalance;

exports.updateUser = updateUser;
exports.signUp = signUp;
exports.getUsers = getUsers;
exports.getUser = getUser;

exports.setTree = setTree;
exports.getTree = getTree;
exports.replaceToObject = replaceToObject;

exports.setNotification = setNotification;
exports.getNotification = getNotification;
exports.updateNotification = updateNotification;
exports.circularChack = circularChack;
