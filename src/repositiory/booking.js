const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  numberOfSeats: {
    type: Number,
    required: true
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
