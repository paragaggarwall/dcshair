const express = require('express');
const authenticateToken = require('../middleware/auth');
const contractController = require('../controllers/contracts/contractController');
const proformaInvoice = require('../controllers/proformainvoice/proformainvoicegenerate')
const { generateProformaInvoice } = require("../controllers/proformagenerate/generateproformainvoice");

const router = express.Router();

router.get('/allcontract', authenticateToken, contractController.getContracts);
// router.post('/pdfgenerate', authenticateToken, proformaInvoice.proformainvoicepdf)
router.post('/pdfgenerate', authenticateToken, (req, res) => {
    try {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="proforma-invoice.pdf"`);
        generateProformaInvoice(req.body, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get('/:contractId/parties', authenticateToken, proformaInvoice.getContractParties);




module.exports = router;
