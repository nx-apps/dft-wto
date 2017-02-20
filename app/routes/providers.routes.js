module.exports = function (app) {
    var controller = require('../controllers/providers.controller');
    app.get(['/', '/list'], controller.list);
    app.get('/provider', controller.get);
    app.get('/provider/:id', controller.getById);
    app.post('/provider', controller.insert);
    app.put('/provider', controller.update);
    app.delete('/provider/:id', controller.delete);
}