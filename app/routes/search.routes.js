module.exports = function (app) {
    var controller = require('../controllers/search.controller');

    app.route('/').get(controller.getSearch).post(controller.getSearch);
    app.route('/get').get(controller.getId).post(controller.getId);
    app.post('/save',controller.save);
    
}