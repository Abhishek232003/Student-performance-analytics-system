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
    """
    Predict student risk using trained ML model
    """

    features = [[
        data["attendance"],
        data["internal_marks"],
        data["assignment"],
        data["behavior"]
    ]]

   # Get probability of High Risk (class = 1)
probability = model.predict_proba(features)[0][1]

# Convert probability to risk level
if probability < 0.33:
    risk_level = "Low"
elif probability < 0.66:
    risk_level = "Medium"
else:
    risk_level = "High"

    return {
       "probability": round(probability, 2),
       "risk_level": risk_level
}



   
