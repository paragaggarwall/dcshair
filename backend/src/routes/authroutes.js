const express = require('express');
const router = express.Router();
const logincontroller = require('../controllers/authcontroller/authlogin');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createloginSchema } = require('../validations/authvalidation');

router.post('/login', validate(createloginSchema), logincontroller.login);
router.post('/logout', authenticateToken, logincontroller.logout)

module.exports = router;




