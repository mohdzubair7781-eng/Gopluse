import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Zap, 
  Clock, 
  Tag, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  Check
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (medicineId: string, delta: number) => void;
  onRemoveItem: (medicineId: string) => void;
  onProceedToCheckout: () => void;
  onOpenPrescription: () => void;
  hasPrescription: boolean;
  selectedArea: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenPrescription,
  hasPrescription,
  selectedArea,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<'express' | 'standard'>('express');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const rxRequiredItems = items.filter(item => item.medicine.requiresPrescription);
  const hasRxItems = rxRequiredItems.length > 0;

  // Delivery fee logic
  const isFreeDelivery = rawSubtotal > 299 || appliedCoupon === 'GOPLUSFREE';
  const deliveryFee = items.length === 0 ? 0 : (isFreeDelivery ? 0 : (deliveryType === 'express' ? 25 : 15));
  
  // Discount coupon logic
  const couponDiscount = appliedCoupon === 'GOPLUS40' ? 40 : (appliedCoupon === 'FIRSTMED' ? 50 : 0);
  const finalTotal = Math.max(0, rawSubtotal + deliveryFee - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'GOPLUS40' || code === 'FIRSTMED' || code === 'GOPLUSFREE') {
      setAppliedCoupon(code);
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code. Try GOPLUSFREE or GOPLUS40');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Medicine Bag</h2>
              <p className="text-xs text-slate-500">Delivering to {selectedArea}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Search or browse from our catalog to add genuine medicines and healthcare essentials.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs hover:bg-amber-600"
              >
                Browse Medicines
              </button>
            </div>
          ) : (
            <>
              {/* Prescription Warning / Status banner */}
              {hasRxItems && (
                <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  hasPrescription 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${hasPrescription ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <div className="flex-1">
                    <p className="font-bold">
                      {hasPrescription 
                        ? 'Prescription Attached ✓' 
                        : 'Doctor\'s Prescription Required'}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {hasPrescription 
                        ? 'Your attached prescription covers prescription items in this order.' 
                        : 'Contains Rx items (e.g. Antibiotics or BP meds). You can upload your prescription before checkout.'}
                    </p>
                    {!hasPrescription && (
                      <button
                        onClick={onOpenPrescription}
                        className="mt-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                      >
                        + Attach Doctor&apos;s Prescription Now
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Items in bag ({items.length})
                </span>
                
                {items.map(({ medicine, quantity }) => (
                  <div 
                    key={medicine.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <img 
                      src={medicine.image} 
                      alt={medicine.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0" 
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{medicine.name}</h4>
                        {medicine.requiresPrescription && (
                          <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-red-100 text-red-700 shrink-0">
                            Rx
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{medicine.packageSize}</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-slate-900">
                          ₹{medicine.price * quantity}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (₹{medicine.price} each)
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(medicine.id, -1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold font-mono text-slate-900 min-w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(medicine.id, 1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(medicine.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery Speed Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 block">Select Delivery Option:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('express')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      deliveryType === 'express'
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 ring-1 ring-amber-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1 text-amber-600">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        Go Plus Express
                      </span>
                      <span className="text-[10px] font-bold font-mono">15–25m</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Dedicated scooter courier</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('standard')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      deliveryType === 'standard'
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 ring-1 ring-amber-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1 text-slate-800">
                        <Clock className="w-3.5 h-3.5" />
                        Standard Slot
                      </span>
                      <span className="text-[10px] font-bold font-mono">Today</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Delivered within 2 hours</p>
                  </button>
                </div>
              </div>

              {/* Coupon / Promo Code */}
              <div className="space-y-1.5 pt-1">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon: GOPLUSFREE or GOPLUS40"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase font-medium bg-slate-100 rounded-xl border border-transparent focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" /> Coupon &apos;{appliedCoupon}&apos; applied!
                    </span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-500">{couponError}</p>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Item Total (MRP &amp; Discounts)</span>
                  <span className="font-semibold text-slate-900">₹{rawSubtotal}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Local Express Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                  )}
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Coupon Savings</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>To Pay</span>
                  <span className="text-base text-amber-600">₹{finalTotal}</span>
                </div>
              </div>

              {/* Quality badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Packed in sealed tamper-proof medical pouches with cold packs if required.</span>
              </div>
            </>
          )}
        </div>

        {/* Bottom Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white sticky bottom-0 z-10 space-y-2">
            <button
              id="proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-between px-5"
            >
              <div className="text-left">
                <span className="text-[10px] uppercase font-semibold text-amber-100 block">Total</span>
                <span className="text-base font-black">₹{finalTotal}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span>Select Address &amp; Pay</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
