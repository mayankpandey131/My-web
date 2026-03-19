# 🌐 My-Web — Student Portfolio Platform

A full-stack portfolio platform where students can showcase their projects, certifications, and academic journey.

---

## 📁 Project Structure

```
my-web/
├── backend/          ← Node.js + Express + MongoDB
│   ├── server.js     ← Main server file (all routes + models)
│   └── package.json
└── frontend/         ← React.js frontend
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── context/
        │   └── AuthContext.js
        ├── services/
        │   └── api.js
        ├── styles/
        │   └── global.css
        ├── components/
        │   ├── Navbar.js
        │   ├── ProjectModal.js
        │   ├── CertificateModal.js
        │   └── EditProfileModal.js
        └── pages/
            ├── HomePage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── ProfilePage.js
            └── ExplorePage.js
```

---

## 🛠️ STEP-BY-STEP SETUP

### STEP 1 — Install Required Software

1. **Install Node.js** (v18 or later)
   - Go to https://nodejs.org → Download LTS → Install

2. **Install MongoDB Community**
   - Go to https://www.mongodb.com/try/download/community
   - Download for your OS → Install
   - Start MongoDB service:
     - Windows: It starts automatically as a service
     - Mac: `brew services start mongodb-community`
     - Linux: `sudo systemctl start mongod`

3. **Verify installations** (open terminal/command prompt):
   ```bash
   node --version      # Should show v18+
   npm --version       # Should show 9+
   mongod --version    # Should show MongoDB version
   ```

---

### STEP 2 — Set Up the Backend

1. Open terminal and navigate to the backend folder:
   ```bash
   cd my-web/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   
   ✅ You should see: `✅ MongoDB connected` and `🚀 Server running on port 5000`

---

### STEP 3 — Set Up the Frontend

1. Open a **NEW terminal window** (keep backend running)

2. Navigate to the frontend folder:
   ```bash
   cd my-web/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the React development server:
   ```bash
   npm start
   ```
   
   ✅ Browser should automatically open at http://localhost:3000

---

### STEP 4 — Use the Application

1. **Visit** http://localhost:3000
2. **Click "Get Started Free"** to create an account
3. **Fill in your details** — college name, degree, stream, passing year
4. **Log in** and you're on your profile page!
5. Click **"+ Add Project"** to add your first project
6. Click **"+ Add Certificate"** to upload a certificate
7. Click **"Edit Profile"** to update bio, skills, and social links

---

## 🔐 How Security Works

| Action | Who Can Do It |
|--------|---------------|
| View any profile | Everyone (no login needed) |
| Add/Edit/Delete projects | Only the profile owner |
| Add/Edit/Delete certificates | Only the profile owner |
| Edit profile details | Only the profile owner |

---

## 🎓 College Verification

When registering, the system checks your college name against a list of **50+ recognized Indian universities and institutes** including:
- IITs, NITs, BITS Pilani
- State universities (Mumbai, Delhi, Anna, VTU, etc.)
- Private institutions (Manipal, SRM, Amity, VIT, etc.)

If your college is found → ✅ **Verified badge** on your profile
If not found → Account still created, just without the verified badge

---

## 📦 Technologies Used

### Backend
- **Node.js + Express** — Web server framework
- **MongoDB + Mongoose** — Database
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT authentication
- **multer** — File upload handling
- **cors** — Cross-origin requests

### Frontend
- **React.js 18** — UI framework
- **React Router v6** — Page routing
- **Axios** — API calls
- **React Toastify** — Notifications
- **Google Fonts** — Typography (Playfair Display + DM Sans)

---

## 🌟 Features

- ✅ Two-step Registration with college verification
- ✅ Secure JWT Login/Logout
- ✅ Public portfolio page per user
- ✅ Project management (add/edit/delete with thumbnail + video)
- ✅ Certificate management (add/edit/delete with file upload + description)
- ✅ YouTube video embedding in projects
- ✅ Profile editing (photo, bio, skills, social links, resume)
- ✅ User search
- ✅ College verified badge
- ✅ Responsive design

---

## ⚠️ Troubleshooting

**"MongoDB connection failed"**
→ Make sure MongoDB is running: `mongod` or start the MongoDB service

**"Port 5000 already in use"**
→ Change the PORT in server.js: `const PORT = 5001`
→ Also update in frontend/src/services/api.js: `baseURL: 'http://localhost:5001/api'`

**"npm install fails"**
→ Delete node_modules folder and package-lock.json, then run npm install again

**Files not uploading**
→ Make sure the `uploads/` folder was created in the backend directory
→ It's created automatically when the server starts

---

## 🚀 Future Enhancements You Can Add

- Email verification on signup
- Password reset via email
- Post/feed for sharing updates
- Follow system between users
- Dark mode toggle
- Export portfolio as PDF
- Deploy on Render/Railway (backend) + Vercel (frontend)
