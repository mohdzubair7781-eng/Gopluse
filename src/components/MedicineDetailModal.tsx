import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Info, 
  CheckCircle,
  Building2,
  Package,
  FileText,
  Camera,
  Pencil
} from 'lucide-react';
import { Medicine } from '../types';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  quantityInCart: number;
  onAddToCart: (medicine: Medicine) => void;
  onUpdateQuantity: (medicineId: string, delta: number) => void;
  isOwnerMode?: boolean;
  onEditProduct?: (medicine: Medicine) => void;
  onEditImage?: (medicine: Medicine) => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  isOwnerMode = false,
  onEditProduct,
  onEditImage,
}) => {
  if (!medicine) return null;

  const handleEdit = () => {
    if (onEditProduct) {
      onEditProduct(medicine);
    } else if (onEditImage) {
      onEditImage(medicine);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-lg">
              {medicine.categoryLabel}
            </span>
            {medicine.requiresPrescription && (
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                Rx Prescription Required
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top section: Image + title */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 relative h-52 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 group">
              <img
                src={medicine.image}
                alt={medicine.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
                    target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600';
                  }
                }}
              />
              {isOwnerMode && (onEditProduct || onEditImage) && (
                <button
                  onClick={handleEdit}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95 border border-amber-300"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Owner: Edit Price, % Off &amp; Photo</span>
                </button>
              )}
            </div>

            <div className="sm:col-span-7 space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {medicine.name}
              </h2>
              <p className="text-sm font-semibold text-amber-700">
                {medicine.genericName}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  {medicine.packageSize}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {medicine.brand}
                </span>
              </div>

              {/* Price Row */}
              <div className="pt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900">
                  ₹{medicine.price}
                </span>
                {medicine.originalPrice > medicine.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{medicine.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Save {medicine.discountPercentage}%
                    </span>
                  </>
                )}
                {medicine.priceRange && (
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                    Market Price Range: {medicine.priceRange}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Inclusive of all taxes • In stock with local chemist
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              About this Medicine
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {medicine.description}
            </p>
          </div>

          {/* Key Uses */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Primary Uses & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {medicine.uses.map((use, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-amber-50/50 border border-amber-100/80 p-2.5 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{use}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Salt Composition & Manufacturer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block mb-1">Active Composition</span>
              <p className="text-slate-600 font-mono text-[11px]">{medicine.composition}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-1">Manufacturer</span>
              <p className="text-slate-600">{medicine.manufacturer}</p>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
              <span className="font-bold text-slate-900 block mb-0.5">Storage Instruction</span>
              <p className="text-slate-600">{medicine.storage}</p>
            </div>
          </div>

          {/* Safety Advice */}
          {(medicine.safetyAdvice.pregnancy || medicine.safetyAdvice.driving || medicine.safetyAdvice.alcohol) && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Safety & Clinical Guidelines
              </h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                {medicine.safetyAdvice.pregnancy && (
                  <p className="bg-orange-50 border border-orange-200/70 p-2.5 rounded-xl text-orange-900">
                    <strong>Pregnancy:</strong> {medicine.safetyAdvice.pregnancy}
                  </p>
                )}
                {medicine.safetyAdvice.driving && (
                  <p className="bg-amber-50 border border-amber-200/70 p-2.5 rounded-xl text-amber-900">
                    <strong>Driving:</strong> {medicine.safetyAdvice.driving}
                  </p>
                )}
                {medicine.safetyAdvice.alcohol && (
                  <p className="bg-slate-100 p-2.5 rounded-xl text-slate-800">
                    <strong>Alcohol:</strong> {medicine.safetyAdvice.alcohol}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Local Pharmacy Guarantee */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Go Plus Quality Guarantee</p>
              <p className="text-emerald-700 text-[11px]">
                Dispensed from licensed partner chemist. Kept in temperature-regulated storage. Expiry guarantee &gt; 6 months.
              </p>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Total Amount</span>
            <span className="text-xl font-black text-slate-900">
              ₹{medicine.price * (quantityInCart || 1)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {quantityInCart > 0 ? (
              <div className="flex items-center bg-slate-900 text-white rounded-xl overflow-hidden shadow-xs">
                <button
                  onClick={() => onUpdateQuantity(medicine.id, -1)}
                  className="p-2.5 hover:bg-slate-800 text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-bold font-mono text-amber-400 min-w-8 text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onUpdateQuantity(medicine.id, 1)}
                  className="p-2.5 hover:bg-slate-800 text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(medicine)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
