module.exports = function(app){
    var controller = require('../controllers/importer/importer.controller');
    app.route('/').get(controller.list);
    app.route('/insert').post(controller.insert);
    app.route('/update').put(controller.update);
    app.route('/delete').put(controller.delete);
}