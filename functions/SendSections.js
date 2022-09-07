const { con } = require("./connectionDB");

const sections = async function section(subject) {
  return new Promise(async function (resolve, reject) {
    let x = subject;
    con.query(
      "SELECT link FROM subjects WHERE id=? AND link!='NULL';",
      [subject],
      (err, result) => {
        if (err) return reject(err);
        if (result.length === 1) x = result[0].link;
        con.query(
          "SELECT sections.*, subjects.subject, links.link FROM ((sections LEFT JOIN links ON links.idsec = sections.id) INNER JOIN subjects ON subjects.id = ?) WHERE sections.idsc=? ORDER BY sections.sec;",
          [subject, x],
          (err, result) => {
            if (err) return reject(err);
            if (result.length === 0)
              return resolve("Sorry we don't have this course available");
            let subject_name = result[0].subject;
            let rows = `*${subject_name}*\n`;
            result.forEach((a) => {
              if (a.sec == 0) rows += "sec #0 (All sec)\n";
              else rows += `sec #${a.sec}\n`;
              if (a.link) rows += `Link: https://chat.whatsapp.com/${a.link}\n`;
              else rows += "There no group please make one and add it 🥺🥺\n";
            });
            rows += `\n\nTo add new group:\n\n*#${subject_name} SEC LINK*\n\n*IF you want to add ALL SEC group replace SEC with 0*\n\n If there is a missing section or there is error section \nAkaa: https://wa.me/97333959459\nAli Redha: https://wa.me/97338406875*`;
            return err ? reject(err) : resolve(rows);
          }
        );
      }
    );
  });
};

exports.sections = sections;
