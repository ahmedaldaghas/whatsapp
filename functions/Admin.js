const { deleteLink } = require("./DeleteLink");
const { addAdmin } = require("./AddAdmin");
const { select } = require("./SendColleges");
const { addSection } = require("./AddSection");
const { deleteSection } = require("./DeleteSection");
const { getNullLinks } = require("./GetNullLinks");
const { getDepartment } = require("./GetDepartment");
const { updateSections } = require("./UpdateSections");
const { banUser } = require("./BanUser");
const { unBanUser } = require("./UnBanUser");

const admin = function admin(msg, from, client) {
  return new Promise(async function (resolve, reject) {
    try {
      if (/^(!d)/.test(msg)) return resolve(await deleteLink(msg, from));
      else if (/^(!a)/.test(msg)) return resolve(await addAdmin(msg, from));
      else if (/^(!-s)/.test(msg)) return resolve(await deleteSection(msg, from));
      else if (/^(!\+s)/.test(msg)) return resolve(await addSection(msg, from));
      else if (/^(!n)$/.test(msg)) return resolve(await getDepartment(from));
      else if (/^(!n)/.test(msg)) return resolve(await getNullLinks(msg, from));
      else if (/^(!u)/.test(msg)) return resolve(await updateSections(from));
      else if (/^(!\+b)/.test(msg)) return resolve(await banUser(msg, from, client));
      else if (/^(!-b)/.test(msg)) return resolve(await unBanUser(msg, from, client));
      else return resolve(await select);
    } catch (e) {
      return reject(e);
    }
  });
};

exports.admin = admin;
