# NetThreads 🌐🧵

**A Modern Social Media Platform for Thoughtful Conversations**  
*Where Threads Unravel Meaningful Interactions*

---

## 🚀 Overview
NetThreads is a high-performance social media application designed for users to share content publicly with an emphasis on structured, nested conversations. Built with cutting-edge technologies and deployed on AWS infrastructure, this project demonstrates scalable full-stack development practices with enterprise-grade optimizations.

![NetThreads Homepage](./screenshots/homepage.png)  
*Homepage featuring trending threads and engagement metrics*

---

## 🛠️ Tech Stack Symphony

### Frontend
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![AWS CloudFront](https://img.shields.io/badge/CloudFront-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

### Infrastructure
![AWS EC2](https://img.shields.io/badge/EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![S3](https://img.shields.io/badge/S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![NGINX](https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white)

---

## 🔑 Key Features

### 🔐 JWT Authentication System
- Dual token strategy with access/refresh tokens
- Secure HTTP-only cookies for token storage
- Automatic token rotation mechanism

![Authentication Flow](./screenshots/jwt_flow.png)

### 🧬 Nested Conversation Threads
- Infinite comment nesting with collapsible UI
- Context-preserving thread navigation
- Real-time depth indicators

![Nested Replies](./screenshots/nested_replies.png)

### 🔍 Atlas-Powered Fuzzy Search
- MongoDB Atlas Search integration
- Autocomplete suggestions
- Typo-tolerant query parsing

![Search Feature](./screenshots/search_feature.png)

### 📧 OTP Email Verification
- NodeMailer integration with SMTP pooling
- Cron-based OTP expiration (Node Schedule)
- Secure OTP hashing with bcrypt

![Email Verification](./screenshots/email_verification.png)

---

## �️ Deployment Architecture

```mermaid
graph TD
    A[Client] -->|HTTPS| B[CloudFront CDN]
    B --> C[S3 Static Assets]
    B --> D[NGINX Load Balancer]
    D --> E[EC2 Instances]
    E --> F[Node.js API]
    F --> G[MongoDB Atlas]
