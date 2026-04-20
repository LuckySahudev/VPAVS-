import requests

BASE_URL = "https://vpavs.onrender.com/api/properties"


def fetch_sectors():
    """Fetch all sector details from API"""
    res = requests.get(f"{BASE_URL}/sectors")
    res.raise_for_status()
    return res.json()


def fetch_sector_by_id(sector_id):
    """Find a specific sector from all sectors list"""
    sectors = fetch_sectors()
    # Handle both list and dict responses
    if isinstance(sectors, dict) and "data" in sectors:
        sectors = sectors["data"]
    for s in sectors:
        if str(s.get("sector")) == str(sector_id):
            return s
    raise Exception(f"Sector {sector_id} not found")


def fetch_house(house_id):
    """Fetch house details by ID — e.g. h101"""
    res = requests.get(f"{BASE_URL}/house/{house_id}")
    res.raise_for_status()
    data = res.json()
    # Handle wrapped response like { data: {...} }
    if isinstance(data, dict) and "data" in data:
        return data["data"]
    return data


def fetch_plot(plot_id):
    """Fetch plot details by ID — e.g. p004"""
    res = requests.get(f"{BASE_URL}/plot/{plot_id}")
    res.raise_for_status()
    data = res.json()
    if isinstance(data, dict) and "data" in data:
        return data["data"]
    return data
