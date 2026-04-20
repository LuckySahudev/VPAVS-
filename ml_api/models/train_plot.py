"""
train_plot.py
─────────────
Trains a Random Forest model on plot + sector data
fetched live from your Render API.

Run once (or whenever you add new properties):
    python3 models/train_plot.py

Saves model to: models/saved/plot_model.pkl
"""

import pickle
import numpy as np
import os
import sys
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from data.fetch_data import fetch_sectors, fetch_plot

# ─────────────────────────────────────────────────────────
# ADD ALL YOUR PLOT IDs HERE
# ─────────────────────────────────────────────────────────
PLOT_IDS = [
    "P001","P002","P003","P004","P005","P006","P007","P008","P009","P010",
    "P011","P012","P013","P014","P015","P016","P017","P018","P019","P020",
    "P021","P022","P023","P024","P025","P026","P027","P028","P029","P030",
    "P031","P032","P033","P034","P035","P036","P037","P038","P039","P040",
    "P041","P042","P043","P044","P045","P046","P047","P048","P049","P050",
    "P051","P052","P053","P054","P055","P056","P057","P058","P059","P060",
    "P061","P062","P063","P064","P065","P066","P067","P068","P069","P070",
    "P071","P072","P073","P074","P075","P076","P077","P078","P079","P080",
    "P081","P082","P083","P084","P085","P086","P087","P088","P089","P090",
    "P091","P092","P093","P094","P095","P096","P097","P098","P099","P100",
    "P101","P102","P103","P104","P105","P106","P107","P108","P109","P110",
    "P111","P112","P113","P114","P115","P116","P117","P118","P119","P120",
    "P121","P122","P123","P124","P125","P126","P127","P128","P129","P130",
    "P131","P132","P133","P134","P135","P136","P137","P138","P139","P140",
    "P141","P142","P143","P144","P145","P146","P147","P148","P149","P150"
    # keep adding all your plot IDs here
]

# ── Encoding maps ─────────────────────────────────────────
LAND_MAP   = {"residential": 2, "commercial": 1, "mixed": 0}
FACING_MAP = {"East": 1, "West": 2, "North": 3, "South": 4}
SOIL_MAP   = {"normal": 2, "clay": 1, "rocky": 0}
REG_MAP    = {"clear": 2, "pending": 1, "disputed": 0}


def build_features(plot, sector, years_ahead=0):
    """
    Build feature vector. Must match predict_plot.py exactly.
    """
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


def build_training_data():
    """
    Fetch all plots + sectors and build X (features) and y (prices).
    Generates synthetic future samples (years 1–5) per property.
    """
    print("Fetching sector data...")
    all_sectors = fetch_sectors()
    if isinstance(all_sectors, dict) and "data" in all_sectors:
        all_sectors = all_sectors["data"]

    sector_map = {str(s.get("sector")): s for s in all_sectors}

    X, y    = [], []
    success = 0
    failed  = 0

    for pid in PLOT_IDS:
        try:
            print(f"  Fetching plot: {pid}")
            plot   = fetch_plot(pid)
            sector = sector_map.get(str(plot.get("sector")), {})
            price  = float(plot.get("price", 0))

            if price <= 0:
                print(f"  Skipping {pid} — price is 0")
                continue

            # Current year (years_ahead = 0)
            X.append(build_features(plot, sector, years_ahead=0))
            y.append(price)

            # Synthetic future — plots typically grow ~10% per year
            for yr in range(1, 6):
                future_price = price * ((1.10) ** yr)
                X.append(build_features(plot, sector, years_ahead=yr))
                y.append(future_price)

            success += 1

        except Exception as e:
            print(f"  Skipping {pid}: {e}")
            failed += 1

    print(f"\nData ready: {success} plots fetched, {failed} skipped")
    print(f"Total training samples: {len(X)}")
    return np.array(X), np.array(y)


def train():
    print("=" * 50)
    print("   PLOT MODEL — RANDOM FOREST TRAINING")
    print("=" * 50)

    X, y = build_training_data()

    if len(X) < 5:
        print("\nERROR: Not enough data to train. Add more plot IDs.")
        sys.exit(1)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"\nTraining on {len(X_train)} samples...")

    # ── Random Forest Model ───────────────────────────
    model = RandomForestRegressor(
        n_estimators=300,      # 300 trees
        max_depth=12,          # prevents overfitting
        min_samples_split=3,
        min_samples_leaf=2,
        max_features="sqrt",
        random_state=42,
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
    save_path = os.path.join(save_dir, "plot_model.pkl")
    os.makedirs(save_dir, exist_ok=True)

    with open(save_path, "wb") as f:
        pickle.dump(model, f)

    print(f"\nModel saved → {save_path}")
    print("=" * 50)


if __name__ == "__main__":
    train()
