const mongoose = require("mongoose");
const { Schema } = mongoose;

const actorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    bio: {
        en: String,
        ru: String,
    },
    image: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

actorSchema.index({ name: "text" });

module.exports = mongoose.model("Actors", actorSchema);
