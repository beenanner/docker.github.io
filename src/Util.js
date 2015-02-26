var exec = require('exec');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

module.exports = {
  exec: function (args, options) {
    options = options || {};
    return new Promise((resolve, reject) => {
      exec(args, options, (stderr, stdout, code) => {
        if (code) {
          reject(stderr);
        }
        resolve(stdout);
      });
    });
  },
  home: function () {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  },
  supportDir: function () {
    var dirs = ['Library', 'Application\ Support', 'Kitematic'];
    var acc = process.env.HOME;
    dirs.forEach(function (d) {
      acc = path.join(acc, d);
      if (!fs.existsSync(acc)) {
        fs.mkdirSync(acc);
      }
    });
    return acc;
  },
  resourceDir: function () {
    return process.env.RESOURCES_PATH;
  },
  packagejson: function () {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  },
  copycmd: function (src, dest) {
    return ['rm', '-f', dest, '&&', 'cp', src, dest];
  },
  escapePath: function (str) {
    return str.replace(/ /g, '\\ ').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }
};
