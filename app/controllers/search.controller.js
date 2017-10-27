exports.getSearch = function (req, res) {
    const j = req.jdbc;
    var val = req.query;
    if (req.method == "POST") val = req.body;
    if (typeof val.dateStart === "undefined") val.dateStart = '';
    if (typeof val.dateEnd === "undefined") val.dateEnd = '';
    if (typeof val.refCode === "undefined") val.refCode = '';
    if (typeof val.type === "undefined") val.type = 'cert';
    j.query("mssql", `exec sp_stats_search_refcode @refCode= ? ,@dateStart= ?, @dateEnd= ?, @dataType= ?`,
        [val.refCode, val.dateStart, val.dateEnd, val.type],
        function (err, data) {
            res.send(data)
        })
}
exports.getEdi = function (req, res) {
    const j = req.jdbc;
    var val = req.query;
    if (req.method == "POST") val = req.body;
    if (typeof val.refCode === "undefined") val.refCode = '';
    j.query("mssql", `exec sp_stats_rpt_refcode @refType= ?,@refCode= ? `,
        ['permit', val.refCode],
        function (err, data) {
            res.send(data)
        })
}
exports.getCustom = function (req, res) {
    const j = req.jdbc;
    var val = req.query;
    if (req.method == "POST") val = req.body;
    if (typeof val.refCode === "undefined") val.refCode = '';
    j.query("mssql", `select * from fn_wto_get_status(?) `,
        [val.refCode],
        function (err, data) {
            data = JSON.parse(data);
            if (data.length > 0) {
                res.json(data[0]);
            } else {
                res.json({});
            }
        })
}
exports.save = (req, res) => {
    const j = req.jdbc;
    const val = req.body;
    j.query("mssql", `exec sp_wto_save_custom_link_edi @ediCode=?,@customCode=?,@dateImport=?,@dateReport=?,@remark=?,@userName=? `,
        [
            val.edi_code,
            val.custom_code,
            val.import_date || '',
            val.report_date || '',
            val.remark || '',
            'admin'
        ],
        function (err, data) {
            if (err) {
                res.send(err)
            } else {
                data = JSON.parse(data)
                if (data.length > 0) {
                    res.json(data[0]);
                } else {
                    res.json({});
                }
            }
        })
}