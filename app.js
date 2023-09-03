var express = require('express'),
bodyParser = require("body-parser"),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");
const swaggerSpec = require('./swagger'); // Import your swagger configuration

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require('./config/db.js');

var indexRouter = require('./routes/index');
var bandRouter = require('./routes/band')(db);
var playerRouter = require('./routes/player')(db);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', indexRouter);
app.use('/api/band', bandRouter);
app.use('/api/player', playerRouter);

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = {app, db};
