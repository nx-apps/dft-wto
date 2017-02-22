exports.list = function (req, res) {
    var r = req.r;
    var q = {};
    for (key in req.query) {

        if (req.query[key] == "true") {
            req.query[key] = true;
        } else if (req.query[key] == "false") {
            req.query[key] = false;
        } else if (req.query[key] == "null") {
            req.query[key] = null;
        }
        q[key] = req.query[key];
    }
    r.db('wto2').table('f3')
        .merge(function (m) {
            return {
                report_status: r.branch(r.db('wto2').table('custom').filter(function (c) {
                    return c('commerce_id').eq(m('request_id'))
                        .and(c('quantity').eq(m('quantity')))
                        .and(c('product_code').eq(m('product_code')))
                        .and(c('tax_id').eq(m('receive_tax_id')))
                        .and(c('import_date').eq(m('import_date')))
                }).count().gt(0)
                    , true
                    , false),
                custom_print_date: r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' })
                    .pluck('custom_print_date')
                    .coerceTo('array'),
                quota_name: r.branch(m('quota').eq(true), 'ในโควตา', 'นอกโควตา'),
                product_code: m('product_code').split('.')(0).add(m('product_code').split('.')(1)).add(m('product_code').split('.')(2)),
                import_date: m('import_date').split('T')(0),
                request_expire_date: m('request_expire_date').split('T')(0),
                request_print_date: m('request_print_date').split('T')(0)
            }
        })
        .map(function (print_date) {
            return print_date.merge({ custom_print_date: print_date('custom_print_date').getField('custom_print_date')(0) }).without('test');
        })
        .merge(function (mm) {
            return {
                report_status_name: r.branch(mm('report_status').eq(true), 'รายงานแล้ว', 'ยังไม่รายงาน'),
                custom_print_date: mm('custom_print_date').split('T')(0)
            }
        })
        .innerJoin(r.db('common').table('country'), function (f, c) {
            return f('source_country').eq(c('country_code2'))
        }).pluck('left', { right: ['country_name_th', 'country_name_en'] }).zip()
        .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
        .filter(q)
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.quotaList = function (req, res) {
    r.db('wto2').table('quota')
        .run()
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err);
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
            .catch((err) => {
                result.message = err;
                res.status(500).json(err);
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