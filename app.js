const express = require("express");

const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/users");
const userRoutes = require("./routes/users");

const app = express();
const { PORT = 3001 } = process.env;
app.use(express.json());
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB", r);
  },
  (e) => console.log("DB error", e),
);

const routers = require("./routes");

app.post("/signin", login);
app.post("/signup", createUser);

app.use((req, res, next) => {
  req.user = {
    _id: "6545d4647a6909cb4835fac9",
  };
  next();
});

// Mount the user routes
app.use("/users", userRoutes);

app.use(routers);
app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
