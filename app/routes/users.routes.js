module.exports = function (app) {
    var user = require('../controllers/user.controller');
    app.get(['/', '/list'], user.list);
    app.get('/user', user.get);
    app.get('/user/:id', user.getById);
    app.post('/user', user.insert);
    app.put('/user', user.update);
    app.delete('/user/:id', user.delete);
}