const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const { login, createUser } = require("./controllers/users");

const { PORT = 3001 } = process.env;
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

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
