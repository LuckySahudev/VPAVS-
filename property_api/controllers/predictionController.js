  /**
 * predictionController.js
 * ────────────────────────
 * Calls Python ML scripts and returns 5-year price predictions.
 *
 * Routes:
 *   GET /api/predict/house/:id   → predict_house.py
 *   GET /api/predict/plot/:id    → predict_plot.py
 */

const { spawn } = require("child_process");
const path = require("path");

// Path to your ml/ directory (relative to controllers/)
const ML_DIR = path.join(__dirname, "../ml");

/**
 * Spawn a Python script and return its JSON output.
 * @param {string} scriptName  - filename inside ml/ (e.g. predict_house.py)
 * @param {string} propertyId  - property ID passed as CLI argument
 */
const runPythonScript = (scriptName, propertyId) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(ML_DIR, scriptName);

    const python = spawn("python3", [scriptPath, propertyId], {
      cwd: ML_DIR, // run from ml/ so relative imports work
    });

    let output = "";
    let errOut = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errOut += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(errOut || "Python script failed"));
      }
      try {
        const parsed = JSON.parse(output.trim());
        if (parsed.error) return reject(new Error(parsed.error));
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON response from Python script"));
      }
    });
  });
};

/**
 * GET /api/predict/house/:id
 * Predict house price for next 5 years
 */
const predictHouse = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "House ID is required" });
  }

  try {
    const result = await runPythonScript("predict_house.py", id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(`[predictHouse] Error for ${id}:`, err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/predict/plot/:id
 * Predict plot price for next 5 years
 */
const predictPlot = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Plot ID is required" });
  }

  try {
    const result = await runPythonScript("predict_plot.py", id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(`[predictPlot] Error for ${id}:`, err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { predictHouse, predictPlot };
