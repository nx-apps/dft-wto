module.exports=function(app){
    console.log('dddd');
    var pushCtrl = require('../controllers/push/push.controller');
    app.get('/import',pushCtrl.import);
} 