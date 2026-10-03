import React from 'react';
import { 
  Pill, 
  FileText, 
  Thermometer, 
  Activity, 
  HeartPulse, 
  ShieldAlert, 
  Flame, 
  Sparkles, 
  Baby, 
  Gauge, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../data/medicines';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  rxOnly: boolean;
  onToggleRxOnly: (val: boolean) => void;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'speed' | 'discount';
  onSortChange: (sort: 'popular' | 'price-low' | 'price-high' | 'speed' | 'discount') => void;
  totalProductsCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  rxOnly,
  onToggleRxOnly,
  sortBy,
  onSortChange,
  totalProductsCount,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pill': return <Pill className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'Thermometer': return <Thermometer className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Baby': return <Baby className="w-4 h-4" />;
      case 'Gauge': return <Gauge className="w-4 h-4" />;
      default: return <Pill className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Horizontal scrolling category chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span className={isSelected ? 'text-amber-400' : 'text-slate-500'}>
                {getIcon(cat.icon)}
              </span>
              <span>{cat.name}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-bar with Rx Filter, count & sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/80">
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalProductsCount}</strong> medicines available locally
          </span>

          {/* Rx Filter Toggle */}
          <button
            onClick={() => onToggleRxOnly(!rxOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              rxOnly
                ? 'bg-red-50 text-red-700 border-red-300 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
              rxOnly ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              Rx
            </span>
            <span>Prescription Required Only</span>
            {rxOnly && <Check className="w-3 h-3 text-red-600 ml-0.5" />}
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            <option value="popular">Most Popular</option>
            <option value="speed">Fastest Delivery (15m)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
      </div>
    </div>
  );
};
