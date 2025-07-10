# 📝 Real-Time Collaborative Document Editor

A real-time collaborative text editor built with the MERN stack and Socket.IO, enabling multiple users to edit the same document simultaneously.

---

## 🚀 Features

- 🔐 **User Authentication** (Register & Login with JWT)
- 📄 **Document Dashboard**
  - View all documents you own or collaborate on
  - Create new documents
  - Delete documents
- ✍️ **Real-Time Collaborative Editor**
  - Live syncing of document content via Socket.IO
  - Show online collaborators in real-time
  - Auto-save every 10 seconds
  - Fullscreen toggle
- 🤝 **Collaboration**
  - Add/remove collaborators
  - Access control based on collaborators
- 🌙 Beautiful dark-mode inspired UI with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO Server
- JWT for authentication
- Bcrypt for password hashing

---

## 📂 Project Structure

```bash
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/axios.js
│   │   └── App.jsx
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket.js
│   └── index.js
