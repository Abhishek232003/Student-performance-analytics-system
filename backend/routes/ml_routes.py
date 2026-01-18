from flask import Blueprint, request, jsonify
from services.ml_service import predict_risk

ml_bp = Blueprint("ml", __name__)

@ml_bp.route("/predict", methods=["POST"])
def predict():
    data = request.json
    risk = predict_risk(data)
    return jsonify({"risk_level": risk})
