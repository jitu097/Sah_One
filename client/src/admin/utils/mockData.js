// Mock data for admin pages

export const MOCK_MENU_ITEMS = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil',
    price: 299,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    available: true,
    rating: 4.5,
  },
  {
    _id: '2',
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with lettuce, tomato, and special sauce',
    price: 199,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    available: true,
    rating: 4.2,
  },
  {
    _id: '3',
    name: 'Veg Hakka Noodles',
    description: 'Stir-fried noodles with mixed vegetables',
    price: 149,
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    available: true,
    rating: 4.3,
  },
  {
    _id: '4',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in Indian spices',
    price: 249,
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
    available: true,
    rating: 4.6,
  },
];

export const MOCK_ORDERS = [
  {
    _id: 'ORD001',
    customer: 'John Doe',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 299 },
      { name: 'Mango Smoothie', quantity: 1, price: 99 },
    ],
    total: 697,
    status: 'delivered',
    createdAt: '2025-12-20T10:30:00Z',
    deliveryAddress: '123 Main Street, Mumbai',
  },
  {
    _id: 'ORD002',
    customer: 'Jane Smith',
    items: [
      { name: 'Chicken Burger', quantity: 1, price: 199 },
    ],
    total: 199,
    status: 'preparing',
    createdAt: '2025-12-24T09:15:00Z',
    deliveryAddress: '456 Park Avenue, Mumbai',
  },
  {
    _id: 'ORD003',
    customer: 'Bob Johnson',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 249 },
    ],
    total: 249,
    status: 'pending',
    createdAt: '2025-12-24T11:00:00Z',
    deliveryAddress: '789 Lake Road, Mumbai',
  },
];

export const MOCK_STATS = {
  totalOrders: 1250,
  totalRevenue: 125000,
  totalUsers: 450,
  activeDelivery: 12,
};

export const MOCK_CHARTS_DATA = {
  ordersOverTime: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [65, 78, 90, 81, 95, 120, 110],
  },
  ordersByCategory: {
    labels: ['Pizza', 'Burgers', 'Chinese', 'Indian', 'Salads'],
    data: [35, 25, 20, 15, 5],
  },
};
