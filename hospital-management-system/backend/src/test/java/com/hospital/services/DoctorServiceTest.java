package com.hospital.services;

import com.hospital.models.Doctor;
import com.hospital.repositories.DoctorRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class DoctorServiceTest {

    @Test
    void getAll_withoutDepartment_returnsAll() {
        DoctorRepository repo = Mockito.mock(DoctorRepository.class);
        Mockito.when(repo.findAll()).thenReturn(List.of(new Doctor(), new Doctor()));

        DoctorService service = new DoctorService(repo);

        assertEquals(2, service.getAll(null).size());
    }

    @Test
    void getById_existingDoctor_returnsDoctor() {
        DoctorRepository repo = Mockito.mock(DoctorRepository.class);
        Doctor d = new Doctor();
        d.setDoctorId(5L);

        Mockito.when(repo.findById(5L)).thenReturn(Optional.of(d));

        DoctorService service = new DoctorService(repo);

        assertEquals(5L, service.getById(5L).getDoctorId());
    }
}
