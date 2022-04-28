const { compareSync, hashSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { secret } = require("../../config/config");
const { userModel } = require('../models/userModel')


getToken = (user) => {
    return sign({ id: user._id, email: user.email }, secret, {
        expiresIn: 3600,
    });
}

module.exports = {

    signup: async (req, res) => {

        try {

            var isUser = await userModel.findOne({ email: req.body.email });

            if (isUser) {

                return res.status(401).json({ msg: 'email taken' })

            } else {
                var user = new userModel({

                    username: req.body.username,
                    email: req.body.email,
                    password: await hashSync(req.body.password, 10),
                });
                user = await user.save();

                var token = await getToken(user);

                const data = {
                    token: token,
                    userAccess: user._id,
                }
                return res.status(201).json(data);
            }

        } catch (error) {

            res.status(500).json(error);
        }
    },
    login: async (req, res) => {

        try {

            var isUser = await userModel.findOne({ email: req.body.email });

            if (!isUser) {

                res.status(400).json({ msg: 'user not found' });
            } else {

                var verify = await compareSync(req.body.password, isUser.password);

                if (!verify) {

                    return res.status(400).json({ msg: 'user details are in accurate' });
                }

                var token = await getToken(isUser);

                const data = {

                    token: token,
                    userAccess: isUser._id,
                }
                res.status(200).json(data);
            }

        } catch (error) {

            res.status(500).json(error);
        }
    }
}

