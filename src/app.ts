import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import randomWords from "random-spanish-words"

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB()

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", userRoutes);

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});