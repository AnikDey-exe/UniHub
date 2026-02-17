# UniHub

> A full-stack, cloud-native university event platform built with modern production infrastructure.

UniHub is a scalable campus events platform that enables students and leaders to discover, create, and manage university events in real-time. The system is designed with production-grade architecture, containerized deployments, secure cloud networking, and a relational data model optimized for performance.

---

## 🚀 Overview

UniHub is a fully deployed, containerized application running on AWS with secure networking and managed infrastructure.

The platform supports:

- Event creation and management
- User authentication and authorization
- Persistent relational data modeling
- Cloud-native deployment pipelines
- Production-grade database hosting
- Secure backend API services
- Scalable frontend delivery

---

## 🏗 Architecture

### Frontend
- **Next.js 15**
- Server Components + Client Components
- Modern routing and optimized rendering
- Dockerized for reproducible builds
- Deployed via AWS App Runner

### Backend
- **Spring Boot**
- RESTful API design
- JPA/Hibernate ORM
- Robust entity relationships
- Production configuration management

### Database
- **AWS RDS (PostgreSQL)**
- Secure VPC configuration
- Controlled inbound access via security groups
- Relational schema with normalized design

### Infrastructure
- Dockerized services
- AWS ECR for container registry
- AWS App Runner for managed container deployment
- RDS for managed relational database
- Environment variable management for secure credentials

---

## 🧠 Core Features

### 👤 User System
- Secure user registration & authentication
- Persistent user profiles
- Profile customization
- OAuth2 and JWT authentication
- Relationship mapping between users and events
- Automatic integration with your university

### 📅 Event Management
- Create events
- Advanced event customization using UniHub Formiq
- Store event metadata (title, description, location, date)
- Easy event discovery through UniHub Butler
- Robust ticketing and RSVP'ing making event management pain free
- Associate events with creators
- Structured relational storage

### 🔐 Security & Infrastructure
- Private database instance (RDS not publicly exposed)
- Backend secured via AWS networking rules
- Environment-based configuration
- Docker build reproducibility
- Production bug handling and schema migration fixes

---

## 📊 Data Model

Relational structure includes:

- Users
- Events
- Registrations
- Colleges
- Creator-to-event relationships
- Proper foreign key constraints
- Indexed queries for efficient retrieval

The system is designed to scale as:
- User count increases
- Event volume grows
- Feature set expands (RSVPs, tagging, analytics, etc.)

---

## 🐳 DevOps & Deployment

UniHub uses container-first deployment:

1. Frontend and backend are containerized via Docker.
2. Images are pushed to AWS ECR.
3. AWS App Runner automatically deploys updated images.
4. Backend connects securely to AWS RDS.
5. Security groups restrict database access to backend only.

Production issues resolved during development:
- Lockfile corruption during Docker builds
- Schema migration conflicts
- Nullable primitive bugs in JPA
- AWS networking misconfiguration
- RDS connectivity debugging

---

## 📈 Scalability Considerations

- Stateless backend containers
- Managed database instance
- Cloud-native deployment
- Easily extensible to:
  - Caching layer (Redis)
  - Message queues
  - Search indexing
  - Microservice decomposition
  - Analytics pipelines

---

## 🛠 Tech Stack

Frontend:
- Next.js 15
- React
- TypeScript
- Tailwind (if applicable)

Backend:
- Java
- Spring Boot
- JPA / Hibernate

Infrastructure:
- Docker
- AWS RDS
- AWS App Runner
- AWS ECR
- PostgreSQL

---

## 🔮 Future Roadmap

- Role-based permissions
- Email notifications
- Real-time updates (WebSockets)
- Analytics dashboard
- Mobile responsiveness refinement

---

## 👨‍💻 Author

Built and deployed by Anik Dey.

---
