const commentModel = require("../models/commentSchema");
const productModel = require("../models/productSchema");

const addNewComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, product } = req.body;
    const commenter = req.token.userId;

    if (!comment || !product) {
      return res.status(400).json({
        success: false,
        message: `comment and product fields are required`,
      });
    }
    const newComment = new commentModel({
      comment,
      commenter,
      product,
    });

    const savedComment = await newComment.save();
    const updatedProduct = await productModel
      .findByIdAndUpdate(
        id,
        { $push: { comments: savedComment._id } },
        { new: true }
      )
      .populate("comments");
    return res.status(201).json({
      success: true,
      message: `Comment added`,
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Server Error`,
      err: err.message,
    });
  }
};

const deleteCommentById = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({
      success: false,
      message: `Invalid id format`,
    });
  }
  commentModel
    .findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          success: false,
          message: `Comment not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `Comment deleted`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
      });
    });
};

module.exports = { addNewComment, deleteCommentById };
