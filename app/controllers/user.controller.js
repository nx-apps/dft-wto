exports.list = function (req, res) {
    var r = req.r;
    r.db('oauth').table('users')
        .merge((users_merge) => {
            return {
                providers: r.db('oauth').table('user_providers')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array'),
                apps: r.db('oauth').table('user_apps')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array')
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
    r.db('oauth').table('users')
        .filter(req.query)
        .merge((users_merge) => {
            return {
                providers: r.db('oauth').table('user_providers')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array'),
                apps: r.db('oauth').table('user_apps')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array')
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
    r.db('oauth').table('users')
        .get(req.params.id)
        .merge((users_merge) => {
            return {
                providers: r.db('oauth').table('user_providers')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array'),
                apps: r.db('oauth').table('user_apps')
                    .getAll(users_merge('id'), { index: 'uid' })
                    .coerceTo('array')
                    .innerJoin(r.db('oauth').table('apps'),function(left,right){
                        return left('app_id').eq(right('id'))
                    })
                    .map(function(row){
                        return row('left').merge(row('right').pluck('app_name','icon_url'))
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
    r.db('oauth').table('users')
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
    r.db('oauth').table('users')
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
    r.db('oauth').table('users')
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