'use strict';

// Imports 
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import debug from 'debug';

// Import Routes
import routes from './routes/index.js';
import users from './routes/users.js';

// Create Log
const log = debug('Job Scrape');

// Creating Express App
var app = express();

// Getting Directory
const __dirname = path.resolve();

// Using Middleware
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Using Routes
app.use('/', routes);
app.use('/users', users);

// Serve static React files only in production
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Set Port
app.set('port', process.env.PORT || 3000);

// Start Server
var server = app.listen(app.get('port'), function () {
    log('Express server listening on port ' + server.address().port); 
});

