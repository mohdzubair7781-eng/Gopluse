import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Truck, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  CheckCircle2,
  HeartHandshake,
  Camera
} from 'lucide-react';

interface HeroProps {
  selectedArea: string;
  onOpenPrescription: () => void;
  onOpenCamera: () => void;
  onSelectCategory: (categoryId: string) => void;
  onQuickSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedArea,
  onOpenPrescription,
  onOpenCamera,
  onSelectCategory,
  onQuickSearch,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-slate-50 to-slate-50 pt-6 pb-8 sm:pt-8 sm:pb-12 border-b border-slate-200">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Action Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Speed Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-semibold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <span>Local Pharmacy Delivery in {selectedArea}</span>
              <span className="font-mono text-amber-700 bg-white/70 px-2 py-0.5 rounded-full text-xs font-bold">
                ⚡ 15–25 Mins
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Medicines & Healthcare <br className="hidden sm:inline" />
              Delivered Fast by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Go Plus</span> 🚚
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Never wait in pharmacy lines when you are unwell. Order genuine tablets, cough syrups, first aid, and baby essentials from your verified neighborhood chemists.
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Camera Photo Option */}
              <button
                id="hero-camera-snap-btn"
                onClick={onOpenCamera}
                className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 active:scale-98"
              >
                <Camera className="w-5 h-5" />
                <span>Snap Medicine Photo 📷</span>
              </button>

              <button
                id="hero-upload-rx-btn"
                onClick={onOpenPrescription}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 font-bold text-sm sm:text-base border border-slate-300 shadow-xs transition-all active:scale-98"
              >
                <UploadCloud className="w-5 h-5 text-amber-600" />
                <span>Upload Doctor&apos;s Prescription</span>
              </button>

              <button
                id="hero-browse-meds-btn"
                onClick={() => {
                  const catalog = document.getElementById('medicine-catalog-section');
                  if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all active:scale-98"
              >
                <span>Browse Catalog</span>
                <span className="text-amber-600 font-bold">→</span>
              </button>
            </div>

            {/* Camera feature prompt card */}
            <div 
              onClick={onOpenCamera}
              className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/15 cursor-pointer transition-colors flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Don&apos;t know the exact medicine name or spelling?
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Click here to snap a picture of your tablet strip or bottle — our camera recognizes it instantly!
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-700 whitespace-nowrap bg-amber-100 px-2.5 py-1 rounded-lg">
                Snap Now &rarr;
              </span>
            </div>

            {/* Emergency & Quick Symptom Pills */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Popular Quick Needs:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '🤒 Fever: Paracetamol & Dolo 650', query: 'Paracetamol' },
                  { label: '🤧 Cough Syrup & Cetirizine', query: 'Cough' },
                  { label: '🩹 Betadine & Antiseptic', query: 'Betadine' },
                  { label: '🔥 Acidity: Pantoprazole & Omeprazole', query: 'Pantoprazole' },
                  { label: '⚡ ORS Powder & Electrolytes', query: 'ORS' },
                  { label: '💪 Pain Relief Spray & Gel', query: 'Pain Relief' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onQuickSearch(item.query)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 font-medium transition-colors shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">100% Genuine</p>
                  <p className="text-[11px] text-slate-500">Verified Exp. Date</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Go Plus Rider</p>
                  <p className="text-[11px] text-slate-500">Live GPS tracking</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">No Min. Order</p>
                  <p className="text-[11px] text-slate-500">Pay cash or online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card + Instant Rx Process */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl border border-slate-200/80 p-5 space-y-4">
              {/* Delivery Banner Image */}
              <div className="relative h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-900 group">
                <img 
                  src="/hero-banner.jpg" 
                  alt="Go Plus Medicine Express Delivery Rider"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to stock medical image
                    e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                
                {/* Overlay live tag */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Riders Active Now: 14 nearby
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">Go Plus Express Delivery</p>
                  <p className="text-sm font-bold truncate">Doorstep medicine drop in sealed sanitized pack</p>
                </div>
              </div>

              {/* 3 Step Quick Prescription Ordering Box */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Have a Doctor&apos;s Prescription?</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Express 2 min verification
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-amber-100 shadow-2xs">
                    <span className="w-5 h-5 mx-auto mb-1 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                      1
                    </span>
                    <p className="font-semibold text-slate-800 text-[11px]">Upload Photo</p>
                    <p className="text-[10px] text-slate-500">Camera or PDF</p>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-amber-100 shadow-2xs">
                    <span className="w-5 h-5 mx-auto mb-1 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                      2
                    </span>
                    <p className="font-semibold text-slate-800 text-[11px]">Chemist Review</p>
                    <p className="text-[10px] text-slate-500">Verify dosage</p>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-amber-100 shadow-2xs">
                    <span className="w-5 h-5 mx-auto mb-1 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                      3
                    </span>
                    <p className="font-semibold text-slate-800 text-[11px]">Rider Dispatched</p>
                    <p className="text-[10px] text-slate-500">20 min ETA</p>
                  </div>
                </div>

                <button
                  onClick={onOpenPrescription}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Order Now</span>
                </button>
              </div>

              {/* Local pharmacy affiliation badge */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Partnered with 18+ licensed pharmacies</span>
                <span className="font-semibold text-emerald-600">✓ Pharmacist On Duty</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
