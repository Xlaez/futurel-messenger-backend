const { Router } = require('express');
const { signup, login } = require('../src/controllers/auth.controller');
const { changePassword,changeEmail } = require('../src/controllers/userFunc.controller');

const router = Router();

router.route('/').post(signup);
router.route('/login').post(login);
router.route('/change_email/:id').post(changeEmail);
router.route('/change_pass/:id').post(changePassword)

module.exports.authRouter = router;