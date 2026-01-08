export type DeliveryType = 'Delivery' | 'Pickup';

export type OrderStatus = 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled' | 'Pending';

export interface OrderItem {
  id: string;
  name: string;
  type: 'Tray' | 'Box' | 'Add-on';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  deliveryType: DeliveryType;
  address?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpend: number;
}

export interface DashboardStats {
  totalOrdersToday: number;
  totalRevenue: number;
  upcomingEvents: number;
  pendingOrders: number;
}

export type Page = 'dashboard' | 'orders' | 'revenue' | 'customers' | 'settings';
