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
exports.getId = function (req, res) {
    const j = req.jdbc;
    var val = req.query;
    if (req.method == "POST") val = req.body;
    if (typeof val.refCode === "undefined") val.refCode = '';
    j.query("mssql", `exec sp_stats_rpt_refcode @refType= ?,@refCode= ? `,
        ['id', val.refCode],
        function (err, data) {
            res.send(data)
        })
}
exports.save = (req, res) => {
    const j = req.jdbc;
    const val = req.body;
    j.query("mssql", `exec sp_wto_save_custom_link_edi @ediCode=?,@customCode=?,@dateImport=?,@dateReport=?,@remark=?,@userName=? `,
        [
            val.reference_code2,
            val.custom_code,
            val.date_import || '',
            val.date_report || '',
            val.remark || '',
            'pong.tw'
        ],
        function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
}