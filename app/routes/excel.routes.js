module.exports = function (app) {
    var controller = require('../controllers/excel.controller');
    app.get('/read', controller.read);
    app.get('/quiz', controller.quiz);
    app.get('/quiz2', controller.quiz2);

    app.get('/test',controller.test);
}