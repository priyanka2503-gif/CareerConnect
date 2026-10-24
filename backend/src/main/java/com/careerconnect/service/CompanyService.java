package com.careerconnect.service;

import com.careerconnect.dto.CompanyRequest;
import com.careerconnect.entity.Company;
import com.careerconnect.exception.BadRequestException;
import com.careerconnect.exception.ResourceNotFoundException;
import com.careerconnect.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    @Transactional
    public Company createCompany(CompanyRequest request) {
        if (companyRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Company with name '" + request.getName() + "' already exists");
        }

        Company company = new Company();
        company.setName(request.getName().trim());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setLogoUrl(request.getLogoUrl());
        company.setIndustry(request.getIndustry());
        company.setCompanySize(request.getCompanySize());

        return companyRepository.save(company);
    }

    @Transactional
    public Company findOrCreateCompany(Long companyId, String companyName, String companyWebsite, String companyLogoUrl) {
        if (companyId != null) {
            return getCompanyById(companyId);
        }

        if (companyName != null && !companyName.isBlank()) {
            return companyRepository.findByNameIgnoreCase(companyName.trim())
                    .orElseGet(() -> {
                        Company newComp = new Company();
                        newComp.setName(companyName.trim());
                        newComp.setWebsite(companyWebsite);
                        newComp.setLogoUrl(companyLogoUrl);
                        return companyRepository.save(newComp);
                    });
        }

        throw new BadRequestException("Company ID or Company Name must be provided");
    }
}
