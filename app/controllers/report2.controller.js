exports.report1 = function (req, res) {
    //https://localhost:3000/api/report/report1?year_start=2016&year_end=2017
    // let year_start, year_end;
    // console.log(typeof req.query.year_start)
    if (typeof req.query.year_start !== 'string')
        req.query.year_start = Number(new Date().getFullYear())
    if (typeof req.query.year_end !== 'string')
        req.query.year_end = Number(new Date().getFullYear()) + 1

    req.jdbc.query('mssql', `
    exec sp_wto_rpt_01 @startYear=?,@endYear=?
    `, [req.query.year_start, req.query.year_end], function (err, data) {
            data = JSON.parse(data);
            r.expr(data).merge(function (m) {
                var sum = r.db('wto2').table('quota').getAll(m('yearQuota'), { index: 'year' }).sum('quantity');
                return {
                    quota: sum,
                    inPercent: r.branch(sum.eq(0), 0, m('inQuota').div(sum).mul(100)),
                    outPercent: r.branch(sum.eq(0), 0, m('outQuota').div(sum).mul(100)),
                    yearThai: m('yearQuota').add(543)
                }
            }).run().then(function (data) {
                // let param = new Object();
                var param = {};
                param.yearStart = Number(req.query.year_start) + 543
                param.yearEnd = Number(req.query.year_end) + 543
                param.date = new Date().toISOString().split('T')[0]
                // console.log('>>>>>', param)
                // res.json(data);
                res.ireport('/wto/report_1.jasper', "pdf", data, param);
            })
        })
}


exports.report2 = function (req, res) {
    var r = req.r;
    //https://localhost:3000/api/report/report2?year1=2016&year2=2017
    // var start_year = req.query.year1+"-01-01T00:00:00.000Z";
    // var end_year = req.query.year2+"-12-31T00:00:00.000Z";
    if (typeof req.query.year1 !== 'string')
        req.query.year1 = Number(new Date().getFullYear())
    if (typeof req.query.year2 !== 'string')
        req.query.year2 = Number(new Date().getFullYear()) + 1

    req.jdbc.query('mssql', `
    exec sp_wto_rpt_02 @startYear=?,@endYear=?
    `, [req.query.year1, req.query.year2], function (err, data) {
            data = JSON.parse(data);
            // res.json(data);
            r.expr(data)
                .group('yearQuota').ungroup()
                .map(function (m) {
                    var sum = r.db('wto2').table('quota').getAll(m('group'), { index: 'year' }).sum('quantity');
                    var country = m('reduction').group('country_name_th').ungroup()
                        .map(function (m2) {
                            return {
                                country_name_th: m2('group'),
                                zone_name: m2('reduction')(0)('zone_id'),
                                inQuota: m2('reduction').sum('inQuota'),
                                outQuota: m2('reduction').sum('outQuota'),
                                hamonize_th: m2('reduction').getField('hamonize_th').reduce(function (left, right) { return left.add(',', right) })
                            }
                        });
                    return {
                        yearQuota: m('group'),
                        yearThai: m('group').add(543),
                        quota: sum,
                        country: country.without('zone_name'),
                        inAseanIn: country.filter({ zone_name: 'ASEAN' }).sum('inQuota'),
                        inAseanOut: country.filter({ zone_name: 'ASEAN' }).sum('outQuota'),
                        outAseanIn: country.filter(function (f) {
                            return f('zone_name').ne('ASEAN')
                        }).sum('inQuota'),
                        outAseanOut: country.filter(function (f) {
                            return f('zone_name').ne('ASEAN')
                        }).sum('outQuota'),
                        sumIn: country.sum('inQuota'),
                        sumOut: country.sum('outQuota')
                    }
                })
                .run().then(function (data) {
                    // let param = new Object();
                    var param = {};
                    param.yearStart = Number(req.query.year1) + 543
                    param.yearEnd = Number(req.query.year2) + 543
                    param.date = new Date().toISOString().split('T')[0]
                    // console.log('>>>>>', param)
                    // res.json(data);
                    res.ireport('/wto/report_2.jasper', "pdf", data, param);
                })
        })
}
exports.report3 = function (req, res) {
    //https://localhost:3000/api/report/report3?date_start=2017-01-01&date_end=2017-06-31
    var r = req.r;
    let data = new Object()
    let mon = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    // data.date_start_inyear = req.query.date_start.concat('T00:00:00.000Z')
    // data.date_end_inyear = req.query.date_end.concat('T23:59:59.999Z')
    // data.date_start_old_year = String(Number(req.query.date_start.split('-')[0])-1).concat('-',req.query.date_start.split('-')[1]+'-01T00:00:00.000Z')
    // data.date_end_old_inyear = String(Number(req.query.date_end.split('-')[0])-1).concat('-',req.query.date_end.split('-')[1]+'-31T23:59:59.999Z')
    // data.quota_year = Number(req.query.date_start.split('-')[0])
    var d = [];
    for (var i = parseInt(req.query.date_start.split('-')[1]); i <= parseInt(req.query.date_end.split('-')[1]); i++) {
        d.push({
            month_no: mon[i],
            quota_year: Number(req.query.date_start.split('-')[0]),
            date_start_inyear: req.query.date_start.split('-')[0] + '-' + (mon[i]) + '-01T00:00:00.000Z',
            date_end_inyear: req.query.date_start.split('-')[0] + '-' + (mon[i]) + '-31T23:59:59.999Z',
            date_start_old_year: String(Number(req.query.date_start.split('-')[0]) - 1).concat('-', (mon[i]) + '-01T00:00:00.000Z'),
            date_end_old_year: String(Number(req.query.date_end.split('-')[0]) - 1).concat('-', (mon[i]) + '-31T23:59:59.999Z')
        });
    }
    //res.json(d);
    r.expr(d)
        .merge(function (quota) {
            return {
                quota: r.db('wto2').table('quota').getAll(quota('quota_year'), { index: 'year' })(0).pluck('quality').getField('quality')
            }
        })
        .merge((monthss) => {
            return {
                country: r.db('wto2').table('f3').between(monthss('date_start_inyear'), monthss('date_end_inyear'),
                    { index: 'import_date' }
                ).coerceTo('array')
                    .group('origin_country')
                    .ungroup()
                    .merge((sumTotal) => {
                        return {
                            country_code: sumTotal('group'),
                            in_q: sumTotal('reduction').filter({ quota: true }).sum('weight_net'),
                            ou_q: sumTotal('reduction').filter({ quota: false }).sum('weight_net'),
                            rice_name: sumTotal('reduction').getField('product_detail').distinct()
                                .reduce(function (l, r) {
                                    return l.add(', ', r)
                                })

                        }
                    })
                    .without('reduction', 'group')
                    .merge((country_merge_name) => {
                        return {
                            country_name_th: r.db('common').table('country').getAll(country_merge_name('country_code'), { index: 'country_code2' })(0).getField('country_name_th')
                        }
                    })
            }
        })
        .merge((total) => {
            return {
                total_in_q_in_year: total('country').sum('in_q'),
                total_ou_q_in_year: total('country').sum('ou_q')
            }
        })
        //  //start old year
        .merge((monthold) => {
            return {
                country_old: r.db('wto2').table('f3').between(monthold('date_start_old_year'), monthold('date_end_old_year'),
                    { index: 'import_date' }
                ).coerceTo('array')
                    .group('origin_country')
                    .ungroup()
                    .merge((sumTotal) => {
                        return {
                            country_code: sumTotal('group'),
                            in_q: sumTotal('reduction').filter({ quota: true }).sum('weight_net'),
                            ou_q: sumTotal('reduction').filter({ quota: false }).sum('weight_net'),
                            rice_name: sumTotal('reduction').getField('product_detail').distinct()
                                .reduce(function (l, r) {
                                    return l.add(', ', r)
                                })

                        }
                    })
                    .without('reduction', 'group')
                    .merge((country_merge_name) => {
                        return {
                            country_name_th: r.db('common').table('country').getAll(country_merge_name('country_code'), { index: 'country_code2' })(0).getField('country_name_th')
                        }
                    })
            }
        })
        .merge((total) => {
            return {
                total_in_q_in_old_year: total('country_old').sum('in_q'),
                total_ou_q_in_old_year: total('country_old').sum('ou_q')
            }
        })
        .without('country_old')
        .run()
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].country.length == 0) {
                    result[i].country.push({ in_q: 0, ou_q: 0 })
                }
            }
            // res.json(result);
            let param = new Object();
            // console.log('>>>>', result[0].date_start_inyear)
            // console.log('>>>>', result[result.length - 1].date_end_inyear)
            param.yearStart = (result[0].date_start_inyear.split('T')[0])
            param.yearEnd = (result[result.length - 1].date_end_inyear.split('T')[0])
            param.yearEndOld = (result[0].date_end_old_year.split('T')[0])
            param.date = new Date().toISOString().split('T')[0]
            // console.log(param)
            res.ireport('/wto/report_3.jasper', "pdf", result, param)
        })
}
exports.report4 = function (req, res) {
    //https://localhost:3000/api/report/report4?startM=1&endM=2&year=2015
    var r = req.r;
    if (typeof req.query.startM !== 'string')
        req.query.startM = Number(new Date().getMonth()) + 1
    if (typeof req.query.endM !== 'string')
        req.query.endM = Number(new Date().getMonth()) + 1
    if (typeof req.query.year !== 'string')
        req.query.year = Number(new Date().getFullYear())

    req.jdbc.query('mssql', `
    exec sp_wto_rpt_04 @startM=?,@endM=?,@year=?
    `, [req.query.startM, req.query.endM, req.query.year], function (err, data) {
            data = JSON.parse(data);
            // res.json(data);
            r.expr(data).group(function (g) {
                return g.pluck('company_name_th', 'country_name_th', 'approve_date', 'expire_date', 'monthName', 'yearName')
            }).ungroup()
                .map(function (m) {
                    return m('group').merge({
                        hamonize_th: m('reduction').getField('hamonize_th').reduce(function (left, right) { return left.add(',', right) }),
                        fob_amt_baht: m('reduction').sum('fob_amt_baht'),
                        net_weight: m('reduction').sum('net_weight'),
                        price_ton: m('reduction').sum('fob_amt_baht').div(
                            m('reduction').sum('net_weight')
                        ),
                        yearName: m('group')('yearName').add(543),
                        monthName: r.branch(m('group')('monthName').ge(10), m('group')('monthName'), r.expr('0').add(m('group')('monthName').coerceTo('string')))
                    })
                })
                .run().then(function (data) {
                    // let param = new Object();
                    // var param = {};
                    // param.yearStart = Number(req.query.year_start) + 543
                    // param.yearEnd = Number(req.query.year_end) + 543
                    // param.date = new Date().toISOString().split('T')[0]
                    // console.log('>>>>>', param)
                    // res.json(data);
                    res.ireport('/wto/report_4.jasper', "pdf", data, {});
                })
        })

}
exports.report5 = function (req, res) {
    req.jdbc.query('mssql',
        `exec sp_wto_rpt_05 @reference_code2=?`,[req.query.reference_code2],
        function (err, data) {
            // res.send(data)
            data = JSON.parse(data);
            r.expr(data).merge(function (m) {
                return {
                    date_print: new Date().toISOString().split('T')[0]
                }
            })
                .run()
                .then(function (data) {
                    // res.json(data);
                    res.ireport('/wto/report7.jasper', "pdf", data, {});
                })

        }
    )
}