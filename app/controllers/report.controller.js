exports.report1 = function (req, res) {
    let year_start, year_end;
    console.log(typeof req.query.year_start)
    if (typeof req.query.year_start !== 'string')
        req.query.year_start = new Date().getFullYear()
    if (typeof req.query.year_end !== 'string')
        req.query.year_end = new Date().getFullYear()

    year_start = Number(req.query.year_start)
    year_end = Number(req.query.year_end) + 1

    // console.log('>',year_end)
    // console.log('--------->',year_start)
    //     year_start
    //  year_end
    r.db('wto2').table('quota').between(year_start, year_end, { index: 'year' })
        .merge((f) => {
            return {
                in_quota: r.db('wto2').table('f3')
                    .merge((f5) => {
                        return {
                            dateCheck: f5.getField('request_print_date').split("-")(0).coerceTo('number')
                        }

                    })
                    .filter({ "dateCheck": f.getField('year'), "quota": true })
                    .getField('total_value')
                    .coerceTo('array')
                    .reduce(function (left, right) {
                        return left.add(right)
                    }).default(0)
                , out_quota: r.db('wto2').table('f3')
                    .merge((f5) => {
                        return {
                            dateCheck: f5.getField('request_print_date').split("-")(0).coerceTo('number')
                        }

                    })
                    .filter({ "dateCheck": f.getField('year'), "quota": false })
                    .getField('total_value')
                    .coerceTo('array')
                    .reduce(function (left, right) {
                        return left.add(right)
                    }).default(0)
            }
        })
        .merge((f) => {
            return {
                in_quota_per: f.getField('in_quota').mul(100).div(f.getField('quality')).floor()
            }
        })
        .merge((out) => {
            return {
                out_quota_per: out.getField('out_quota').mul(100).div(out.getField('quality'))
            }
        })
        .merge((total) => {
            return {
                total_vaolue: total.getField('in_quota').add(total.getField('out_quota'))
            }
        })
        .merge((year) => {
            return {
                year_thai: year.getField('year').add(543)
            }
        })
        .run()
        .then((result) => {
            res.json(result)
        })
        .error((err) => {
            res.json(err)
        })
}


exports.report2 = function (req, res) {
    var r = req.r;
    // var start_year = req.query.year1+"-01-01T00:00:00.000Z";
    // var end_year = req.query.year2+"-12-31T00:00:00.000Z";
    var d = [];
    for (var i = parseInt(req.query.year1); i <= parseInt(req.query.year2); i++) {
        d.push({ year: i });
    }
    r.expr(d)
        .merge(function (year_merge) {
            return {
                data: r.db('wto2').table('f3').between(
                    year_merge('year').coerceTo('string').add("-01-01T00:00:00.000Z"),
                    year_merge('year').coerceTo('string').add("-12-31T00:00:00.000Z"),
                    { index: 'import_date' }
                ).coerceTo('array')
                    .group('origin_country')
                    .ungroup()
                    .merge(function (country_merge) {
                        return {
                            country: country_merge('group'),
                            in: country_merge('reduction').filter({ quota: true }).sum('weight_net'),
                            out: country_merge('reduction').filter({ quota: false }).sum('weight_net'),
                            rice: country_merge('reduction').getField('product_detail').distinct()
                                .reduce(function (l, r) {
                                    return l.add(', ', r)
                                })
                        }
                    })
                    .without('group', 'reduction')
                    .merge(function (country_merge) {
                        return {
                            country_id: r.db('common').table('country').getAll(country_merge('country'), { index: 'country_code2' })(0).getField('id')
                        }
                    })
                    .merge(function (con_merge) {
                        return {
                            asean: r.db('common').table('country_group').get('ASEAN')('country')
                                .contains(con_merge('country_id'))
                        }
                    })
            }
        })
        .merge(function (year_merge) {
            return {
                aIn: year_merge('data').filter({ asean: true }).sum('in'),
                aOut: year_merge('data').filter({ asean: true }).sum('out'),
                oIn: year_merge('data').filter({ asean: false }).sum('in'),
                oOut: year_merge('data').filter({ asean: false }).sum('out')
            }
        })
        .merge(function (year_merge) {
            return {
                in: year_merge('aIn').add(year_merge('oIn')),
                out: year_merge('aOut').add(year_merge('oOut'))
            }
        })
        .run()
        .then(function (data) {
            res.json(data);
        })
}