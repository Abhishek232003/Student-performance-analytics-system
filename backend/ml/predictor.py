import joblib
import pandas as pd
from pathlib import Path

# Get path of this folder
BASE = Path(__file__).resolve().parent

# Load trained model and encoder
model = joblib.load(BASE / "student_risk_rf.pkl")
encoder = joblib.load(BASE / "risk_encoder.pkl")

def predict_risk(attendance, internal_marks, assignment, behavior):
    """
    Takes student data and returns predicted risk level.
    """

    data = pd.DataFrame([{
        "attendance": attendance,
        "internal_marks": internal_marks,
        "assignment": assignment,
        "behavior": behavior
    }])

    prediction = model.predict(data)
    label = encoder.inverse_transform(prediction)[0]

    return label
