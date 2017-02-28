module.exports = function (app) {

    var controller = require('../controllers/statistics.controller');
    app.route('/').get(controller.list);
    app.route('/importer').get(controller.listimporter);
    app.route('/inquota').get(controller.listInqouta);
    app.route('/outquota').get(controller.listOutqouta);
}