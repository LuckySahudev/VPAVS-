const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/propertyController");

router.get("/sectors/:id", propertyController.getSectorById);

router.get("/sectors", propertyController.getSectors);

router.get("/house/:id", propertyController.getHouseById);

router.get("/plot/:id", propertyController.getPlotById);

router.get("/house/bhk/:bhk", propertyController.getHouseByBhk);

router.get("/plots/range", propertyController.getPlotByRange);

router.get("/houses/range", propertyController.getHouseByPriceRange);

module.exports = router;