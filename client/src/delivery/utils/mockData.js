// Mock data for delivery pages

export const MOCK_DELIVERY_ORDERS = [
  {
    _id: 'ORD001',
    customer: 'John Doe',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 299 },
      { name: 'Mango Smoothie', quantity: 1, price: 99 },
    ],
    total: 697,
    status: 'out_for_delivery',
    createdAt: '2025-12-24T10:30:00Z',
    deliveryAddress: '123 Main Street, Mumbai',
    customerPhone: '+91 98765 43210',
  },
  {
    _id: 'ORD002',
    customer: 'Jane Smith',
    items: [
      { name: 'Chicken Burger', quantity: 1, price: 199 },
    ],
    total: 199,
    status: 'preparing',
    createdAt: '2025-12-24T11:15:00Z',
    deliveryAddress: '456 Park Avenue, Mumbai',
    customerPhone: '+91 98765 43211',
  },
];
