const fs = require('fs')
const async = require('async')
const importList = require('./import');

var pusher = function (res, callback) {
    async.each(importList, function (push_file, next) {
        try {
            var contentType;
            switch (push_file.type) {
                case "html":
                    contentType = "text/html";
                    break;
                case "js":
                    contentType = "application/javascript";
            }

           

            fs.readFile('./public/' + push_file.path, function (err, content) {
                res.push(push_file.path,
                    {
                       status: 200,
                       method: 'GET',
                       request: {
                        accept: '*/*'
                       },
                        response: {
                            'content-type': contentType
                      }
                    },
                    function (err, stream) {
                       if (err) next(err);
                        stream.end(content);
                        next();
                    }
                );
            });
        } catch (err) {
            next(err);
        }
    }, function (err) {
        callback(err);
    });
}

class pusha {
  //  res.pusher(xxxx)
    import(req, res) {
        pusher(res, function (err) {
            res.end("");
        });
    }
}
module.exports = new pusha();





