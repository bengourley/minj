# minj - a js minifier middleware for express / connect

Minj is heavily based on Stylus' caching and comiling method, where instead
of comiling .styl to .css, it minifies .js to .minj.js using Uglify.js.

# Usage

app.use(require('./modules/minj').middleware({ src: __dirname + '/public/' }));
