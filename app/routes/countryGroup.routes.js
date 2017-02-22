module.exports = function (app) {
    var controller = require('../controllers/countryGroup.controller');
    app.get('/', controller.list);
}