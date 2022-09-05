const {con} = require('./connectionDB');
const sections = async function section(subject) {
    return new Promise(function (resolve, reject) {
        let x = subject;
        con.query("SELECT subject FROM subjects WHERE id=(SELECT link FROM subjects WHERE subject=?);", [subject], (err, result) => {
            if(err) return reject(err);
            if (result.length === 1) x = result[0].subject;
            con.query("SELECT sections.*, subjects.subject, links.link FROM ((sections LEFT JOIN links ON links.idsec = sections.id) INNER JOIN subjects ON subjects.id = (SELECT id FROM subjects WHERE subject=?)) WHERE sections.idsc=(SELECT id FROM subjects WHERE subject=?) ORDER BY sections.sec;", [subject, x], (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return resolve("Are you sure this subjects exists ^0^ Please send a number from 1-9 to see the list");
                let subject_name = result[0].subject;
                let rows = `*${subject_name}*\n`;
                result.forEach(a => {
                    if (a.sec == 0) rows += "sec #0 (All sec)\n";
                    else rows += `sec #${a.sec}\n`;
                    if (a.link) rows += `Link: https://chat.whatsapp.com/${a.link}\n`;
                    else rows += "There no group please make one and add it 🥺🥺\n";
                });
                rows += `\n\nTo add new group:\n\n*#${subject_name} SEC LINK*\n\n*IF you want to add ALL SEC group replace SEC with 0*`;
                return err ? reject(err) : resolve(rows);
            });
        });
    });
}

exports.sections = sections;