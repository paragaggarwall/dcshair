const express = require('express');
const authenticateToken = require('../middleware/auth');
const proformaInvoice = require('../controllers/proformainvoice/proformainvoicegenerate');
const validate = require('../middleware/validate');
const { proformaInvoiceSchema } = require('../validations/proformainvoicevalidation');

const router = express.Router();

router.get('/', proformaInvoice.getAllProforma)
router.get('/party/:proformaid', proformaInvoice.getproformaparty)
router.get('/:contractId/parties', proformaInvoice.getContractParties);
router.post('/create', validate(proformaInvoiceSchema), proformaInvoice.proformainvoicecreate)
router.get('/:id/pdf', proformaInvoice.proformainvoicePdf);
router.get('/:id/preview', proformaInvoice.proformainvoicePdf);

module.exports = router;
