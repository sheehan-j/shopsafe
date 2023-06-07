const express = require("express");
const app = express();
const PORT = 6202;
const morgan = require("morgan");
require("dotenv").config();

// Set up HTTP rewquest logger
app.use(morgan("dev"));

// Handle urlencoded data (built-in middleware)
app.use(express.urlencoded({ extended: false }));

// Use built-in middleware for handling JSON
app.use(express.json());

// Routes
// app.use("/search", require("./routes/search"));

// TODO: Eventually wrap this with once DB conn is established
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
