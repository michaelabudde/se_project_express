/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

require("dotenv").config();

const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.error("Database connected"))
  .catch((err) => console.error("Error connecting to database:", err));

app.use(cors());

app.use(express.json());

app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
// app.post("/login", validateLogIn, login);
// app.post("/signup", validateUserInfo, createUser);
app.use(routes);
app.use(errorLogger); // enabling the error logger
app.use(errorHandler); // centralized error handler
app.use(errors()); // celebrate error handler

app.listen(PORT, () => {
  console.error(`App listening at port ${PORT}`);
});
// we handle all errors here, by logging the error to the console
// and sending a response with an appropriate status code and message
// app.use((err, req, res, next) => {
//   console.error(err);
//   return res.status(500).send({ message: "An error occurred on the server" });
// });

// app.listen(PORT);
