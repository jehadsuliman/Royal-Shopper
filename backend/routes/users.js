const express = require("express");
const {
  Register,
  Login,
  addToCart,
  getToCart,
  deleteCartById,
} = require("../controllers/users");
const UsersRouter = express.Router();
const authentication = require("../middleware/authentication");

UsersRouter.post("/create", Register);
UsersRouter.post("/login", Login);
UsersRouter.post("/cart/:productId", addToCart);
UsersRouter.get("/get/cart", getToCart);
UsersRouter.delete("/cart/delete", deleteCartById);

module.exports = UsersRouter;
