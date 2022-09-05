const {con} = require("./connectionDB");
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const addLink = function selectList(msg, who) {
    return new Promise(async function (resolve, reject) {
        msg = msg.split(' ');
        if (msg.length !== 3) return resolve("*Sorry* 😭😭\n\n*But your format is not correct*\n\n*#ITCSxxx SEC LINK*\n\n*make sure of the spacing*");
        link = msg[2].split('.com/');
        if (link.length !== 2) return resolve("*Sorry* 😭😭\n\n*But your format is not correct*\n\n*#ITCSxxx SEC LINK*\n\n*make sure of the spacing*");
        if (!/^[A-Za-z0-9]+$/.test(link[1])) return resolve("*Sorry* 😭😭\n\n*But your format is not correct*\n\n*#ITCSxxx SEC LINK*\n\n*make sure of the spacing*");
        let skip = await checkLink(link[1]);
        if (skip === 0 || skip === 2) return resolve("*This link is either invalid or not working* 🤡🤡");
        let x = msg[0].slice(1);
        con.query("SELECT subject FROM subjects WHERE id=(SELECT link FROM subjects WHERE subject=?);", [x], async (err, result) => {
            if(err) return reject(err);
            if (result.length === 1) x = result[0].subject;
            con.query("SELECT id,link FROM links WHERE idsec = ((SELECT id FROM sections WHERE idsc = (SELECT id FROM subjects WHERE subject=?) AND sec =?));", [x, msg[1]], async (err, result) => {
                if (err) return resolve("*Sorry* 😭😭\n\n*But your format is not correct*\n\n*#ITCSxxx SEC LINK*\n\n*make sure of the spacing*");
                if (result.length === 1) {
                    if (link[1] === result[0].link) return resolve("Hello Thanks for you effort but this link already exists 💮💮");
                    let skip1 = await checkLink(result[0].link);
                    console.log(skip1);
                    if (skip1 === 0 || skip1 === 2) {
                        con.query("UPDATE links SET link=?, WhoLastUpdate=? WHERE id=?", [link[1], who, result[0].id], (err, result) => {
                            return err ? resolve("*Sorry* 😭😭\n\n*But your format is not correct*\n\n*#ITCSxxx SEC LINK*\n\n*make sure of the spacing*") : resolve("*The Course has been updated* \n\n*Thanks for the help* 🥰🥰\n\n*We really appreciate it* 🌹🌹\n");
                        })
                    }
                    else {
                        con.query("INSERT INTO links(idsec, link, WhoLastUpdate) VALUE ((SELECT id FROM sections WHERE idsc = (SELECT id FROM subjects WHERE subject=?) AND sec =?), ?,?)", [x, msg[1], link[1], who], (err, result) => {
                            return err ? (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) ? resolve("There is a link don't worry 🥰🥰") : resolve("*Sorry* 😭😭\n\n*But your format is not correct*\n\n*#ITCSxxx SEC LINK*\n\n*make sure of the spacing*") : resolve("*The Course has been added* \n\n*Thanks for the help* 🥰🥰\n\n*We really appreciate it* 🌹🌹\n");
                        })
                    }
                }
                else{
                    con.query("INSERT INTO links(idsec, link, WhoLastUpdate) VALUE ((SELECT id FROM sections WHERE idsc = (SELECT id FROM subjects WHERE subject=?) AND sec =?), ?,?)", [x, msg[1], link[1], who], (err, result) => {
                        return err ? (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) ? resolve("There is a link don't worry 🥰🥰") : resolve("*Sorry* 😭😭\n\n*But your format is not correct*\n\n*#ITCSxxx SEC LINK*\n\n*make sure of the spacing*") : resolve("*The Course has been added* \n\n*Thanks for the help* 🥰🥰\n\n*We really appreciate it* 🌹🌹\n");
                    })
                }
            })
        })
    })
}

exports.addLink = addLink;


async function checkLink(link) {
    try {
        let x = 0;
        await fetch(`https://chat.whatsapp.com/${link}`)
            .then(res => res.text())
            .then(async text => {
                $ = await cheerio.load(text);
                if (($('h3._9vd5._9scr')).text() !== "") {
                    x = 1;
                }
            });
        return x;
    } catch (exception) {
        return 2;
    }
}
