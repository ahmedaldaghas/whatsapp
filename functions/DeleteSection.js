const { con } = require("./connectionDB");
const { select } = require("./SendColleges");

const deleteSection = function deleteSection(msg, who) {
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
              "*Sorry*\n\n*But your format is not correct*\n\n*!-sITCSxxx SEC*\n\n*make sure of the spacing*"
            );
          let x = msg[0].slice(3);
          let y = msg[1];
          con.query(
            "SET @count = (SELECT id FROM sections WHERE idsc=(SELECT CASE WHEN link IS null THEN id ELSE link END AS a FROM subjects WHERE SUBJECT=?) AND sec=?);DELETE FROM links WHERE idsec=@COUNT LIMIT 1;DELETE FROM sections WHERE id=@COUNT LIMIT 1;",
            [x, y],
            async (err, result) => {
              if (err) return reject(err);
              else return resolve("DELETED-I hope");
            }
          );
        } else {
          return resolve(await select);
        }
      }
    );
  });
};

exports.deleteSection = deleteSection;
