package com.hospital.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.CancelAppointmentRequest;
import com.hospital.dto.CancelAppointmentResponse;
import com.hospital.dto.CreateAppointmentRequest;
import com.hospital.dto.CreateAppointmentResponse;
import com.hospital.dto.DoctorSearchRequest;
import com.hospital.dto.DoctorSearchResponse;
import com.hospital.dto.FindAppointmentRequest;
import com.hospital.dto.FindAppointmentResponse;
import com.hospital.repositories.AppointmentRepository;

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