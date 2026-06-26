const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers/customerController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { verifyRoles } = require('../middleware/verifyrole');
const { createCustomerSchema, updateCustomerSchema, addcustomerPartySchema, deletecustomerPartySchema } = require('../validations/customervalidation');

//customer Api
router.get('/', authenticateToken, customerController.getCustomers);
router.get('/:id', authenticateToken, customerController.getCustomerbyId);
router.post('/', validate(createCustomerSchema), customerController.createCustomer);
router.post('/update/:id', validate(updateCustomerSchema), customerController.updateCustomerbyId);
//customer Party Api
router.post('/party', validate(addcustomerPartySchema), customerController.createParty);
router.post('/party/delete', verifyRoles(["Admin"]), validate(deletecustomerPartySchema), customerController.deleteParty);

module.exports = router;
