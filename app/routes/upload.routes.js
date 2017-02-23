module.exports = function (app) {

    var upload = require('../controllers/upload.controller');
    app.route('/file/:request_id').post(upload.uploadFile);
    app.route('/file/:id').delete(upload.deleteFile);
    app.route('/file/:id').get(upload.downloadFile);
    app.route('/list/:refPath/:request_id').get(upload.listFilePath);
    app.route('/list/:request_id').get(upload.listFileDelete);
    app.route('/update/:file_id').put(upload.recoveryFile);
}