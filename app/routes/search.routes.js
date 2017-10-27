module.exports = function (app) {
    var controller = require('../controllers/search.controller');

    app.route('/').get(controller.getSearch).post(controller.getSearch);
    app.route('/edi').get(controller.getEdi).post(controller.getEdi);
    app.route('/custom').get(controller.getCustom).post(controller.getCustom);
    app.post('/save',controller.save);
    
}