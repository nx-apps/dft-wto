exports.listimporter = function (req, res) {
    var r = req.r;
    // var q = {};
    // for (key in req.query) {
    //     if (req.query[key] == "true") {
    //         req.query[key] = true;
    //     } else if (req.query[key] == "false") {
    //         req.query[key] = false;
    //     } else if (req.query[key] == "null") {
    //         req.query[key] = null;
    //     }
    //     q[key] = req.query[key];
    // }


    var start_date = req.query['year'];
    var end_date = req.query['year'];
    if (req.query['period'] == 1) {
        start_date += "-01-01";
        end_date += "-04-30";
    } else if (req.query['period'] == 2) {
        start_date += "-05-01";
        end_date += "-08-31";
    } else if (req.query['period'] == 3) {
        start_date += "-09-01";
        end_date += "-12-31";
    } else {
        start_date += "-01-01";
        end_date += "-12-31";
    }
    // delete q.period

    r.expr([{
        f3: r.db('wto2').table('f3')
            .between(start_date, end_date, { index: 'import_date' })
            .filter({ product_code: req.query['product_code'] })
            .coerceTo('array'),
        custom: r.db('wto2').table('custom').between(start_date, end_date, { index: 'import_date' })
            .filter({ product_code: req.query['product_code'] })
            .coerceTo('array')
    }])
        .merge(function (m) {
            return {
                company_f3: m('f3')
                    .group('receive_tax_id')
                    .ungroup()
                    .coerceTo('array')
                    .merge(function (m) {
                        return {
                            tax_id: m('group'),
                            product_code: m('reduction').getField('product_code')(0),
                            sum_weight_rice: m('reduction').sum('weight_net')
                        }
                    })
                    .merge(function (m) {
                        return {
                            product_code: m('product_code').split('.')(0)
                                .add(m('product_code').split('.')(1))
                                .add(m('product_code').split('.')(2))
                        }
                    }).without('group', 'reduction')
                    .innerJoin(m('f3'), function (name, f3) {
                        return name('tax_id').eq(f3('receive_tax_id'))
                    }).pluck('left', { right: ['receive_name'] }).zip()
                ,
                company_custom: m('custom')
                    .group('tax_id')
                    .ungroup()
                    .coerceTo('array')
                    .merge(function (m) {
                        return {
                            tax_id: m('group'),
                            product_code: m('reduction').getField('product_code')(0),
                            sum_weight_rice: m('reduction').sum('weight_net')
                        }
                    }).without('group', 'reduction')
                    .innerJoin(m('f3'), function (name, f3) {
                        return name('tax_id').eq(f3('receive_tax_id'))
                    }).pluck('left', { right: ['receive_name'] }).zip()
            }
        })
        .merge(function (m) {
            return {
                company: m('company_custom').union(m('company_f3'))
            }
        })
        // .without('company_custom', 'company_f3', 'custom', 'f3')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.list = function (req, res) {
    var r = req.r;
    var start_date = req.query.year + "-01-01T00:00:00.000Z";
    var end_date = req.query.year + "-12-31T00:00:00.000Z";
    r.expr([{
        f3: r.db('wto2').table('f3')
            .between(start_date, end_date, { index: 'import_date' })
            .coerceTo('array'),
        custom: r.db('wto2').table('custom').between(start_date, end_date, { index: 'import_date' })
            .coerceTo('array')
    }])
        .merge(function (m) {
            return {
                custom: m('custom').merge(function (cus2_merge) {
                    return {
                        quota: r.db('wto2').table('f3').getAll(cus2_merge('commerce_id'), { index: 'request_id' })(0)
                            .getField('quota')
                    }
                })
            }
        })
        .merge(function (m) {
            return {
                rice_custom: m('custom')
                    .group(function (g) {
                        return g.pluck('product_code', 'quota')
                    })
                    .sum('weight_net')
                    .ungroup()
                    .merge(function (m) {
                        return {
                            product_code: m('group')('product_code'),
                            quota: m('group')('quota'),
                            weight_net: m('reduction'),
                            division: 'custom'
                        }
                    }).without('group', 'reduction'),
                rice_f3: m('f3')
                    .group(function (g) {
                        return g.pluck('product_code', 'quota')
                    })
                    .sum('weight_net')
                    .ungroup()
                    .merge(function (m) {
                        return {
                            product_code: m('group')('product_code'),
                            quota: m('group')('quota'),
                            weight_net: m('reduction'),
                            division: 'f3'
                        }
                    }).without('group', 'reduction'),
                company_custom: m('custom').pluck('tax_id').distinct().count(),
                company_f3: m('f3').pluck('receive_tax_id').distinct().count(),
                weight_net_custom: m('custom').sum('weight_net'),
                weight_net_f3: m('f3').sum('weight_net'),
                product_custom: m('custom').pluck('product_code').distinct().count(),
                product_f3: m('f3').pluck('product_code').distinct().count()
            }
        })
        .merge(function (m) {
            return {
                type_stat: 'in&out_quota',
                product_code: m('rice_custom').merge(function (product_name) {
                    return {
                        product_code: product_name('product_code').split('.')(0)
                            .add(product_name('product_code').split('.')(1))
                            .add(product_name('product_code').split('.')(2))
                    }
                })
                    .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
                ,
                rice: m('rice_custom').union(m('rice_f3'))
                    .group('product_code')
                    .ungroup()
                    .merge(function (rice_merge) {
                        return {
                            type_quota: 'all',
                            product_code: rice_merge('group'),
                            in_f3: rice_merge('reduction').filter({ quota: true, division: 'f3' }).sum('weight_net'),
                            in_cus: rice_merge('reduction').filter({ quota: true, division: 'custom' }).sum('weight_net'),
                            out_f3: rice_merge('reduction').filter({ quota: false, division: 'f3' }).sum('weight_net'),
                            out_cus: rice_merge('reduction').filter({ quota: false, division: 'custom' }).sum('weight_net')
                        }
                    }).without('group', 'reduction')
                    .merge(function (m) {
                        return {
                            product_code: m('product_code').split('.')(0)
                                .add(m('product_code').split('.')(1))
                                .add(m('product_code').split('.')(2))
                        }
                    })
                    .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
            }
        }).without('custom', 'f3', 'rice_custom', 'rice_f3')
        .run()
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listInqouta = function (req, res) {
    var r = req.r

    var start_date = req.query['year'];
    var end_date = req.query['year'];
    if (req.query['period'] == 1) {
        start_date += "-01-01";
        end_date += "-04-30";
    } else if (req.query['period'] == 2) {
        start_date += "-05-01";
        end_date += "-08-31";
    } else if (req.query['period'] == 3) {
        start_date += "-09-01";
        end_date += "-12-31";
    } else {
        start_date += "-01-01";
        end_date += "-12-31";
    }

    r.expr([{
        f3: r.db('wto2').table('f3')
            .between(start_date, end_date, { index: 'import_date' })
            .filter({ quota: true })
            .coerceTo('array'),
        custom: r.db('wto2').table('custom').between(start_date, end_date, { index: 'import_date' })
            .coerceTo('array')
    }])
        .merge(function (m) {
            return {
                custom: m('custom').merge(function (cus_merge) {
                    return {
                        quota: r.db('wto2').table('f3').getAll(cus_merge('commerce_id'), { index: 'request_id' })(0)
                            .getField('quota')
                    }
                })
                    .filter({ quota: true })
            }
        })
        .merge(function (m) {
            return {
                rice_custom: m('custom')
                    .group(function (g) {
                        return g.pluck('product_code', 'quota')
                    })
                    .sum('weight_net')
                    .ungroup()
                    .merge(function (m) {
                        return {
                            product_code: m('group')('product_code'),
                            quota: m('group')('quota'),
                            weight_net: m('reduction'),
                            division: 'custom'
                        }
                    }).without('group', 'reduction'),
            }
        })
        .merge(function (m) {
            return {
                rice_f3: m('f3')
                    .group(function (g) {
                        return g.pluck('product_code', 'quota')
                    })
                    .sum('weight_net')
                    .ungroup()
                    .merge(function (m) {
                        return {
                            product_code: m('group')('product_code'),
                            quota: m('group')('quota'),
                            weight_net: m('reduction'),
                            division: 'f3'
                        }
                    }).without('group', 'reduction'),
                company_custom: m('custom').pluck('tax_id').distinct().count(),
                company_f3: m('f3').pluck('receive_tax_id').distinct().count(),
                product_custom: m('custom').pluck('product_code').distinct().count(),
                product_f3: m('f3').pluck('product_code').distinct().count()
            }
        })
        .merge(function (m) {
            return {
                type_stat: 'in_quota',
                weight_net_custom: m('rice_custom').sum('weight_net'),
                weight_net_f3: m('rice_f3').sum('weight_net'),
                product_code: m('rice_custom').merge(function (product_name) {
                    return {
                        product_code: product_name('product_code').split('.')(0)
                            .add(product_name('product_code').split('.')(1))
                            .add(product_name('product_code').split('.')(2))
                    }
                })
                    .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
                ,
                rice: m('rice_custom').union(m('rice_f3'))
                    .group('product_code')
                    .ungroup()
                    .merge(function (rice_merge) {
                        return {
                            type_quota: true,
                            product_code: rice_merge('group'),
                            in_f3: rice_merge('reduction').filter({ division: 'f3' }).sum('weight_net'),
                            in_cus: rice_merge('reduction').filter({ division: 'custom' }).sum('weight_net')
                        }
                    }).without('group', 'reduction')
                    .merge(function (m) {
                        return {
                            product_code: m('product_code').split('.')(0)
                                .add(m('product_code').split('.')(1))
                                .add(m('product_code').split('.')(2))
                        }
                    })
                    .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
            }
        }).without('custom', 'f3', 'rice_custom', 'rice_f3')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
exports.listOutqouta = function (req, res) {
    var r = req.r

    var start_date = req.query['year'] + "-01-01T00:00:00.000Z";
    var end_date = req.query['year'] + "-12-31T00:00:00.000Z";

    r.expr([{
        f3: r.db('wto2').table('f3')
            .between(start_date, end_date, { index: 'import_date' })
            .filter({ quota: false })
            .coerceTo('array'),
        custom: r.db('wto2').table('custom').between(start_date, end_date, { index: 'import_date' })
            .coerceTo('array')
    }])
        .merge(function (m) {
            return {
                custom: m('custom').merge(function (cus_merge) {
                    return {
                        quota: r.db('wto2').table('f3').getAll(cus_merge('commerce_id'), { index: 'request_id' })(0)
                            .getField('quota')
                    }
                })
                    .filter({ quota: false })
            }
        })
        .merge(function (m) {
            return {
                rice_custom: m('custom')
                    .group(function (g) {
                        return g.pluck('product_code', 'quota')
                    })
                    .sum('weight_net')
                    .ungroup()
                    .merge(function (m) {
                        return {
                            product_code: m('group')('product_code'),
                            quota: m('group')('quota'),
                            weight_net: m('reduction'),
                            division: 'custom'
                        }
                    }).without('group', 'reduction'),
            }
        })
        .merge(function (m) {
            return {
                rice_f3: m('f3')
                    .group(function (g) {
                        return g.pluck('product_code', 'quota')
                    })
                    .sum('weight_net')
                    .ungroup()
                    .merge(function (m) {
                        return {
                            product_code: m('group')('product_code'),
                            quota: m('group')('quota'),
                            weight_net: m('reduction'),
                            division: 'f3'
                        }
                    }).without('group', 'reduction'),
                company_custom: m('custom').pluck('tax_id').distinct().count(),
                company_f3: m('f3').pluck('receive_tax_id').distinct().count(),
                product_custom: m('custom').pluck('product_code').distinct().count(),
                product_f3: m('f3').pluck('product_code').distinct().count()
            }
        })
        .merge(function (m) {
            return {
                type_stat: 'out_quota',
                weight_net_custom: m('rice_custom').sum('weight_net'),
                weight_net_f3: m('rice_f3').sum('weight_net'),
                product_code: m('rice_custom').merge(function (product_name) {
                    return {
                        product_code: product_name('product_code').split('.')(0)
                            .add(product_name('product_code').split('.')(1))
                            .add(product_name('product_code').split('.')(2))
                    }
                })
                    .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
                ,
                rice: m('rice_custom').union(m('rice_f3'))
                    .group('product_code')
                    .ungroup()
                    .merge(function (rice_merge) {
                        return {
                            type_quota: false,
                            product_code: rice_merge('group'),
                            out_f3: rice_merge('reduction').filter({ division: 'f3' }).sum('weight_net'),
                            out_cus: rice_merge('reduction').filter({ division: 'custom' }).sum('weight_net')
                        }
                    }).without('group', 'reduction')
                    .merge(function (m) {
                        return {
                            product_code: m('product_code').split('.')(0)
                                .add(m('product_code').split('.')(1))
                                .add(m('product_code').split('.')(2))
                        }
                    })
                    .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
            }
        }).without('custom', 'f3', 'rice_custom', 'rice_f3')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
exports.search_list_head = function(req, res){
    var j = req.jdbc;
    j.query("mssql", `EXEC sp_query_wto_qu01 @year=?,@type=?,@period=? `, [req.query.year,req.query.quota,req.query.period],
        function (err, data) {
            res.send(data)
        })
}
exports.search_list_detail = function(req, res){
    var j = req.jdbc;
    j.query("mssql", `EXEC sp_query_wto_qu02 @year=?,@type=?,@period=? `, [req.query.year,req.query.quota,req.query.period],
        function (err, data) {
            res.send(data)
        })
}