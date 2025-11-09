const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('./../../models/tourmodel');

dotenv.config({ path: './config.env' });

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
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
// importing data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded sucessfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data from collection

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted sucessfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
