const propertyModel = require("../models/propertyModel");

// sectors
exports.getSectors = async (req, res) => {
  try {
    const result = await propertyModel.getSectors();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// house by id
exports.getHouseById = async (req, res) => {
  try {
    const result = await propertyModel.getHouseById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// plot by id
exports.getPlotById = async (req, res) => {
  try {
    const result = await propertyModel.getPlotById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// house by bhk
exports.getHouseByBhk = async (req, res) => {
  try {
    const result = await propertyModel.getHouseByBhk(req.params.bhk);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// plot range
exports.getPlotByRange = async (req, res) => {
  try {
    const { min, max } = req.query;
    const result = await propertyModel.getPlotByRange(min, max);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// house price range
exports.getHouseByPriceRange = async (req, res) => {
  try {
    const { min, max } = req.query;
    const result = await propertyModel.getHouseByPriceRange(min, max);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};