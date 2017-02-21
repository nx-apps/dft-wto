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
    // console.log(req.body)
    r.db('wto2').table('quota')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.delete = function (req, res) {
    var r = req.r;
    r.db('wto2').table('quota')
        .get(req.params.id)
        .delete()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}