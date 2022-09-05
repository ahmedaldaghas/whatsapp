const {select} = require("./SendColleges");
const {addLink} = require("./AddLink");
const {sections} = require("./SendSectionsByUser");

const selectChat = function selectList(msg, from) {
    return new Promise(async function (resolve, reject) {
        try {
            if (/^[#]/.test(msg)) return resolve(await addLink(msg,from));
            else if (/^[A-Za-z]/.test(msg)) return resolve(await sections(msg));
            else return resolve(await select);
        } catch (e) {
            return reject(e);
        }
    })
}

exports.selectChat = selectChat;