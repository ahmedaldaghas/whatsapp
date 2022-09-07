const { con } = require("./connectionDB");

const addAdmin = function addAdmin(msg, who) {
  let x = msg.slice(2) + "@c.us";
  return new Promise(async function (resolve, reject) {
    con.query(
      "SELECT * FROM ADMINS WHERE ADMIN=? AND CanAdd=1;",
      [who],
      async (err, result) => {
        if (err) return reject(err);
        if (result.length === 1) {
          con.query(
            "INSERT INTO ADMINS (ADMIN,WhoAddHim,CanAdd) VALUES (?,?,0);",
            [x, who],
            async (err, result) => {
              if (err) return reject(err);
              if (result.affectedRows === 1) {
                return resolve("Admin has been added succesfully");
              } else return resolve("FAIL");
            }
          );
        } else {
          return resolve("FAIL");
        }
      }
    );
  });
};

exports.addAdmin = addAdmin;
