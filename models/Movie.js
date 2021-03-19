const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
    en: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        poster: {
            type: String,
            required: true,
        },
        translator_id: {
            type: Number,
            default: 238,
        },
        trailer: String,
    },
    ru: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        poster: {
            type: String,
            required: true,
        },
        translator_id: {
            type: Number,
            default: 56,
        },
        trailer: String,
    },
    hdrezka: {
        type: Number,
    },
    hdrezkaUrl: {
        type: String,
    },
    tmdbId: {
        type: Number,
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categories',
        },
    ],
    originalTitle: {
        type: String,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['movie', 'anime', 'cartoon'],
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
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
    actors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Actors',
        },
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categories',
        },
    ],
    episodes: {
        type: [
            {
                name: {
                    en: String,
                    ru: String,
                },
                season: Number,
                episode: Number,
                sources: {
                    en: [
                        {
                            url: {
                                type: String,
                            },
                            quality: Number,
                        },
                    ],
                    ru: [
                        {
                            url: {
                                type: String,
                            },
                            quality: Number,
                        },
                    ],
                },
                subtitles: [
                    {
                        lang_code: String,
                        language: String,
                        url: String,
                    },
                ],
                image: String,
            },
        ],
        select: false,
    },
    isCard: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

movieSchema.index({
    'en.title': 'text',
    'ru.title': 'text',
    originalTitle: 'text',
    type: 'text',
});

module.exports = mongoose.model('Movies', movieSchema);
