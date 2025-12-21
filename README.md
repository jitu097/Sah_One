# Sah One - Food Delivery App

A full-stack Progressive Web App (PWA) for food delivery with real-time order tracking, role-based dashboards, and seamless user experience.

## 🚀 Features

### User Features
- Browse menu with search and filters
- Add items to cart with quantity management
- Place orders with multiple payment options
- Track order status in real-time
- View order history
- Manage profile and delivery addresses

### Admin Features
- Dashboard with analytics and charts
- Order management with status updates
- Menu management (CRUD operations)
- Offers and promotions management
- User management
- Sales reports

### Delivery Personnel Features
- View assigned orders
- Update delivery status
- Mark orders as picked up/delivered
- View delivery history

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **React Router v6** - Client-side routing
- **Chart.js** - Data visualization
- **PWA** - Service Worker, offline support

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching and session management
- **JWT** - Authentication
- **Razorpay** - Payment integration
- **Socket.io** - Real-time communication

## 📁 Project Structure

```
sah-one/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── admin/         # Admin pages
│   │   ├── user/          # User pages
│   │   ├── delivery/      # Delivery pages
│   │   ├── auth/          # Authentication
│   │   ├── shared/        # Shared components
│   │   └── app/           # App configuration
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Database & Redis config
│   │   ├── models/        # Mongoose models
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middlewares
│   │   └── services/      # Business logic
│   └── package.json
│
├── docs/                  # Documentation
│   ├── API.md            # API documentation
│   └── SYSTEM.md         # System architecture
│
├── docker-compose.yml     # Docker configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Sah_One
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**
```bash
cd client
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Default Credentials

### Admin Access
- Email: `admin123@gmail.com`
- Password: `admin`

### Delivery Personnel Access
- Email: `delivery123@gmail.com`
- Password: `delivery`

### User Access
- Any email and password

## 🐳 Docker Setup (Optional)

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend API on port 5000
- Frontend on port 3000

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Installable**: Can be installed on mobile/desktop
- **Fast Loading**: Cached assets for quick access
- **Push Notifications**: Real-time order updates
- **Responsive**: Works on all screen sizes

## 🔧 Environment Variables

See `.env.example` for required environment variables.

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sah_one
REDIS_HOST=localhost
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 📚 API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## 🏗️ System Architecture

See [docs/SYSTEM.md](docs/SYSTEM.md) for system architecture details.

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📦 Building for Production

### Frontend
```bash
cd client
npm run build
```

### Backend
```bash
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Material-UI for the component library
- Chart.js for data visualization
- All contributors and open-source projects used
