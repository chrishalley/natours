const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  // API Error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // FRONTEND ERROR
  console.error('ERROR: ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProduction = (err, req, res) => {
  // API ERROR
  if (req.originalUrl.startsWith('/api')) {
    // OPERATIONAL ERROR, THAT WE TRUST
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // PROGRAMMING OR OTHER UNKNOWN ERROR
    // 1) LOG ERROR
    console.error('ERROR: ', err);
    // 2) SEND MESSAGE
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }

  // FRONTEND ERROR
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
    // PROGRAMMING OR OTHER UNKNOWN ERROR
  }
  // 1) LOG ERROR
  console.error('ERROR: ', err);
  // 2) SEND RENDERED RESPONSE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later'
  });
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please log in again', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const env = process.env.NODE_ENV;

  if (env === 'development') {
    sendErrorDev(err, req, res);
  } else if (env === 'production') {
    let error = { ...err };
    error.message = err.message; // Because for some reason message prop is not spread across
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProduction(error, req, res);
  }
};
