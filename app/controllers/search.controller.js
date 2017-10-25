exports.getSearch = function (req, res) {
    var j = req.jdbc;
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