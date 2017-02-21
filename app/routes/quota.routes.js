module.exports = function(app){
    var controller = require('../controllers/quota.controller');

    app.get('/', controller.quotaList)
    app.get('/list-quota', controller.quotaList)
    app.post('/insert', controller.insert)
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}