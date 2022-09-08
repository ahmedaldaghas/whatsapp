const { con } = require("./connectionDB");
const { select } = require("./SendColleges");

const getNullLinks = function getNullLinks(who) {
  return new Promise(async function (resolve, reject) {
    con.query(
      "SELECT * FROM ADMINS WHERE ADMIN=?;",
      [who],
      async (err, result) => {
        if (err) return reject(err);
        if (result.length === 1) {
            con.query(
                "SELECT a.subject, s.sec FROM sections s, subjects a WHERE s.idsc=a.id  AND s.id NOT IN(SELECT idsec FROM links);",
                async (err, result) => {
                  let g=`${new Date().toLocaleString()}; *#${result.length} sections need your help :)*\n`;
                  result.forEach((subject,i) => {
                    if(i===0){
                        g+=`${subject.subject}: ${subject.sec}`;
                    }
                    else{
                        if(result[i-1].subject === subject.subject){
                            g+=`, ${subject.sec}`;
                        }
                        else{
                            g+=`\n${subject.subject}: ${subject.sec}`;
                        }
                    }
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

exports.getNullLinks = getNullLinks;
