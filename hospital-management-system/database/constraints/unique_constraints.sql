-- Unique Constraints

ALTER TABLE patients
ADD CONSTRAINT uq_patient_email UNIQUE (email);

ALTER TABLE doctors
ADD CONSTRAINT uq_doctor_email UNIQUE (email);

ALTER TABLE branches
ADD CONSTRAINT uq_branch_name UNIQUE (branch_name);

ALTER TABLE departments
ADD CONSTRAINT uq_department_branch UNIQUE (department_name, branch_id);
