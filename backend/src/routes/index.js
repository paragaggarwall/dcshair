const express = require('express');
const userRoutes = require('./userRoutes');
const customerRoutes = require('./customerRoutes');
const productRoutes = require('./productRoutes');
const contractRoutes = require('./contractRoutes');
const { generateProformaInvoice } = require('../controllers/proformagenerate/generateproformainvoice');
const proformainvoiceRoutes = require('./proformainvoiceRoutes')
const { proformainvoice } = require('../controllers/proformainvoice/proformainvoicegenerate');
const invoiceRoutes = require('./invoiceRoutes')

const router = express.Router();

// Management routes
router.use('/users', userRoutes);
router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
//not check contract api
router.use('/contracts', contractRoutes);

router.use('/proformainvoice', proformainvoiceRoutes);
router.use('/invoice', invoiceRoutes);

module.exports = router;
