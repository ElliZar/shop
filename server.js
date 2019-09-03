require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// import routes
const user = require("./routes/user");

// Init app
const app = express();

// Connect DB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log("database connected")
}).catch(err => console.log(err))

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// add routes
app.use("/api", user);

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`Server on Port ${port}`)
});
