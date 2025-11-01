const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('uncaught exception, shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // keep this
  })
  .then(() => {
    console.log('DB connection successful');
  });

// const testTour = new Tour({
//   name: "The Forest Hiker",
//   rating: 4.7,
//   price: 497,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log("error:", err);
//   });
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('the server is running');
});

process.on('unhandledRejection', (err) => {
  console.log('Shutting down the app');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
