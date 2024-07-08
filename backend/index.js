const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./models/db");
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

let orders = [];

const UsersRouter = require("./routes/users");
const rolesRouter = require("./routes/roles");
const commentsRouter = require("./routes/comments");
const productRouter = require("./routes/products");

app.use("/users", UsersRouter);
app.use("/roles", rolesRouter);
app.use("/comment", commentsRouter);
app.use("/product", productRouter);

app.post("/orders/create", (req, res) => {
  const { userId, products } = req.body;
  orders.push({ userId, products });
  res.json({ message: "order created successfully" });
});

app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
