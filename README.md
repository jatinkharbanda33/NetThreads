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
    A[Client] -->B[CloudFront CDN]
    A --> C[NGINX]
    B --> D[S3 Static Assets]
    C --> E[EC2 Instances]
    E --> F[Node.js API]
    F --> G[MongoDB Atlas]
```

AWS Infrastructure
AWS Free Tier Services Utilization

⚡ Performance Optimizations
🗂️ Database Excellence
Compound indexing on frequently queried fields

Connection pooling with 100+ concurrent connections

Atlas Search indexes for text queries

MongoDB Indexing

🕒 Cron Job Automation
Daily expired OTP cleanup

Weekly database optimization tasks

Monthly usage statistics generation

Cron Jobs

🚦 Production Monitoring
PM2 process management with clustering

NGINX reverse proxy configuration

Connection rate limiting

PM2 Monitoring

🖼️ Media Management
bash
Copy
User Upload -> S3 Bucket -> CloudFront Distribution -> CDN Caching
Signed URL generation for secure uploads

Image compression pipeline

EXIF data stripping for privacy

🛠️ Installation Guide
Backend Setup
bash
Copy
git clone https://github.com/jatinkharbanda33/NetThreads.git
cd server
npm install

# Configure environment
cp .env.example .env
nano .env

# Start production server
pm2 start server.js -i max
Frontend Setup
bash
Copy
cd client
npm install
npm run build

# Deploy built files to S3
aws s3 sync dist/ s3://your-bucket-name
🔒 Environment Variables
Variable	Description	Example
ATLAS_URI	MongoDB connection string	mongodb+srv://user:pass@cluster
JWT_SECRET	JWT signing key	super_secret_key_123
AWS_ACCESS_KEY	S3 access credentials	AKIAXXXXXXXXXXXXXXXX
SMTP_CONFIG	Email service config	smtps://user:pass@smtp.example.com
📈 Future Roadmap
Real-time chat implementation

User analytics dashboard

Cross-platform mobile app

AI-powered content recommendations

WebSocket-based notifications

🤝 Contributors
Jatin Kharbanda - Full Stack Architect

License: MIT
Documentation: Project Wiki

Copy

To use this README:
1. Create `screenshots` directory in your repo
2. Add your images with the specified filenames
3. Replace image paths if using different structure
4. Update contributors section as needed
5. Modify environment variables table to match your actual .env config

The combination of technical depth, visual elements, and clear structure demonstrates professional-grade project documentation while maintaining readability.
