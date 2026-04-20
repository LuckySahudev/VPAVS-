"""
train_house.py
──────────────
Trains a Random Forest model on house + sector data
fetched live from your Render API.

Run once (or whenever you add new properties):
    python3 models/train_house.py

Saves model to: models/saved/house_model.pkl
"""

import pickle
import numpy as np
import os
import sys
from datetime import datetime

# Allow import from parent ml/ directory
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from data.fetch_data import fetch_sectors, fetch_house

# ─────────────────────────────────────────────────────────
# ADD ALL YOUR HOUSE IDs HERE
# The more IDs you add, the better the model learns
# ─────────────────────────────────────────────────────────
HOUSE_IDS = [
    
    "2H001","2H002","2H003","2H004","2H005","2H006","2H007","2H008","2H009","2H010",
    "2H011","2H012","2H013","2H014","2H015","2H016","2H017","2H018","2H019","2H020",
    "2H021","2H022","2H023","2H024","2H025","2H026","2H027","2H028","2H029","2H030",
    "2H031","2H032","2H033","2H034","2H035","2H036","2H037","2H038","2H039","2H040",
    "2H041","2H042","2H043","2H044","2H045","2H046","2H047","2H048","2H049","2H050",
    "3H051","3H052","3H053","3H054","3H055","3H056","3H057","3H058","3H059","3H060",
    "3H061","3H062","3H063","3H064","3H065","3H066","3H067","3H068","3H069","3H070",
    "3H071","3H072","3H073","3H074","3H075","3H076","3H077","3H078","3H079","3H080",
    "3H081","3H082","3H083","3H084","3H085","3H086","3H087","3H088","3H089","3H090",
    "3H091","3H092","3H093","3H094","3H095","3H096","3H097","3H098","3H099","3H100"
    # keep adding all your house IDs here
]

# ── Encoding maps ─────────────────────────────────────────
FURNISHED_MAP = {"furnished": 2, "semi-furnished": 1, "unfurnished": 0}
FACING_MAP    = {"East": 1, "West": 2, "North": 3, "South": 4}
REG_MAP       = {"clear": 2, "pending": 1, "disputed": 0}
PARKING_MAP   = {"available": 1, "not available": 0}


def build_features(house, sector, years_ahead=0):
    """
    Build feature vector. Must match predict_house.py exactly.
    """
    current_year = datetime.now().year

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


def build_training_data():
    """
    Fetch all houses + sectors and build X (features) and y (prices).
    Also generates synthetic future samples (years 1–5) per property
    so the model learns time-based growth patterns.
    """
    print("Fetching sector data...")
    all_sectors = fetch_sectors()
    if isinstance(all_sectors, dict) and "data" in all_sectors:
        all_sectors = all_sectors["data"]

    # Build sector lookup by sector ID
    sector_map = {str(s.get("sector")): s for s in all_sectors}

    X, y = [], []
    success = 0
    failed  = 0

    for hid in HOUSE_IDS:
        try:
            print(f"  Fetching house: {hid}")
            house  = fetch_house(hid)
            sector = sector_map.get(str(house.get("sector")), {})
            price  = float(house.get("price", 0))

            if price <= 0:
                print(f"  Skipping {hid} — price is 0")
                continue

            # Current year (years_ahead = 0)
            X.append(build_features(house, sector, years_ahead=0))
            y.append(price)

            # Synthetic future samples with ~8% annual growth
            # This teaches the model time-based price increase
            for yr in range(1, 6):
                future_price = price * ((1.08) ** yr)
                X.append(build_features(house, sector, years_ahead=yr))
                y.append(future_price)

            success += 1

        except Exception as e:
            print(f"  Skipping {hid}: {e}")
            failed += 1

    print(f"\nData ready: {success} properties fetched, {failed} skipped")
    print(f"Total training samples: {len(X)}")
    return np.array(X), np.array(y)


def train():
    print("=" * 50)
    print("   HOUSE MODEL — RANDOM FOREST TRAINING")
    print("=" * 50)

    X, y = build_training_data()

    if len(X) < 5:
        print("\nERROR: Not enough data to train. Add more house IDs.")
        sys.exit(1)

    # Split into train / test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"\nTraining on {len(X_train)} samples...")

    # ── Random Forest Model ───────────────────────────
    model = RandomForestRegressor(
        n_estimators=300,      # 300 trees — good balance of speed vs accuracy
        max_depth=12,          # prevents overfitting on small datasets
        min_samples_split=3,   # minimum samples to split a node
        min_samples_leaf=2,    # minimum samples at a leaf node
        max_features="sqrt",   # use sqrt(features) at each split
        random_state=42,       # reproducible results
        n_jobs=-1,             # use all CPU cores
    )

    model.fit(X_train, y_train)

    # ── Evaluate ──────────────────────────────────────
    preds = model.predict(X_test)
    mae   = mean_absolute_error(y_test, preds)
    r2    = r2_score(y_test, preds)

    print(f"\nModel Performance:")
    print(f"  MAE (Mean Absolute Error) : ₹{mae:,.0f}")
    print(f"  R² Score                  : {r2:.4f}  (1.0 = perfect)")

    # ── Save model ────────────────────────────────────
    save_dir  = os.path.join(os.path.dirname(__file__), "saved")
    save_path = os.path.join(save_dir, "house_model.pkl")
    os.makedirs(save_dir, exist_ok=True)

    with open(save_path, "wb") as f:
        pickle.dump(model, f)

    print(f"\nModel saved → {save_path}")
    print("=" * 50)


if __name__ == "__main__":
    train()
