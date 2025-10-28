const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // keep this
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a tour must have name"],
    unique: true,
  },

  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "a tour must have price"],
  },
});

const Tour = mongoose.model("Tour", tourschema);
const testTour = new Tour({
  name: "The Forest Hiker",
  rating: 4.7,
  price: 497,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("error:", err);
  });
const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("the server is running");
});
