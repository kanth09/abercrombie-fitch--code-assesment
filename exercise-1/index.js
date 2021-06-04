const http = require('http');
const fs = require("fs");
const path = require("path");
const basePath = __dirname;

http.createServer((req, res) => {
    if(req.url === '/') {
        fs.readFile(path.join(basePath, 'index.html'), (err, indexPage) => {
            if(err) {
                res.writeHead(404);
                res.write("Contents you are looking for are Not Found");
                console.log(err);
            } else {
                res.writeHead(200, { 'Content-Type' : 'text/html'});
                res.write(indexPage);
            }
            res.end();
        })
    } else {
        res.writeHead(404);
        res.write("Route Not found")
        res.end();
    }
  }).listen(3000);
  console.log("Server running at port 3000");