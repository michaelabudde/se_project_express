require("dotenv").config();

const { PORT = 3001, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const { login, createUser } = require("./controllers/users");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error connecting to database: ", err));

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/signin", login);
app.post("/signup", createUser);
app.use(routes);

app.post("/signin", (req, res) => {
  // Example: Sign a JWT token
  const token = jwt.sign({ userId: 32 }, JWT_SECRET, { expiresIn: "7h" });
  res.json({ token });
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
