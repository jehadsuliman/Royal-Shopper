const express = require("express");
const { addNewComment, deleteCommentById } = require("../controllers/comments");
const commentsRouter = express.Router();
const authentication = require("../middleware/authentication");

commentsRouter.post("/add/:id", authentication, addNewComment);
commentsRouter.delete("/delete/:id", authentication, deleteCommentById);

module.exports = commentsRouter;
