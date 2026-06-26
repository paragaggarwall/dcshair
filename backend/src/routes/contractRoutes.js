const express = require('express');
const contractController = require('../controllers/contracts/contractController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createContractSchema } = require('../validations/contractvalidation');
const router = express.Router();

router.post('/terms-of-payment', contractController.createTermsOfPayment);
router.get('/allterm-payment', contractController.getAllTermsOfPayment)

router.post('/create', validate(createContractSchema), contractController.createContract);
router.get('/list', authenticateToken, contractController.getContracts);
router.get('/options', authenticateToken, contractController.getContractOptions);
router.get('/:id/pdf', authenticateToken, contractController.getContractPdf);
router.get('/:id/preview', authenticateToken, contractController.previewContractPdf);

module.exports = router;
