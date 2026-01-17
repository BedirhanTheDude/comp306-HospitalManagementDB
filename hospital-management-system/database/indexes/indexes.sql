-- Database Indexes for Performance Optimization

-- Patient indexes
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);

-- Doctor indexes
CREATE INDEX idx_doctors_email ON doctors(email);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_department ON doctors(department_id);

-- Appointment indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Branch indexes
CREATE INDEX idx_branches_city ON branches(city);

-- Department indexes
CREATE INDEX idx_departments_branch ON departments(branch_id);
