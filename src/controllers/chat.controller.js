const { Messages } = require("../models/chatModel");
const { userModel } = require("../models/userModel");

module.exports = {

    uploadImage: async (req, res) => {
        var file = req.file;
        try {

            if (!file) return res.status(500).json({ message: "no image provided" });

            let user = await userModel.findById(req.params.id);

            user.image = file.path;

            user.isImage = true;

            user = await user.save();

            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).json({ status: false, err })

        }
    },

    user: async (req, res) => {
        try {
            const chat = await userModel.findById(req.params.id).select([
                "isImage", "email", "username", "image", "_id","createdAt"
            ]);


            return res.status(200).json(chat);

        } catch (error) {

            return res.status(400).json({ status: false, error })
        }
    },
    users: async (req, res) => {

        try {

            var users = await userModel.find({ _id: { $ne: req.params.id } }).select(

                ["isImage", "email", "username", "image", "_id",]
            )
            if (!users) {

                res.status(500).json({ msg: 'no users' });
            } else {

                res.status(200).json(users);
            }

        } catch (err) {

            return res.status(500).json({ status: false, err })
        }
    },
    addMessage: async (req, res) => {
        try {
            const body = req.body;

            const data = await Messages.create({
                message: {
                    text: body.message,
                },
                users: [body.from, body.to],
                sender: body.from,
            });
            if (data) return res.status(201).json({ data: data, msg: "Message sent successfully" })

            return res.status(400).json({ msg: "Failed to send" })

        } catch (err) {
            return res.status(400).json(err);
        }
    },

    getMessages: async (req, res) => {
        try {
            const { from, to } = req.body;

            const messages = await Messages.find({
                users: {
                    $all: [from, to],
                },
            }).sort({ updatedAt: 1 });
            const newMessages = messages.map((msg) => {
                return {
                    fromUser: msg.sender.toString() === from,
                    message: msg.message.text,
                    time: msg.createdAt,
                    user1: msg.users[0],
                    user2: msg.users[1]
                }
            })

            return res.status(200).json(newMessages)

        } catch (err) {
            res.status(500).json(err)
        }
    }

}