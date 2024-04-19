import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";

/* configuration */

dotenv.config();
let app = express();
app.use(express.json());

/* routes */

app.use("/api", authRouter);

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
