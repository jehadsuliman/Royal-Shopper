const productModel = require("../models/productSchema");

const createNewProduct = async (req, res) => {
  const { title, image, publisher, description, price } = req.body;

  if (!title || !description || !price) {
    return res.status(400).json({
      success: false,
      message: `Please Enter all data`,
    });
  }
  try {
    const newProduct = new productModel({
      title,
      publisher,
      description,
      price,
      image,
    });
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: `created new project`,
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getAllProduct = (req, res) => {
  productModel
    .find({})
    .populate([
      {
        path: "comments",
        populate: {
          path: "commenter",
          model: "user",
        },
      },
      {
        path: "publisher",
      },
    ])

    .then((result) => {
      if (result.length) {
        res.status(200).json({
          success: true,
          message: `All the product`,
          product: result,
        });
      } else {
        res.status(200).json({
          success: false,
          message: `No Product Yet`,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: `  Server Error`,
        error: error.message,
      });
    });
};

const deleteProductById = (req, res) => {
  const id = req.params.id;
  productModel
    .findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          success: false,
          message: `The product with id ${id} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `Product deleted`,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        error: error.message,
      });
    });
};

const updateProductById = (req, res) => {
  const id = req.params.id;
  const filter = req.body;
  Object.keys(filter).forEach((key) => {
    filter[key] == "" && delete filter[key];
  });
  productModel
    .findByIdAndUpdate(id, filter, { new: true })
    .then((result) => {
      if (!result) {
        res.status(404).json({
          success: false,
          message: `The product with id => ${id} not found`,
        });
      }
      res.status(202).json({
        success: true,
        message: `Product updated`,
        product: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        error: error.message,
      });
    });
};

const getProductById = (req, res) => {
  const id = req.params.id;
  productModel
    .findById(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          success: false,
          message: `The product with id => ${id} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `The product id => ${id}`,
        product: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        error: error.message,
      });
    });
};

const likeProductById = (req, res) => {
  const productId = req.params.id;
  const userId = req.body.userId;

  productModel
    .findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `The product with id => ${productId} not found`,
        });
      }
      if (product.likedBy.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: `User has already liked this product`,
        });
      }
      product.likes += 1;
      product.likedBy.push(userId);
      return product.save();
    })
    .then((updatedProduct) => {
      res.status(200).json({
        success: true,
        message: `product Liked`,
        product: updatedProduct,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        error: error,
      });
    });
};

module.exports = {
  createNewProduct,
  getAllProduct,
  deleteProductById,
  updateProductById,
  getProductById,
  likeProductById,
};
