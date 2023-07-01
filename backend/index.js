import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { FIREBASE_AUTH } from "./config/firebase-config.js";
import usersRouter from "./routes/users.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Set up HTTP rewquest logger
app.use(morgan("dev"));

app.use(cors());

// Handle urlencoded data (built-in middleware)
app.use(express.urlencoded({ extended: false }));

// Use built-in middleware for handling JSON
app.use(express.json());

// Routes
app.use("/users", usersRouter);

// TODO: Eventually wrap this with once DB conn is established
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
