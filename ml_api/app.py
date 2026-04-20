from fastapi import FastAPI
from predict_house import predict_house_5_years
from predict_plot import predict_plot_5_years

app = FastAPI()

@app.get("/")
def home():
    return {"message": "ML API running"}

@app.get("/predict/house/{house_id}")
def predict_house(house_id: str):
    try:
        return predict_house_5_years(house_id)
    except Exception as e:
        return {"error": str(e)}

@app.get("/predict/plot/{plot_id}")
def predict_plot(plot_id: str):
    try:
        return predict_plot_5_years(plot_id)
    except Exception as e:
        return {"error": str(e)}