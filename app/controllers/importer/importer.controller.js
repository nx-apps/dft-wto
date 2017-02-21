exports.list = function (req, res) {
    var r = req.r;
    r.db('wto2').table('importer')
        .merge(function (m) {
            return {
                seller: r.db('external').table('seller').getAll(m('tags')(0), {index: 'seller_tax_id'})
                .coerceTo('array')
                .without(['id','date_created'])
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
exports.insert = function (req, res) {
    var r = req.r;
}
exports.update = function (req, res) {
    var r = req.r;
}
exports.delete = function (req, res) {
    var r = req.r;
}