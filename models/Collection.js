const mongoose = require("mongoose");
const { Schema } = mongoose;

const collectionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Animes",
        },
    ],
});

collectionSchema.index({
    title: "text",
});

module.exports = mongoose.model("Collections", collectionSchema);
