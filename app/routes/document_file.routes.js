module.exports = function (app) {

    var document_file = require('../controllers/document_file.controller');
    app.route('/').get(document_file.document_file);
    app.route('/id/:id').get(document_file.document_fileId);
}