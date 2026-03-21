require("dotenv").config();

const express = require("express");
const cors = require("cors");

// IMPORTANT
const db = require("./config/db");

const propertyRoutes = require("./routes/propertyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});