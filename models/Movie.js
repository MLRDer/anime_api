const mongoose = require("mongoose");
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
        categories: [String],
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
        categories: [String],
        translator_id: {
            type: Number,
            default: 238,
        },
        trailer: String,
    },
    hdrezka: {
        type: Number,
    },
    tmdbID: {
        type: Number,
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
        enum: ["movie", "anime", "cartoon"],
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
            ref: "Actors",
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
                sources: [
                    {
                        url: {
                            type: String,
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

movieSchema.index({
    "en.title": "text",
    "ru.title": "text",
    originalTitle: "text",
    "en.categories": "text",
    "ru.categories": "text",
    type: "text",
});

module.exports = mongoose.model("Movies", movieSchema);
