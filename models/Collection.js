const mongoose = require("mongoose");
const { Schema } = mongoose;

const collectionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    data: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Animes",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

collectionSchema.index({
    title: "text",
});

module.exports = mongoose.model("Collections", collectionSchema);
