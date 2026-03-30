const db = require("../config/db");

// get sectors
exports.getSectors = async () => {
  const [rows] = await db.query("SELECT * FROM sector_details");
  return rows;
};

// get specific sector 
exports.getSectorById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM sector_details WHERE id = ?",
    [id]
  );
  return rows[0];
};

// house by id
exports.getHouseById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM house_details WHERE id = ?",
    [id]
  );
  return rows;
};

// plot by id
exports.getPlotById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM plot_details WHERE id = ?",
    [id]
  );
  return rows;
};

// house by bhk
exports.getHouseByBhk = async (bhk) => {
  const [rows] = await db.query(
    "SELECT * FROM house_details WHERE bhk = ?",
    [bhk]
  );
  return rows;
};

// plot range
exports.getPlotByRange = async (min, max) => {
  const [rows] = await db.query(
    "SELECT * FROM plot_details WHERE area_sqft BETWEEN ? AND ?",
    [min, max]
  );
  return rows;
};

// house price range
exports.getHouseByPriceRange = async (min, max) => {
  const [rows] = await db.query(
    "SELECT * FROM house_details WHERE price BETWEEN ? AND ?",
    [min, max]
  );
  return rows;
};