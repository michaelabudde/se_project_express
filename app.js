require("dotenv").config();

const { PORT = 3001 } = process.env;
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const { login, createUser } = require("./controllers/user");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.error("Database connected"))
  .catch((err) => console.error("Error connecting to database:", err));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/login", login);
app.post("/signup", createUser);
app.use(routes);

app.listen(PORT, () => {
  console.error(`App listening at port ${PORT}`);
});
// why does it not like the use of console statements here?
