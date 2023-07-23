const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

axios.defaults.headers.common["X-API-KEY"] = process.env.OPEN_SEA_API_KEY;

// enable express sessions
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// import routes

const collectionsRouter = require("./routes/collections");
const merchandiseRouter = require("./routes/merchandise");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/orders");
const shippingRouter = require("./routes/shippings");
const adminRouter = require("./routes/admin");
const localnftsRouter = require("./routes/localnfts");
const otlRouter = require("./routes/otl");

app.use("/collections", collectionsRouter);
app.use("/merchandise", merchandiseRouter);
app.use("/user", userRouter);
app.use("/orders", orderRouter);
app.use("/shippings", shippingRouter);
app.use("/admin", adminRouter);
app.use("/localnft", localnftsRouter);
app.use("/otl", otlRouter);

const { sequelize } = require("./models");

// db.sequelize.sync();

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // sequelize.sync({});
  sequelize.sync({ force: true }).then(() => {console.log("Drop and Resync with { force: true }"); process.exit(0);});
  console.log("listing on " + PORT);
});
