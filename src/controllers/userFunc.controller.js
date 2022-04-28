const { userModel } = require('../models/userModel')
const { compareSync, hashSync } = require('bcryptjs')

module.exports = {

    changePassword: async (req, res) => {

        try {

            var reqData = {
                newPassword: req.body.newPassword,
                oldPassword: req.body.oldPassword,
                userAccess: req.params.id,
            }
            var user = await userModel.findById(reqData.userAccess);

            if (!user) {

                res.status(400).json({ msg: 'user does not exist' });
            } else {

                var verify = await compareSync(reqData.oldPassword, user.password);

                if (!verify) {

                    res.status(403).json({ msg: 'password doesn\'t match' })
                } else {

                    user.password = await hashSync(reqData.newPassword, 10);

                    user = await user.save();

                    res.status(201).json({ msg: 'success' });
                }
            }
        } catch (error) {

            res.status(500).json(error)
        }

    },
    changeEmail: async (req, res) => {
        try {

            var data = {

                password: req.body.password,
                email: req.body.email,
                userAccess: req.params.id,
            }
            var user = await userModel.findById(data.userAccess);

            if (!user) {

                res.status(400).json({ msg: 'user not found' });
            } else {

                var verify = await compareSync(data.password, user.password);

                if (!verify) {
                    res.status(400).json({ msg: 'password does not match' });
                } else {
                    user.email = data.email;

                    user = await user.save();

                    res.status(201).json({ data: user });
                }
            }
        } catch (error) {

            res.status(500).json(error);
        }

    }
}