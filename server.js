const mongoose = require('mongoose');
const dotenv = require('dotenv');

const parseError = err => {
  const fullMessage = err.message;
  const errmsgStart = fullMessage.indexOf('errmsg:') + 8;
  const errmsgEnd = fullMessage.indexOf(',', errmsgStart);
  const errmsgLength = errmsgEnd - errmsgStart;
  const errorText = fullMessage.substr(errmsgStart, errmsgLength);
  return { name: err.name, message: errorText };
};

process.on('uncaughtException', err => {
  const { name, message } = parseError(err);
  console.log(name, message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log({ err });
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('db connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

process.on('unhandledRejection', err => {
  const { name, message } = parseError(err);
  console.log(name, message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, shutting down gracefully');
  server.close(() => console.log('Process terminated'));
});
