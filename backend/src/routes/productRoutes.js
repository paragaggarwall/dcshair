const express = require('express');
const productController = require('../controllers/products/productController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/create', authenticateToken, productController.createProduct);
router.post('/get', authenticateToken, productController.getProducts);
router.get('/:id',authenticateToken,productController.getProductById)
router.post('/update/:id',authenticateToken,productController.updateProductbyId)

module.exports = router;
