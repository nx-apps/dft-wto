module.exports = function (app) {
    var controller = require('../controllers/apps.controller');
    app.get(['/', '/list'], controller.list);
    app.get('/app', controller.get);
    app.get('/app/:id', controller.getById);
    app.post('/app', controller.insert);
    app.put('/app', controller.update);
    app.delete('/app/:id', controller.delete);
    app.get('/connects/:id', controller.connects);
    app.get('/roles/:id', controller.roles);
    app.get('/users/:id', controller.users);
    app.put('/users', controller.update_users);
    app.get('/balanceList/:user_id', controller.getBalanceList);
    app.post('/request', controller.insertRequest);
}