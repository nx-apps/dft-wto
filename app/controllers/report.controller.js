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
                            dateCheck: f5.getField('import_date').split("-")(0).coerceTo('number')
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
                            dateCheck: f5.getField('import_date').split("-")(0).coerceTo('number')
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
exports.report3 = function (req,res) {
    var r = req.r;
    let data = new Object()
    data.date_start_inyear = req.query.date_start.concat('T00:00:00.000Z')
    data.date_end_inyear = req.query.date_end.concat('T23:59:59.999Z')
    data.date_start_old_year = String(Number(req.query.date_start.split('-')[0])-1).concat('-',req.query.date_start.split('-')[1]+'-01T00:00:00.000Z')
    data.date_end_old_inyear = String(Number(req.query.date_end.split('-')[0])-1).concat('-',req.query.date_end.split('-')[1]+'-31T23:59:59.999Z')
    data.quota_year = Number(req.query.date_start.split('-')[0])

    r.expr(data)
    .merge(function (quota) {
            return {
                quota:r.db('wto2').table('quota').filter({"year": data.quota_year}).pluck('quality').coerceTo('array')(0).getField('quality')
            }
     })
     .merge((monthss)=>{
         return {
             month: r.db('wto2').table('f3').between(data.date_start_inyear,data.date_end_inyear,
                    { index: 'import_date' }
                ).coerceTo('array')
                .merge((thisMonth)=>{
                    return {
                        month_is : thisMonth.getField('import_date').split('-')(1)
                    }
                })
                .group('month_is')
                .ungroup()
                .merge((qouta)=>{
                        return {
                            quota : monthss.getField('quota')
                        }
                })
                .merge((date)=>{
                        return {
                            date : date.getField('reduction')(0).getField('import_date')
                        }
                })
                .merge((changeNamereduction)=>{
                    return {
                        contry : changeNamereduction.getField('reduction')
                                    .group('origin_country')
                                    .ungroup()
                                    .merge(function (country_merge) {
                        return {
                            country_name: country_merge('group'),
                            in_q: country_merge('reduction').filter({ quota: true }).sum('weight_net'),
                            ou_q: country_merge('reduction').filter({ quota: false }).sum('weight_net'),
                            rice_name: country_merge('reduction').getField('product_detail').distinct()
                                .reduce(function (l, r) {
                                    return l.add(', ', r)
                                })
                        }
                    })
                    .without('group', 'reduction')
                    .merge(function (country_merge_name) {
                        return {
                            country_name_th: r.db('common').table('country').getAll(country_merge_name('country_name'), { index: 'country_code2' })(0).getField('country_name_th')
                        }
                    })
                    }
                })
                .without('group','reduction')
                .merge(function (year_merge) {
                    return {
                        total_in_q: year_merge('contry').sum('in_q'),
                        total_ou_q:year_merge('contry').sum('ou_q'),
                    }
                })
         }
     })
     //start old year
     .merge((monthss)=>{
         return {
             month_old: r.db('wto2').table('f3').between(data.date_start_old_year,data.date_end_old_inyear,
                    { index: 'import_date' }
                ).coerceTo('array')
                .merge((thisMonth)=>{
                    return {
                        month_is : thisMonth.getField('import_date').split('-')(1)
                    }
                })
                .group('month_is')
                .ungroup()
                .merge((qouta)=>{
                        return {
                            quota : monthss.getField('quota')
                        }
                })
                .merge((date)=>{
                        return {
                            date : date.getField('reduction')(0).getField('import_date')
                        }
                })
                .merge((changeNamereduction)=>{
                    return {
                        contry : changeNamereduction.getField('reduction')
                                    .group('origin_country')
                                    .ungroup()
                                    .merge(function (country_merge) {
                        return {
                            country_name: country_merge('group'),
                            in_q: country_merge('reduction').filter({ quota: true }).sum('weight_net'),
                            ou_q: country_merge('reduction').filter({ quota: false }).sum('weight_net'),
                            rice_name: country_merge('reduction').getField('product_detail').distinct()
                                .reduce(function (l, r) {
                                    return l.add(', ', r)
                                })
                        }
                    })
                    .without('group', 'reduction')
                    .merge(function (country_merge_name) {
                        return {
                            country_name_th: r.db('common').table('country').getAll(country_merge_name('country_name'), { index: 'country_code2' })(0).getField('country_name_th')
                        }
                    })
                    }
                })
                .without('group','reduction')
                .merge(function (year_merge) {
                    return {
                        total_in_q: year_merge('contry').sum('in_q'),
                        total_ou_q:year_merge('contry').sum('ou_q'),
                    }
                })
         }
     })
     //end old year
     .merge((calTotalinYear)=>{
        return {
            total_Year_this_in_q: calTotalinYear('month').sum('total_in_q'),
            total_Year_this_ou_q: calTotalinYear('month').sum('total_ou_q'), 
        }
     })
     .merge((calTotalinYear)=>{
        return {
            total_Year_old_in_q: calTotalinYear('month_old').sum('total_in_q'),
            total_Year_old_ou_q: calTotalinYear('month_old').sum('total_ou_q'), 
        }
     })
     .without('month_old','quota','date_start_old_year','date_end_old_inyear')
    .run()
    .then(function (data) {
            res.json(data);
    })
}
exports.report4 = function (req,res) {
    var r = req.r;
    let data = new Object()
    let componey = new Array()
    data.date_start = req.query.date_start.concat('T00:00:00.000Z')
    data.date_end = req.query.date_end.concat('T23:59:59.999Z')
    data.month_end = Number(req.query.date_end.split('-')[1])
    //for(let i=1; i<=data.month_end ;i++)
     //   componey.push({month_no:req.query.date_end.split('-')[0]+'-0'+(String(i))})

    r.db('wto2').table('f3').between(data.date_start,data.date_end,{ index: 'import_date' })
    .merge((cm)=>{
        return {
            import_report:r.db('wto2').table('custom').between(data.date_start,data.date_end,{ index: 'import_date' })
                .filter({commerce_id:cm.getField('request_id')})
                // .getAll(cm.getField('request_id'), { index: 'commerce_id' })
                .coerceTo('array')
                .getField('import_date')
                .reduce(function(l,r){
                    return l.add(r)
                }).default("")
        }
    })
    .merge((checkImport)=>{
        return {
           check_import :  checkImport.getField('import_report').eq("").branch('ยังไม่รายงาน','รายงาน')
        }
    })
    .merge((country_merge_name)=> {
                        return {
                            country_name_th: r.db('common').table('country').getAll(country_merge_name('origin_country'), { index: 'country_code2' })(0).getField('country_name_th')
                        }
                    })
    .merge((quota)=>{
        return {
            quotaIs : quota.getField('quota').eq(true).branch('IN', 'OUT')
        }
    })
    .merge((calBathPerTon)=>{
        return {
            total_bath_per_ton : calBathPerTon.getField('rate_exchange').mul(1000)
        }
    })
    .merge((calBath)=>{
        return {
            total_bath : calBath.getField('total_bath_per_ton').mul(calBath.getField('weight_net'))
        }
    })
    
    .run()
    .then(function (data) {
            // res.json(componey);
            res.json(data);
    })

}