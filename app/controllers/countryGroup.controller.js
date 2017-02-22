exports.list = function (req, res) {
    var r = req.r;
    r.db('common').table('country_group')
        .without('country')
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
    r.db('common').table('country_group')
        .get(req.params.id)
        .merge(function (m) {
            return {
                country: m('country').map(function (c_map) {
                    return r.db('common').table('country').get(c_map).pluck('id', 'country_name_th')
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
exports.country = function (req, res) {
    var r = req.r;
    r.db('common').table('country')
        .without('date_created', 'date_updated')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.append = function (req, res) {
    var r = req.r;
    r.db('common').table('country_group')
        .get(req.body.id)
        .update({ country: r.row('country').append(req.body.country) })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}