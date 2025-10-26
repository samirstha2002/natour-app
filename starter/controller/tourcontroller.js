const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// 2) Route Handler

exports.getalltours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    requestedTime: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.gettours = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'tours not found',
    });
  }
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'sucess',
    // results: tours.length,
    data: {
      tour,
    },
  });
};

exports.createtour = (req, res) => {
  //   console.log(req.body)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updatetour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'tours not found',
    });
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: 'updated tour here',
    },
  });
};

exports.deletetour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'tours not found',
    });
  }
  res.status(204).json({
    status: 'sucess',
    data: {
      tour: null,
    },
  });
};
