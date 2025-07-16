# 🩸 Blood Donation Website

A user-friendly platform to connect blood donors with recipients. It simplifies the process of finding, requesting, and
managing blood donations with secure, efficient, and responsive features.

### 🚀 Live Demo [Live Site](https://blood-donation24.netlify.app) | 🚀 Client Side Code [Visit Repositories](https://github.com/saddaulsiam/blood-donation-client)

---

## ✅ Features

- User registration and secure JWT-based login
- Search and filter donors by blood type, location, availability
- Detailed donor profiles with bio, age, last donation date
- Blood request system with request status
- Personal dashboard:
  - My Profile
  - My Blood Requests
  - Requests for Blood to Me
- Admin tools to manage users
- Responsive design for all devices

## 🛠️ Technology Stack

- **Frontend**: Next.js, Tailwind, Redux, Framer-Motion
- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/saddaulsiam/blood-donation-server
```

```bash
cd blood-donation-server
```

```bash
npm install
```

```bash
npm run dev
```

### 2️⃣ Create .env

```bash
NODE_ENV = development

# for production neon
DATABASE_URL = "your database url"

# for jwt
JWT_SECRET = "jwt secret"
EXPIRES_IN = "7d"
REFRESH_TOKEN_SECRET = "refresh token secret"
REFRESH_TOKEN_EXPIRES_IN = "30d"
RESET_PASS_SECRET = "reset pass secret"
RESET_PASS_TOKEN_EXPIRES_IN = "10m"
RESET_PASS_LINK = "domain.com/reset-password"

# for nodemail
EMAIL_USER = "email.gmail.com"
EMAIL_PASSWORD = "password"

# Admin
ADMIN_NAME = "super admin name"
ADMIN_EMAIL = "super admin email"
ADMIN_PASSWORD = "super admin password"
ADMIN_PHONE_NUMBER = "super admin number"

```

### 🤝 Contributing

_Contributions are welcome! Please open an issue or pull request._
