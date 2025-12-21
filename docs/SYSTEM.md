# System Architecture Documentation

## Overview

Sah One is a full-stack Progressive Web Application (PWA) for food delivery services, built with a modern microservices-inspired architecture using React, Node.js, MongoDB, and Redis.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React PWA (Port 3000)                   │   │
│  │  ┌────────┐  ┌────────┐  ┌─────────┐  ┌─────────┐  │   │
│  │  │  User  │  │ Admin  │  │Delivery │  │  Auth   │  │   │
│  │  │  Pages │  │  Pages │  │  Pages  │  │  Pages  │  │   │
│  │  └────────┘  └────────┘  └─────────┘  └─────────┘  │   │
│  │         │                                      │      │   │
│  │         └──────────────┬───────────────────────┘      │   │
│  │                   Redux Store                         │   │
│  │         Service Worker + Cache Storage               │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Express.js Server (Port 5000)              │   │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │   │
│  │  │   CORS     │  │    JWT     │  │ Rate Limiting │  │   │
│  │  │ Middleware │  │   Auth     │  │               │  │   │
│  │  └────────────┘  └────────────┘  └───────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Auth       │   │   Orders     │   │    Menu      │
│ Controller   │   │  Controller  │   │  Controller  │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Payment    │   │ Notification │   │Order Status  │
│   Service    │   │   Service    │   │   Service    │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌──────────────────┐              ┌──────────────────┐
│    MongoDB       │              │      Redis       │
│  (Port 27017)    │              │   (Port 6379)    │
│                  │              │                  │
│  ┌────────────┐  │              │  ┌────────────┐  │
│  │   Users    │  │              │  │  Sessions  │  │
│  │   Orders   │  │              │  │   Cache    │  │
│  │ MenuItems  │  │              │  │   Queue    │  │
│  │  Payments  │  │              │  └────────────┘  │
│  └────────────┘  │              └──────────────────┘
└──────────────────┘
```

## Technology Stack

### Frontend Stack
- **React 18.2.0**: Component-based UI framework
- **Vite 5.0.8**: Fast build tool and dev server
- **Redux Toolkit 2.0.1**: Centralized state management
- **Material-UI 5.15.0**: Pre-built React components
- **React Router 6.21.1**: Client-side routing
- **Chart.js 4.4.1**: Data visualization for admin dashboard
- **Axios**: HTTP client (being replaced with fetch)
- **React Hot Toast**: Notification system

### Backend Stack
- **Node.js**: JavaScript runtime
- **Express.js 4.18.2**: Web application framework
- **MongoDB 8.0**: NoSQL database
- **Mongoose 8.0.3**: MongoDB ODM
- **Redis 4.6.12**: In-memory data store for caching
- **JWT**: Token-based authentication
- **Bcrypt.js**: Password hashing
- **Razorpay**: Payment gateway integration

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (enum: ['user', 'admin', 'delivery']),
  address: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    menuItem: ObjectId (ref: MenuItem),
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  deliveryAddress: Object,
  status: String (enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']),
  paymentStatus: String,
  paymentMethod: String,
  deliveryPerson: ObjectId (ref: User),
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  specialInstructions: String,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  isAvailable: Boolean,
  preparationTime: Number,
  ingredients: [String],
  rating: Number,
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Collection
```javascript
{
  _id: ObjectId,
  order: ObjectId (ref: Order),
  user: ObjectId (ref: User),
  amount: Number,
  paymentMethod: String,
  status: String,
  transactionId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Generate JWT token (7 days expiry)
   ↓
4. Token sent to client
   ↓
5. Client stores token in localStorage
   ↓
6. Token included in Authorization header for all requests
   ↓
7. Middleware validates token on protected routes
   ↓
8. User data attached to request object
```

## Order Processing Flow

```
User Places Order
   ↓
Validate Items & Calculate Total
   ↓
Create Order (status: pending)
   ↓
Process Payment
   ├─ Success → Update payment status
   └─ Failure → Cancel order
   ↓
Admin Confirms Order (status: confirmed)
   ↓
Kitchen Prepares (status: preparing)
   ↓
Assign to Delivery Person
   ↓
Out for Delivery (status: out_for_delivery)
   ↓
Delivered (status: delivered)
   ↓
Send Notifications at each stage
```

## Caching Strategy

### Redis Cache Usage

1. **Session Management**
   - Store active user sessions
   - Fast session validation

2. **Menu Items Cache**
   - Cache frequently accessed menu items
   - TTL: 1 hour
   - Invalidate on menu updates

3. **Order Statistics**
   - Cache dashboard stats
   - TTL: 5 minutes
   - Reduces database load

4. **Rate Limiting**
   - Track API requests per user
   - Prevent abuse

## State Management (Frontend)

### Redux Store Structure
```
store
├── auth
│   ├── user
│   ├── isAuthenticated
│   └── error
├── cart
│   ├── items
│   └── totalAmount
├── orders (deprecated - moved to local state)
└── menu (deprecated - moved to local state)
```

### Current Implementation (Mock Data)
- Authentication: localStorage-based
- Cart: Redux with localStorage persistence
- Orders: Component-level state with mock data
- Menu: Component-level state with mock data

## Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum 6 characters

2. **JWT Authentication**
   - HTTP-only cookies (recommended)
   - Token expiration: 7 days
   - Secure transmission over HTTPS

3. **Input Validation**
   - Express-validator for request validation
   - Sanitize user inputs
   - Prevent SQL/NoSQL injection

4. **CORS Configuration**
   - Whitelist specific origins
   - Credentials enabled

5. **Rate Limiting**
   - Prevent brute force attacks
   - API request throttling

## API Design Patterns

### RESTful Endpoints
- `GET /api/resource` - Fetch all
- `GET /api/resource/:id` - Fetch one
- `POST /api/resource` - Create
- `PUT /api/resource/:id` - Update
- `DELETE /api/resource/:id` - Delete

### Response Format
```json
{
  "success": true/false,
  "data": {},
  "error": "error message",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

## Progressive Web App (PWA) Features

### Service Worker
- **Cache-First Strategy**: Static assets
- **Network-First Strategy**: API calls
- **Offline Support**: Cached pages work offline

### Manifest.json
- App name and icons
- Theme colors
- Display mode: standalone
- Start URL configuration

### Installability
- Add to Home Screen on mobile
- Desktop installation support
- App-like experience

## Performance Optimizations

### Frontend
1. **Code Splitting**: Route-based lazy loading
2. **Memoization**: useMemo for expensive computations
3. **Debouncing**: Search inputs
4. **Image Optimization**: Lazy loading, WebP format
5. **Bundle Optimization**: Vite tree-shaking

### Backend
1. **Database Indexing**: Indexed fields for fast queries
2. **Connection Pooling**: Mongoose connection management
3. **Compression**: Gzip compression middleware
4. **Pagination**: Limit data transfer
5. **Redis Caching**: Reduce database hits

## Monitoring & Logging

### Application Logs
- Error logging with stack traces
- Request/Response logging
- Performance metrics

### Database Monitoring
- Query performance analysis
- Connection pool monitoring
- Index usage statistics

### Health Checks
- `/health` endpoint for server status
- Database connectivity check
- Redis connectivity check

## Deployment Architecture

### Production Setup
```
User Request
   ↓
Nginx (Reverse Proxy + SSL)
   ├─ Static Files (Frontend)
   └─ /api → Node.js Server
         ↓
    PM2 (Process Manager - Cluster Mode)
         ↓
    MongoDB (Replica Set)
         ↓
    Redis (Sentinel for HA)
```

### CI/CD Pipeline
1. Code push to repository
2. Automated tests run
3. Build frontend and backend
4. Deploy to staging
5. Manual approval
6. Deploy to production
7. Health check validation

## Scalability Considerations

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple Node.js instances (PM2 cluster)
- MongoDB sharding
- Redis cluster

### Vertical Scaling
- Increase server resources
- Database optimization
- Connection pool tuning

## Future Enhancements

1. **Real-time Features**
   - Socket.io for live order tracking
   - Push notifications via FCM

2. **Advanced Analytics**
   - Customer behavior tracking
   - Predictive ordering

3. **Machine Learning**
   - Recommendation engine
   - Demand forecasting

4. **Microservices**
   - Separate services for orders, payments, notifications
   - Message queue (RabbitMQ/Kafka)

5. **Mobile Apps**
   - React Native apps
   - Deep linking support
