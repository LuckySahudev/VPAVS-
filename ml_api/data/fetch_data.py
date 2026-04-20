import requests

BASE_URL = "https://vpavs.onrender.com/api/properties"


# ─────────────────────────────────────────────
# Fetch all sectors
# ─────────────────────────────────────────────
def fetch_sectors():
    res = requests.get(f"{BASE_URL}/sectors")
    res.raise_for_status()
    data = res.json()

    if isinstance(data, dict) and "data" in data:
        return data["data"]

    return data


# ─────────────────────────────────────────────
# Fetch sector by ID
# ─────────────────────────────────────────────
def fetch_sector_by_id(sector_id):
    sectors = fetch_sectors()

    for s in sectors:
        if str(s.get("sector")) == str(sector_id):
            return s

    raise Exception(f"Sector {sector_id} not found")


# ─────────────────────────────────────────────
# Fetch house by ID
# ─────────────────────────────────────────────
def fetch_house(house_id):
    res = requests.get(f"{BASE_URL}/house/{house_id}")
    res.raise_for_status()
    data = res.json()

    # unwrap { data: [...] }
    if isinstance(data, dict) and "data" in data:
        data = data["data"]

    # if list → return first item
    if isinstance(data, list):
        if len(data) == 0:
            raise Exception(f"House {house_id} not found")
        return data[0]

    return data


# ─────────────────────────────────────────────
# Fetch plot by ID
# ─────────────────────────────────────────────
def fetch_plot(plot_id):
    res = requests.get(f"{BASE_URL}/plot/{plot_id}")
    res.raise_for_status()
    data = res.json()

    if isinstance(data, dict) and "data" in data:
        data = data["data"]

    if isinstance(data, list):
        if len(data) == 0:
            raise Exception(f"Plot {plot_id} not found")
        return data[0]

    return data