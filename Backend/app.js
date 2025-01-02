
import express from "express";

import { dbConnection } from "./Database/dbConnection.js";
import { main } from "./src/app.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

dotenv.config();
const app = express();
app.use(cors({
    origin: 'https://www.painfrei.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(passport.initialize());
app.use(morgan("dev"));
app.use(express.static("uploads"));

main(app);
dbConnection();
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${port}!`)
);
