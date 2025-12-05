import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { MongoDB } from "../src/Infrastructure/database/mongodbconnection";
import authRoutes from "../src/Presentation/routes/authroute";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MongoDB.connect();
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
