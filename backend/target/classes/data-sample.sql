-- ====================================================================
-- CareerConnect Sample Job & Company SQL Data for PostgreSQL / pgAdmin
-- ====================================================================

-- Demo Companies
INSERT INTO companies (id, name, description, website, location, logo_url, industry, company_size, created_at)
VALUES 
(1, 'CloudSphere Technologies', 'Enterprise cloud orchestration, distributed architectures, and AI-driven automation.', 'https://cloudsphere.example.com', 'San Francisco, CA', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80', 'Cloud Computing', '500-1000 employees', NOW())
ON CONFLICT (name) DO NOTHING;

INSERT INTO companies (id, name, description, website, location, logo_url, industry, company_size, created_at)
VALUES 
(2, 'Apex FinTech Solutions', 'Next-generation financial infrastructure powering digital banking and real-time clearing.', 'https://apexfintech.example.com', 'New York, NY', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80', 'Financial Technology', '1000+ employees', NOW())
ON CONFLICT (name) DO NOTHING;

INSERT INTO companies (id, name, description, website, location, logo_url, industry, company_size, created_at)
VALUES 
(3, 'HealthPulse Innovations', 'Modernizing clinical telemedicine and digital healthcare analytics.', 'https://healthpulse.example.com', 'Boston, MA', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80', 'HealthTech', '200-500 employees', NOW())
ON CONFLICT (name) DO NOTHING;

-- Demo Users (Passwords are BCrypt encoded for 'password123')
-- $2a$10$eACCYoNOHEqgkVE8aGY2..eZ2i8aQf7mG1YgW9h4o5Q6w0k7/mJm2
INSERT INTO users (id, name, email, password, role, headline, phone, bio, skills, resume_url, created_at, updated_at)
VALUES
(1, 'Sarah Jenkins', 'recruiter@example.com', '$2a$10$Dow1jVq2p5Hh7X6o47eLweuJd7NskqO9J6K/2g4H6tI9M5P1Q8u.2', 'ROLE_RECRUITER', 'Lead Technical Recruiter at CloudSphere Tech', '+1 (555) 234-5678', 'Passionate tech recruiter connecting world-class engineering talent.', NULL, NULL, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, password, role, headline, phone, bio, skills, resume_url, created_at, updated_at)
VALUES
(2, 'Alex Rivera', 'jobseeker@example.com', '$2a$10$Dow1jVq2p5Hh7X6o47eLweuJd7NskqO9J6K/2g4H6tI9M5P1Q8u.2', 'ROLE_JOB_SEEKER', 'Senior Full-Stack Developer (React / Spring Boot)', '+1 (555) 876-5432', 'Full-stack software engineer with 5+ years experience building cloud applications.', 'React, Java, Spring Boot, PostgreSQL, Docker', 'https://example.com/resumes/alex-rivera.pdf', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Demo Jobs
INSERT INTO jobs (id, title, description, requirements, responsibilities, location, job_type, experience_level, salary_min, salary_max, currency, skills, deadline, status, posted_by_id, company_id, created_at, updated_at)
VALUES
(1, 'Senior Full-Stack Engineer (React & Java)', 'Lead development of next-gen cloud platform across React and Spring Boot.', '5+ years experience with Java and React.', 'Architect features, lead code reviews, mentor juniors.', 'San Francisco, CA (Hybrid)', 'FULL_TIME', 'SENIOR_LEVEL', 140000, 185000, 'USD', 'Java 17, Spring Boot, React, PostgreSQL, AWS', CURRENT_DATE + 30, 'OPEN', 1, 1, NOW(), NOW()),
(2, 'Frontend React Developer', 'Craft pixel-perfect, accessible, and fast web user interfaces in React.', '3+ years with React and modern CSS.', 'Develop telemedicine web dashboards and component systems.', 'Remote', 'REMOTE', 'MID_LEVEL', 110000, 140000, 'USD', 'React, JavaScript, HTML5, CSS3, Vite, Tailwind CSS', CURRENT_DATE + 45, 'OPEN', 1, 3, NOW(), NOW()),
(3, 'Backend Microservices Engineer (Spring Boot)', 'Design, develop, and scale high-throughput payment transaction pipelines.', '5+ years Java and Spring Data JPA.', 'Implement transaction processing and event pipelines.', 'New York, NY', 'FULL_TIME', 'SENIOR_LEVEL', 150000, 195000, 'USD', 'Java, Spring Boot, PostgreSQL, Kafka, Microservices', CURRENT_DATE + 60, 'OPEN', 1, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;
