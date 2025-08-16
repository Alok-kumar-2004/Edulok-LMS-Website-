# 🎓 Edulok – Full Stack Learning Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue)](https://edulok-lms-website-em87.onrender.com/auth)

**Edulok** is a full-featured Learning Management System (LMS) that allows instructors to create and manage courses while students can browse, enroll, and track their learning journey. It features role-based access, secure payments via PayPal, media upload via Cloudinary, and a modern, responsive UI with animations using Radix UI and Framer Motion.

---

## 🚀 Live Site

🌐 **Hosted on Render**:  
👉 [https://edulok-lms-website-em87.onrender.com/auth](https://edulok-lms-website-em87.onrender.com/auth)

---

## 📌 Key Features

### 👨‍🏫 Instructor Panel
- Create, update, and delete courses
- Upload lessons (videos, documents, etc.) via Cloudinary
- Manage enrolled students and monitor course performance

### 👨‍🎓 Student Panel
- Browse and enroll in available courses
- Make secure payments using **PayPal**
- Track progress via a personalized dashboard

### 🔐 Authentication
- JWT-based login and role-based access control
- Secure and protected API routes
- Separate dashboards for students and instructors

### 📦 Integrations
- **PayPal SDK** – for secure course payment
- **Cloudinary** – for image/video storage and delivery
- **Framer Motion** & **Radix UI** – modern, animated, and accessible UI components

---

## 🛠️ Tech Stack

| Frontend               | Backend                    | Database       | Third-Party Tools      |
|------------------------|----------------------------|----------------|------------------------|
| React.js (with Hooks)  | Node.js + Express.js       | MongoDB (Atlas) | PayPal, Cloudinary     |
| Radix UI               | JWT Authentication         | Mongoose ORM   | Framer Motion          |
| React Router DOM       | RESTful API Architecture   |                |                        |

---

## 🧩 Project Architecture

```
Edulok-LMS-Website/
├── client/                 # React frontend
│   ├── pages/             # Route-based pages (auth, dashboard, course, etc.)
│   ├── components/        # Reusable UI components
│   └── utils/             # Axios config, constants
├── server/                 # Express backend
│   ├── models/            # Mongoose schemas for User, Course
│   ├── routes/            # Route handlers (auth, course, payment)
│   ├── middleware/        # Auth & role-based access control
│   └── config/            # PayPal & Cloudinary setup
└── README.md              # Project documentation
```

---

## 🧠 How It Works

### ➕ Instructor Workflow
1. Registers or logs in as an **Instructor**
2. Creates a course by providing title, description, and uploading lessons (video/text)
3. Uploaded media is stored on **Cloudinary**
4. Can view enrolled students and track course engagement

### 🛒 Student Workflow
1. Registers or logs in as a **Student**
2. Browses available courses
3. Enrolls in a course → redirected to **PayPal** for payment
4. Upon successful payment, the course is added to their dashboard
5. Student can track their lesson progress and continue learning

### 🔐 Authentication Logic
- JWT token is generated upon login/register
- Stored in localStorage and sent with every API request
- Middleware checks token and user role to permit access

---

## 🛠️ Getting Started Locally

### 📁 Clone the repo

```bash
git clone https://github.com/Alok-kumar-2004/Edulok-LMS-Website-.git
cd Edulok-LMS-Website-
```

### 📦 Backend Setup

```bash
cd server
npm install
# Create .env file with your MongoDB URI, PayPal & Cloudinary keys
npm start
```

### 💻 Frontend Setup

```bash
cd client
npm install
npm start
```

Now visit [http://localhost:3000](http://localhost:3000) 🚀

---

## 📈 Future Improvements

- Add quiz & certification system
- Enable course ratings & feedback
- Admin dashboard for platform analytics
- Real-time chat or Q&A per course
- Email verification & password reset

---

## 👨‍💻 Author

Made with ❤️ by **Alokkumar Singh**  
🔗 [LinkedIn](https://www.linkedin.com/in/alokkumar-singh2004/)  
📫 alokkumar2004@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
