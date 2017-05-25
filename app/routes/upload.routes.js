module.exports = function (app) {

    var upload = require('../controllers/upload.controller');
    app.route('/file/:company_taxno').post(upload.uploadFile);
    app.route('/file/:id').delete(upload.deleteFile);
    app.route('/file/:id').get(upload.downloadFile);
    app.route('/list/:refPath/:company_taxno').get(upload.listFilePath);
    app.route('/list/:company_taxno').get(upload.listFileDelete);
    app.route('/update/:file_id').put(upload.recoveryFile);
}