require('6to5/register');

var fs         = require('fs');
var http       = require('http');
var path       = require('path');
var myth       = require('myth');
var browserify = require('browserify');
var watchify   = require('watchify');
var server     = require('../src/app-server');


var mainCSS  = path.resolve(__dirname, '..', 'src', 'components', 'main.css');
var mainJS   = path.resolve(__dirname, 'browser.js');
var distDir  = path.resolve(__dirname, '..', 'dist');
var ecstatic = require('ecstatic')({ root: distDir });
var port     = process.env.npm_package_config_port || 8080;


var b = browserify({ cache: {}, packageCache: {}, fullPaths: false });
b.add(mainJS);
var w = watchify(b);

function compileJS() {
    return w.bundle();
}

function compileCSS() {
    var css = fs.readFileSync(mainCSS, 'utf8');
    return myth(css);
}


var htdoc = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<meta charset="utf-8">',
    '<title>react-boilerplate</title>',
    '<link rel="stylesheet" href="/main.css">',
    '@@@content@@@',
    '<script src="/bundle.js" async defer></script>'
].join('');


http.createServer(function (req, res) {
    if (req.url.indexOf('bundle.js') !== -1) {
        compileJS().pipe(res);
    } else if (req.url.indexOf('main.css') !== -1) {
        res.end(compileCSS());
    } else if (path.extname(req.url)) {
        ecstatic(req, res);
    } else {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        server.run(req, function (err, content) {
            res.end(htdoc.replace('@@@content@@@', content));
        });
    }
}).listen(port);

console.log('Server started. Listening on: http://localhost:%s', port);
