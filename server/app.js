import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import config from './bin/config';
const app = express();

// ===================================================

import session from 'express-session';
import passport from 'passport';

app.use( session( config.sessionsConfig ));
app.use( passport.initialize() );
app.use( passport.session( config.sessionsConfig ) );

//passport configuration
require('./auth/config')(passport);
// ===================================================

import api from './routes/api';
import index from './routes/index';

// ====================================================
// ================ Hot reload ========================

import webpack from 'webpack';
import webpackConfig from '../webpack.config';
const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler,
  {
    publicPath: webpackConfig.output.publicPath
  }));

app.use(require('webpack-hot-middleware')(compiler));

//======================================================
//=================== AUTH CONFIG ======================

app.use( session( config.session ));
app.use( passport.initialize() );
app.use( passport.session( config.session ) );

//passport configuration
require('./auth/config')(passport);


// =====================================================
// ============== EJS CONFIGURATION ====================

app.set('views', path.join(__dirname, 'mvc' ,'views'));
app.set('view engine', 'ejs');

// =====================================================

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// ======================================================
// ================ ROUTES BINDING ======================

app.use('/', index);
app.use('/api', api);

// ======================================================
// ================= ERROR HANDLING =====================

app.use(function(req, res, next)
{
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

app.use(function(err, req, res, next)
{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// ======================================================


module.exports = app;
