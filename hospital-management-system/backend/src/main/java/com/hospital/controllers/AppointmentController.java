package com.hospital.controllers;

import com.hospital.dto.*;
import com.hospital.repositories.AppointmentRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @PostMapping("/search/doctors")
    public List<DoctorSearchResponse> searchDoctors(@RequestBody DoctorSearchRequest request) {
        return AppointmentRepository.searchDoctor(request);
    }

    @PostMapping("/create")
    public CreateAppointmentResponse makeAppointment(@RequestBody CreateAppointmentRequest request) {
        return AppointmentRepository.createAppointment(request);
    }

    @PostMapping("/cancel")
    public CancelAppointmentResponse cancelAppointment(@RequestBody CancelAppointmentRequest request) {
        return AppointmentRepository.cancelAppointment(request);
    }

    @PostMapping("/calendar")
    public List<FindAppointmentResponse> findAppointments(@RequestBody FindAppointmentRequest request) {
        return AppointmentRepository.findAppointments(request);
    }
}
