exports.report1 = function (req, res) {

    // if (typeof req.query.year_start !== 'string')
    //     req.query.year_start = Number(new Date().getFullYear())
    // if (typeof req.query.year_end !== 'string')
    //     req.query.year_end = Number(new Date().getFullYear()) + 1

    req.jdbc.query("mssql", "exec sp_wto_rpt_due_date @startDate=?, @endDate=? ", [req.query.startDate, req.query.endDate],
        function (err, data) {
            data = JSON.parse(data);
            // const arrMonth = req.query.modelMonth.split(",").sort();
            var param = {
                date: req.query.date,
                FILE_TYPE: req.query.export,
            };
            param.START_DATE = req.query.startDate//rpt.getMonthName(Number(arrMonth[0])),
            param.END_DATE = req.query.endDate //rpt.getMonthName(Number(arrMonth[arrMonth.length - 1])),
            // param.year = req.query.modelYear;
            param.CURRENT_DATE = new Date().toISOString().slice(0, 10);
            param.OUTPUT_NAME = param.CURRENT_DATE.replace(/-/g, '') + '_รายงานผู้ได้รับหนังสือรับรองแสดงการได้รับสิทธิชำระภาษีในโควตา WTO ที่ยังไม่ได้รายงานการนำเข้าภ'
            // param = rpt.keysToUpper(param);
            // res.json(data)
            res.ireport("edi/report1.jasper", req.query.export || "pdf", data, param)
        })
}