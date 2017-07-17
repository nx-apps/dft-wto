module.exports = function (app) {

    var controller = require('../controllers/statistics.controller');
    // app.route('/').get(controller.list);
    // app.route('/importer').get(controller.listimporter);
    // app.route('/inquota').get(controller.listInqouta);
    // app.route('/outquota').get(controller.listOutqouta);
    app.route('/search_head').get(controller.search_list_head);
    app.route('/search_detail').get(controller.search_list_detail);
}