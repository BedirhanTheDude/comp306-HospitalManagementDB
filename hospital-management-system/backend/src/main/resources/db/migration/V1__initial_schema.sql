-- V1: Initial Schema Migration
-- Hospital Management System Database Schema (Based on ER Diagram)

-- =============================================
-- 1. HOSPITAL_BRANCH TABLE
-- =============================================
CREATE TABLE HOSPITAL_BRANCH (
    bid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20)
);

-- =============================================
-- 2. POLICLINIC TABLE
-- =============================================
CREATE TABLE POLICLINIC (
    poid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    bid INT NOT NULL,
    FOREIGN KEY (bid) REFERENCES HOSPITAL_BRANCH(bid) ON DELETE CASCADE
);

-- =============================================
-- 3. USER TABLE
-- =============================================
CREATE TABLE USER (
    username VARCHAR(100) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('PATIENT', 'DOCTOR', 'EMPLOYEE', 'ADMIN') NOT NULL
);

-- =============================================
-- 4. PATIENT TABLE
-- =============================================
CREATE TABLE PATIENT (
    ssn VARCHAR(20) PRIMARY KEY,
    fullname VARCHAR(200) NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    phone VARCHAR(20),
    dob DATE NOT NULL
);

-- =============================================
-- 5. DOCTOR TABLE
-- =============================================
CREATE TABLE DOCTOR (
    did INT AUTO_INCREMENT PRIMARY KEY,
    ssn VARCHAR(20) NOT NULL UNIQUE,
    poid INT NOT NULL,
    username VARCHAR(100) UNIQUE,
    title VARCHAR(100),
    FOREIGN KEY (poid) REFERENCES POLICLINIC(poid) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES USER(username) ON DELETE SET NULL
);

-- =============================================
-- 6. EMPLOYEE TABLE
-- =============================================
CREATE TABLE EMPLOYEE (
    ssn VARCHAR(20) PRIMARY KEY,
    fullname VARCHAR(200) NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    role VARCHAR(100),
    baseSalary DECIMAL(10, 2),
    hireDate DATE,
    dob DATE,
    bid INT NOT NULL,
    FOREIGN KEY (bid) REFERENCES HOSPITAL_BRANCH(bid) ON DELETE CASCADE
);

-- =============================================
-- 7. DEPENDENT TABLE
-- =============================================
CREATE TABLE DEPENDENT (
    essn VARCHAR(20) NOT NULL,
    fullname VARCHAR(200) NOT NULL,
    dob DATE,
    relation VARCHAR(50),
    PRIMARY KEY (essn, fullname),
    FOREIGN KEY (essn) REFERENCES EMPLOYEE(ssn) ON DELETE CASCADE
);

-- =============================================
-- 8. PAYROLL TABLE
-- =============================================
CREATE TABLE PAYROLL (
    payId INT AUTO_INCREMENT PRIMARY KEY,
    month INT NOT NULL,
    year INT NOT NULL,
    gross DECIMAL(12, 2),
    bonus DECIMAL(12, 2) DEFAULT 0,
    net DECIMAL(12, 2),
    eId VARCHAR(20) NOT NULL,
    FOREIGN KEY (eId) REFERENCES EMPLOYEE(ssn) ON DELETE CASCADE
);

-- =============================================
-- 9. APPOINTMENT TABLE
-- =============================================
CREATE TABLE APPOINTMENT (
    aid INT AUTO_INCREMENT PRIMARY KEY,
    appt_datetime DATETIME NOT NULL,
    status ENUM('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    price DECIMAL(10, 2),
    pssn VARCHAR(20) NOT NULL,
    did INT NOT NULL,
    FOREIGN KEY (pssn) REFERENCES PATIENT(ssn) ON DELETE CASCADE,
    FOREIGN KEY (did) REFERENCES DOCTOR(did) ON DELETE CASCADE
);

-- =============================================
-- 10. OPERATION TABLE
-- =============================================
CREATE TABLE OPERATION (
    oid INT AUTO_INCREMENT PRIMARY KEY,
    scheduled_at DATETIME NOT NULL,
    op_type VARCHAR(100),
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    pssn VARCHAR(20) NOT NULL,
    did INT NOT NULL,
    FOREIGN KEY (pssn) REFERENCES PATIENT(ssn) ON DELETE CASCADE,
    FOREIGN KEY (did) REFERENCES DOCTOR(did) ON DELETE CASCADE
);

-- =============================================
-- 11. OPERATION_TEAM TABLE
-- =============================================
CREATE TABLE OPERATION_TEAM (
    otid INT AUTO_INCREMENT PRIMARY KEY,
    team_role VARCHAR(100),
    oid INT NOT NULL,
    FOREIGN KEY (oid) REFERENCES OPERATION(oid) ON DELETE CASCADE
);

-- =============================================
-- 12. PARTICIPATES TABLE (Doctor participates in Operation Team)
-- =============================================
CREATE TABLE PARTICIPATES (
    eid INT NOT NULL,
    otid INT NOT NULL,
    PRIMARY KEY (eid, otid),
    FOREIGN KEY (otid) REFERENCES OPERATION_TEAM(otid) ON DELETE CASCADE
);

-- =============================================
-- 13. MEDICAL_REPORT TABLE
-- =============================================
CREATE TABLE MEDICAL_REPORT (
    mrid INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    notes TEXT,
    did INT NOT NULL,
    FOREIGN KEY (did) REFERENCES DOCTOR(did) ON DELETE CASCADE
);

-- =============================================
-- 14. PRESCRIPTION TABLE
-- =============================================
CREATE TABLE PRESCRIPTION (
    prid INT AUTO_INCREMENT PRIMARY KEY,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    mrid INT NOT NULL,
    FOREIGN KEY (mrid) REFERENCES MEDICAL_REPORT(mrid) ON DELETE CASCADE
);

-- =============================================
-- 15. MEDICATION TABLE
-- =============================================
CREATE TABLE MEDICATION (
    mid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    unit VARCHAR(50),
    is_controlled BOOLEAN DEFAULT FALSE
);

-- =============================================
-- 16. PRESCRIPTION_ITEM TABLE
-- =============================================
CREATE TABLE PRESCRIPTION_ITEM (
    pitem_id INT AUTO_INCREMENT PRIMARY KEY,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    days INT,
    prid INT NOT NULL,
    mid INT NOT NULL,
    FOREIGN KEY (prid) REFERENCES PRESCRIPTION(prid) ON DELETE CASCADE,
    FOREIGN KEY (mid) REFERENCES MEDICATION(mid) ON DELETE CASCADE
);

-- =============================================
-- 17. TEST_TYPE TABLE
-- =============================================
CREATE TABLE TEST_TYPE (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    unit VARCHAR(50),
    min_ref DECIMAL(10, 4),
    max_ref DECIMAL(10, 4)
);

-- =============================================
-- 18. TEST_RESULT TABLE
-- =============================================
CREATE TABLE TEST_RESULT (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(10, 4),
    measured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    type_id INT NOT NULL,
    pssn VARCHAR(20) NOT NULL,
    FOREIGN KEY (type_id) REFERENCES TEST_TYPE(type_id) ON DELETE CASCADE,
    FOREIGN KEY (pssn) REFERENCES PATIENT(ssn) ON DELETE CASCADE
);

-- =============================================
-- 19. CHECKUP TABLE
-- =============================================
CREATE TABLE CHECKUP (
    cid INT AUTO_INCREMENT PRIMARY KEY,
    performed_on DATE NOT NULL,
    pssn VARCHAR(20) NOT NULL,
    FOREIGN KEY (pssn) REFERENCES PATIENT(ssn) ON DELETE CASCADE
);

-- =============================================
-- 20. CHECKUP_TEST TABLE (Many-to-Many: Checkup - Test_Result)
-- =============================================
CREATE TABLE CHECKUP_TEST (
    test_id INT NOT NULL,
    cid INT NOT NULL,
    PRIMARY KEY (test_id, cid),
    FOREIGN KEY (test_id) REFERENCES TEST_RESULT(test_id) ON DELETE CASCADE,
    FOREIGN KEY (cid) REFERENCES CHECKUP(cid) ON DELETE CASCADE
);

-- =============================================
-- 21. REVIEW TABLE
-- =============================================
CREATE TABLE REVIEW (
    rid INT AUTO_INCREMENT PRIMARY KEY,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    pssn VARCHAR(20) NOT NULL,
    did INT NOT NULL,
    aid INT NOT NULL,
    FOREIGN KEY (pssn) REFERENCES PATIENT(ssn) ON DELETE CASCADE,
    FOREIGN KEY (did) REFERENCES DOCTOR(did) ON DELETE CASCADE,
    FOREIGN KEY (aid) REFERENCES APPOINTMENT(aid) ON DELETE CASCADE
);
