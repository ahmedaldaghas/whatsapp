const { con } = require("./connectionDB");
const { List } = require("whatsapp-web.js");

const dep = async function deps(collage) {
  return new Promise(function (resolve, reject) {
    con.query(
      "SELECT D.*,c.name FROM dep D, colleges c WHERE D.idcol=? AND c.id=?",
      [collage, collage],
      (err, result) => {
        if (err) return reject(err);
        let rows = [];
        let collage_name = result[0].name;
        result.forEach((a) => rows.push({ title: a.dep, id: `dep-${a.id}` }));
        let sections = [{ title: "Select department", rows: rows }];
        let list = new List(
          `${collage_name} department`,
          `${collage_name}`,
          sections,
          "Departments",
          ""
        );
        return err ? reject(err) : resolve(list);
      }
    );
  });
};

exports.dep = dep;
