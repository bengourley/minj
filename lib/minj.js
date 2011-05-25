var fs = require('fs'),
		url = require('url'),
		basename = require('path').basename,
		join = require('path').join,
		parser = require("uglify-js").parser,
		uglifyer = require("uglify-js").uglify,
		ENOENT,
		debug = false;

try {
  ENOENT = require('constants').ENOENT;
} catch (err) {
  ENOENT = process.ENOENT;
}

// Ignore ENOENT to fall through as 404
function error (err, next) {
	next(ENOENT == err.errno ? null : err);
}

module.exports.middleware = function (options) {

	options = options || {};

	var src = options.src;

	if (options.debug) {
		debug = options.debug;
	}

	// Default dest dir to source
  var dest = options.dest ? options.dest : src;

	return function (req, res, next) {

		function compile(jsPath, minjPath, req, next) {

			fs.readFile(jsPath, 'utf8', function (err, str) {
				if (err) {
					console.log(err);
					return error(err, next);
				}
				
				try {
					var ast = parser.parse(str);
					ast = uglifyer.ast_mangle(ast);
					ast = uglifyer.ast_squeeze(ast);
					fs.writeFile(minjPath, uglifyer.gen_code(ast), 'utf8', function (err) {
						next(err);
					});
				} catch (ex) {
					// Probably reached this because of invalid
					// syntax in js file. Revert back to serve original
					// -- let it error in the browser if need be.
					req.url = originalPath;
					next();
				}

			});

		}

		var originalPath = req.url;

		if ('GET' != req.method && 'HEAD' != req.method) {
			return next();
		}

		var path = url.parse(req.url).pathname;
		if (/\.js$/.test(path) && !/\.minj*\.js$/.test(path)) {

			if (debug) console.log("minj: serving...");

			var minjRelativePath =  path.replace('.js', '.minj.js'),
					minjPath = join(dest, minjRelativePath),
					jsPath = join(src, path);

			if (!req.query.debug) req.url = minjRelativePath;

			if (debug) console.log("minj: paths: " + jsPath + " -- " + minjPath);

			fs.stat(jsPath, function(err, jsStats) {

				if (err) {
					return error(err, next);
				}
				
				fs.stat(minjPath, function(err, minjStats) {
					if (err) {
						if (ENOENT == err.errno) {
							// JS not minified yet, so minify it
							if (debug) console.log("minj: creating and compiling");
							compile(jsPath, minjPath, req, next);
						} else {
							next(err);
						}

					} else {
						if (jsStats.mtime > minjStats.mtime) {
							if (debug) console.log("minj: re-compiling");
							// Source has changed, compile it
							compile(jsPath, minjPath, req, next);
						} else {
							if (debug) console.log("minj: cached");
							next();
						}
					}
				});
			});			
			
		} else {

			next();

		}

	};

};
