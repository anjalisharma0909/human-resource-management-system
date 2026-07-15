# Human Resource Management System (HRMS)

A full-stack Human Resource Management System (HRMS) built using **Next.js**, **FastAPI**, and **PostgreSQL**. This project helps organizations manage employees, attendance, departments, leave requests, and user authentication through a modern web interface.

---

## 🚀 Features

- 🔐 Secure Authentication (JWT)
- 👨‍💼 Employee Management
- 🏢 Department Management
- 📅 Attendance Tracking
- 📝 Leave Management
- 📊 Admin Dashboard
- 👤 Employee Dashboard
- 🔑 Password Reset
- 📈 Role-Based Access Control
- ⚡ RESTful APIs with FastAPI

---

## 🛠 Tech Stack

### Frontend
- Next.js
- React.js
- TypeScript
- CSS

### Backend
- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database
- PostgreSQL

---

## 📂 Project Structure

```text
human-resource-management-system/
│
├── hrms-backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── hrms-frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## ⚙️ Backend Setup

```bash
cd hrms-backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

## 💻 Frontend Setup

```bash
cd hrms-frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env` file inside `hrms-backend`.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/hrms

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 📌 Modules

- Authentication
- Employee Management
- Department Management
- Attendance Management
- Leave Management
- Dashboard
- Password Reset

---

## 🎯 Future Enhancements

- Payroll Management
- Recruitment Module
- Email Notifications
- Performance Tracking
- Reports & Analytics

---

## 👩‍💻 Author

**Anjali Sharma**

- GitHub: https://github.com/anjalisharma0909

---

## 📄 License

This project is developed for learning and educational purposes.
