const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/propertyController");

// sectors
router.get("/sectors", propertyController.getSectors);

// house by id
router.get("/house/:id", propertyController.getHouseById);

// plot by id
router.get("/plot/:id", propertyController.getPlotById);

// house by bhk
router.get("/house/bhk/:bhk", propertyController.getHouseByBhk);

// plot by area range
router.get("/plots/range", propertyController.getPlotByRange);

// house price range
router.get("/houses/range", propertyController.getHouseByPriceRange);

module.exports = router;