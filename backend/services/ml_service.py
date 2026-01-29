import joblib
import os

# Load model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "../ml/student_risk_model.pkl"
)
model = joblib.load(MODEL_PATH)

def predict_risk(data):
    features = [[
        data["attendance"],
        data["internal_marks"],
        data["assignment"],
        data["behavior"]
    ]]

    probability = model.predict_proba(features)[0][1]

    # Debug (optional – remove later)
    print("Probability =", probability)

    # ✅ FINAL THRESHOLDS (demo friendly)
    if probability < 0.30:
        risk_level = "Low"
    elif probability < 0.35:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return {
        "probability": round(probability, 2),
        "risk_level": risk_level
    }
