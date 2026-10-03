export interface Medicine {
  id: string;
  name: string;
  brand: string;
  genericName: string;
  category: 'prescription' | 'fever-pain' | 'cough-cold' | 'first-aid' | 'diabetes-cardiac' | 'digestion' | 'vitamins' | 'baby-care' | 'devices';
  categoryLabel: string;
  dosageForm: 'Tablets' | 'Syrup' | 'Capsules' | 'Ointment' | 'Drops' | 'Inhaler' | 'Device' | 'Kit' | 'Spray';
  packageSize: string; // e.g., "Strip of 10 Tablets", "100 ml Bottle"
  price: number;
  originalPrice: number;
  discountPercentage: number;
  priceRange?: string; // e.g., "₹10–25"
  requiresPrescription: boolean;
  inStock: boolean;
  deliveryTimeMinutes: number; // e.g., 15-25 mins
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  uses: string[];
  composition: string;
  manufacturer: string;
  storage: string;
  sideEffects?: string[];
  safetyAdvice: {
    pregnancy?: string;
    driving?: string;
    alcohol?: string;
  };
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface PrescriptionOrder {
  id: string;
  fileName: string;
  fileUrl?: string;
  patientName: string;
  patientAge: string;
  patientPhone: string;
  deliveryAddress: string;
  notes?: string;
  requestCall: boolean;
  status: 'verifying' | 'pharmacist_approved' | 'preparing' | 'out_for_delivery' | 'delivered';
  timestamp: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  apartment: string;
  area: string;
  landmark?: string;
  city: string;
  pinCode: string;
  type: 'Home' | 'Work' | 'Other';
}

export interface Order {
  id: string;
  items: CartItem[];
  prescriptionUploaded?: boolean;
  prescriptionFileName?: string;
  address: DeliveryAddress;
  paymentMethod: 'cod' | 'upi' | 'card';
  deliveryType: 'express' | 'standard';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'placed' | 'confirmed' | 'packing' | 'dispatched' | 'arriving' | 'delivered';
  createdAt: number;
  estimatedDeliveryTime: number; // timestamp
  riderName: string;
  riderPhone: string;
  riderVehicle: string;
  otp: string;
}
