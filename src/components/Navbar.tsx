import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  UploadCloud, 
  ShoppingBag, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  X,
  Sparkles,
  PackageCheck,
  Camera,
  Instagram,
  Mail
} from 'lucide-react';
import { Logo } from './Logo';
import { LOCAL_AREAS } from '../data/medicines';

interface NavbarProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenPrescription: () => void;
  onOpenCamera: () => void;
  onOpenContact?: () => void;
  activeOrderCount: number;
  onOpenTracking: () => void;
  onOpenOwnerStudio?: () => void;
  isOwnerAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedArea,
  onSelectArea,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenPrescription,
  onOpenCamera,
  onOpenContact,
  activeOrderCount,
  onOpenTracking,
  onOpenOwnerStudio,
  isOwnerAuthenticated = false,
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDetectLocation = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            onSelectArea('Green Valley Heights');
            setDetectingGps(false);
            setIsLocationOpen(false);
          }, 800);
        },
        () => {
          // Fallback
          setTimeout(() => {
            onSelectArea('Central Downtown');
            setDetectingGps(false);
            setIsLocationOpen(false);
          }, 600);
        }
      );
    } else {
      setDetectingGps(false);
    }
  };

  const currentAreaObj = LOCAL_AREAS.find(a => a.name === selectedArea) || LOCAL_AREAS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              ⚡ FAST LOCAL EXPRESS
            </span>
            <span className="hidden sm:inline text-slate-300">
              Local medicines delivered in <strong>15–25 mins</strong> via certified local pharmacies.
            </span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine Batch</span>
            </div>

            <a 
              href="tel:8972947993" 
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors font-medium"
              title="Call Go Plus Helpline"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Call: <strong className="text-white">8972947993</strong></span>
            </a>

            <a 
              href="mailto:goplus313@gmail.com" 
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
              title="Email Go Plus"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>goplus313@gmail.com</span>
            </a>

            <a 
              href="https://www.instagram.com/just_.zubair_?stkn=MW1lenVvaXIwbnJucg==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors"
              title="Follow Go Plus on Instagram"
            >
              <Instagram className="w-3 h-3" />
              <span className="hidden sm:inline">@just_.zubair_</span>
            </a>

            {onOpenOwnerStudio && (
              <button
                id="owner-portal-top-nav-btn"
                onClick={onOpenOwnerStudio}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold transition-all ${
                  isOwnerAuthenticated
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-400/40'
                }`}
                title="Go Plus Owner: Replace or update medicine images"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{isOwnerAuthenticated ? '👑 Owner Mode Active' : 'Owner / Admin'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <button 
              id="brand-home-button"
              onClick={() => {
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="focus:outline-hidden text-left"
            >
              <Logo size="md" />
            </button>

            {/* Local Area Delivery Selector */}
            <div className="relative hidden md:block" ref={locationRef}>
              <button
                id="location-picker-btn"
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-2 text-left px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Deliver To
                  </span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    {currentAreaObj.name.split('&')[0]}
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
                  </span>
                </div>
              </button>

              {/* Location dropdown */}
              {isLocationOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Select Local Delivery Hub</span>
                    <button 
                      onClick={() => setIsLocationOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleDetectLocation}
                    disabled={detectingGps}
                    className="w-full mb-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium text-xs border border-amber-200/80 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {detectingGps ? 'Detecting GPS...' : 'Use Current Live Location'}
                  </button>

                  <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                    {LOCAL_AREAS.map((area) => (
                      <button
                        key={area.code}
                        onClick={() => {
                          onSelectArea(area.name);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedArea === area.name 
                            ? 'bg-amber-500 text-white font-semibold' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{area.name}</p>
                          <p className={`text-[10px] ${selectedArea === area.name ? 'text-amber-100' : 'text-slate-400'}`}>
                            Hub: {area.hub}
                          </p>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                          selectedArea === area.name ? 'bg-amber-600 text-white' : 'bg-slate-100 text-emerald-600 font-medium'
                        }`}>
                          ⚡ {area.eta}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar with Camera search */}
          <div className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-medicines-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search medicines, salts, syrups, paracetamol, pain relief..."
                className="w-full pl-10 pr-20 py-2 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  id="camera-search-btn"
                  type="button"
                  onClick={onOpenCamera}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                  title="Take or share medicine photo"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-[10px] font-bold">Snap</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Contact / Help Button */}
            {onOpenContact && (
              <button
                id="contact-navbar-btn"
                onClick={onOpenContact}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all active:scale-98"
                title="Contact Go Plus (Phone, Gmail, Instagram)"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>Contact Us</span>
              </button>
            )}

            {/* Snap Medicine Photo Button */}
            <button
              id="camera-navbar-btn"
              onClick={onOpenCamera}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all active:scale-98"
            >
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Snap Photo</span>
            </button>

            {/* Quick Prescription Upload Button */}
            <button
              id="upload-rx-navbar-btn"
              onClick={onOpenPrescription}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-98"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden xs:inline">Upload</span>
              <span>Prescription</span>
            </button>

            {/* Owner Portal Quick Access */}
            {onOpenOwnerStudio && (
              <button
                id="owner-navbar-btn"
                onClick={onOpenOwnerStudio}
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-98 ${
                  isOwnerAuthenticated
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title="Go Plus Owner: Change Medicine Photos"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="hidden xl:inline">{isOwnerAuthenticated ? '👑 Owner Mode' : 'Owner Access'}</span>
                <span className="xl:hidden">Owner</span>
              </button>
            )}

            {/* Active order badge if customer has live order */}
            {activeOrderCount > 0 && (
              <button
                id="live-order-tracking-btn"
                onClick={onOpenTracking}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Track</span>
                <span>Rider</span>
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              id="cart-drawer-toggle-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all active:scale-98"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold bg-amber-500 text-slate-950 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search & Local Area Row */}
        <div className="mt-2 sm:hidden flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="search-medicines-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search medicines, symptoms, tablets..."
              className="w-full pl-10 pr-20 py-2 text-sm bg-slate-100 rounded-xl border border-transparent focus:border-amber-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onOpenCamera}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="text-[10px]">Photo</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-600 bg-amber-50/70 border border-amber-200/60 rounded-lg px-2.5 py-1">
            <div className="flex items-center gap-1.5 font-medium text-amber-900 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{currentAreaObj.name}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 font-mono shrink-0">
              ⚡ {currentAreaObj.eta}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
