exports.list = function (req, res) {
    var r = req.r;
    r.db('wto2').table('importer')
        .eqJoin('type_rice_id', r.db('common').table('type_rice')).pluck('left',{right:['type_rice_name_th', 'type_rice_name_en']})
        .zip()
        .innerJoin(r.db('external').table('seller'), function (importer, seller) {
            return importer('seller_tax_id').eq(seller('seller_tax_id'))
        }).without({ right: ['id', 'date_created', 'type_lic_id'] }).zip()
        .innerJoin(r.db('wto2').table('type_import'), function (importer, type) {
            return importer('type_import_code').eq(type('type_import_code'))
        }).without({ right: ['id'] }).zip()
        .merge(function(m){
            return {
                country : r.db('common').table('country').getAll(m('tags')(0), {index: 'id'})
                .coerceTo('array')
            }
        })
        .merge(function(m){
            return {
                country_name_th : m('country').getField('country_name_th')(0),
                country_name_en : m('country').getField('country_name_en')(0)
            }
        })
        .without(['country', 'tags'])
        .run()
        .then(function (result) {
            res.json(result)
        })
        .error(function (err) {
            res.json(err)
        })
}
exports.quotaList = function (req, res){
    r.db('wto2').table('quota')
    .run()
    .then((result)=>{
        res.json(result)
    })
    .error((err)=> {
        res.json(err)
    })
}
exports.insert = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('quota', req.body); 
    var result = { result: false, message: null, id: null };
    // console.log('===>',valid)
    if(valid){
        r.db('wto2').table('quota').insert(req.body)
        .run()
        .then((response)=>{
            result.message = response;
                if (response.errors == 0) {
                    result.result = true;
                    result.id = response.generated_keys;
                }
                res.json(result);
        })
        .error((err)=> {
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