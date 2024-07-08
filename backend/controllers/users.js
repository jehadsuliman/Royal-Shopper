const usersModel = require("../models/userSchema");
const cartSchema = require("../models/cartSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { populate } = require("../models/roleSchema");

const Register = (req, res) => {
  const { firstName, lastName, age, country, email, password, role, userName } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !age ||
    !country ||
    !email ||
    !password ||
    !userName
  ) {
    res.status(404).json({
      success: false,
      message: ` Please fill out all entries `,
    });
  }

  const user = new usersModel({
    firstName,
    lastName,
    userName,
    age,
    country,
    email,
    password,
    role,
  });

  user
    .save()
    .then((result) => {
      const getCartByUserId = new cartSchema({
        userId: result._id,
        products: [],
      });
      getCartByUserId.save();

      res.status(201).json({
        success: true,
        message: ` Account Created Successfully `,
        author: result,
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(404).json({
          success: false,
          message: ` The email already exists `,
        });
      }
      res.status(500).json({
        success: false,
        message: ` Server Error `,
        err: err.message,
      });
    });
};

const Login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  usersModel
    .findOne({ email })
    .populate("role", "-_id -__v")
    .then(async (result) => {
      try {
        if (!result) {
          res.status(403).json({
            success: false,
            message: `The email doesn't exist or The password you’ve entered is incorrect => result`,
          });
        } else {
          const valid = await bcrypt.compare(password, result.password);
          if (!valid) {
            res.status(403).json({
              success: false,
              message: `The email doesn't exist or The password you’ve entered is incorrect`,
            });
          }
          const payload = {
            userId: result._id,
            author: result.firstName,
            role: result.role,
            country: result.country,
          };
          const options = {
            expiresIn: "60m",
          };
          const token = jwt.sign(payload, process.env.SECRET, options);
          res.status(200).json({
            success: true,
            message: `Valid login credentials`,
            token: token,
            userId: result._id,
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const addToCart = (req, res) => {
  const { userId } = req.body;
  const productId = req.params.productId;
  cartSchema
    .findOneAndUpdate(
      { userId: userId },
      { $push: { ProductId: productId } },
      { new: true }
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `Product added to cart`,
        result: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: `Server Error`,
        error: error.message,
      });
    });
};

const getToCart = (req, res) => {
  const { userId } = req.query;
  cartSchema
    .find({ userId: userId })
    .populate("ProductId")
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All the carts`,
        products: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: `Server Error not found ${productId}`,
        error: error.message,
      });
    });
};

const deleteCartById = (req, res) => {
  const { userId, productId } = req.body;
  cartSchema
    .findOne({ userId: userId })
    .then((cart) => {
      if (!cart) {
        res.status(404).json({
          success: false,
          message: `Cart Not Found`,
        });
      } else {
        cart.products.pull(productId);
        return cart.save();
      }
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `Product removed from cart`,
        result: result,
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
  Register,
  Login,
  addToCart,
  getToCart,
  deleteCartById,
};
