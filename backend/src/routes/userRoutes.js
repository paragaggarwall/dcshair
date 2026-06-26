const express = require('express');
const userController = require('../controllers/users/userController');
const authenticateToken = require('../middleware/auth');
const { verifyRoles } = require('../middleware/verifyrole');
const validate = require('../middleware/validate');
const router = express.Router();
const { createUserSchema, updateUserSchema, } = require("../validations/uservalidation");

// These will be mounted under specific paths in the main router
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserbyId);
router.post('/delete/:id', userController.deleteUser);
router.post('/', verifyRoles(["Admin"]), validate(createUserSchema), userController.createUser);
router.post('/update/:id', validate(updateUserSchema), userController.updateUser);

module.exports = router;
