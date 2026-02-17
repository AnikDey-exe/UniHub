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

### 🧩 UniHub Formiq

**UniHub Formiq** is a dynamic event configuration tool that allows event creators to design structured, customizable event experiences.

Formiq enables:

- Custom questionnaire creation for events
- Dynamic form fields (text, selection, conditional inputs)
- Structured response storage tied to users
- Event-specific property extensions
- Schema-backed customization without breaking relational integrity

Instead of hardcoding event attributes, Formiq allows events to define their own structured data model — making UniHub extensible and adaptable across different event types (hackathons, workshops, conferences, socials, etc.). Formiq is actively undergoing upgrades. Stay tuned!

---

### 🤖 UniHub Butler

**UniHub Butler** is UniHub’s AI-powered discovery and recommendation engine.

Butler provides:

- Intelligent event search
- Context-aware filtering
- Two tower query system
- Personalized recommendations
- Structured query processing across relational data
- Scalable foundation for semantic search and ranking systems

Butler transforms UniHub from a static event board into a dynamic discovery platform. Butler is actively undergoing upgrades. Stay tuned!

---

## 🏫 UniHub Institutor

**UniHub Institutor** is UniHub’s institutional identity and onboarding service.

It is responsible for identifying, validating, and associating users with their respective universities — forming the foundation for UniHub’s multi-tenant architecture.

---

### 🎓 Institution Discovery Engine

Institutor maintains a continuously updated dataset of accredited universities and their associated email domains.

Current capabilities:

- Scrapes and consolidates public university data
- Maps official institutional email domains
- Maintains normalized institutional records
- Structured storage of university metadata

---

### 📧 Email-Based Institution Resolution

When a user signs up:

1. Their email domain is extracted.
2. Institutor matches the domain against verified institutional records.
3. The user is automatically scoped to their university tenant.

This allows:

- Automatic institutional assignment
- Scoped event visibility
- University-level data partitioning
- Cleaner access control boundaries

---

### 🧠 Architectural Role

Institutor is the foundation for:

- Multi-tenant university support
- Scoped relational queries
- Institution-level permissions
- Future administrative dashboards
- Cross-campus federation (roadmap)

---

### 🔮 Future Expansion

Planned enhancements include:

- Institution verification workflows
- Admin claim flows for official representatives
- Custom university branding
- Institution-specific feature toggles
- Cross-institution event collaboration

---

Institutor transforms UniHub from a single-campus product into a scalable university platform.
___

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
