"""
predict_house.py
────────────────
Fetches house + sector data from the live Render API,
then uses a trained Random Forest model to predict
property price year-by-year for the next 5 years.

Usage:
    python3 predict_house.py h101
"""

import pickle
import numpy as np
import sys
import json
import os
from datetime import datetime

# Allow imports from sibling folders
sys.path.append(os.path.dirname(__file__))
from data.fetch_data import fetch_house, fetch_sector_by_id

# ── Path to saved model ───────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "saved", "house_model.pkl")


# ── Encoding maps (must match training) ──────────────────
FURNISHED_MAP = {"furnished": 2, "semi-furnished": 1, "unfurnished": 0}
FACING_MAP    = {"East": 1, "West": 2, "North": 3, "South": 4}
REG_MAP       = {"clear": 2, "pending": 1, "disputed": 0}
PARKING_MAP   = {"available": 1, "not available": 0}


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. "
            "Please run: python3 models/train_house.py"
        )
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)


def prepare_house_features(house, sector, target_year):
    """
    Build a flat feature vector from house + sector dictionaries.
    Order must exactly match the order used during training.
    """
    current_year = datetime.now().year
    years_ahead  = target_year - current_year

    construction_year = house.get("construction_year")
    try:
        property_age = current_year - int(str(construction_year)[:4])
    except Exception:
        property_age = 0

    return [
        # ── House features ─────────────────────────────
        float(house.get("area_sqft", 0)),
        float(house.get("bhk", 0)),
        float(house.get("floors", 0)),
        float(house.get("bathrooms", 0)),
        float(house.get("balcony", 0)),
        float(house.get("front_road_width_ft", 0)),
        float(house.get("distance_from_main_road_km", 0)),
        float(property_age),
        float(1 if house.get("corner_property") else 0),
        float(1 if house.get("loan_approved") else 0),
        float(PARKING_MAP.get(house.get("parking_available", "not available"), 0)),
        float(FURNISHED_MAP.get(house.get("furnished_status", "unfurnished"), 0)),
        float(FACING_MAP.get(house.get("facing", "East"), 1)),
        float(REG_MAP.get(house.get("registration_status", "pending"), 1)),

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


def predict_house_5_years(house_id):
    """
    Main prediction function.
    Returns a dict with year-by-year predictions for 5 years.
    """
    model        = load_model()
    house        = fetch_house(house_id)
    sector       = fetch_sector_by_id(house["sector"])
    current_year = datetime.now().year
    base_price   = float(house.get("price", 1))
    predictions  = []

    for i in range(1, 6):
        target_year = current_year + i
        features    = prepare_house_features(house, sector, target_year)
        predicted   = float(model.predict([features])[0])

        growth = round(((predicted - base_price) / base_price) * 100, 2)

        predictions.append({
            "year": target_year,
            "predicted_price": round(predicted, 2),
            "growth_percent": growth,
        })

    return {
        "type": "house",
        "property_id": house_id,
        "sector": house.get("sector"),
        "bhk": house.get("bhk"),
        "area_sqft": house.get("area_sqft"),
        "furnished_status": house.get("furnished_status"),
        "floors": house.get("floors"),
        "current_price": base_price,
        "currency": "INR",
        "predictions": predictions,
    }


# ── Entry point ───────────────────────────────────────────
if __name__ == "__main__":
    house_id = sys.argv[1] if len(sys.argv) > 1 else "h101"
    try:
        result = predict_house_5_years(house_id)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
