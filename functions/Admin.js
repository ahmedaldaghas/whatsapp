const { deleteLink } = require("./DeleteLink");
const { addAdmin } = require("./AddAdmin");
const { select } = require("./SendColleges");
const { addSection } = require("./AddSection");
const { deleteSection } = require("./DeleteSection");
const { getNullLinks } = require("./GetNullLinks");

const admin = function admin(msg, from) {
  return new Promise(async function (resolve, reject) {
    try {
      if (/^(!d)/.test(msg)) return resolve(await deleteLink(msg, from));
      else if (/^(!a)/.test(msg)) return resolve(await addAdmin(msg, from));
      else if (/^(!-s)/.test(msg)) return resolve(await deleteSection(msg, from));
      else if (/^(!\+s)/.test(msg)) return resolve(await addSection(msg, from));
      else if (/^(!n)$/.test(msg)) return resolve(await getNullLinks());
      else return resolve(await select);
    } catch (e) {
      return reject(e);
    }
  });
};

exports.admin = admin;
