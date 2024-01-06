const fs = require('fs');
const express = require('express');
const app = express();

//Middleware
app.use(express.json());

let tourDetails = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

app.get('/tours', (req, res) => {
  return [tourDetails];
});

app.post('/tours', (req, res) => {
  const { name, description, duration, price } = req.body;
  const newId = tourDetails.length > 0 ? tourDetails[tourDetails.length - 1].id + 1 : 1;
  const newTour = {
    id: newId,
    name,
    description,
    duration,
    price,
  };

  tourDetails.push(newTour);

  fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));

  res.status(200).json({
    message: 'Tour added successfully',
  });
});

app.put('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  const updatedTour = req.body;

  const tourIndex = tourDetails.findIndex((tour) => tour.id === tourId);

  if (tourIndex !== -1) {
    tourDetails[tourIndex] = { ...tourDetails[tourIndex], ...updatedTour };

    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));

    res.status(200).json({
      message: 'Tour updated successfully',
    });
  } else {
    res.status(404).json({
      message: 'Tour not found',
    });
  }
});

app.delete('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  const filteredTours = tourDetails.filter((tour) => tour.id !== tourId);

  if (filteredTours.length === tourDetails.length) {
    res.status(404).json({
      message: 'Tour not found',
    });
  } else {
    tourDetails = filteredTours;

    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));

    res.status(200).json({
      message: 'Tour deleted successfully',
    });
  }
});

module.exports = app;
