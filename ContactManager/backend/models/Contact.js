const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    company: {
        type: String
    },
    tags: {
        type: [String]
    },
    notes: {
        type: String
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
