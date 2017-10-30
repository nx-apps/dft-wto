exports.report1 = function (req, res) {
    console.log(1111111111111)
    // if (typeof req.query.year_start !== 'string')
    //     req.query.year_start = Number(new Date().getFullYear())
    // if (typeof req.query.year_end !== 'string')
    //     req.query.year_end = Number(new Date().getFullYear()) + 1
res.json(123)
    // req.jdbc.query("mssql", "exec sp_wto_rpt_due_date @startDate=?, @endDate=? ", [req.query.startDate, req.query.endDate],
    //     function (err, data) {
    //         data = JSON.parse(data);
    //         const arrMonth = req.query.modelMonth.split(",").sort();
    //         var param = {
    //             date: req.query.date,
    //             FILE_TYPE: req.query.export,
    //         };
    //         param.startMonth = rpt.getMonthName(Number(arrMonth[0])),
    //             param.endMonth = rpt.getMonthName(Number(arrMonth[arrMonth.length - 1])),
    //             param.year = req.query.modelYear;
    //         param.current_date = new Date().toISOString().slice(0, 10);
    //         param.OUTPUT_NAME = param.current_date.replace(/-/g, '') + '_ปริมาณและมูลค่าการส่งออกข้าวของไทย'
    //         param = rpt.keysToUpper(param);
    //         res.json(data)
    //         // res.ireport("custom/rpt_custom_export_rice.jasper", req.query.export || "pdf", data, param)
    //     })
}