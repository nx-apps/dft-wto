exports.report1 = function (req, res) {
    let year_start,year_end;
    console.log(typeof req.query.year_start)
    if(typeof req.query.year_start !== 'string')
        req.query.year_start = new Date().getFullYear()
    if(typeof req.query.year_end !== 'string')
        req.query.year_end = new Date().getFullYear()

    year_start = Number(req.query.year_start)
    year_end = Number(req.query.year_end)+1
   
    // console.log('>',year_end)
    // console.log('--------->',year_start)
//     year_start
//  year_end
    r.db('wto2').table('quota').between(year_start, year_end,{index: 'year'})
  .merge((f)=>{
  return {
      in_quota:r.db('wto2').table('f3')
    	               .merge((f5)=>{ 
                                return {
                                               dateCheck: f5.getField('request_print_date').split("-")(0).coerceTo('number')
                                          }
      
                     })
        .filter({"dateCheck": f.getField('year'),"quota": true })
         .getField('total_value')
        .coerceTo('array')
           .reduce(function(left,right){
                return left.add(right)
          }).default(0)
   		,out_quota:r.db('wto2').table('f3')
    	               .merge((f5)=>{ 
                                return {
                                               dateCheck: f5.getField('request_print_date').split("-")(0).coerceTo('number')
                                          }
      
                     })
        .filter({"dateCheck": f.getField('year'),"quota": false })
         .getField('total_value')
        .coerceTo('array')
           .reduce(function(left,right){
                return left.add(right)
          }).default(0)
}
  })
    .merge((f)=>{
      return {
      in_quota_per:f.getField('in_quota').mul(100).div(f.getField('quality')).floor()
      }
      })
        .merge((out)=>{
      return {
      out_quota_per:out.getField('out_quota').mul(100).div(out.getField('quality'))
      }
      })
       .merge((total)=>{
      return {
      total_vaolue:total.getField('in_quota').add(total.getField('out_quota'))
      }
      }) 
         .merge((year)=>{
      return {
      year_thai:year.getField('year').add(543)
      }
      }) 
        .run()
        .then((result) => {
            res.json(result)
        })
        .error((err) => {
            res.json(err)
        })
}
