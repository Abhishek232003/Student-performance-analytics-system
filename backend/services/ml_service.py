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

    prediction = model.predict(features)
    return int(prediction[0])


   