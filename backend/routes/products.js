const express = require("express");
const {
  createNewProduct,
  getAllProduct,
  deleteProductById,
  updateProductById,
  getProductById,
  likeProductById,
} = require("../controllers/products");
const authentication = require("../middleware/authentication");

const productRouter = express.Router();

productRouter.post("/newProduct", createNewProduct);
productRouter.get("/all", getAllProduct);
productRouter.delete("/delete/:id", deleteProductById);
productRouter.put("/update/:id", updateProductById);
productRouter.get("/get/:id", getProductById);
productRouter.put("/like/:id", authentication, likeProductById);

module.exports = productRouter;
