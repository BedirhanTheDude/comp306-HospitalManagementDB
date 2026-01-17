-- Trigger: Appointment Audit
-- Logs changes to appointments table

-- First, create the audit table
CREATE TABLE IF NOT EXISTS appointment_audit (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    action VARCHAR(10),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100)
);

DELIMITER //

CREATE TRIGGER trg_appointment_audit_update
AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO appointment_audit (appointment_id, action, old_status, new_status)
        VALUES (NEW.appointment_id, 'UPDATE', OLD.status, NEW.status);
    END IF;
END //

DELIMITER ;
