const propertyModel = require("../models/propertyModel");

// sectors
exports.getSectors = (req, res) => {
  propertyModel.getSectors((err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// house by id
exports.getHouseById = (req, res) => {
  const id = req.params.id;

  propertyModel.getHouseById(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// plot by id
exports.getPlotById = (req, res) => {
  const id = req.params.id;

  propertyModel.getPlotById(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// house by bhk
exports.getHouseByBhk = (req, res) => {
  const bhk = req.params.bhk;

  propertyModel.getHouseByBhk(bhk, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// plot range
exports.getPlotByRange = (req, res) => {
  const { min, max } = req.query;

  propertyModel.getPlotByRange(min, max, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// house price range
exports.getHouseByPriceRange = (req, res) => {
  const { min, max } = req.query;

  propertyModel.getHouseByPriceRange(min, max, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};