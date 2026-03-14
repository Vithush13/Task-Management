
-- Mini Task Management System - Complete MySQL Schema

-- Create Database
DROP DATABASE IF EXISTS task_management_db;
CREATE DATABASE task_management_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE task_management_db;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tasks

CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    due_date DATE,
    completed_at TIMESTAMP NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_tasks_user_id (user_id),
    INDEX idx_tasks_status (status),
    INDEX idx_tasks_priority (priority),
    INDEX idx_tasks_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@taskmanagement.com', '$2a$10$rJk0CQnXmQYqQYqQYqQYqO', 'System Administrator', 'ADMIN');


INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('john.doe', 'john@example.com', '$2a$10$rJk0CQnXmQYqQYqQYqQYqO', 'John Doe', 'USER'),
('jane.smith', 'jane@example.com', '$2a$10$rJk0CQnXmQYqQYqQYqQYqO', 'Jane Smith', 'USER');

-- Insert Sample Tasks

INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES
-- Admin's tasks
('Setup Project Infrastructure', 'Initialize Spring Boot and Next.js projects', 'DONE', 'HIGH', DATE_ADD(CURDATE(), INTERVAL -5 DAY), 1),
('Review Code Quality', 'Conduct code review for all team members', 'IN_PROGRESS', 'HIGH', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1),

-- John's tasks
('Complete Login Feature', 'Implement JWT authentication for frontend', 'DONE', 'HIGH', DATE_ADD(CURDATE(), INTERVAL -2 DAY), 2),
('Implement Task CRUD', 'Create REST APIs for task management', 'IN_PROGRESS', 'HIGH', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2),
('Write Unit Tests', 'Achieve 80% code coverage', 'TODO', 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 2),

-- Jane's tasks
('Design UI Components', 'Create reusable React components', 'DONE', 'HIGH', DATE_ADD(CURDATE(), INTERVAL -3 DAY), 3),
('Add Filtering', 'Implement task filtering by status and priority', 'IN_PROGRESS', 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 3);


SELECT 'Database created successfully!' AS 'Status';
SELECT CONCAT('Total Users: ', COUNT(*)) AS 'Summary' FROM users;
SELECT CONCAT('Total Tasks: ', COUNT(*)) AS 'Summary' FROM tasks;

-- Show sample data
SELECT '--- Users ---' AS '';
SELECT id, username, email, role FROM users;
SELECT '--- Tasks ---' AS '';
SELECT t.id, t.title, u.username, t.status, t.priority 
FROM tasks t
JOIN users u ON t.id = u.id;