exports.list = function (req, res) {
    var r = req.r;
    r.db('common').table('country_group')
        .merge((pv_merge) => {
            return {
                scope: pv_merge('scope').reduce((l, r) => {
                    return l.add(',', r);
                })
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
