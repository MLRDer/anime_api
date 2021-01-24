const mongoose = require('mongoose');
const { Schema } = mongoose;

const animeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    hdrezka: {
        type: Number
    },
    originalTitle: {
        type: String,
    },
    year: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['movie', 'anime', 'cartoon'],
    },
    image: {
        type: String,
        required: true,
    },
    poster: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    description: {
        type: String,
    },
    quality: {
        type: [Number],
        enum: [240, 360, 480, 720, 1080],
    },
    isSerial: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    categories: [String],
    episodes: {
        type: [
            {
                name: String,
                season: Number,
                episode: Number,
                sources: [
                    {
                        url: {
                            type: String,
                            required: true,
                        },
                        quality: Number,
                    },
                ],
            },
        ],
        select: false,
    },
    isCard: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

animeSchema.index({
    title: 'text',
    originalTitle: 'text',
    categories: 'text',
    type: 'text',
});

module.exports = mongoose.model('Animes', animeSchema);
