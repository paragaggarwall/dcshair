const prisma = require('../../db');

exports.createProduct = async (req, res) => {
  // console.log('Prisma keys:', Object.keys(prisma));
  // console.log('Is product in prisma?', 'product' in prisma);
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        createdBy: req.user.email
      }
    });
    return res.status(201).json(product);
  } catch (error) {
    console.log(error.stack);
    return res.status(400).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};


exports.updateProductbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, size, skuCode, imageUrl, color } = req.body;

    console.log("update data:", req.body, id);

    const product = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        size,
        skuCode,
        imageUrl,
        color
      }
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};