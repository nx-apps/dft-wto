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
    // res.json(data);
    var r = req.r;
    var respon = true;
    for (tb in data) {
        // if (!data2DB(r, tb, data[tb])) {
        //     respon = false;
        // }
        console.log(data2DB(r, tb, data[tb]));

    }
    res.json(respon);
}
function data2DB(r, table, data) {
    r.db('wto2').tableList().contains(table)
        .do(function (tbExists) {
            return r.branch(tbExists,
                r.db('wto2').table(table).delete(),
                r.db('wto2').tableCreate(table)
            ).do(function (tbInsert) {
                return r.db('wto2').table(table).insert(data)
            })
        })
        .run()
        .then(function (result) {
            if (result.errors == 0) {
                return true;
            } else {
                return false;
            }
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