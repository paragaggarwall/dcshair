const prisma = require('../../db');

exports.createProduct = async (req, res) => {
  const { name } = req.body
  try {

    const alreadyexist = await prisma.product.findUnique({
      where: {
        name: name
      }
    })

    if (alreadyexist) {
      throw new Error('already exist product name')
    }


    const product = await prisma.product.create({
      data: {
        ...req.body,
        createdBy: req.user.email
      }
    });

    if (!product) {
      throw new Error('fail create product ')
    }
    return res.status(200).json({
      success: true,
      message: "Product created successfully.",
      data: product
    })
  } catch (error) {
    console.log(error.stack || error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Product fail to create.",
    })
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    if (!products) {
      throw new Error('no product found')
    }
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Products fetched Fail",
    })
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
      throw new Error('product not found')
    }
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: product
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Product fetched Fail.",
    })
  }
};


exports.updateProductbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, skuCode, imageUrl } = req.body;

    const alreadyexist = await prisma.product.findUnique({
      where: {
        name: name
      }
    })

    if (alreadyexist) {
      throw new Error('already exist product name')
    }

    const product = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        skuCode,
        imageUrl,
      }
    });

    if (!product) {
      throw new Error('fail update product ')
    }

    return res.status(200).json({
      success: true,
      message: "Products update successfully.",
      data: product
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Products update fail",
    })
  }
};



exports.createSizeColor = async (req, res, next) => {
  try {
    const { colors = [], sizes = [] } = req.body;



    if (!Array.isArray(colors) || !Array.isArray(sizes)) {
      throw new Error("Colors and Sizes must be arrays.", 400);
    }

    if (colors.length === 0 && sizes.length === 0) {
      throw new Error("Please provide at least one color or size.", 400);
    }



    // Remove duplicates
    const uniqueColors = [...new Set(colors.map(c => c.trim()))];
    const uniqueSizes = [...new Set(sizes.map(s => s.trim()))];

    await prisma.$transaction(async (tx) => {
      // Create Colors
      for (const color of uniqueColors) {
        if (!color) continue;

        const exists = await tx.color.findFirst({
          where: {
            color,
          },
        });

        if (!exists) {
          await tx.color.create({
            data: {
              color,
              createdBy: req.user?.userName,
            },
          });
        }
      }

      // Create Sizes
      for (const size of uniqueSizes) {
        if (!size) continue;

        const exists = await tx.size.findFirst({
          where: {
            size,
          },
        });

        if (!exists) {
          await tx.size.create({
            data: {
              size,
              createdBy: req.user?.userName,
            },
          });
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Product colors and sizes created successfully.",
    });

  } catch (error) {
    console.log("fail to create size and color", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Product colors and sizes created fail.",
    });
  }
};


exports.getAllColorSize = async (req, res) => {
  try {
    const [colors, sizes] = await Promise.all([
      prisma.Color.findMany(),
      prisma.size.findMany(),
    ]);

    if (!colors) {
      throw new Error('colors not found or empty data')
    }
    return res.status(200).json({
      success: true,
      message: "color found successfully",
      data: { colors, sizes }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "color fetch failed",
    })
  }

}