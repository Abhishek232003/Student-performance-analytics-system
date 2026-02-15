from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.request_routes import request_bp
from routes.announcement_routes import announcement_bp


load_dotenv()

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(student_bp, url_prefix="/api/students")
app.register_blueprint(request_bp, url_prefix="/api/requests")
app.register_blueprint(announcement_bp, url_prefix="/api/announcements")




@app.route("/")
def home():
    return {"status": "Backend running"}

if __name__ == "__main__":
    app.run(debug=True)
