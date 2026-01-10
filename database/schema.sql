
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL
);

CREATE TABLE Teachers (
  teacher_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department VARCHAR(50),
  year INT,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Academic_records (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject VARCHAR(50),
  marks INT,
  attendance INT,
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

CREATE TABLE Ml_predictions (
  prediction_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  risk_level ENUM('Low', 'Medium', 'High'),
  predicted_on DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

CREATE TABLE Courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(150) NOT NULL,
  subject VARCHAR(50),
  difficulty_level ENUM('Beginner','Intermediate','Advanced'),
  description TEXT
);

CREATE TABLE Student_course_recommendations (
  rec_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  reason TEXT,
  recommended_on DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

CREATE TABLE Agent_interactions (
  interaction_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role ENUM('student','teacher'),
  query TEXT,
  response TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Alerts_log (
  alert_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  alert_type VARCHAR(50),
  message TEXT,
  sent_on DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

ALTER TABLE Academic_records
ADD CHECK (marks BETWEEN 0 AND 100),
ADD CHECK (attendance BETWEEN 0 AND 100);

CREATE INDEX idx_academic_student ON Academic_records(student_id);
CREATE INDEX idx_ml_student ON Ml_predictions(student_id);
CREATE INDEX idx_rec_student ON Student_course_recommendations(student_id);
CREATE INDEX idx_alert_student ON Alerts_log(student_id);

