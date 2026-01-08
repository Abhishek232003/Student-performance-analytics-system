
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
