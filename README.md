# Task Management Backend API

A robust and scalable REST API for task management applications built with Spring Boot 3 and JWT authentication.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Database Configuration](#database-configuration)
- [Steps to Run the Application](#steps-to-run-the-application)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)

## Project Overview

The Task Management Backend API is a powerful RESTful service designed to support task management applications. It provides secure user authentication, task management capabilities, and role-based access control.

### Key Features
- **User Authentication**: Secure JWT-based authentication system with login and registration
- **Task Management**: Complete CRUD operations for tasks with priority and status tracking
- **Role-Based Access**: USER, ADMIN, and MANAGER roles with different permissions
- **Data Persistence**: PostgreSQL database with JPA/Hibernate for reliable data storage
- **Security**: Password encryption using BCrypt and token-based authorization
- **Task Organization**: Priority levels (LOW, MEDIUM, HIGH, CRITICAL) and status tracking (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)

## Setup Instructions

### Prerequisites

Before you begin, ensure you have installed the following software:

| Software | Version | Download Link |
|----------|---------|---------------|
| Java JDK | 17 or higher | [Oracle JDK](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) |
| Maven | 3.9 or higher | [Apache Maven](https://maven.apache.org/download.cgi) |
| PostgreSQL | 15 or higher | [PostgreSQL](https://www.postgresql.org/download/) |
| Git | Latest | [Git](https://git-scm.com/downloads) |
| IDE (Optional) | Any | VS Code, IntelliJ IDEA, Eclipse |

### Installation Steps

#### 1. Clone the Repository
Open your terminal or command prompt and run:
```bash
git clone https://github.com/Vithush13/Task-management
cd task-management-backend