module.exports = function(app){
    var common = require('../controllers/common/common.controller');
    app.get('/module',common.getModule);
    //app.get('/subModule',common.getSubModule);
}