const express = require("express");
const app = express();
const sequelize = require("./db");
app.use(express.json());

const user = require("./controllers/user-controller");
const log = require("./controllers/log-controller")

sequelize.sync();
//sequelize.sync({force: true});
app.use(require("./middleware/headers"));


app.use("/user", user);

app.use(require("./middleware/validate-session"));
app.use("/log", log);

app.listen(3000, function () {
  console.log("App is listening on port 3000");
});
