// exports.old = function (req, res) {
//     var r = req.r;
//     var q = {};
//     for (key in req.query) {
//         if (req.query[key] == "true") {
//             req.query[key] = true;
//         } else if (req.query[key] == "false") {
//             req.query[key] = false;
//         } else if (req.query[key] == "null") {
//             req.query[key] = null;
//         }
//         q[key] = req.query[key];
//     }


//     var start = req.query['year'];
//     var end = req.query['year'];
//     if (req.query['period'] == 1) {
//         start += "-01-01";
//         end += "-04-30";
//     } else if (req.query['period'] == 2) {
//         start += "-05-01";
//         end += "-08-31";
//     } else if (req.query['period'] == 3) {
//         start += "-09-01";
//         end += "-12-31";
//     } else {
//         start += "-01-01";
//         end += "-12-31";
//     }
//     delete q.period

//     //  res.send(start + '<br>' + end);
//     r.db('wto2').table('f3').between(start, end, { index: 'request_print_date' })
//         // r.db('wto2').table('f3')
//         .merge(function (m) {
//             return {
//                 report_status: r.branch(r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' })
//                     .filter(function (c) {
//                         return (c('quantity').eq(m('quantity')))
//                             .and(c('product_code').eq(m('product_code')))
//                             .and(c('tax_id').eq(m('receive_tax_id')))
//                             .and(c('import_date').eq(m('import_date')))
//                     }).count().gt(0)
//                     , true
//                     , false),
//                 custom_print_date: r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' }).coerceTo('array')
//                     .pluck('custom_print_date'),
//                 quota_name: r.branch(m('quota').eq(true), 'ในโควตา', 'นอกโควตา'),
//                 product_code: m('product_code').split('.')(0).add(m('product_code').split('.')(1)).add(m('product_code').split('.')(2)),
//                 import_date: m('import_date').split('T')(0),
//                 request_expire_date: m('request_expire_date').split('T')(0),
//                 request_print_date: m('request_print_date').split('T')(0),
//                 year: m('import_date').split('-')(0)
//             }
//         })
//         .merge(function (mm) {
//             return {
//                 custom_print_date: r.branch(mm('custom_print_date').eq([]), null, mm('custom_print_date')(0)('custom_print_date').split('T')(0)),
//                 report_status_name: r.branch(mm('report_status').eq(true), 'รายงานแล้ว', 'ยังไม่รายงาน')
//             }
//         })
//         .innerJoin(r.db('common').table('country'), function (f, c) {
//             return f('source_country').eq(c('country_code2'))
//         }).pluck('left', { right: ['country_name_th', 'country_name_en'] }).zip()
//         .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
//         .filter(q)
//         .run()
//         .then(function (result) {
//             res.json(result)
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })

// }
// exports.list = function (req, res) {
//     var r = req.r
//     var start_date = req.query.year + "-01-01T00:00:00.000Z";
//     var end_date = req.query.year + "-12-31T00:00:00.000Z";
//     r.db('wto2').table('f3').between(start_date, end_date, { index: 'import_date' })
//         .merge(function (m) {
//             return {
//                 report_status: r.branch(r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' })
//                     // .filter(function (c) {
//                     //     return (c('quantity').eq(m('quantity')))
//                     //         .and(c('product_code').eq(m('product_code')))
//                     //         .and(c('tax_id').eq(m('receive_tax_id')))
//                     //         .and(c('import_date').eq(m('import_date')))
//                     // })
//                     .count().gt(0)
//                     , true
//                     , false),
//                 custom_print_date: r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' }).coerceTo('array')
//                     .pluck('custom_print_date'),
//                 quota_name: r.branch(m('quota').eq(true), 'ในโควตา', 'นอกโควตา'),
//                 product_code: m('product_code').split('.')(0).add(m('product_code').split('.')(1)).add(m('product_code').split('.')(2)),
//                 import_date: m('import_date').split('T')(0),
//                 request_expire_date: m('request_expire_date').split('T')(0),
//                 request_print_date: m('request_print_date').split('T')(0)
//             }
//         })
//         .merge(function (mm) {
//             return {
//                 custom_print_date: r.branch(mm('custom_print_date').eq([]), null, mm('custom_print_date')(0)('custom_print_date').split('T')(0)),
//                 report_status_name: r.branch(mm('report_status').eq(true), 'รายงานแล้ว', 'ยังไม่รายงาน')
//             }
//         })
//         .innerJoin(r.db('common').table('country'), function (f, c) {
//             return f('source_country').eq(c('country_code2'))
//         }).pluck('left', { right: ['country_name_th', 'country_name_en'] }).zip()
//         .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
//         .orderBy('receive_tax_id')
//         .run()
//         .then(function (data) {
//             res.json(data)
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
// }
// exports.list_inquota = function (req, res) {
//     var r = req.r
//     var start_date = req.query['year'];
//     var end_date = req.query['year'];
//     if (req.query['period'] == 1) {
//         start_date += "-01-01";
//         end_date += "-04-30";
//     } else if (req.query['period'] == 2) {
//         start_date += "-05-01";
//         end_date += "-08-31";
//     } else if (req.query['period'] == 3) {
//         start_date += "-09-01";
//         end_date += "-12-31";
//     } else {
//         start_date += "-01-01";
//         end_date += "-12-31";
//     }
//     r.db('wto2').table('f3').between(start_date, end_date, { index: 'import_date' })
//         .filter({ quota: true })
//         .merge(function (m) {
//             return {
//                 report_status: r.branch(r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' })
//                     // .filter(function (c) {
//                     //     return (c('quantity').eq(m('quantity')))
//                     //         .and(c('product_code').eq(m('product_code')))
//                     //         .and(c('tax_id').eq(m('receive_tax_id')))
//                     //         .and(c('import_date').eq(m('import_date')))
//                     // })
//                     .count().gt(0)
//                     , true
//                     , false),
//                 custom_print_date: r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' }).coerceTo('array')
//                     .pluck('custom_print_date'),
//                 quota_name: r.branch(m('quota').eq(true), 'ในโควตา', 'นอกโควตา'),
//                 product_code: m('product_code').split('.')(0).add(m('product_code').split('.')(1)).add(m('product_code').split('.')(2)),
//                 import_date: m('import_date').split('T')(0),
//                 request_expire_date: m('request_expire_date').split('T')(0),
//                 request_print_date: m('request_print_date').split('T')(0)
//             }
//         })
//         .merge(function (mm) {
//             return {
//                 custom_print_date: r.branch(mm('custom_print_date').eq([]), null, mm('custom_print_date')(0)('custom_print_date').split('T')(0)),
//                 report_status_name: r.branch(mm('report_status').eq(true), 'รายงานแล้ว', 'ยังไม่รายงาน')
//             }
//         })
//         .innerJoin(r.db('common').table('country'), function (f, c) {
//             return f('source_country').eq(c('country_code2'))
//         }).pluck('left', { right: ['country_name_th', 'country_name_en'] }).zip()
//         .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
//         .run()
//         .then(function (data) {
//             res.json(data)
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
// }
// exports.list_outquota = function (req, res) {
//     var r = req.r
//     var start_date = req.query['year'] + "-01-01T00:00:00.000Z";
//     var end_date = req.query['year'] + "-12-31T00:00:00.000Z";
//     r.db('wto2').table('f3').between(start_date, end_date, { index: 'import_date' })
//         .filter({ quota: false })
//         .merge(function (m) {
//             return {
//                 report_status: r.branch(r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' })
//                     // .filter(function (c) {
//                     //     return (c('quantity').eq(m('quantity')))
//                     //         .and(c('product_code').eq(m('product_code')))
//                     //         .and(c('tax_id').eq(m('receive_tax_id')))
//                     //         .and(c('import_date').eq(m('import_date')))
//                     // })
//                     .count().gt(0)
//                     , true
//                     , false),
//                 custom_print_date: r.db('wto2').table('custom').getAll(m('request_id'), { index: 'commerce_id' }).coerceTo('array')
//                     .pluck('custom_print_date'),
//                 quota_name: r.branch(m('quota').eq(true), 'ในโควตา', 'นอกโควตา'),
//                 product_code: m('product_code').split('.')(0).add(m('product_code').split('.')(1)).add(m('product_code').split('.')(2)),
//                 import_date: m('import_date').split('T')(0),
//                 request_expire_date: m('request_expire_date').split('T')(0),
//                 request_print_date: m('request_print_date').split('T')(0)
//             }
//         })
//         .merge(function (mm) {
//             return {
//                 custom_print_date: r.branch(mm('custom_print_date').eq([]), null, mm('custom_print_date')(0)('custom_print_date').split('T')(0)),
//                 report_status_name: r.branch(mm('report_status').eq(true), 'รายงานแล้ว', 'ยังไม่รายงาน')
//             }
//         })
//         .innerJoin(r.db('common').table('country'), function (f, c) {
//             return f('source_country').eq(c('country_code2'))
//         }).pluck('left', { right: ['country_name_th', 'country_name_en'] }).zip()
//         .eqJoin('product_code', r.db('common').table('type_rice')).pluck('left', { right: ['type_rice_name_th', 'type_rice_name_en'] }).zip()
//         .run()
//         .then(function (data) {
//             res.json(data)
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
// }

exports.get_list = function (req, res) {
    var j = req.jdbc;
//         SELECT 
//     company_taxno ,
// MAX(contract_type) as contract_type ,
// MAX(contract_type_name) as contract_type_name ,
// MAX(reference_code2) as reference_code2 ,
// MAX(destination_country) as destination_country ,
// MAX(id) as id ,
// MAX(company_name_th) as company_name_th ,
// MAX(status_name) as status_name ,
// MAX(load_date) as load_date 
    
//      FROM fn_list_wto(?, ?, ?)
//      group by company_taxno
    j.query("mssql", `         SELECT 
    company_taxno ,
 MAX(contract_type) as contract_type ,
MAX(contract_type_name) as contract_type_name ,
MAX(reference_code2) as reference_code2 ,
MAX(destination_country) as destination_country ,
MAX(id) as id ,
MAX(company_name_th) as company_name_th ,
MAX(status_name) as status_name ,
MAX(load_date) as load_date 
    
     FROM fn_list_all_wto(?)
     group by company_taxno 
     order by contract_type`, [req.query.quota],
        function (err, data) {
            res.send(data)
        })
}
exports.get_company = function (req, res) {
    var j = req.jdbc;
    j.query("mssql", `  SELECT  a.id,
                                a.contract_type_name,
                                a.reference_code2,
                                CONVERT(NVARCHAR(10), a.approve_date, 126) as approve_date,
                                CONVERT(NVARCHAR(10), a.expire_date, 126) as expire_date,
                                a.destination_country,
                                a.ob_country,
                                a.destination_company,
                                a.destination_address,
                                a.destination_province,
                                a.company_name_th,
                                a.company_address_th,
                                a.company_province_th,
                                a.company_phone,
                                a.company_taxno,
                                a.request_person,
                                a.vasel_name,
                                a.port_name,
                                a.product_description,
                                a.currency_code,
                                a.currency_rate,
                                a.hmcode8,
                                a.net_weight,
                                a.fob_amt_perunit,
                                a.currency_code,
                                a.fob_amt_baht,
                               case custom_code
                               when isnull(custom_code,0) then CAST(1 AS BIT)
                               else CAST(0 AS BIT)
                               end as report_status,
							   CONVERT(NVARCHAR(10), b.date_created, 126) as report_date,
							   CONVERT(NVARCHAR(10), c.load_date2, 126) as load_date,
                               b.custom_code as tran_no
                        FROM(
                            SELECT f.*,
                                c.company_name_th,
                                c.company_address_th,
                                c.company_province_th,
                                c.company_phone
                            FROM(
                                SELECT * 
                                FROM f3 
                                WHERE id = ?
                            )f
                            join(
                                SELECT *
                                FROM company_info
                            )c on f.company_taxno = c.company_taxno
                        )a
                        left join reference_code b on a.reference_code2 = b.edi_code
                        left join custom c on c.tran_no = b.custom_code
                        group by
						        a.id,
                                a.contract_type_name,
                                a.reference_code2,
                                CONVERT(NVARCHAR(10), a.approve_date, 126),
                                CONVERT(NVARCHAR(10), a.expire_date, 126),
                                a.destination_country,
                                a.ob_country,
                                a.destination_company,
                                a.destination_address,
                                a.destination_province,
                                a.company_name_th,
                                a.company_address_th,
                                a.company_province_th,
                                a.company_phone,
                                a.company_taxno,
                                a.request_person,
                                a.vasel_name,
                                a.port_name,
                                a.product_description,
                                a.currency_code,
                                a.currency_rate,
                                a.hmcode8,
                                a.net_weight,
                                a.fob_amt_perunit,
                                a.currency_code,
                                a.fob_amt_baht,
                               case custom_code
                               when isnull(custom_code,0) then CAST(1 AS BIT)
                               else CAST(0 AS BIT)
                               end,
							   CONVERT(NVARCHAR(10), b.date_created, 126),
							   CONVERT(NVARCHAR(10), c.load_date2, 126),
                               b.custom_code`, [req.query.id],
        function (err, data) {
            res.send(data)
        })
}
exports.insert_tran = function (req, res) {
    var j = req.jdbc
    j.query("mssql", `INSERT INTO reference_code(custom_code,edi_code) values(?,?)`, [req.body.custom_code, req.body.edi_code],
        function (err, data) {
            res.send(data)
        })
}
exports.update_tran = function (req, res){
    var j = req.jdbc
    j.query("mssql",`UPDATE reference_code
                     SET custom_code = ?
                     WHERE edi_code = ?`,[req.body.custom_code, req.body.edi_code],
        function (err, data) {
            res.send(data)
        })
}