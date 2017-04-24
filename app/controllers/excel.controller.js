exports.read = function (req, res) {
    //Read file here.
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../dft-wto/app/files/wto.xlsx');

    var file = workbook.Sheets;
    var data = {};
    var temp = { db: "", col: [], maxCol: "" };
    var keyIndex = 1; //num row has field_key
    var row = {};
    for (var sheet in file) {
        for (var key in file[sheet]) {
            if (key !== '!ref') {
                if (str2NumOnly(key) == keyIndex) {
                    temp.col[str2CharOnly(key)] = file[sheet][key].v;
                    temp.maxCol = str2CharOnly(key);
                } else {
                    if (temp.col[str2CharOnly(key)].indexOf("date") > -1) {
                        row[temp.col[str2CharOnly(key)]] = new Date(file[sheet][key].w).toISOString();
                    } else {
                        row[temp.col[str2CharOnly(key)]] = file[sheet][key].v;
                    }

                    if (str2CharOnly(key) == temp.maxCol) {
                        data[temp.db].push(row);
                        row = {};
                    }
                }
            } else {
                temp.col = [];
                temp.db = sheet;
                if (!data.hasOwnProperty(sheet)) {
                    data[sheet] = [];
                }
            }
        }
    }



    var dataSheet = [];
    for (table in data) {
        dataSheet.push({ table: table, data: data[table] });
    }

    //res.json(dataSheet);
    var r = req.r;
    r.expr(dataSheet).forEach(function (row) {
        return r.db('wto2').tableList().contains(row('table'))
            .do(function (tbExists) {
                return r.branch(tbExists,
                    r.db('wto2').table(row('table')).delete(),
                    r.db('wto2').tableCreate(row('table'))
                ).do(function (tbInsert) {
                    return r.db('wto2').table(row('table')).insert(row('data'))
                })
            })
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })

}
function str2NumOnly(string) { //input AB123  => output 123
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 48) && (string[i].charCodeAt(0) <= 57)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode(t);
}
function str2CharOnly(string) { //input AB123  => output AB
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 65) && (string[i].charCodeAt(0) <= 90)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode.apply(String, t);
}
exports.quiz = function (req, res) {
    var r = req.r;
    var limit = 3;
    r.expr({
        a: [],
        b: [],
        c: [],
        d: [],
        e: [],
        f: [],
        g: []
    })
        .merge({
            a: r.db('adb').table('test')
                .pluck('id', 'refer', 'refer_index', 'question')
                .sample(limit).coerceTo('array')
        })
        .merge(function (m) {
            return {
                b: m('a').filter(function (ff) {
                    return ff.hasFields('refer').and(ff('refer_index').gt(1))
                }).coerceTo('array')

            }
        })
        .merge(function (m) {
            return {
                c: m('b').map(function (b_map) {
                    return r.branch(
                        m('a').filter({ refer: b_map('refer'), refer_index: 1 }).count().gt(0),
                        { del: true },
                        b_map.merge({ del: false })
                    )
                })
                    .filter(function (ff) {
                        return ff('del').eq(true).not()
                    })
                    .without('del')

            }
        })
        .merge(function (m) {
            return {
                d: r.branch(
                    m('c').count().gt(0)
                    , m('c').merge(function (ref_map) {
                        return r.db('adb').table('test').filter({
                            refer: ref_map('refer'),
                            refer_index: 1
                        }).pluck('id', 'refer', 'refer_index', 'question')(0)
                    })
                    , []
                )
            }
        })
        .merge(function (m) {
            return {
                e: m('d').union(m('c'))
            }
        })
        .merge(function (m) {
            return {
                f: m('e').union(m('a')).distinct().orderBy('refer', 'refer_index')
            }
        })
        .merge(function (m) {
            return {
                g: m('f').limit(limit)
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
}

exports.quiz2 = function (req, res) {
    var r = req.r;
    r.expr([
        {
            "amount": 3,
            "dificalty_index": 1,
            "name": "เลือกใช้ภาษาอังกฤษได้ถูกต้อง",
            "sub_module": [
                "test002"
            ]
        },
        {
            "amount": 1,
            "dificalty_index": 2,
            "name": "เขียนภาษาอังกฤษได้ดี",
            "sub_module": [
                "test001"
            ]
        }
    ])
        .merge(function (m) {
            return {
                a: r.db('lms').table('question')
                    .getAll(r.args(m('sub_module')), { index: 'tags' })
                    .filter({ dificalty_index: m('dificalty_index') })
                    .pluck('id', 'refer', 'refer_index', 'question')
                    .sample(m('amount')).coerceTo('array')
            }
        })
        .merge(function (m) {
            return {
                b: m('a').filter(function (ff) {
                    return ff.hasFields('refer').and(ff('refer_index').gt(1))
                }).coerceTo('array')

            }
        })
        .merge(function (m) {
            return {
                c: m('b').map(function (b_map) {
                    return r.branch(
                        m('a').filter({ refer: b_map('refer'), refer_index: 1 }).count().gt(0),
                        { del: true },
                        b_map.merge({ del: false })
                    )
                })
                    .filter(function (ff) {
                        return ff('del').eq(true).not()
                    })
                    .without('del')

            }
        })
        .merge(function (m) {
            return {
                d: r.branch(
                    m('c').count().gt(0)
                    , m('c').merge(function (ref_map) {
                        return r.db('lms').table('question').filter({
                            refer: ref_map('refer'),
                            refer_index: 1
                        }).pluck('id', 'refer', 'refer_index', 'question')(0)
                    })
                    , []
                )
            }
        })
        .merge(function (m) {
            return {
                e: m('d').union(m('c'))
            }
        })
        .merge(function (m) {
            return {
                f: m('e').union(m('a')).distinct().orderBy('refer', 'refer_index')
            }
        })
        .merge(function (m) {
            return {
                g: m('f').limit(limit)
            }
        })
        // .getField('g')
        // .reduce(function (l, r) {
        //     return l.add(r)
        // })
        .run()
        .then(function (result) {
            res.json(result);
        })
}


exports.test = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `EXEC sp_query_test @param1=?,@param2=? `, [req.query.param1,req.query.param2],
        function (err, data) {
            res.send(data)
        })
}