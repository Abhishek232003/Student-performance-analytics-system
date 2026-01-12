import mysql.connector
import random

# ===============================
# DATABASE CONNECTION (EDIT)
# ===============================
db = mysql.connector.connect(
    host="mysql-10796400-studentperformanceanalytics.f.aivencloud.com",
    port=27484,
    user="avnadmin",
    password="AVNS_P7HV-YnQRdR_a_VbF6c",
    database="student_performance_system"
)

cursor = db.cursor()

# ===============================
# CONFIG
# ===============================
DEPARTMENTS = ["CSE", "ECE", "MECH"]
SUBJECTS = ["DBMS", "OS", "CN"]

# ===============================
# INSERT ONE TEACHER PER DEPT
# ===============================
for dept in DEPARTMENTS:
    cursor.execute(
        "INSERT INTO Users (name, email, password, role) VALUES (%s,%s,%s,%s)",
        (f"{dept}_Teacher", f"{dept.lower()}_teacher@test.com", "dummy_pwd", "teacher")
    )
    user_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO Teachers (user_id, department) VALUES (%s,%s)",
        (user_id, dept)
    )

print("✅ Teachers inserted (1 per department)")

# ===============================
# INSERT DUMMY STUDENTS
# ===============================
for i in range(1, 26):
    department = random.choice(DEPARTMENTS)

    cursor.execute(
        "INSERT INTO Users (name, email, password, role) VALUES (%s,%s,%s,%s)",
        (f"Student_{i}", f"student{i}@test.com", "dummy_pwd", "student")
    )
    user_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO Students (user_id, department, year) VALUES (%s,%s,%s)",
        (user_id, department, random.choice([2, 3, 4]))
    )
    student_id = cursor.lastrowid

    risk = random.choice(["Low", "Medium", "High"])

    for subject in SUBJECTS:
        if risk == "Low":
            marks = random.randint(70, 90)
            attendance = random.randint(80, 95)
        elif risk == "Medium":
            marks = random.randint(55, 65)
            attendance = random.randint(65, 75)
        else:
            marks = random.randint(40, 50)
            attendance = random.randint(50, 65)

        cursor.execute(
            """
            INSERT INTO Academic_records (student_id, subject, marks, attendance)
            VALUES (%s,%s,%s,%s)
            """,
            (student_id, subject, marks, attendance)
        )

print("✅ Dummy students + academic records inserted")

# ===============================
# INSERT COURSES
# ===============================
courses = [
    ("DBMS Basics", "DBMS", "Beginner", "DBMS fundamentals"),
    ("Advanced DBMS", "DBMS", "Advanced", "Indexes and optimization"),
    ("OS Crash Course", "OS", "Intermediate", "Operating systems"),
    ("CN Fundamentals", "CN", "Beginner", "Computer networks"),
    ("Study Skills Bootcamp", "General", "Intermediate", "Learning strategies")
]

for course in courses:
    cursor.execute(
        """
        INSERT INTO Courses (course_name, subject, difficulty_level, description)
        VALUES (%s,%s,%s,%s)
        """,
        course
    )

print("✅ Courses inserted")

db.commit()
cursor.close()
db.close()

print("\n🎉 DUMMY DATA SEEDING COMPLETED SUCCESSFULLY")
