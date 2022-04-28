const mongoose = require('mongoose');

module.exports = {

    userModel: mongoose.model('authModel', new mongoose.Schema({
        username: {
            type: String,
            default: "user"
        },
        email: {
            type: String,
            required: true,
            min: 5,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 7,
        },
        image: {
            type: String,
        },
        groups: {
            type: Array,
        },
        isImage: {
            type: String,
        },
        resetToken: {
            type: String,
        },
        resetTokenExpiry: {
            type: Date,
        }

    }, {
        timestamps: true,
    }))
}