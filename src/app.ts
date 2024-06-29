import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB()

app.use("/api", userRoutes);
app.use("/api", authRoutes);

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});