-- Database Schema for Task Prioritization System
-- This assumes the database `task_db` is already created.

CREATE DATABASE IF NOT EXISTS task_db;
USE task_db;

CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    deadline DATETIME,
    urgency INT NOT NULL,
    importance INT NOT NULL,
    effort INT NOT NULL,
    priority_score INT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL,
    user_id VARCHAR(255) NOT NULL
);

-- Note: The urgency, importance, and effort are generally on a 1-5 or 1-10 scale.
-- The priority_score is calculated as: (urgency * 2) + importance - effort
-- Supabase manages the user authentication, and the user_id from Supabase Auth
-- is stored in the tasks table to link tasks to specific users.
