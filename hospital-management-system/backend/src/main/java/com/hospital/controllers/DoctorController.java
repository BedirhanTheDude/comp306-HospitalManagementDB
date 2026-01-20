package com.hospital.controllers;

import com.hospital.models.Doctor;
import com.hospital.services.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // GET /api/doctors OR /api/doctors?departmentId=3
    @GetMapping
    public List<Doctor> getAll(@RequestParam(required = false) Long departmentId) {
        return doctorService.getAll(departmentId);
    }

    // GET /api/doctors/5
    @GetMapping("/{id}")
    public Doctor getById(@PathVariable Long id) {
        return doctorService.getById(id);
    }

    // POST /api/doctors
    @PostMapping
    public Doctor create(@RequestBody Doctor doctor) {
        return doctorService.create(doctor);
    }

    // PUT /api/doctors/5
    @PutMapping("/{id}")
    public Doctor update(@PathVariable Long id, @RequestBody Doctor doctor) {
        return doctorService.update(id, doctor);
    }

    // DELETE /api/doctors/5
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        doctorService.delete(id);
    }
}
