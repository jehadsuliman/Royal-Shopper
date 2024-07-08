const mongoose = require("mongoose");
const DB=`${process.env.DB_URI}`
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Ready To Use");
  })
  .catch((err) => {
    console.log(err.message);
  });
