import React from 'react';
import { Plus, Minus, Star, Zap, Clock, Info, ShieldCheck, Camera, Pencil } from 'lucide-react';
import { Medicine } from '../types';

interface MedicineCardProps {
  medicine: Medicine;
  quantityInCart: number;
  onAddToCart: (medicine: Medicine) => void;
  onUpdateQuantity: (medicineId: string, delta: number) => void;
  onViewDetails: (medicine: Medicine) => void;
  isOwnerMode?: boolean;
  onEditProduct?: (medicine: Medicine) => void;
  onEditImage?: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onViewDetails,
  isOwnerMode = false,
  onEditProduct,
  onEditImage,
}) => {
  const handleEdit = () => {
    if (onEditProduct) {
      onEditProduct(medicine);
    } else if (onEditImage) {
      onEditImage(medicine);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top badges bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {/* Prescription Required (Rx) or OTC */}
        {medicine.requiresPrescription ? (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider shadow-xs">
            Rx Required
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider shadow-xs">
            OTC Med
          </span>
        )}

        {/* Speed tag */}
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-amber-400 flex items-center gap-1 font-mono shadow-xs">
          <Zap className="w-2.5 h-2.5 fill-amber-400" />
          {medicine.deliveryTimeMinutes}m
        </span>
      </div>

      {/* Owner Product Edit Button Overlay */}
      {isOwnerMode && (onEditProduct || onEditImage) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1 transition-transform active:scale-95 border border-amber-300 pointer-events-auto"
          title="Owner: Edit Price, % Off, Photo & Details"
        >
          <Pencil className="w-3 h-3" />
          <span>Edit Price &amp; Photo</span>
        </button>
      )}

      {/* Product Image */}
      <div 
        onClick={() => onViewDetails(medicine)}
        className="relative h-44 overflow-hidden bg-slate-50 cursor-pointer flex items-center justify-center p-3"
      >
        <img 
          src={medicine.image} 
          alt={medicine.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
              target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
            }
          }}
        />

        {/* Discount sticker if applicable */}
        {medicine.discountPercentage > 0 && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-500 text-slate-950">
            {medicine.discountPercentage}% OFF
          </span>
        )}

        {/* Info hover icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(medicine);
          }}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-600 hover:text-amber-600 hover:bg-white shadow-xs transition-colors"
          title="View salt & safety details"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Packaging / Form */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span>{medicine.dosageForm}</span>
            <span className="text-slate-400">•</span>
            <span className="truncate max-w-[130px]">{medicine.packageSize}</span>
          </div>

          {/* Medicine Name */}
          <h3 
            onClick={() => onViewDetails(medicine)}
            className="font-bold text-slate-900 text-sm hover:text-amber-600 line-clamp-1 cursor-pointer transition-colors"
            title={medicine.name}
          >
            {medicine.name}
          </h3>

          {/* Generic / Salt Composition */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium" title={medicine.genericName}>
            {medicine.genericName}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              <span>{medicine.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({medicine.reviewsCount})</span>
            <span className="text-[10px] text-emerald-600 font-semibold ml-auto bg-emerald-50 px-1.5 py-0.2 rounded-md">
              In Stock
            </span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ₹{medicine.price}
              </span>
              {medicine.originalPrice > medicine.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{medicine.originalPrice}
                </span>
              )}
            </div>
            {medicine.priceRange ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                Range: {medicine.priceRange}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">Per unit / pack</span>
            )}
          </div>

          {/* Add to Cart button / Quantity Stepper */}
          {quantityInCart === 0 ? (
            <button
              id={`add-to-cart-${medicine.id}`}
              onClick={() => onAddToCart(medicine)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-900 hover:text-white border border-amber-300 hover:border-amber-500 font-bold text-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center bg-slate-900 text-white rounded-xl overflow-hidden shadow-xs">
              <button
                id={`decrease-cart-${medicine.id}`}
                onClick={() => onUpdateQuantity(medicine.id, -1)}
                className="p-1.5 hover:bg-slate-800 text-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-bold font-mono text-amber-400 min-w-5 text-center">
                {quantityInCart}
              </span>
              <button
                id={`increase-cart-${medicine.id}`}
                onClick={() => onUpdateQuantity(medicine.id, 1)}
                className="p-1.5 hover:bg-slate-800 text-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
