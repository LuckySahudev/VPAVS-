const db = require("../config/db");

// get all sectors
const getSectors = (callback) => {
  const sql = "SELECT * FROM sector_details";
  db.query(sql, callback);
};

// get house by id
const getHouseById = (id, callback) => {
  const sql = "SELECT * FROM house_details WHERE id = ?";
  db.query(sql, [id], callback);
};

// get plot by id
const getPlotById = (id, callback) => {
  const sql = "SELECT * FROM plot_details WHERE id = ?";
  db.query(sql, [id], callback);
};

// get houses by bhk
const getHouseByBhk = (bhk, callback) => {
  const sql = "SELECT * FROM house_details WHERE bhk = ?";
  db.query(sql, [bhk], callback);
};

// get plots by area range
const getPlotByRange = (min, max, callback) => {
  const sql = "SELECT * FROM plot_details WHERE area_sqft BETWEEN ? AND ?";
  db.query(sql, [min, max], callback);
};

// get houses by price range
const getHouseByPriceRange = (min, max, callback) => {
  const sql = "SELECT * FROM house_details WHERE price BETWEEN ? AND ?";
  db.query(sql, [min, max], callback);
};

module.exports = {
  getSectors,
  getHouseById,
  getPlotById,
  getHouseByBhk,
  getPlotByRange,
  getHouseByPriceRange
};