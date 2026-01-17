# Deployment Guide

## Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

## Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update database credentials in `.env`

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm start
   ```

## Database Setup

1. Create the database:
   ```sql
   CREATE DATABASE hospital_db;
   ```

2. Run migrations (handled automatically by Flyway)

## Production Deployment
- Configure production environment variables
- Build frontend: `npm run build`
- Package backend: `mvn package`
