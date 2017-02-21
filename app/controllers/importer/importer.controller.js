exports.list = function (req, res) {
    var r = req.r;
    r.db('wto2').table('f3')
        .merge(function (m) {
            return {
                report_status: r.branch(r.db('wto2').table('custom').filter({ 'commerce_id': m('request_id') }).count().gt(0)
                    , true, false),
                quota_name: r.branch(m('quota').eq(true), 'ในโควตา', 'นอกโควตา'),
                import_date : m('import_date').split('T')(0),
                request_expire_date : m('request_expire_date').split('T')(0),
                request_print_date : m('request_print_date').split('T')(0)
            }
        })
        .merge(function (mm) {
            return {
                report_status_name: r.branch(mm('report_status').eq(true), 'รายงานแล้ว', 'ยังไม่รายงาน')
            }
        })
        .run()
        .then(function (result) {
            res.json(result)
        })
        .error(function (err) {
            res.json(err)
        })
}
exports.quotaList = function (req, res) {
    r.db('wto2').table('quota')
        .run()
        .then((result) => {
            res.json(result)
        })
        .error((err) => {
            res.json(err)
        })
}
exports.insert = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('quota', req.body);
    var result = { result: false, message: null, id: null };
    // console.log('===>',valid)
    if (valid) {
        r.db('wto2').table('quota').insert(req.body)
            .run()
            .then((response) => {
                result.message = response;
                if (response.errors == 0) {
                    result.result = true;
                    result.id = response.generated_keys;
                }
                res.json(result);
            })
            .error((err) => {
                result.message = err;
                res.json(result);
            })
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
    // console.log(rs)

}
exports.update = function (req, res) {
    var r = req.r;
}
exports.delete = function (req, res) {
    var r = req.r;
}