import joblib
import os

# Path to the ML model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "../ml/student_risk_model.pkl"
)

# Load the trained model
model = joblib.load(MODEL_PATH)

def predict_risk(data):
    features = [[
        data["attendance"],
        data["internal_marks"],
        data["assignment"],
        data["behavior"]
    ]]

    probability = model.predict_proba(features)[0][1]

    if probability < 0.33:
        risk_level = "Low"
    elif probability < 0.50:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return {
        "probability": round(probability, 2),
        "risk_level": risk_level
    }



   
