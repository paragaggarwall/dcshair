const express = require('express');
const authenticateToken = require('../middleware/auth');
const contractController = require('../controllers/contracts/contractController');
const proformaInvoice = require('../controllers/proformainvoice/proformainvoicegenerate')

const router = express.Router();

router.get('/allcontract',authenticateToken,contractController.getContracts);
router.post('/pdfgenerate',authenticateToken,proformaInvoice.proformainvoicepdf)
router.get('/:contractId/parties', authenticateToken, proformaInvoice.getContractParties);



module.exports = router;
