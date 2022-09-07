const { con } = require("./connectionDB");
const { List } = require("whatsapp-web.js");

const select = new Promise(function (resolve, reject) {
  con.query("SELECT * FROM colleges", (err, result) => {
    if (err) return reject(err);
    let rows = [];
    result.forEach((a) => rows.push({ title: a.name, id: `College-${a.id}` }));
    let sections = [{ title: "Select college", rows: rows }];
    let list = new List("UOB colleges", "Colleges", sections, "Colleges", "");
    return err ? reject(err) : resolve(list);
  });
});

exports.select = select;
