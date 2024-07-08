const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  description: { type: String },
  price: { type: Number },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

module.exports = mongoose.model("product", productSchema);
