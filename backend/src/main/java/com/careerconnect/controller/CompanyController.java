package com.careerconnect.controller;

import com.careerconnect.dto.CompanyRequest;
import com.careerconnect.entity.Company;
import com.careerconnect.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_RECRUITER', 'ROLE_ADMIN', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<Company> createCompany(@Valid @RequestBody CompanyRequest request) {
        Company created = companyService.createCompany(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
