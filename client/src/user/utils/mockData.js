// Mock data for user pages

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
  {
    _id: '5',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
    price: 179,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    available: true,
    rating: 4.1,
  },
  {
    _id: '6',
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with yogurt and ice',
    price: 99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
    available: true,
    rating: 4.4,
  },
];

export const MOCK_ORDERS = [
  {
    _id: 'ORD001',
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
    items: [
      { name: 'Chicken Burger', quantity: 1, price: 199 },
      { name: 'Caesar Salad', quantity: 1, price: 179 },
    ],
    total: 378,
    status: 'out_for_delivery',
    createdAt: '2025-12-24T09:15:00Z',
    deliveryAddress: '456 Park Avenue, Mumbai',
  },
  {
    _id: 'ORD003',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 249 },
    ],
    total: 249,
    status: 'preparing',
    createdAt: '2025-12-24T11:00:00Z',
    deliveryAddress: '789 Lake Road, Mumbai',
  },
];
