const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionSchema = new Schema({
    title: {
        en: {
            type: String,
            required: true,
        },
        ru: {
            type: String,
            required: true,
        },
    },
    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movies',
        },
    ],
    order: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

collectionSchema.index({
    'title.en': 'text',
    'title.ru': 'text',
});

module.exports = mongoose.model('Collection2s', collectionSchema);
