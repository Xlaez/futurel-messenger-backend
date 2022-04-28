const mongoose = require('mongoose');

module.exports = {

    Messages: mongoose.model("Chat_messages",
        new mongoose.Schema({
            message: {
                text: {
                    type: String,
                    required: true
                },
            },
            users: Array,
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "authmodel",
            }
        }, {
            timestamps: true
        }))

}
