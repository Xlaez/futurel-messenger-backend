const mongoose = require('mongoose');

module.exports = {
    groupModel: mongoose.model('group_model',
        new mongoose.Schema({
            name: {
                type: String,
                min: 3,
                max: 30,
            },
            description: {
                type: String,
            },
            admin: {
                type: String,
            }
        }, {
            timestamps: true,
        })
    ),
    groupMessages: mongoose.model("Group_messages",
        new mongoose.Schema({
            message: {
                text: {
                    type: String,
                    required: true
                },
                users: Array,
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "authmodel",
                }
            },
        }, {
            timestamps: true
        }))
}