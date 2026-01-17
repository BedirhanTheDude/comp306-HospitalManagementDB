-- Foreign Key Constraints

ALTER TABLE doctors
ADD CONSTRAINT fk_doctors_department
FOREIGN KEY (department_id) REFERENCES departments(department_id);

ALTER TABLE departments
ADD CONSTRAINT fk_departments_branch
FOREIGN KEY (branch_id) REFERENCES branches(branch_id);

ALTER TABLE appointments
ADD CONSTRAINT fk_appointments_patient
FOREIGN KEY (patient_id) REFERENCES patients(patient_id);

ALTER TABLE appointments
ADD CONSTRAINT fk_appointments_doctor
FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id);
