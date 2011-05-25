# minj
	
minj is a js minifier middleware for express / connect

## Installation

	$ npm install minj

## Usage

In your express/connect server setup, use as follows:

	app.use(require('minj').middleware({ src: __dirname + '/public/' }));

The src option will need to match the option you use with express/connect's static provider, which defaults to the example here.

In your html, refer to your js path as normal e.g:
		
	<script src="/javascripts/main.js"></script>
		
The minified file is created dynamically adjacent to the original file with the extension .minj.js, so there's no need to keep restarting your server when developing. If the modified time of the source file is newer than that of the minified file, it will be re-minified.

minj will assume that request for resources ending in .min.js or .minj.js are already minified, and will not attempt to minify them.

For debugging purposes, if you want to serve the source file instead of the minified file, append the get paramater 'debug' like so:

	/javascripts/main.js?debug=true

Uglify.js is used for minification.

## Tests
To run the tests, first install the expresso framework:

	$ npm install expresso -g

Then cd to the minj root, and run

	$ expresso -I lib

To see a code coverage report, run

	$expresso -I lib -c

Current, code coverage is at 52.38. Please feel free to add tests to help increase this!
