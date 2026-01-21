package com.hospital.controllers;

import com.hospital.dto.DoctorAppointmentResponse;
import com.hospital.repositories.DoctorAppointmentsRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorAppointmentsController {

    private final DoctorAppointmentsRepository repo;

    public DoctorAppointmentsController(DoctorAppointmentsRepository repo) {
        this.repo = repo;
    }

    // GET /api/doctors/{doctorId}/appointments/today
@GetMapping("/{doctorId}/appointments/today")
public List<DoctorAppointmentResponse> today(@PathVariable long doctorId) {
    return repo.getDoctorAppointmentsOnDate(doctorId, LocalDate.now());
}


    // (opsiyonel) GET /api/doctors/{doctorId}/appointments?date=2026-01-21
    @GetMapping("/{doctorId}/appointments")
    public List<DoctorAppointmentResponse> onDate(@PathVariable long doctorId,
                                                  @RequestParam String date) {
        return repo.getDoctorAppointmentsOnDate(doctorId, LocalDate.parse(date));
    }
}
