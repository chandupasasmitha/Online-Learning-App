# System Design

## Architecture + Database Design

### System Architecture

- Frontend: React Native
- Backend: Node.js + Express
- Database: MongoDB

### Database Schema

#### Users

- \_id
- name
- email
- password
- role (student/instructor)

#### Courses

- \_id
- title
- description
- instructor
- duration

#### Enrollments

- \_id
- userId
- courseId
- enrolledAt
