const express = require("express");
const fs = require("fs");
const { json } = require("stream/consumers");
const app = express();
app.use(express.json()); //midleware
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "hello my friends",
//     app: "natour",
//   });
// });

// app.post("/", (req, res) => {
//   res.send("you can post in this endpont");
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
);
app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "tours not found",
    });
  }
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "sucess",
    // results: tours.length,
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  //   console.log(req.body)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "sucess",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch("/api/v1/tours/:id", (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "tours not found",
    });
  }
  res.status(200).json({
    status: "sucess",
    data: {
      tour: "updated tour here",
    },
  });
});

app.delete("/api/v1/tours/:id", (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "tours not found",
    });
  }
  res.status(204).json({
    status: "sucess",
    data: {
      tour: null,
    },
  });
});
const port = 3000;
app.listen(port, () => {
  console.log("the server is running");
});
