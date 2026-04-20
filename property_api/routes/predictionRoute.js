/**
 * predictionRoute.js
 * ───────────────────
 * Routes for ML price prediction endpoints.
 *
 * Register in server.js:
 *   const predictionRoute = require('./routes/predictionRoute');
 *   app.use('/api/predict', predictionRoute);
 */

const router = require("express").Router();
const { predictHouse, predictPlot } = require("../controllers/predictionController");

// GET /api/predict/house/h101
router.get("/house/:id", predictHouse);

// GET /api/predict/plot/p004
router.get("/plot/:id", predictPlot);

module.exports = router;
