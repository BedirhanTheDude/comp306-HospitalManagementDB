# Database Design

## Overview
The hospital management system uses a relational database (MySQL) to store all data.

## Tables

### patients
Stores patient information including personal details and contact information.

### doctors
Stores doctor information including specialization and department assignment.

### appointments
Stores appointment records linking patients and doctors.

### branches
Stores hospital branch locations.

### departments
Stores department information within each branch.

## Relationships
- Doctors belong to Departments (many-to-one)
- Departments belong to Branches (many-to-one)
- Appointments link Patients and Doctors (many-to-many through appointments)

## ER Diagram
See `database/schema/er_diagram.png` for visual representation.
