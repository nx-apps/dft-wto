module.exports = function (app) {
    var controller = require('../controllers/search.controller');

    app.route('/').get(controller.getSearch).post(controller.getSearch);
    app.route('/detail').get(controller.getDetailer).post(controller.getDetailer);
    app.route('/head').get(controller.getHeader).post(controller.getHeader);
    app.post('/save',controller.save);
    
}