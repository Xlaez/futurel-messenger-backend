const { groupModel, groupMessages } = require('../models/groupModel');
const { userModel } = require('../models/userModel');

module.exports = {

    createGroup: async (req, res) => {

        var group = new groupModel({
            name: req.body.name,
            admin: req.params.id,
            description: req.body.description,
        });

        try {
            group = await group.save();
            var groupAdd = await userModel.findById(req.params.id);

            if (!groupAdd) return res.status(400).json({ msg: 'user doesn\'t exist' });
            groupAdd.groups = [group._id];
            groupAdd = await groupAdd.save()
            return res.status(201).json({ msg: 'created!', data: group, d: groupAdd });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    editGroupName: async (req, res) => {

        var group = await groupModel.findById(req.params.id);

        if (!group) {

            res.status(400).json({ msg: 'group doesn\'t exist' });
        } else {

            group.name = req.body.name;
            group = await group.save();

            res.status(201).json({ msg: 'updated!' });
        }
    },
    deleteGroup: async (req, res) => {

        var group = await groupModel.findByIdAndDelete(req.params.id);

        try {

            if (!group) {

                res.status(400).json({ msg: 'group does not exist' });
            }
            else {
                res.status(201).json({ msg: 'deleted!' })

            }
        } catch (err) {

            res.status(500).json(err);
        }
    },
    addUser: async (req, res) => {

        try {

            var group = await groupModel.findById(req.params.id);

            if (!group) {

                return res.status(400).json({ msg: 'group doesn\'t exist' });
            }
            var user = await userModel.findById(req.body.userId);
            console.log(user)
            if (!user) {

                return res.status(400).json({ msg: 'user doesn\'t exist' });
            }
            user.groups = [group._id];
            user = await user.save();
            return res.status(201).json({ msg: 'user added!' })
        } catch (error) {

            res.status(500).json(error)
        }
    },
    getGroups: async (req, res) => {

        try {

            var user = await userModel.findById(req.params.id);

            if (!user) {

                res.status(400).json({ msg: 'user not found' });
            } else {

                const groupId = user.groups[0].toString();

                var groups = await groupModel.findById(groupId).select(
                    ['_id', 'name', 'description', 'createdAt', 'updatedAt', 'admin']
                );

                var admin = await userModel.findById(groups.admin).select([
                    'username'
                ]);
                const data = {
                    admin,
                    groups,
                }
                res.status(200).json({ data });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    addMessages: async (req, res) => {
        console.log(req);
        try {
            const body = req.body;

            const data = await groupMessages.create({
                message: {
                    text: body.message,
                    users: [body.from, body.to],
                    sender: body.from,
                },
            });
            if (data) return res.status(201).json({ data: data, msg: "Message sent successfully" })

            return res.status(400).json({ msg: "Failed to send" })

        } catch (err) {
            return res.status(400).json(err);
        }
    },

    getMessage: async (req, res) => {
        
        try {
            const { from, to } = req.body;

            const messages = await groupMessages.find({
                users: {
                    $all: [from, to],
                },
            }).sort({ updatedAt: 1 });
            const newMessages = messages.map((msg) => {
                return {
                    fromUser: msg.message.sender.toString() === from,
                    message: msg.message.text,
                    time: msg.createdAt,

                }
            })

            return res.status(200).json(newMessages)

        } catch (err) {
            res.status(500).json(err)
        }
    }
}