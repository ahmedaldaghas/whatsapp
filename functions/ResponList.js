const {dep} = require("./SendDepartment");
const {subject} = require("./SendSubjects");
const {sections} = require("./SendSections");

const selectLists = function selectList(rowID) {
    return new Promise(async function (resolve, reject) {
        rowID = rowID.split('-');
        try {
            switch (rowID[0]) {
                case 'College':
                    return resolve(await dep(rowID[1]));
                    break;
                case 'dep':
                    return resolve(await subject(rowID[1]));
                    break;
                case 'subject':
                    return resolve(await sections(rowID[1]));
                    break;
            }
        }
        catch (e){
            return reject(e);
        }
    })
}

exports.selectLists = selectLists;