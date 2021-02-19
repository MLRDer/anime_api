const mongoose = require("mongoose");
const { Schema } = mongoose;

const updateSchema = new Schema({
    changelog: {
        type: String,
        required: true,
    },
    isShown: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Updates", updateSchema);
