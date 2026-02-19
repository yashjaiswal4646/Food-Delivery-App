export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  UPI: 'upi',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
];

export const DELIVERY_FEE_THRESHOLD = 500;
export const DELIVERY_FEE = 5;
export const TAX_RATE = 0.1;