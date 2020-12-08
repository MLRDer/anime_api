const mongoose = require("mongoose");
const { Schema } = mongoose;

const animeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    originalTitle: {
        type: String,
    },
    year: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    quality: {
        type: Number,
        enum: [480, 720, 1080],
    },
    isSerial: {
        type: Boolean,
        default: true,
    },
    categories: [String],
    episodes: [
        {
            url: {
                type: String,
                required: true,
            },
            size: Number,
            quality: Number,
        },
    ],
});

module.exports = mongoose.model("Animes", animeSchema);
