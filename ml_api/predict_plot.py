"""
predict_plot.py
───────────────
Fetches plot + sector data from the live Render API,
then uses a trained Random Forest model to predict
property price year-by-year for the next 5 years.

Usage:
    python3 predict_plot.py p004
"""

import pickle
import numpy as np
import sys
import json
import os
from datetime import datetime

sys.path.append(os.path.dirname(__file__))
from data.fetch_data import fetch_plot, fetch_sector_by_id

# ── Path to saved model ───────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "saved", "plot_model.pkl")


# ── Encoding maps (must match training) ──────────────────
LAND_MAP   = {"residential": 2, "commercial": 1, "mixed": 0}
FACING_MAP = {"East": 1, "West": 2, "North": 3, "South": 4}
SOIL_MAP   = {"normal": 2, "clay": 1, "rocky": 0}
REG_MAP    = {"clear": 2, "pending": 1, "disputed": 0}


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. "
            "Please run: python3 models/train_plot.py"
        )
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)


def prepare_plot_features(plot, sector, target_year):
    """
    Build a flat feature vector from plot + sector dictionaries.
    Order must exactly match the order used during training.
    """
    current_year = datetime.now().year
    years_ahead  = target_year - current_year

    return [
        # ── Plot features ──────────────────────────────
        float(plot.get("area_sqft", 0)),
        float(plot.get("front_road_width_ft", 0)),
        float(plot.get("distance_from_main_road_km", 0)),
        float(1 if plot.get("corner_property") else 0),
        float(1 if plot.get("boundary_wall") else 0),
        float(1 if plot.get("loan_approved") else 0),
        float(LAND_MAP.get(plot.get("land_type", "mixed"), 0)),
        float(FACING_MAP.get(plot.get("facing", "East"), 1)),
        float(SOIL_MAP.get(plot.get("soil_type", "normal"), 2)),
        float(REG_MAP.get(plot.get("registration_status", "pending"), 1)),

        # ── Sector features ────────────────────────────
        float(sector.get("average_income_level", 0)),
        float(sector.get("population_density", 0)),
        float(sector.get("rental_demand", 0)),
        float(sector.get("transaction_volume", 0)),
        float(sector.get("nearby_metro_distance_km", 0)),
        float(sector.get("national_highway_distance_km", 0)),
        float(sector.get("railway_station_distance_km", 0)),
        float(sector.get("nearest_hospital_distance_km", 0)),
        float(sector.get("nearest_mall_distance_km", 0)),
        float(sector.get("nearest_college_distance_km", 0)),
        float(sector.get("industrial_rating", 0)),
        float(sector.get("pollution_rate", 0)),
        float(sector.get("crime_rate", 0)),
        float(sector.get("traffic_rate", 0)),
        float(sector.get("sports_club_rating", 0)),
        float(sector.get("private_clinic_rating", 0)),
        float(sector.get("active_government_projects", 0)),
        float(sector.get("future_government_projects", 0)),
        float(sector.get("average_property_price_per_sqft", 0)),

        # ── Time feature ───────────────────────────────
        float(years_ahead),
    ]


def predict_plot_5_years(plot_id):
    """
    Main prediction function.
    Returns a dict with year-by-year predictions for 5 years.
    """
    model        = load_model()
    plot         = fetch_plot(plot_id)
    sector       = fetch_sector_by_id(plot["sector"])
    current_year = datetime.now().year
    base_price   = float(plot.get("price", 1))
    predictions  = []

    for i in range(1, 6):
        target_year = current_year + i
        features    = prepare_plot_features(plot, sector, target_year)
        predicted   = float(model.predict([features])[0])

        growth = round(((predicted - base_price) / base_price) * 100, 2)

        predictions.append({
            "year": target_year,
            "predicted_price": round(predicted, 2),
            "growth_percent": growth,
        })

    return {
        "type": "plot",
        "property_id": plot_id,
        "sector": plot.get("sector"),
        "area_sqft": plot.get("area_sqft"),
        "land_type": plot.get("land_type"),
        "soil_type": plot.get("soil_type"),
        "facing": plot.get("facing"),
        "current_price": base_price,
        "currency": "INR",
        "predictions": predictions,
    }


# ── Entry point ───────────────────────────────────────────
if __name__ == "__main__":
    plot_id = sys.argv[1] if len(sys.argv) > 1 else "p004"
    try:
        result = predict_plot_5_years(plot_id)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
