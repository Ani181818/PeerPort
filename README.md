# DevTinder 💻❤️

A Tinder-like application for developers to connect, match, and chat with each other based on skills and interests.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Create and edit developer profiles with skills and bio
- **Smart Matching**: Swipe through developer profiles based on interests
- **Connection Requests**: Send and receive connection requests
- **Real-time Chat**: Chat with matched developers using Socket.IO
- **Feed System**: Discover new developers with pagination
- **Responsive Design**: Works seamlessly across devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Validator** - Data validation

### Frontend
- **React** (assumed from CORS setup)
- **Socket.IO Client** - Real-time features

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devtinder.git
   cd devtinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DB_CONNECTION_SECRET=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=7777
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

### Profile
- `GET /profile/view` - Get user profile
- `PATCH /profile/edit` - Update profile
- `PATCH /profile/password` - Change password

### Connections
- `POST /request/send/:status/:userId` - Send connection request
- `POST /request/review/:status/:requestId` - Accept/reject request
- `GET /user/requests/received` - Get received requests
- `GET /user/connections` - Get all connections

### Feed & Discovery
- `GET /user/feed` - Get user feed with pagination

### Chat
- `GET /chat/:targetUserId` - Get chat history

## 🔌 Socket Events

### Client to Server
- `joinChat` - Join a chat room
- `sendMessage` - Send a message

### Server to Client
- `messageReceived` - Receive a new message

## 📁 Project Structure

```
devtinder/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middlewares/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   ├── user.js              # User model
│   │   ├── connectionRequest.js # Connection request model
│   │   └── chat.js              # Chat model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── profile.js           # Profile routes
│   │   ├── request.js           # Connection request routes
│   │   ├── user.js              # User routes
│   │   └── chat.js              # Chat routes
│   ├── utils/
│   │   ├── validation.js        # Input validation utilities
│   │   └── socket.js            # Socket.IO configuration
│   └── app.js                   # Main application file
├── package.json
└── README.md
```

## 🚦 Usage

1. **Sign Up**: Create a new developer account
2. **Complete Profile**: Add your skills, bio, and photo
3. **Discover**: Browse through other developers' profiles
4. **Connect**: Send interest or ignore profiles
5. **Match**: When both users show interest, you can chat
6. **Chat**: Real-time messaging with your connections

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- Secure cookie handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aniket Mahadik**

## 🐛 Issues

If you find any bugs or have feature requests, please create an issue on GitHub.

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

---

Made with ❤️ for the developer community