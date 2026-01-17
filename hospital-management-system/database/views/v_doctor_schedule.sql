-- View: Doctor Schedule
-- Shows doctor's appointment schedule

CREATE OR REPLACE VIEW v_doctor_schedule AS
SELECT
    d.doctor_id,
    CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
    d.specialization,
    dep.department_name,
    a.appointment_id,
    a.appointment_date,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    a.status,
    a.notes
FROM doctors d
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
LEFT JOIN patients p ON a.patient_id = p.patient_id
LEFT JOIN departments dep ON d.department_id = dep.department_id
ORDER BY d.doctor_id, a.appointment_date;
