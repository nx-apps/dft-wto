module.exports = function(app){
    var controller = require('../controllers/importer/importer.controller');
    app.route('/').get(controller.list);
    app.route('/list-quota').get(controller.quotaList);
    app.route('/insert').post(controller.insert);
    app.route('/update').put(controller.update);
    app.route('/delete').put(controller.delete);
}