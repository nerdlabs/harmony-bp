require('babel/register');

var http   = require('http');
var path   = require('path');
var server = require('../src/app-server');


var distDir  = path.resolve(__dirname, '..', 'dist');
var ecstatic = require('ecstatic')({ root: distDir });
var port     = process.env.npm_package_config_port || 8080;



var htdoc = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<meta charset="utf-8">',
    '<title>react-boilerplate</title>',
    '<link rel="stylesheet" href="/bundle.css">',
    '@@@content@@@',
    '<script src="/bundle.js" async defer></script>'
].join('');


http.createServer(function (req, res) {
    if (path.extname(req.url)) {
        ecstatic(req, res);
    } else {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        server.run(req, function (err, content) {
            res.end(htdoc.replace('@@@content@@@', content));
        });
    }
}).listen(port);

console.log('Server started. Listening on: http://localhost:%s', port);
