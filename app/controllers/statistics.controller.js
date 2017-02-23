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


    var start = req.query['year'];
    var end = req.query['year'];
    if (req.query['period'] == 1) {
        start += "-01-01";
        end += "-04-30";
    } else if (req.query['period'] == 2) {
        start += "-05-01";
        end += "-08-31";
    } else if (req.query['period'] == 3) {
        start += "-09-01";
        end += "-12-31";
    } else {
        start += "-01-01";
        end += "-12-31";
    }
    delete q.period
    
    r.db('wto2').table('f3').between(start, end, { index: 'request_print_date' })
        .merge(function (m) {
            return {
                report_status: r.branch(r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' })
                    .filter(function (c) {
                        return (c('quantity').eq(m('quantity')))
                            .and(c('product_code').eq(m('product_code')))
                            .and(c('tax_id').eq(m('receive_tax_id')))
                            .and(c('import_date').eq(m('import_date')))
                    }).count().gt(0)
                    , true
                    , false),
                custom_print_date: r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' }).coerceTo('array')
                    .pluck('custom_print_date'),
                quota_name: r.branch(m('quota').eq(true), 'ในโควตา', 'นอกโควตา'),
                product_code: m('product_code').split('.')(0).add(m('product_code').split('.')(1)).add(m('product_code').split('.')(2)),
                import_date: m('import_date').split('T')(0),
                request_expire_date: m('request_expire_date').split('T')(0),
                request_print_date: m('request_print_date').split('T')(0),
                year: m('request_print_date').split('-')(0)
            }
        })
        .merge(function (mm) {
            return {
                custom_print_date: r.branch(mm('custom_print_date').eq([]), null, mm('custom_print_date')(0)('custom_print_date').split('T')(0)),
                report_status_name: r.branch(mm('report_status').eq(true), 'รายงานแล้ว', 'ยังไม่รายงาน')
            }
        })
        .innerJoin(r.db('common').table('country'), function (f, c) {
            return f('source_country').eq(c('country_code2'))
        }).pluck('left', { right: ['country_name_th', 'country_name_en'] }).zip()
        .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
        .filter(function (f) {
            return f('product_code').eq(req.query['product_code'])
                .and(f('report_status').eq(true))
        })
        // .group('product_code').sum('weight_net')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}