import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

/* configuration */

dotenv.config();
let app = express();

/* routes */

/* database connection setup */

let port = 8000 || process.env.PORT;

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`server live at port ${port}`);
    });
  })
  .catch((error) => {
    console.log("database connection is failed", error);
  });
