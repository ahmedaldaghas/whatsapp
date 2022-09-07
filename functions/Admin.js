const { deleteLink } = require("./DeleteLink");
const { addAdmin } = require("./AddAdmin");
const { select } = require("./SendColleges");

const admin = function admin(msg, from) {
  return new Promise(async function (resolve, reject) {
    try {
      if (/^(!d)/.test(msg)) return resolve(await deleteLink(msg, from));
      else if (/^(!a)/.test(msg)) return resolve(await addAdmin(msg, from));
      else return resolve(await select);
    } catch (e) {
      return reject(e);
    }
  });
};

exports.admin = admin;
