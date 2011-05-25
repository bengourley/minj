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
				originalFile = fs.readFileSync('test/resource/jquery.js');

		app.configure(function () {
			app.use(require('minj').middleware({ src: __dirname + '/resource' }));
			app.use(express.static(__dirname + '/resource'));
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

			// Tear down
			fs.unlinkSync(__dirname + '/resource/jquery.minj.js');
		});

  },

	'debug parameter causes original file to be served' : function () {

    var app = express.createServer(),
				originalFile = fs.readFileSync('test/resource/jquery.js', 'utf8');

		app.configure(function () {
			app.use(require('minj').middleware({ src: __dirname + '/resource' }));
			app.use(express.static(__dirname + '/resource'));
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
				originalFile = fs.readFileSync('test/resource/invalid.js', 'utf8');

		app.configure(function () {
			app.use(require('minj').middleware({ src: __dirname + '/resource' }));
			app.use(express.static(__dirname + '/resource'));
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
				dirList = fs.readdirSync('test/resource/minified');

		app.configure(function () {
			app.use(require('minj').middleware({ src: __dirname + '/resource' }));
			app.use(express.static(__dirname + '/resource'));
		});

		assert.response(app, {
			url : '/minified/minified.min.js'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'application/javascript'
			}
		}, function (res) {
			assert.eql(fs.readdirSync('test/resource/minified'), dirList,
				'request for minified file has changed directory listing');
		});

	},

	'request for file that does not exist 404s' : function () {
		
		var app = express.createServer();

		app.configure(function () {
			app.use(require('minj').middleware({ src: __dirname + '/resource' }));
			app.use(express.static(__dirname + '/resource'));
		});

		assert.response(app, {
			url : '/doesnotexist.js'
		}, {
			status : 404,
			headers : {
				'Content-Type' : 'text/plain'
			}
		}, function (res) {
		});

	},

	'POST request does not serve a js file' : function () {
		
		var app = express.createServer();

		app.configure(function () {
			app.use(require('minj').middleware({ src: __dirname + '/resource' }));
			app.use(express.static(__dirname + '/resource'));
		});

		assert.response(app, {
			url : '/jquery.js',
			method : 'POST'
		}, {
			status : 404,
			headers : {
				'Content-Type' : 'text/plain'
			}
		}, function (res) {
		});

	}/*,

	'modified js file causes minfied file to be re-compiled' : function () {
		
		var app = express.createServer();

		fs.writeFileSync('test/resource/modified/jquery.js',
			fs.readFileSync('test/resource/jquery.js', 'utf8')
		);

		app.configure(function () {
			app.use(require('minj').middleware({ src: __dirname + '/resource' }));
			app.use(express.static(__dirname + '/resource'));
		});

		assert.response(app, {
			url : '/modified/jquery.js'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'application/javascript'
			}
		}, function (res) {
			
			var mtime =  fs.statSync('test/resource/modified/jquery.minj.js').mtime;
			
			fs.writeFileSync('test/resource/modified/jquery.js',
				fs.readFileSync('test/resource/jquery.js', 'utf8')
			);

			setTimeout(function () {

				assert.response(app, {
					url : '/modified/jquery.js'
				}, {
					status : 200,
					headers : {
						'Content-Type' : 'application/javascript'
					}
				}, function (res) {

					console.log(mtime.getTime(), fs.statSync('test/resource/modified/jquery.minj.js').mtime.getTime());
					assert.ok(mtime < fs.statSync('test/resource/modified/jquery.minj.js').mtime);
					fs.unlinkSync(__dirname + '/resource/modified/jquery.minj.js');
					fs.unlinkSync(__dirname + '/resource/modified/jquery.js');

				});

			}, 10);

		});

	}*/


};
