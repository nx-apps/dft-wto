module.exports = function (app) {

    var controller = require('../controllers/statistics.controller');
    app.route('/').get(controller.list);
    app.route('/').get(controller.listimporter);
}