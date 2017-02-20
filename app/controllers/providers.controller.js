exports.list = function (req, res) {
    var r = req.r;
    r.db('oauth').table('providers')
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
exports.get = function (req, res) {
    var r = req.r;
    r.db('oauth').table('providers')
        .filter(req.query)
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
exports.getById = function (req, res) {
    var r = req.r;
    r.db('oauth').table('providers')
        .get(req.params.id)
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
exports.insert = function (req, res) {
    var r = req.r;
    r.db('oauth').table('providers')
        .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.update = function (req, res) {
    var r = req.r;
    r.db('oauth').table('providers')
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
    r.db('oauth').table('providers')
        .get(req.params.id)
        .delete()
        .do((app_del) => {
            return r.db('apps').getAll(req.params.id, { index: 'connections' }).update(function (row) {
                return {
                    connections: row('connections').setDifference([req.params.id])
                }
            })
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}