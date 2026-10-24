package com.careerconnect.config;

import com.careerconnect.entity.Company;
import com.careerconnect.entity.Job;
import com.careerconnect.entity.User;
import com.careerconnect.repository.CompanyRepository;
import com.careerconnect.repository.JobRepository;
import com.careerconnect.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            if (jobRepository.count() > 0) {
                logger.info("Database already seeded with job data. Skipping initial seeding.");
                return;
            }

            logger.info("Initializing database with demo users, companies, and jobs...");

            // 1. Seed Users
            User recruiter = userRepository.findByEmail("recruiter@example.com").orElseGet(() -> {
                User u = new User();
                u.setName("Sarah Jenkins");
                u.setEmail("recruiter@example.com");
                u.setPassword(passwordEncoder.encode("password123"));
                u.setRole("ROLE_RECRUITER");
                u.setHeadline("Lead Technical Recruiter at CloudSphere Tech");
                u.setPhone("+1 (555) 234-5678");
                u.setBio("Passionate tech recruiter connecting world-class engineering talent with cutting-edge tech companies.");
                return userRepository.save(u);
            });

            User seeker = userRepository.findByEmail("jobseeker@example.com").orElseGet(() -> {
                User u = new User();
                u.setName("Alex Rivera");
                u.setEmail("jobseeker@example.com");
                u.setPassword(passwordEncoder.encode("password123"));
                u.setRole("ROLE_JOB_SEEKER");
                u.setHeadline("Senior Full-Stack Developer | React & Spring Boot Specialist");
                u.setPhone("+1 (555) 876-5432");
                u.setBio("Software engineer with 5+ years building scalable cloud applications, REST APIs, and responsive web experiences.");
                u.setSkills("React, Java, Spring Boot, PostgreSQL, TypeScript, Docker, RESTful APIs");
                u.setResumeUrl("https://example.com/resumes/alex-rivera.pdf");
                return userRepository.save(u);
            });

            // Admin user
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setName("CareerConnect Administrator");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
            }

            // 2. Seed Companies
            Company cloudSphere = companyRepository.findByNameIgnoreCase("CloudSphere Technologies").orElseGet(() -> {
                Company c = new Company();
                c.setName("CloudSphere Technologies");
                c.setDescription("Pioneering enterprise cloud orchestration, distributed architectures, and AI-driven automation.");
                c.setWebsite("https://cloudsphere.example.com");
                c.setLocation("San Francisco, CA");
                c.setLogoUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80");
                c.setIndustry("Cloud Computing & Enterprise Software");
                c.setCompanySize("500-1000 employees");
                return companyRepository.save(c);
            });

            Company apexFintech = companyRepository.findByNameIgnoreCase("Apex FinTech Solutions").orElseGet(() -> {
                Company c = new Company();
                c.setName("Apex FinTech Solutions");
                c.setDescription("Next-generation financial infrastructure powering frictionless digital banking and real-time algorithmic clearing.");
                c.setWebsite("https://apexfintech.example.com");
                c.setLocation("New York, NY");
                c.setLogoUrl("https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80");
                c.setIndustry("Financial Technology");
                c.setCompanySize("1000+ employees");
                return companyRepository.save(c);
            });

            Company healthPulse = companyRepository.findByNameIgnoreCase("HealthPulse Innovations").orElseGet(() -> {
                Company c = new Company();
                c.setName("HealthPulse Innovations");
                c.setDescription("Transforming healthcare analytics, clinical telemedicine, and patient diagnosis through intelligent software.");
                c.setWebsite("https://healthpulse.example.com");
                c.setLocation("Boston, MA");
                c.setLogoUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80");
                c.setIndustry("HealthTech & BioInformatics");
                c.setCompanySize("200-500 employees");
                return companyRepository.save(c);
            });

            Company nextGenAi = companyRepository.findByNameIgnoreCase("NextGen Robotics & AI").orElseGet(() -> {
                Company c = new Company();
                c.setName("NextGen Robotics & AI");
                c.setDescription("Building autonomous warehouse robotics and vision AI pipelines for global logistics.");
                c.setWebsite("https://nextgenrobotics.example.com");
                c.setLocation("Austin, TX");
                c.setLogoUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=128&auto=format&fit=crop&q=80");
                c.setIndustry("Artificial Intelligence & Robotics");
                c.setCompanySize("50-200 employees");
                return companyRepository.save(c);
            });

            Company quantumCyber = companyRepository.findByNameIgnoreCase("Quantum CyberSecurity").orElseGet(() -> {
                Company c = new Company();
                c.setName("Quantum CyberSecurity");
                c.setDescription("Zero-trust cybersecurity defenses and continuous cloud posture protection for Fortune 500 enterprises.");
                c.setWebsite("https://quantumcyber.example.com");
                c.setLocation("Remote (Global)");
                c.setLogoUrl("https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80");
                c.setIndustry("Cybersecurity");
                c.setCompanySize("100-250 employees");
                return companyRepository.save(c);
            });

            // 3. Seed Jobs
            Job j1 = new Job();
            j1.setTitle("Senior Full-Stack Engineer (React & Java)");
            j1.setCompany(cloudSphere);
            j1.setPostedBy(recruiter);
            j1.setLocation("San Francisco, CA (Hybrid)");
            j1.setJobType("FULL_TIME");
            j1.setExperienceLevel("SENIOR_LEVEL");
            j1.setSalaryMin(140000.0);
            j1.setSalaryMax(185000.0);
            j1.setCurrency("USD");
            j1.setSkills("Java 17, Spring Boot, React, TypeScript, PostgreSQL, Docker, AWS");
            j1.setDeadline(LocalDate.now().plusDays(45));
            j1.setStatus("OPEN");
            j1.setDescription("We are seeking an experienced Full-Stack Engineer to lead the design and implementation of our next-generation cloud management platform. You will work across the entire stack, from reactive UI components in React to robust high-throughput microservices built with Java Spring Boot and PostgreSQL.");
            j1.setRequirements("- 5+ years of software engineering experience.\n- Deep expertise in Java 17, Spring Boot, and JPA/Hibernate.\n- Proficiency in modern React, state management, and modern CSS.\n- Experience designing resilient RESTful APIs and PostgreSQL databases.\n- Familiarity with CI/CD and Docker containerization.");
            j1.setResponsibilities("- Architect and implement full-stack features from conception to production.\n- Collaborate with product managers and designers to craft intuitive developer tools.\n- Mentor junior and mid-level developers through thorough code reviews.\n- Optimize application throughput, latency, and query performance.");
            jobRepository.save(j1);

            Job j2 = new Job();
            j2.setTitle("Frontend React Developer");
            j2.setCompany(healthPulse);
            j2.setPostedBy(recruiter);
            j2.setLocation("Remote");
            j2.setJobType("REMOTE");
            j2.setExperienceLevel("MID_LEVEL");
            j2.setSalaryMin(110000.0);
            j2.setSalaryMax(140000.0);
            j2.setCurrency("USD");
            j2.setSkills("React, JavaScript, HTML5, CSS3, Vite, Tailwind CSS, REST APIs");
            j2.setDeadline(LocalDate.now().plusDays(30));
            j2.setStatus("OPEN");
            j2.setDescription("HealthPulse is on a mission to modernize clinical telemedicine. We are looking for a dedicated Frontend Developer passionate about crafting pixel-perfect, accessible, and ultra-fast web user interfaces in React.");
            j2.setRequirements("- 3+ years experience with React and modern frontend ecosystems.\n- Strong fluency in responsive CSS, flexbox, grid, and semantic HTML.\n- Proven track record consuming RESTful endpoints with Axios or Fetch.\n- Strong understanding of web accessibility (WCAG 2.1) and UI performance.");
            j2.setResponsibilities("- Develop intuitive patient and provider dashboards in React.\n- Build reusable component libraries and responsive views.\n- Coordinate closely with UX designers to refine interaction workflows.");
            jobRepository.save(j2);

            Job j3 = new Job();
            j3.setTitle("Backend Microservices Engineer (Spring Boot)");
            j3.setCompany(apexFintech);
            j3.setPostedBy(recruiter);
            j3.setLocation("New York, NY");
            j3.setJobType("FULL_TIME");
            j3.setExperienceLevel("SENIOR_LEVEL");
            j3.setSalaryMin(150000.0);
            j3.setSalaryMax(195000.0);
            j3.setCurrency("USD");
            j3.setSkills("Java, Spring Boot, PostgreSQL, Kafka, Microservices, Redis, JUnit");
            j3.setDeadline(LocalDate.now().plusDays(60));
            j3.setStatus("OPEN");
            j3.setDescription("Join our core banking engineering group to build ultra-low-latency transaction processing services. You will design, develop, and scale mission-critical payment services handling millions of transactions daily.");
            j3.setRequirements("- 5+ years of backend Java development experience.\n- Mastery of Spring Boot, Spring Data JPA, and transaction isolation levels.\n- Deep knowledge of relational database schema design and SQL query tuning in PostgreSQL.\n- Familiarity with event-driven distributed architectures using Kafka or RabbitMQ.");
            j3.setResponsibilities("- Design robust, fault-tolerant transaction processing pipelines.\n- Write comprehensive unit, integration, and load tests.\n- Participate in on-call rotations and diagnose production issues.");
            jobRepository.save(j3);

            Job j4 = new Job();
            j4.setTitle("DevOps & Cloud Systems Engineer");
            j4.setCompany(nextGenAi);
            j4.setPostedBy(recruiter);
            j4.setLocation("Austin, TX (Hybrid)");
            j4.setJobType("FULL_TIME");
            j4.setExperienceLevel("MID_LEVEL");
            j4.setSalaryMin(125000.0);
            j4.setSalaryMax(160000.0);
            j4.setCurrency("USD");
            j4.setSkills("Kubernetes, Docker, Terraform, AWS, Linux, GitHub Actions, Prometheus");
            j4.setDeadline(LocalDate.now().plusDays(40));
            j4.setStatus("OPEN");
            j4.setDescription("NextGen Robotics is expanding our autonomous logistics infrastructure. We need a talented DevOps Engineer to manage Kubernetes clusters, automate deployment pipelines, and guarantee 99.99% uptime.");
            j4.setRequirements("- 3+ years managing production workloads on AWS or GCP.\n- Hands-on experience with Kubernetes, Helm, and Docker containerization.\n- Infrastructure as code expertise using Terraform.\n- Proficiency in writing CI/CD automation scripts.");
            j4.setResponsibilities("- Maintain and scale container clusters for AI model inference.\n- Automate zero-downtime rolling deployments and blue/green rollouts.\n- Set up comprehensive monitoring, alerting, and log aggregation.");
            jobRepository.save(j4);

            Job j5 = new Job();
            j5.setTitle("Cloud Security Specialist");
            j5.setCompany(quantumCyber);
            j5.setPostedBy(recruiter);
            j5.setLocation("Remote");
            j5.setJobType("REMOTE");
            j5.setExperienceLevel("LEAD");
            j5.setSalaryMin(165000.0);
            j5.setSalaryMax(210000.0);
            j5.setCurrency("USD");
            j5.setSkills("Cloud Security, IAM, SIEM, Penetration Testing, OWASP, Python");
            j5.setDeadline(LocalDate.now().plusDays(50));
            j5.setStatus("OPEN");
            j5.setDescription("Lead our cloud defense team defending global enterprises against sophisticated zero-day threats. You will evaluate cloud postures, implement rigorous IAM security policies, and automate vulnerability scanning.");
            j5.setRequirements("- 6+ years in information security, threat hunting, or cloud security.\n- In-depth understanding of OWASP Top 10, TLS/SSL, and cryptographic standards.\n- CISSP, AWS Certified Security, or equivalent certification is a plus.");
            j5.setResponsibilities("- Lead vulnerability assessments and red-team penetration simulations.\n- Architect multi-account IAM role boundaries and least-privilege policies.\n- Formulate incident response playbooks and guide emergency response teams.");
            jobRepository.save(j5);

            Job j6 = new Job();
            j6.setTitle("Junior Software Engineer (Web & APIs)");
            j6.setCompany(cloudSphere);
            j6.setPostedBy(recruiter);
            j6.setLocation("San Francisco, CA");
            j6.setJobType("FULL_TIME");
            j6.setExperienceLevel("ENTRY_LEVEL");
            j6.setSalaryMin(80000.0);
            j6.setSalaryMax(105000.0);
            j6.setCurrency("USD");
            j6.setSkills("Java, JavaScript, React, SQL, Git, REST");
            j6.setDeadline(LocalDate.now().plusDays(35));
            j6.setStatus("OPEN");
            j6.setDescription("Launch your engineering career at CloudSphere! We provide hands-on mentorship, pairing sessions, and direct ownership of meaningful platform features.");
            j6.setRequirements("- Degree in Computer Science, bootcamp graduate, or equivalent practical project experience.\n- Foundational programming knowledge in Java, Python, or JavaScript.\n- Eagerness to learn modern web frameworks (React, Spring Boot) and database modeling.");
            j6.setResponsibilities("- Implement bug fixes, unit tests, and user-facing features under senior mentorship.\n- Participate in daily standups, code reviews, and sprint retrospectives.");
            jobRepository.save(j6);

            logger.info("Successfully initialized demo data: 3 users, 5 companies, and 6 diverse jobs!");

        } catch (Exception e) {
            logger.error("Failed to seed initial database data: {}", e.getMessage(), e);
        }
    }
}
