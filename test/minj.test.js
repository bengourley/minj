/**
 * Module dependencies.
 */

var express = require('express'),
		assert = require('assert'),
		http = require('http'),
		fs = require('fs');

module.exports = {

  'length of file served is less than or equal to length of original' : function () {

    var app = express.createServer(),
				originalFile = fs.readFileSync('resource/jquery.js');

		app.configure(function () {
			app.use(express.static(__dirname + '/resource'));
			app.use(require('./../index.js').middleware({ src: __dirname + '/resource' }));
		});

		assert.response(app, {
			url : '/jquery.js'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'application/javascript'
			}
		}, function (res) {
			assert.ok(res.body.length <= originalFile.length,
				'length of file served is greater than length of original');
		});

  },

	'debug parameter causes original file to be served' : function () {

    var app = express.createServer(),
				originalFile = fs.readFileSync('resource/jquery.js', 'utf8');

		app.configure(function () {
			app.use(express.static(__dirname + '/resource'));
			app.use(require('./../index.js').middleware({ src: __dirname + '/resource' }));
		});

		assert.response(app, {
			url : '/jquery.js?debug=true'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'application/javascript'
			}
		}, function (res) {
			assert.equal(res.body, originalFile,
				'length of file served is not equal to length of original');
		});

  },

	'non-js in original file causes original file to be served' : function () {

    var app = express.createServer(),
				originalFile = fs.readFileSync('resource/invalid.js', 'utf8');

		app.configure(function () {
			app.use(express.static(__dirname + '/resource'));
			app.use(require('./../index.js').middleware({ src: __dirname + '/resource' }));
		});

		assert.response(app, {
			url : '/invalid.js'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'application/javascript'
			}
		}, function (res) {
			assert.equal(res.body, originalFile,
				'original file is not served if js is invalid');
		});

  },

	'request for .min.js does not create a new file' : function () {
		
		var app = express.createServer(),
				dirList = fs.readdirSync('resource');

		app.configure(function () {
			app.use(express.static(__dirname + '/resource'));
			app.use(require('./../index.js').middleware({ src: __dirname + '/resource' }));
		});

		assert.response(app, {
			url : '/minified.min.js'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'application/javascript'
			}
		}, function (res) {
			assert.eql(fs.readdirSync('resource'), dirList,
				'request for minified file has changed directory listing');
		});

	}


};
