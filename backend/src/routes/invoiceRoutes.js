const express = require('express');
const authenticateToken = require('../middleware/auth');
const invoiceController = require('../controllers/invoice/invoiceConttroller');
const validate = require('../middleware/validate');
const { invoiceSchema, updateInvoiceSchema } = require('../validations/invoicevalidation');

const router = express.Router();


router.get('/getAllInvoices', invoiceController.getAllInvoices)
router.get('/:id', invoiceController.getInvoicebyId)
router.post('/create', validate(invoiceSchema), invoiceController.createinvoice)
router.post('/updateInvoice/:id', validate(updateInvoiceSchema), invoiceController.updateInvoiceDetails)
router.post('/:id/pdf', invoiceController.getInvoicePdf)


// router.post('/shipping-details',authenticateToken,invoiceController.createshippingDetails)
// router.post('/shipping-tracking',authenticateToken,invoiceController.createShippingTracking)
// router.post('/customSaleDetails',authenticateToken,invoiceController.createCustomSaleDetails)
// router.post('/bankSaleDetails',authenticateToken,invoiceController.createBankSaleDetails)

module.exports = router;