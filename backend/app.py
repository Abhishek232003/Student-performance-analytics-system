
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.request_routes import request_bp
from routes.announcement_routes import announcement_bp
from routes.calendar import calendar_bp
from routes.teacher_routes import teacher_bp
from routes.student_portal_routes import student_portal_bp
from routes.llm_routes import llm_bp


load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# Register routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(student_bp, url_prefix="/api/students")
app.register_blueprint(request_bp, url_prefix="/api/requests")
app.register_blueprint(announcement_bp, url_prefix="/api/announcements")
app.register_blueprint(calendar_bp, url_prefix="/api/calendar")
app.register_blueprint(teacher_bp, url_prefix="/teacher")
app.register_blueprint(student_portal_bp, url_prefix="/student")
app.register_blueprint(llm_bp, url_prefix="/api/llm")




@app.route("/")
def home():
    return {"status": "Backend running"}

if __name__ == "__main__":
    app.run(debug=True)
