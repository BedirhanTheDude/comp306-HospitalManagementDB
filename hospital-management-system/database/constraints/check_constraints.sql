-- Check Constraints

ALTER TABLE appointments
ADD CONSTRAINT chk_appointment_status
CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show'));

ALTER TABLE patients
ADD CONSTRAINT chk_patient_email
CHECK (email LIKE '%@%.%');

ALTER TABLE doctors
ADD CONSTRAINT chk_doctor_email
CHECK (email LIKE '%@%.%');
