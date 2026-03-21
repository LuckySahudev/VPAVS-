require("dotenv").config();

const express = require("express");
const cors = require("cors");

const propertyRoutes = require("./routes/propertyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VPAVS Property API Running");
});

app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});