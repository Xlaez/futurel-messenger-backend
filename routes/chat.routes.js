const { Router } = require('express');
const { getMessages, addMessage, users, user, uploadImage } = require('../src/controllers/chat.controller');
const { createGroup, editGroupName, deleteGroup, addUser, getGroups, addMessages, getMessage } = require('../src/controllers/groups.controller');

const router = Router();

router.route('/').post(getMessages);
router.route('/:id').get(users).put(uploadImage);
router.route('/add').post(addMessage);
router.route('/user/:id').get(user);
router.route('/groups/:id').post(createGroup).put(editGroupName).delete(deleteGroup).get(getGroups);
router.route('/groups/add/:id').post(addUser);
router.route('/groups/msg').post(addMessages);
router.route('/groups/msgs/get').post(getMessage);

module.exports.chatRouter = router;