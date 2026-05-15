const express = require('express');
const userRoutes = require('./userRoutes');
const customerRoutes = require('./customerRoutes');
const productRoutes = require('./productRoutes');
const shipmentRoutes = require('./shipmentRoutes');
const contractRoutes = require('./contractRoutes');
const { generateProformaInvoice } = require('../controllers/proformagenerate/generateproformainvoice');
const proformainvoiceRoutes = require('./proformainvoiceRoutes')
// const { proformainvoice } = require('../controllers/proformainvoice/proformainvoicegenerate');

const router = express.Router();

// Auth routes (Login)
router.use('/auth', userRoutes);

// Management routes
router.use('/users', userRoutes);
router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/contracts', contractRoutes);
router.post("/proformainvoice", (req, res) => {
    try {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="proforma-invoice.pdf"`);
        generateProformaInvoice(req.body, res); // res is the outputStream
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.use('/proformainvoice', proformainvoiceRoutes);

module.exports = router;
