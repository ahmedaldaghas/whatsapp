const { con } = require("./connectionDB");
var request = require('request');
var cheerio = require('cheerio');
const { select } = require("./SendColleges");

var fixed = [
    {
        collage: 7,
        dep: [{ id: 1, i: 50 }, { id: 3, i: 49 }, { id: 4, i: 51 }]
    },
    {
        collage: 4,
        dep: [{ id: 5, i: 35 }, { id: 6, i: 36 }, { id: 7, i: 38 }, { id: 8, i: 37 }]
    },
    {
        collage: 1,
        dep: [{ id: 32, i: 7 }, { id: 18, i: 17 }, { id: 17, i: 21 }, { id: 16, i: 15 }, { id: 15, i: 20 }, { id: 14, i: 16 }]
    },
    {
        collage: 3,
        dep: [{ id: 23, i: 29 }, { id: 22, i: 32 }, { id: 21, i: 33 }, { id: 20, i: 765 }, { id: 19, i: 770 }]
    },
    {
        collage: 15,
        dep: [{ id: 24, i: 247 }, { id: 25, i: 320 }, { id: 26, i: 1772 }, { id: 27, i: 491 }, { id: 28, i: 1740 }]
    },
    {
        collage: 10,
        dep: [{ id: 31, i: 943 }, { id: 30, i: 58 }, { id: 29, i: 57 }]
    },
    {
        collage: 35,
        dep: [{ id: 33, i: 494 }, { id: 34, i: 946 }]
    },
    {
        collage: 9,
        dep: [{ id: 36, i: 54 }, { id: 37, i: 55 }, { id: 38, i: 747 }, { id: 39, i: 751 }]
    }
]

const updateSections = function updateSections(who) {
    return new Promise(function (resolve, reject) {
        con.query(
            "SELECT * FROM ADMINS WHERE ADMIN=?;",
            [who],
            async (err, result) => {
                if (err) return reject(err);
                if (result.length === 1) {
                    con.query("SET FOREIGN_KEY_CHECKS=0;", () => {
                        var b = "";
                        var g = "";
                        fixed.forEach((co, is) => {
                            co.dep.forEach((dep, ix) => {
                                var dataString = `year=2022&sem=2&type=CD&college=${co.collage}&dept=${dep.i}`;
                                var options = {
                                    url: 'https://ucs.uob.edu.bh/index.php',
                                    method: 'POST',
                                    headers: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    body: dataString
                                };
                                request(options, function callback(error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        var $ = cheerio.load(body);


                                        $(".large-12.medium-6.columns").map(function () {
                                            return `('${$(this).find("span[style='color:#900']").text()}',${dep.id}),`
                                        }).toArray().forEach(a => b += a)


                                        $(".large-12.medium-6.columns").map(function () {
                                            return {
                                                sec: $(this).find(".secContainer .row:first-child div:first-child span:last-child").map((o, v) => {
                                                    return $(v).text()
                                                }).toArray(),
                                                subject: $(this).find("span[style='color:#900']").text()
                                            }
                                        }).toArray().forEach(a => {
                                            a.sec.forEach((c, i) => {
                                                if (i === 1) {
                                                    g += `((SELECT id from subjects WHERE subject="${a.subject}"),${0}),`
                                                }
                                                g += `((SELECT id from subjects WHERE subject="${a.subject}"),${c}),`
                                            })
                                        })
                                        if (is === fixed.length - 1 && ix === fixed[fixed.length - 1].dep.length - 1) {
                                            con.query(
                                                "INSERT INTO `subjects`( `subject`, `dep`) VALUES " + b.slice(0, -1) + " ON DUPLICATE KEY UPDATE id=id",
                                                (err, result) => {
                                                    if (err) {
                                                        con.query("SET FOREIGN_KEY_CHECKS=1;")
                                                        return resolve(
                                                            "*Error \n" + err + "\n\n" + "INSERT INTO `subjects`( `subject`, `dep`) VALUES " + b.slice(0, -1) + " ON DUPLICATE KEY UPDATE id=id"
                                                        );
                                                    }
                                                    else {
                                                        var x = result.message.split(' ').filter(element => element === '0' || Number(element)).map(Number)
                                                        con.query(
                                                            "INSERT INTO sections(idsc,sec) VALUES " + g.slice(0, -1) + " ON DUPLICATE KEY UPDATE id=id",
                                                            (err, result) => {
                                                                if (err) {
                                                                    con.query("SET FOREIGN_KEY_CHECKS=1;")
                                                                    return resolve(
                                                                        "*Error \n" + err + "\n\n" + "INSERT INTO `subjects`( `subject`, `dep`) VALUES " + b.slice(0, -1) + " ON DUPLICATE KEY UPDATE id=id"
                                                                    );
                                                                }
                                                                else {
                                                                    var y = result.message.split(' ').filter(element => element === '0' || Number(element)).map(Number)
                                                                    con.query("SET FOREIGN_KEY_CHECKS=1;")
                                                                    if (dep.i == 751) {
                                                                        return resolve(`Updated:\n${x[0] - x[1]} Group added\n${y[0] - y[1]} Section added`);
                                                                    }
                                                                }
                                                            }
                                                        );

                                                    }
                                                }
                                            );
                                        }
                                    }
                                });
                            })
                        })
                    })
                }
                else {
                    return resolve(await select);
                }
            })
    });
}

exports.updateSections = updateSections;

