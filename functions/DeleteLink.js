const { con } = require("./connectionDB");
const { select } = require("./SendColleges");

const deleteLink = function deleteLink(msg, who) {
  return new Promise(async function (resolve, reject) {
    con.query(
      "SELECT * FROM ADMINS WHERE ADMIN=?;",
      [who],
      async (err, result) => {
        if (err) return reject(err);
        if (result.length === 1) {
          msg = msg.split(" ");
          if (msg.length !== 2)
            return resolve(
              "*Sorry*\n\n*But your format is not correct*\n\n*!dITCSxxx SEC*\n\n*make sure of the spacing*"
            );
          let x = msg[0].slice(2);
          let y = msg[1];
          con.query(
            "DELETE FROM links WHERE idsec IN ( SELECT l.id FROM sections l, subjects s WHERE s.subject=? AND l.idsc=s.id AND l.sec=? ) limit 1;",
            [x, y],
            async (err, result) => {
              if (err) return reject(err);
              if (result.affectedRows === 0) {
                con.query(
                  "DELETE FROM links WHERE idsec IN ( SELECT id FROM sections WHERE idsc=(SELECT link FROM subjects WHERE SUBJECT=?) AND sec=? ) limit 1;",
                  [x, y],
                  async (err, result) => {
                    if (err) return reject(err);
                    if (result.affectedRows === 0) {
                      return resolve(
                        "This course is not found please double check"
                      );
                    } else {
                      return resolve(`${x} has been deleted`);
                    }
                  }
                );
              } else {
                return resolve(`${x} has been deleted`);
              }
            }
          );
        } else {
          return resolve(await select);
        }
      }
    );
  });
};

exports.deleteLink = deleteLink;
