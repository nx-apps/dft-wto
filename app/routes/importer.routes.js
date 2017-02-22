module.exports = function(app){
    var controller = require('../controllers/importer/importer.controller');
    app.route('/').get(controller.list);
}