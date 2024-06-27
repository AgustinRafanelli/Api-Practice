import express from "express";
const app = express();
import mongoose from "mongoose";
const port = 3000;
mongoose
  .connect("mongodb://127.0.0.1/manteca")
  .catch((error) => console.log(error));

import Models  from "./db"


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
