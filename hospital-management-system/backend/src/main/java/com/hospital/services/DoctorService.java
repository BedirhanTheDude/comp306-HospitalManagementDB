package com.hospital.services;

import com.hospital.exceptions.ResourceNotFoundException;
import com.hospital.models.Doctor;
import com.hospital.repositories.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;


import java.util.List;

@Profile("jpa")
@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAll(Long departmentId) {
        if (departmentId != null) {
            return doctorRepository.findByDepartmentId(departmentId);
        }
        return doctorRepository.findAll();
    }

    public Doctor getById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
    }

    public Doctor create(Doctor doctor) {
        // mini validation
        if (doctor.getFirstName() == null || doctor.getLastName() == null) {
            throw new IllegalArgumentException("firstName and lastName are required");
        }
        if (doctor.getEmail() != null && doctorRepository.existsByEmail(doctor.getEmail())) {
            throw new IllegalArgumentException("email already in use");
        }
        return doctorRepository.save(doctor);
    }

    public Doctor update(Long id, Doctor updated) {
        Doctor existing = getById(id);

        if (updated.getFirstName() != null) existing.setFirstName(updated.getFirstName());
        if (updated.getLastName() != null) existing.setLastName(updated.getLastName());
        if (updated.getSpecialization() != null) existing.setSpecialization(updated.getSpecialization());
        if (updated.getDepartmentId() != null) existing.setDepartmentId(updated.getDepartmentId());

        // email update (istersen kapat da çakışmasın)
        if (updated.getEmail() != null && !updated.getEmail().equals(existing.getEmail())) {
            if (doctorRepository.existsByEmail(updated.getEmail())) {
                throw new IllegalArgumentException("email already in use");
            }
            existing.setEmail(updated.getEmail());
        }

        return doctorRepository.save(existing);
    }

    public void delete(Long id) {
        Doctor existing = getById(id);
        doctorRepository.delete(existing);
    }
}
