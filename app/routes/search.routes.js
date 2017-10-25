module.exports = function (app) {
    var controller = require('../controllers/search.controller');

    app.route('/search').get(controller.getSearch).post(controller.getSearch);
}