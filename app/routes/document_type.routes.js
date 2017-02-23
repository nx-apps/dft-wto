module.exports = function (app) {

    var document_type = require('../controllers/document_type.controller');
    app.route('/').get(document_type.document_type);
    app.route('/id/:doc_type_id').get(document_type.document_typeId);
}