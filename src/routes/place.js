const express = require('express');
const placeRouter = express.Router();
const placeController = require('../service/place');

// Route to add a new place
placeRouter.post('/addPlace', placeController.addPlace);
placeRouter.get('/getAllPlaces', placeController.getAllPlaces);
module.exports = placeRouter;
