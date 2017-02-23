module.exports = function (app) {
    var controller = require('../controllers/countryGroup.controller');
    app.get('/', controller.list);
    app.get('/group/:id', controller.getById);
    app.get('/country', controller.country);
    app.put('/append', controller.append);
}