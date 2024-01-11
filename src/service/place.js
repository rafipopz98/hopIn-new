const Place = require('../repositiory/place');

module.exports = {
    async addPlace(req, res) {
        try {
            const { name } = req.body;

            // Check if the place name already exists
            const existingPlace = await Place.findOne({ name });
            if (existingPlace) {
                return res.status(400).json({ message: 'Place already exists' });
            }

            // Create a new place
            const newPlace = new Place({
                name,
                // Other details related to the place can be added here in the future
            });

            // Save the new place to the database
            await newPlace.save();

            res.status(201).json({ message: 'Place created successfully', place: newPlace });
        } catch (err) {
            res.status(500).json({ message: 'Could not create place', error: err.message });
        }
    },
    async getAllPlaces(req, res) {
        try {
            const allPlaces = await Place.find();
            res.status(200).json({ places: allPlaces });
        } catch (err) {
            res.status(500).json({ message: 'Could not fetch places', error: err.message });
        }
    }
};
