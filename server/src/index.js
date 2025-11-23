const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//routes handlers
const apiRouter = require("./routes/api.route");

const app = express();
const PORT = process.env.PORT || 3003;

//connection to database
connectDB();
//cors for handling cross origin requests
const allowedOrigins = [process.env.FE1, process.env.FE2];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api route navigation to handle all api requests
app.use("/api", apiRouter);

//api route to check server health status
app.get("/check", (req, res) => {
  console.log(req.cookies.auth_token);
  res.send("Server is Healthy");
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, page not found.");
});

app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));
