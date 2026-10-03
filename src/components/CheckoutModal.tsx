import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  Building, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { CartItem, DeliveryAddress, Order } from '../types';
import { RIDERS_POOL } from '../data/medicines';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedArea: string;
  hasPrescription: boolean;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedArea,
  hasPrescription,
  onOrderPlaced,
}) => {
  const [fullName, setFullName] = useState('Rahul Verma');
  const [phone, setPhone] = useState('+91 98765 21098');
  const [street, setStreet] = useState('Flat 304, Green Heights, Orchid Road');
  const [apartment, setApartment] = useState('Tower B');
  const [landmark, setLandmark] = useState('Near Metro Station');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const deliveryFee = rawSubtotal > 299 ? 0 : 25;
  const total = rawSubtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Pick random friendly rider from Go Plus pool
    const randomRider = RIDERS_POOL[Math.floor(Math.random() * RIDERS_POOL.length)];
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setTimeout(() => {
      const newOrder: Order = {
        id: `GP-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...items],
        prescriptionUploaded: hasPrescription,
        address: {
          fullName,
          phone,
          street,
          apartment,
          area: selectedArea,
          landmark,
          city: 'Local Area',
          pinCode: '110045',
          type: addressType,
        },
        paymentMethod,
        deliveryType: 'express',
        subtotal: rawSubtotal,
        deliveryFee,
        discount: 0,
        total,
        status: 'placed',
        createdAt: Date.now(),
        estimatedDeliveryTime: Date.now() + 18 * 60 * 1000, // 18 mins
        riderName: randomRider.name,
        riderPhone: randomRider.phone,
        riderVehicle: randomRider.vehicle,
        otp: generatedOtp,
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Delivery Address &amp; Payment</h2>
              <p className="text-xs text-slate-500">Go Plus Rider arrives in 15–20 minutes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-6 overflow-y-auto space-y-5">
          
          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              1. Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Receiver Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone (For Rider Call &amp; OTP) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              2. Delivery Address in {selectedArea}
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">House / Flat / Floor / Building *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Flat 304, Green Heights"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Behind City Hospital"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Address Label</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        addressType === type
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              3. Payment Option
            </h3>

            <div className="space-y-2">
              <label 
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-slate-500">Inspect medicine seal &amp; pay rider upon delivery</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Most Popular
                </span>
              </label>

              <label 
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi' 
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Instant UPI / QR Code</p>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Zero fee</span>
              </label>

              <label 
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Credit / Debit Card / Health Card</p>
                    <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({items.length} medicines)</span>
              <span>₹{rawSubtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Express Local Delivery (15m)</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Payable Total</span>
              <span className="text-amber-600">₹{total}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            id="confirm-place-order-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming with Chemist &amp; Dispatching Rider...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-white" />
                <span>Place Order &bull; Pay ₹{total}</span>
              </span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
