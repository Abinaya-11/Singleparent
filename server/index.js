import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ This line must pass a router
app.use("/login", authRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));
