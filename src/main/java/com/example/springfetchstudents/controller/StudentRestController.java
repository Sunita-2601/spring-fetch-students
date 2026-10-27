package com.example.springfetchstudents.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:8080")
public class StudentRestController {

    private final Map<Long, StudentDto> store =
            Collections.synchronizedMap(new LinkedHashMap<>());

    private final AtomicLong idGen = new AtomicLong(1);

    public static class StudentDto {

        public Long id;
        public String rollNumber;
        public String firstName;
        public String lastName;
        public String email;

        public StudentDto() {
        }

        public StudentDto(Long id, String rollNumber, String firstName,
                          String lastName, String email) {
            this.id = id;
            this.rollNumber = rollNumber;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }
    }

    @GetMapping
    public List<StudentDto> list() {
        return new ArrayList<>(store.values());
    }

    @PostMapping
    public ResponseEntity<StudentDto> create(@RequestBody StudentDto input) {

        long id = idGen.getAndIncrement();

        StudentDto student = new StudentDto(
                id,
                input.rollNumber,
                input.firstName,
                input.lastName,
                input.email
        );

        store.put(id, student);

        return ResponseEntity.status(201).body(student);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        StudentDto removed = store.remove(id);

        if (removed == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}