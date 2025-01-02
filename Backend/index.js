import express from "express";

import { dbConnection } from "./Database/dbConnection.js";
import { main } from "./src/app.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

dotenv.config();
const app = express();
const origin =
  process.env.NODE_ENV === "development" ? "*" : "https://www.painfrei.com";
app.use(
  cors({
    origin: origin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(passport.initialize());
app.use(morgan("dev"));
app.use(express.static("uploads"));

main(app);
dbConnection();
app.listen(process.env.PORT, "0.0.0.0", () =>
  console.log(`Example app listening on port ${port}!`)
);
