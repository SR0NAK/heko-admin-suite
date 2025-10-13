import { OrderStatus } from "@/components/StatusBadge";

// Mock data for development - replace with real API calls
export const mockUsers = [
  {
    id: '1',
    phone: '+91 9876543210',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    status: 'active',
    referralCode: 'RAJ123',
    referredBy: null,
    virtualWallet: 500,
    actualWallet: 250,
    totalOrders: 12,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    phone: '+91 9876543211',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    status: 'active',
    referralCode: 'PRI456',
    referredBy: 'RAJ123',
    virtualWallet: 300,
    actualWallet: 100,
    totalOrders: 8,
    createdAt: '2024-01-20T14:20:00Z',
  },
];

export const mockProducts = [
  {
    id: '1',
    name: 'Organic Apples',
    description: 'Fresh organic apples from Himachal',
    images: ['/placeholder.svg'],
    price: 180,
    mrp: 220,
    discount: 18,
    unit: '1 kg',
    category: 'Fruits',
    subcategory: 'Fresh Fruits',
    inStock: true,
    stockQuantity: 50,
    tags: ['organic', 'fresh'],
  },
  {
    id: '2',
    name: 'Amul Milk',
    description: 'Fresh full cream milk',
    images: ['/placeholder.svg'],
    price: 60,
    mrp: 65,
    discount: 8,
    unit: '1 L',
    category: 'Dairy',
    subcategory: 'Milk',
    inStock: true,
    stockQuantity: 100,
    tags: ['dairy', 'fresh'],
  },
];

export const mockOrders = [
  {
    id: 'ORD-001',
    userId: '1',
    userName: 'Rajesh Kumar',
    items: [
      { productId: '1', name: 'Organic Apples', quantity: 2, price: 180 },
      { productId: '2', name: 'Amul Milk', quantity: 1, price: 60 },
    ],
    status: 'delivered' as OrderStatus,
    subtotal: 420,
    discount: 0,
    deliveryFee: 30,
    total: 450,
    walletUsed: 100,
    address: '123, MG Road, Bangalore - 560001',
    deliveryOtp: '1234',
    deliveryPartner: 'Suresh Kumar',
    createdAt: '2024-01-25T10:00:00Z',
  },
];

export const mockCategories = [
  {
    id: '1',
    name: 'Fruits & Vegetables',
    image: '/placeholder.svg',
    subcategories: ['Fresh Fruits', 'Fresh Vegetables', 'Exotic'],
    order: 1,
  },
  {
    id: '2',
    name: 'Dairy & Eggs',
    image: '/placeholder.svg',
    subcategories: ['Milk', 'Eggs', 'Paneer', 'Curd'],
    order: 2,
  },
];

export const mockWalletTransactions = [
  {
    id: '1',
    userId: '1',
    type: 'credit',
    amount: 450,
    walletType: 'virtual',
    direction: 'in',
    kind: 'cashback',
    orderId: 'ORD-001',
    description: '100% cashback on order',
    timestamp: '2024-01-25T11:00:00Z',
    balanceAfter: 500,
  },
];

export const mockSettings = {
  deliveryFee: 30,
  minOrderValue: 200,
  cashbackPercentage: 100,
  referralRewardPercentage: 10,
  serviceRadius: 5,
  businessHours: {
    start: '07:00',
    end: '22:00',
  },
};
