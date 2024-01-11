const express = require('express');
const rideRouter = express.Router();
const Ride = require('../repositiory/ride');
const jwt = require('jsonwebtoken');
const isAuth = require('../middleware/isAuth');
const authenticateToken = require('../middleware/isAuth');
// Route to allow users to post their rides
rideRouter.post('/postRide', authenticateToken, async (req, res) => {
    try {
        const { source, destination, departureTime, availableSeats } = req.body;
        console.log(isAuth)
        const userId = req.user.id; // Access user ID from the authenticated request

        const newRide = new Ride({
            userId,
            source,
            destination,
            departureTime,
            availableSeats
        });

        await newRide.save();

        res.json({ message: 'Ride posted successfully', ride: newRide });
    } catch (err) {
        res.status(500).json({ message: 'Error posting ride', error: err.message });
    }
});

rideRouter.get('/searchRides', async (req, res) => {
    try {
        const { source, destination } = req.query;

        // Create regular expressions for partial matching
        const sourceRegex = new RegExp(source, 'i'); // 'i' for case-insensitive
        const destinationRegex = new RegExp(destination, 'i');

        // Get the current date and time
        const currentDate = new Date();

        // Use regular expressions in the query for partial matching
        // Include conditions to filter out rides that are booked, and rides that have already departed
        const rides = await Ride.find({
            source: { $regex: sourceRegex },
            destination: { $regex: destinationRegex },
            departureTime: { $gte: currentDate }, // Filter out rides with a departureTime less than or equal to the current date
            status: 'available' // Filter out booked rides
        }).sort({ departureTime: 1 }); // Sort in ascending order of departureTime

        res.json({ message: 'Rides retrieved successfully', rides });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving rides', error: err.message });
    }
});




// Assuming you have a route for booking a ride

// Route for booking a ride
rideRouter.post('/bookRide/:rideId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const rideId = req.params.rideId;


        const bookedRide = await Ride.findOneAndUpdate(
            { _id: rideId, status: 'available' },
            { $set: { status: 'booked', bookedBy: userId } },
            { new: true }
        );

        if (!bookedRide) {
            return res.status(404).json({ message: 'Ride not available for booking' });
        }

        // Send confirmation response or notification to the user
        res.json({ message: 'Ride booked successfully', bookedRide });
    } catch (err) {
        res.status(500).json({ message: 'Error booking ride', error: err.message });
    }
});

rideRouter.get('/bookedRides', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookedRides = await Ride.find({ bookedBy: userId, status: 'booked' });

        res.json({ message: 'Booked rides retrieved successfully', rides: bookedRides });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving booked rides', error: err.message });
    }
});



module.exports = rideRouter;
