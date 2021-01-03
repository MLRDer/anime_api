const mongoose = require("mongoose");
const { Schema } = mongoose;

const errorSchema = new Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Animes",
    },
    episodeId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    error: {},
});

module.exports = mongoose.model("Errors", errorSchema);
