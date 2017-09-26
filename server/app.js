import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import api from './routes/api';
import index from './routes/index';


const app = express();

app.set('views', path.join(__dirname ,'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));


app.use('/', index);
app.use('/api', api);


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


module.exports = app;
