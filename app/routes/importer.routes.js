module.exports = function(app){
    var controller = require('../controllers/importer/importer.controller');
    app.route('/').get(controller.list);
    app.route('/inquota').get(controller.list_inquota);
    app.route('/outquota').get(controller.list_outquota);
    app.route('/old').get(controller.old);
}