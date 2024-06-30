import express from "express";
import connectDB from "./config/db";
import apiRouter from "./routes"

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB()

app.use("/api", apiRouter);

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});