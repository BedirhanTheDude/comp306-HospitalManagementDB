#!/bin/bash
# Data Import Script

echo "Importing seed data..."

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-password}"
DB_NAME="${DB_NAME:-hospital_db}"

# Import seed data
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < ../backend/src/main/resources/db/seed/seed_data.sql

echo "Data import complete!"
