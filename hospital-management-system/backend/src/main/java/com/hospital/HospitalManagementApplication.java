package com.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.hospital.repositories")
@EntityScan(basePackages = "com.hospital.models")
public class HospitalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
    }
}
