# minj
	
	minj is a js minifier middleware for express / connect

## Installation

		$ npm install minj

### Usage

	In your express/connect server setup, use as follows:

		app.use(require('minj').middleware({ src: __dirname + '/public/' }));

	The src option will need to match the option you use with express/connect's static provider, which defaults to the example here.

	In your html, refer to your vanilla js path, but replace '.js' with '.minj.js'. e.g:
		
		<script src="/javascripts/main.js"></script>
		
		becomes:

		<script src="/javascripts/main.minj.js"></script>

	The minified file is created dynamically, so there's no need to keep restarting your server when developing. If the modified time of the source file is newer than that of the minified file, it will be re-minified.
	
	Uglify.js is used for minification.
