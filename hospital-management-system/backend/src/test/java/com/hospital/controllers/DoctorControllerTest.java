package com.hospital.controllers;

import com.hospital.services.DoctorService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DoctorController.class)
public class DoctorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DoctorService doctorService;

    @Test
    void getAllDoctors_shouldReturn200() throws Exception {
        Mockito.when(doctorService.getAll(null))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/doctors").with(user("test").roles("USER")))
            .andExpect(status().isOk());

    }
}
