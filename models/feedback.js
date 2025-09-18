const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        },
    email: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
}, { timestamps: true });
mongoose.models = {};
module.exports = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);