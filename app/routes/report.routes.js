module.exports = function (app) {
    var controller = require('../controllers/report2.controller');
    app.get('/report1', controller.report1);
    app.get('/report2', controller.report2);
    app.get('/report3', controller.report3);
    app.get('/report4', controller.report4);
    app.get('/report5', controller.report5); 
    app.get('/report6', controller.report6); 
}