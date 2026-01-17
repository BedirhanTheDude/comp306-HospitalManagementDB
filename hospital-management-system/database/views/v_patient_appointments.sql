-- View: Patient Appointments
-- Shows patient appointments with doctor information

CREATE OR REPLACE VIEW v_patient_appointments AS
SELECT
    a.appointment_id,
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.email AS patient_email,
    d.doctor_id,
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    d.specialization,
    a.appointment_date,
    a.status,
    a.notes
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id;
