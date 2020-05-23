const mongoose = require ('mongoose');
const schema = mongoose.Schema;

let itinerary = new schema({
    itinerary_name: {
        type: String,
    },
    itinerary_country: {
        type: String,
    },
    itinerary_description: {
        type: String,
    },
    submitted_by: {
        type: String,
    },
    rating: {
        type: Number,
    },
    activities: [
        {
            activity_location: {
                type: String,
            },
            activity_description: {
                type: String,
            },
            // TODO: store images with S3 path
        }
    ]
});

module.exports = mongoose.model('itinerary', itinerary);