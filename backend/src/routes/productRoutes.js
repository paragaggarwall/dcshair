const express = require('express');
const productController = require('../controllers/products/productController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProductSchema } = require('../validations/productvalidation');
const router = express.Router();

router.post('/create', validate(createProductSchema), productController.createProduct);
router.post('/get', authenticateToken, productController.getProducts);
router.post('/update/:id', authenticateToken, productController.updateProductbyId)
router.post('/createsizecolor', productController.createSizeColor)
router.get('/getAllColorSize', productController.getAllColorSize)
router.get('/:id', authenticateToken, productController.getProductById)

module.exports = router;
