// Mock data for the application - no backend needed

export const MOCK_MENU_ITEMS = [
    {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
        price: 299,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        rating: 4.5,
        isAvailable: true,
    },
    {
        id: '2',
        name: 'Chicken Burger',
        description: 'Juicy chicken patty with lettuce, tomato, and special sauce',
        price: 199,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        rating: 4.3,
        isAvailable: true,
    },
    {
        id: '3',
        name: 'Veg Hakka Noodles',
        description: 'Stir-fried noodles with fresh vegetables and soy sauce',
        price: 179,
        category: 'Chinese',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
        rating: 4.6,
        isAvailable: true,
    },
    {
        id: '4',
        name: 'Paneer Butter Masala',
        description: 'Creamy tomato curry with cottage cheese cubes',
        price: 249,
        category: 'Indian',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
        rating: 4.7,
        isAvailable: true,
    },
    {
        id: '5',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan and croutons',
        price: 159,
        category: 'Salads',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        rating: 4.2,
        isAvailable: true,
    },
    {
        id: '6',
        name: 'Mango Smoothie',
        description: 'Fresh mango blended with yogurt and honey',
        price: 99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
        rating: 4.4,
        isAvailable: true,
    },
];

export const MOCK_ORDERS = [
    {
        id: 'ORD001',
        userId: 'user1',
        items: [
            { name: 'Margherita Pizza', quantity: 2, price: 299 },
            { name: 'Mango Smoothie', quantity: 1, price: 99 },
        ],
        totalAmount: 697,
        status: 'delivered',
        orderDate: '2024-01-20T10:30:00',
        deliveryAddress: '123 Main St, Apartment 4B, New York, NY 10001',
        paymentMethod: 'UPI',
    },
    {
        id: 'ORD002',
        userId: 'user1',
        items: [
            { name: 'Chicken Burger', quantity: 1, price: 199 },
            { name: 'Caesar Salad', quantity: 1, price: 159 },
        ],
        totalAmount: 358,
        status: 'out_for_delivery',
        orderDate: '2024-01-22T14:20:00',
        deliveryAddress: '123 Main St, Apartment 4B, New York, NY 10001',
        paymentMethod: 'Card',
    },
    {
        id: 'ORD003',
        userId: 'user2',
        items: [
            { name: 'Paneer Butter Masala', quantity: 2, price: 249 },
            { name: 'Veg Hakka Noodles', quantity: 1, price: 179 },
        ],
        totalAmount: 677,
        status: 'preparing',
        orderDate: '2024-01-23T18:45:00',
        deliveryAddress: '456 Oak Avenue, Floor 2, Brooklyn, NY 11201',
        paymentMethod: 'Cash',
    },
];

export const MOCK_STATS = {
    totalOrders: 156,
    totalRevenue: 45670,
    totalUsers: 89,
    activeDelivery: 12,
    pendingOrders: 8,
    completedToday: 23,
    averageRating: 4.5,
    totalMenuItems: 45,
};

export const MOCK_USER = {
    id: 'user1',
    name: 'John Doe',
    email: 'user@example.com',
    phone: '+1 234 567 8900',
    role: 'user',
    profileImage: null,
    addresses: [
        {
            id: 'addr1',
            label: 'Home',
            street: '123 Main St, Apartment 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            isDefault: true,
        },
    ],
};

export const MOCK_DELIVERY_ORDERS = [
    {
        id: 'ORD002',
        customerName: 'John Doe',
        items: 2,
        totalAmount: 358,
        status: 'out_for_delivery',
        pickupAddress: 'Sah One Restaurant, Downtown',
        deliveryAddress: '123 Main St, Apartment 4B, NY 10001',
        customerPhone: '+1 234 567 8900',
        estimatedTime: '15 mins',
    },
    {
        id: 'ORD004',
        customerName: 'Jane Smith',
        items: 3,
        totalAmount: 542,
        status: 'ready_for_pickup',
        pickupAddress: 'Sah One Restaurant, Downtown',
        deliveryAddress: '789 Park Ave, Brooklyn, NY 11201',
        customerPhone: '+1 234 567 8901',
        estimatedTime: '20 mins',
    },
];

export const MOCK_CHARTS_DATA = {
    ordersOverTime: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [12, 19, 15, 25, 22, 30, 28],
    },
    revenueOverTime: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [3200, 4100, 3800, 5200, 4800, 6100, 5900],
    },
    categoryDistribution: {
        labels: ['Pizza', 'Burgers', 'Chinese', 'Indian', 'Salads', 'Beverages'],
        data: [30, 25, 20, 15, 5, 5],
    },
};
