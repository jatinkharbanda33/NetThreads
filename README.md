# NetThreads 🌐🧵

**A Modern Social Media Platform for Thoughtful Conversations**  
*Where Threads Unravel Meaningful Interactions*

**Deployed URL -> https://netthreads.crabdance.com**


---

## 🚀 Overview
NetThreads is a high-performance social media application designed for users to share content publicly with an emphasis on structured, nested conversations. Built with cutting-edge technologies and deployed on AWS infrastructure, this project demonstrates scalable full-stack development practices with enterprise-grade optimizations.

![NetThreads Homepage](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/1.png)  
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
- Dual token strategy with access/refresh tokens.
- Secure HTTP-only cookies for token storage.
- Automatic token rotation mechanism.

### 🧬 Nested Conversation Threads
- Infinite comment nesting with collapsible UI.
- Context-preserving thread navigation.
- Real-time depth indicators.

![Nested Replies](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/InfinitePost.png)

### 🔍 Atlas-Powered Fuzzy Search
- MongoDB Atlas Search integration.
- Autocomplete suggestions.
- Typo-tolerant query parsing.

![Search Feature](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/search.png)

### 📧 OTP Email Verification
- NodeMailer integration with SMTP pooling.
- Cron-based OTP expiration (Node Schedule).
- Secure OTP hashing with bcrypt.

![Email Verification](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/Email.png)

---

## 🏗️ Deployment Architecture

```mermaid
graph TD
    A[Client] --> B[CloudFront CDN]
    A --> C[NGINX]
    B --> D[S3 Static Assets]
    C --> E[EC2 Instances]
    E --> F[Nodejs Backend]
    F --> G[MongoDB Atlas]
```

---

## 📦 AWS Free Tier Services Utilization
![AWS Free Tier](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/AwsFreeTier.png)

## ⚡ Performance Optimizations
- Connection pooling for concurrent connections.
  ![Connection pooling](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/MongoDB.png)

## 🗂️ Database Excellence
- Indexing on frequently queried fields.
- Atlas Search indexes for text queries.
 ![Indexing](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/Indexing.png)

## 🕒 Cron Job Automation
- Daily expired OTP cleanup.
- ![Cron Job](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/Cron%20Job.png)
  

## 🚦 Production Monitoring
- PM2 process management with clustering.
- NGINX reverse proxy configuration.
- Connection rate limiting.
- ![PM2](https://ddq6ld55a9pdc.cloudfront.net/githubFiles/pm2.png)


## 🖼️ Media Management
- User Upload → S3 Bucket → CloudFront Distribution → CDN Caching.
- Signed URL generation for secure uploads.

---

## 🛠️ Installation Guide

### Backend Setup
```sh
git clone https://github.com/jatinkharbanda33/NetThreads.git
cd backend
npm install
```


### Frontend Setup
```sh
cd client
npm install
npm run build
```

---

## 📈 Future Roadmap
- Real-time chat implementation.
- User analytics dashboard.
- Cross-platform mobile app.
- AI-powered content recommendations.
- WebSocket-based notifications.

---

## 🤝 Contributors
**Jatin Kharbanda** - Full Stack Architect

---

## 📜 License
MIT
