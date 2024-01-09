const fs = require('fs');
const express = require('express');
const app = express();

//Middleware
app.use(express.json());

const tourDetails = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

app.get('/tours', (req, res) => {
  //write a code here to get all the tours from tours.json
  // Retrieve all tours
  res.status(200).json({
    status: 200,
    message: 'Success',
    data: tourDetails,
  });
});

app.post('/tours', (req, res) => {
  const { name, description, duration, price } = req.body;
  //Write a code here for creating new tour from data/tours.json
  //For creating new id use this logic
  // const newId = tourDetails[tourDetails.length - 1].id + 1;
   // Create new tour
  const newId = tourDetails.length > 0 ? tourDetails[tourDetails.length - 1].id + 1 : 1;
  const newTour = {
    id: newId,
    name,
    description,
    duration,
    price,
  };

  // Add new tour to data
  tourDetails.push(newTour);

  try {
    // Update tours.json
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails, null, 2));

    res.status(200).json({
      status: 200,
      message: 'Tour added successfully',
    });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

app.put('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  const updatedTour = req.body;

  //write a code here for updating a tour
  // Find the index of the tour to be updated
  const index = tourDetails.findIndex((tour) => tour.id === tourId);

  // If tour not found, return 404
  if (index === -1) {
    return res.status(404).json({
      status: 404,
      message: 'Tour not found',
    });
  }

  try {
    // Update tour details
    tourDetails[index] = { ...tourDetails[index], ...updatedTour };

    // Update tours.json
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails, null, 2));

    res.status(200).json({
      status: 200,
      message: 'Tour updated successfully',
    });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

app.delete('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  //Write a code here for deleting a tour from data/tours.json
  // Find the index of the tour to be deleted
  const index = tourDetails.findIndex((tour) => tour.id === tourId);

  // If tour not found, return 404
  if (index === -1) {
    return res.status(404).json({
      status: 404,
      message: 'Tour not found',
    });
  }

  try {
    // Remove the tour from the array
    tourDetails.splice(index, 1);

    // Update tours.json
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails, null, 2));

    res.status(200).json({
      status: 200,
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

module.exports = app;
