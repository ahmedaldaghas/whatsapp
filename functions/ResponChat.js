const { select } = require("./SendColleges");
const { addLink } = require("./AddLink");
const { sections } = require("./SendSectionsByUser");
const { admin } = require("./Admin");

const selectChat = function selectList(msg, from, client) {
  return new Promise(async function (resolve, reject) {
    try {
      if (/^[#]/.test(msg)) return resolve(await addLink(msg, from));
      else if (/^[A-Za-z]/.test(msg)) return resolve(await sections(msg));
      else if (/^[!]/.test(msg)) return resolve(await admin(msg, from, client));
      else return resolve(await select);
    } catch (e) {
      return reject(e);
    }
  });
};

exports.selectChat = selectChat;
