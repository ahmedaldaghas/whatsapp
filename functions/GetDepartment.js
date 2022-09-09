const { con } = require("./connectionDB");
const { select } = require("./SendColleges");

const getDepartment = function getDepartment(who) {
  return new Promise(async function (resolve, reject) {
    con.query(
      "SELECT * FROM ADMINS WHERE ADMIN=?;",
      [who],
      async (err, result) => {
        if (err) return reject(err);
        if (result.length === 1) {
            con.query(
                "SELECT id,dep FROM dep;",
                async (err, result) => {
                  let g=`Departments\n`;
                  result.forEach((dep) => {
                    g+=`${dep.id}: ${dep.dep}\n`;
                  });
                  return resolve(g);
                }
              );
        } else {
          return resolve(await select);
        }
      }
    );
  });
};

exports.getDepartment = getDepartment;
