const { con } = require("./connectionDB");
const { select } = require("./SendColleges");

const banUser = function banUser(msg, who, client) {
    return new Promise(async function (resolve, reject) {
      con.query(
        "SELECT * FROM ADMINS WHERE ADMIN=?;",
        [who],
        async (err, result) => {
          if (err) return reject(err);
          if (result.length === 1) {
            msg = msg.slice(3);
            client?.getContactById(`${msg}@c.us`).then((res)=>{
                res.block().then(()=> resolve("okay")).catch(()=>resolve("Error"));
            }).catch(()=> resolve("Error"));
          } else {
            return resolve(await select);
          }
        }
      );
    });
  };
  
  exports.banUser = banUser;