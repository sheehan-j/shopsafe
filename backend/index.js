import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./config/firebase-config.js";
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
// app.use("/search", require("./routes/search"));
app.get("/", (req, res) => {
	res.send("working fine");
});

app.get("/user", async (req, res) => {
	const email = req.query?.email;
	console.log(email);

	try {
		const user = await auth.getUserByEmail(email);
		return res.status(200).json({ exists: true, email: user.email });
	} catch (err) {
		return res.status(200).json({ exists: false, error: err.message });
	}
});

// TODO: Eventually wrap this with once DB conn is established
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
