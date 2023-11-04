const express = require("express");

const mongoose = require("mongoose");

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

app.use((req, res, next) => {
  req.user = {
    _id: "6545d4647a6909cb4835fac9", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use(routers);
app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
