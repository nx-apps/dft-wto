module.exports = function (app) {
    var controller = require('../controllers/excel.controller');
    app.get('/read', controller.read);
}