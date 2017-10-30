module.exports = function (app) {
    var controller = require('./../../controllers/report/edi.controller');
    app.get('/report1', controller.report1);
}