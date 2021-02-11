const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name_en: {
        type: String,
        required: true,
        unique: true,
    },
    name_ru: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
    },
    tmdbId: Number,
});

module.exports = mongoose.model('Categories', categorySchema);
