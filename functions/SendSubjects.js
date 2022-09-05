const {con} = require('./connectionDB');
const {List} = require('whatsapp-web.js');

const subject = async function deps(dep) {
    return new Promise(function (resolve, reject) {
        con.query("SELECT S.*,d.dep FROM subjects S, dep d WHERE S.dep=? AND d.id=?", [dep, dep], (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return resolve("There is no subject from this department\nContact:\nAkaa: https://wa.me/97333959459\nAli Redha: https://wa.me/97338406875");
            let rows = [{title: "Level 1", rows: []},
                {title: "Level 2", rows: []},
                {title: "Level 3", rows: []},
                {title: "Level 4", rows: []}];
            let dep_name = result[0].dep;
            result.forEach(a => {
                switch (a.subject.substr(-3, 1)) {
                    case '1':
                        rows[0].rows.push({title: a.subject, id: `subject-${a.id}`})
                        break;
                    case '2':
                        rows[1].rows.push({title: a.subject, id: `subject-${a.id}`})
                        break;
                    case '3':
                        rows[2].rows.push({title: a.subject, id: `subject-${a.id}`})
                        break;
                    case '4':
                        rows[3].rows.push({title: a.subject, id: `subject-${a.id}`})
                        break;
                }
            })
            rows = rows.filter(a => a.rows.length != 0);

            let list = new List(`${dep_name} Subjects`, `${dep_name}`, rows, 'Subjects', '');
            return err ? reject(err) : resolve(list);
        });
    });
}

exports.subject = subject;