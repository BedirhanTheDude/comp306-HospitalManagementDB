package com.hospital.controllers;

import com.hospital.dto.*;
import com.hospital.repositories.AppointmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import com.hospital.dto.CancelAppointmentRequest;
import com.hospital.dto.CancelAppointmentResponse;
import com.hospital.dto.CreateAppointmentRequest;
import com.hospital.dto.CreateAppointmentResponse;
import com.hospital.dto.DoctorSearchRequest;
import com.hospital.dto.DoctorSearchResponse;
import com.hospital.dto.FindAppointmentRequest;
import com.hospital.dto.FindAppointmentResponse;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @PostMapping("/search/doctors")
    public ResponseEntity<List<DoctorSearchResponse>> searchDoctors(@RequestBody DoctorSearchRequest request) {
        return ResponseEntity.ok(AppointmentRepository.searchDoctor(request));
    }

    @PostMapping("/create")
    public ResponseEntity<CreateAppointmentResponse> makeAppointment(@RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.ok(AppointmentRepository.createAppointment(request));
    }

    @PostMapping("/cancel")
    public ResponseEntity<CancelAppointmentResponse> cancelAppointment(@RequestBody CancelAppointmentRequest request) {
        return ResponseEntity.ok(AppointmentRepository.cancelAppointment(request));
    }

    @PostMapping("/calendar")
    public ResponseEntity<List<FindAppointmentResponse>> findAppointments(@RequestBody FindAppointmentRequest request) {
        return ResponseEntity.ok(AppointmentRepository.findAppointments(request));
    }

    @PostMapping("/slots")
    public ResponseEntity<List<FindAvailableTimeSlotResponse>> findAvailableSlots(@RequestBody FindAvailableTimeSlotRequest request) {
        return ResponseEntity.ok(AppointmentRepository.findAvailableTimeSlots(request));
    }
}
