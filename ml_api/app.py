from fastapi import FastAPI
from predict_house import predict_house_5_years
from predict_plot import predict_plot_5_years
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app = FastAPI()

# ✅ CORS BLOCK HERE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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