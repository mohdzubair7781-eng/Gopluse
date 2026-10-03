import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Camera, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Lock, 
  Unlock, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  LogOut, 
  Save, 
  IndianRupee,
  Percent,
  Package,
  Pencil,
  Tag,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Medicine } from '../types';
import { optimizeMedicineImage } from '../utils/medicineStorage';

interface OwnerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: Medicine[];
  defaultMedicines: Medicine[];
  selectedMedicineId: string | null;
  onSelectMedicine: (id: string) => void;
  onUpdateMedicine: (updatedMedicine: Medicine) => void;
  onResetMedicine: (medicineId: string) => void;
  onResetAllMedicines: () => void;
  isOwnerAuthenticated: boolean;
  onAuthenticate: (pin: string) => boolean;
  onLogout: () => void;
}

export const OwnerStudioModal: React.FC<OwnerStudioModalProps> = ({
  isOpen,
  onClose,
  medicines,
  defaultMedicines,
  selectedMedicineId,
  onSelectMedicine,
  onUpdateMedicine,
  onResetMedicine,
  onResetAllMedicines,
  isOwnerAuthenticated,
  onAuthenticate,
  onLogout,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  // Image tool tab: 'upload' | 'url' | 'camera'
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'camera'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search query in sidebar
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Medicine
  const activeMed = medicines.find(m => m.id === (selectedMedicineId || medicines[0]?.id)) || medicines[0];
  const originalMed = defaultMedicines.find(d => d.id === activeMed?.id);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    priceRange: '',
    image: '',
    packageSize: '',
    dosageForm: 'Tablets' as Medicine['dosageForm'],
    brand: '',
    inStock: true,
    requiresPrescription: false,
    deliveryTimeMinutes: 15,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const lastActiveIdRef = useRef<string | null>(null);

  // Synchronize form when selected medicine changes or modal opens
  useEffect(() => {
    if (activeMed && (lastActiveIdRef.current !== activeMed.id || !formData.name)) {
      lastActiveIdRef.current = activeMed.id;
      setFormData({
        name: activeMed.name,
        price: activeMed.price,
        originalPrice: activeMed.originalPrice,
        discountPercentage: activeMed.discountPercentage,
        priceRange: activeMed.priceRange || '',
        image: activeMed.image,
        packageSize: activeMed.packageSize,
        dosageForm: activeMed.dosageForm,
        brand: activeMed.brand,
        inStock: activeMed.inStock,
        requiresPrescription: activeMed.requiresPrescription,
        deliveryTimeMinutes: activeMed.deliveryTimeMinutes || 15,
      });
      setUrlInput('');
      setPreviewUrl(null);
    }
  }, [activeMed?.id, isOpen]);

  if (!isOpen) return null;

  // Handle owner PIN login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAuthenticate(pinInput);
    if (success) {
      setAuthError(false);
      setPinInput('');
    } else {
      setAuthError(true);
    }
  };

  // Price & Discount Auto-Calculation
  const handlePriceChange = (newPrice: number) => {
    const validPrice = Math.max(0, newPrice);
    let newDiscount = formData.discountPercentage;
    if (formData.originalPrice > 0) {
      newDiscount = Math.max(0, Math.round(((formData.originalPrice - validPrice) / formData.originalPrice) * 100));
    }
    setFormData(prev => ({
      ...prev,
      price: validPrice,
      discountPercentage: newDiscount,
    }));
    setSavedSuccess(false);
  };

  const handleOriginalPriceChange = (newOriginal: number) => {
    const validOriginal = Math.max(0, newOriginal);
    let newDiscount = formData.discountPercentage;
    if (validOriginal > 0) {
      newDiscount = Math.max(0, Math.round(((validOriginal - formData.price) / validOriginal) * 100));
    }
    setFormData(prev => ({
      ...prev,
      originalPrice: validOriginal,
      discountPercentage: newDiscount,
    }));
    setSavedSuccess(false);
  };

  const handleDiscountChange = (newDiscount: number) => {
    const validDiscount = Math.max(0, Math.min(99, newDiscount));
    let newPrice = formData.price;
    if (formData.originalPrice > 0) {
      newPrice = Math.max(1, Math.round(formData.originalPrice * (1 - validDiscount / 100)));
    }
    setFormData(prev => ({
      ...prev,
      discountPercentage: validDiscount,
      price: newPrice,
    }));
    setSavedSuccess(false);
  };

  const handleApplyPresetDiscount = (pct: number) => {
    handleDiscountChange(pct);
  };

  // File Upload Handler (Compressed & Permanent)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsOptimizingImage(true);
      const optimized = await optimizeMedicineImage(file, 800, 0.85);
      setFormData(prev => ({ ...prev, image: optimized }));
      setSavedSuccess(false);
    } catch (err) {
      console.warn('Failed to compress image, falling back to direct reader:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData(prev => ({ ...prev, image: result }));
          setSavedSuccess(false);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizingImage(false);
    }
  };

  // URL Image Apply
  const handleApplyUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try {
      setIsOptimizingImage(true);
      // Attempt to optimize URL into offline data URL if reachable
      const optimized = await optimizeMedicineImage(trimmed, 800, 0.85);
      setFormData(prev => ({ ...prev, image: optimized }));
    } catch {
      setFormData(prev => ({ ...prev, image: trimmed }));
    } finally {
      setIsOptimizingImage(false);
      setUrlInput('');
      setPreviewUrl(null);
      setSavedSuccess(false);
    }
  };

  // Camera Handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert('Camera access denied or unavailable. Please use file upload or image URL.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    try {
      setIsOptimizingImage(true);
      const canvas = document.createElement('canvas');
      const vw = videoRef.current.videoWidth || 640;
      const vh = videoRef.current.videoHeight || 480;
      const maxDim = 800;
      let targetW = vw;
      let targetH = vh;
      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, image: dataUrl }));
        stopCamera();
        setSavedSuccess(false);
      }
    } finally {
      setIsOptimizingImage(false);
    }
  };

  // Form Submit / Save (Guaranteed Durable Persistence)
  const handleSaveMedicine = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeMed) return;

    let finalImage = formData.image || activeMed.image;
    // If raw large data url, compress it before saving
    if (finalImage.startsWith('data:image/') && finalImage.length > 250000) {
      try {
        finalImage = await optimizeMedicineImage(finalImage, 800, 0.85);
      } catch {
        // Keep as-is
      }
    }

    const updated: Medicine = {
      ...activeMed,
      name: formData.name.trim() || activeMed.name,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      discountPercentage: Number(formData.discountPercentage),
      priceRange: formData.priceRange.trim() || activeMed.priceRange,
      image: finalImage,
      packageSize: formData.packageSize.trim() || activeMed.packageSize,
      dosageForm: formData.dosageForm,
      brand: formData.brand.trim() || activeMed.brand,
      inStock: formData.inStock,
      requiresPrescription: formData.requiresPrescription,
      deliveryTimeMinutes: Number(formData.deliveryTimeMinutes) || 15,
    };

    onUpdateMedicine(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Revert this medicine to original default
  const handleResetCurrent = () => {
    if (!activeMed || !originalMed) return;
    if (confirm(`Reset "${activeMed.name}" back to original pricing and default photo?`)) {
      onResetMedicine(activeMed.id);
      setFormData({
        name: originalMed.name,
        price: originalMed.price,
        originalPrice: originalMed.originalPrice,
        discountPercentage: originalMed.discountPercentage,
        priceRange: originalMed.priceRange || '',
        image: originalMed.image,
        packageSize: originalMed.packageSize,
        dosageForm: originalMed.dosageForm,
        brand: originalMed.brand,
        inStock: originalMed.inStock,
        requiresPrescription: originalMed.requiresPrescription,
        deliveryTimeMinutes: originalMed.deliveryTimeMinutes || 15,
      });
      setSavedSuccess(true);
    }
  };

  // Check if active med is customized compared to default
  const isCustomized = originalMed && (
    originalMed.price !== activeMed.price ||
    originalMed.originalPrice !== activeMed.originalPrice ||
    originalMed.discountPercentage !== activeMed.discountPercentage ||
    originalMed.image !== activeMed.image ||
    originalMed.name !== activeMed.name ||
    originalMed.packageSize !== activeMed.packageSize ||
    originalMed.priceRange !== activeMed.priceRange
  );

  // Filter list
  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl font-bold flex items-center justify-center shadow-xs">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">Owner Studio: Product &amp; Price Editor</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                  Zubair Khan (Owner)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Edit <strong>Main Price (₹)</strong>, <strong>Original Price (MRP)</strong>, <strong>% OFF</strong>, <strong>Product Image</strong>, and stock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerAuthenticated && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Lock Owner Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Mode</span>
              </button>
            )}
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isOwnerAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-1">
              <h4 className="text-xl font-black text-slate-900">Website Owner Verification</h4>
              <p className="text-xs sm:text-sm text-slate-500">
                Dawai ki main price, % off discount aur images edit karne ke liye Owner PIN enter karein.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3.5">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Enter Owner Secret PIN</label>
                  <span className="text-[10px] font-semibold text-slate-400">Restricted</span>
                </div>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (authError) setAuthError(false);
                    }}
                    placeholder="000"
                    maxLength={10}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center font-mono text-lg tracking-widest bg-slate-50 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    title={showPin ? "Hide PIN" : "Show PIN"}
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError ? (
                  <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Incorrect PIN. Access restricted to store owner only.
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 text-center">
                    Confidential &bull; Enter your secret 3-digit owner PIN
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Product &amp; Price Editor</span>
              </button>
            </form>
          </div>
        ) : (
          /* WORKSPACE: SIDEBAR + EDITABLE FORM */
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Sidebar: All Medicines */}
            <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0 max-h-[30vh] md:max-h-full">
              {/* Search */}
              <div className="p-3 border-b border-slate-200 bg-white">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${medicines.length} medicines...`}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                {filteredMedicines.map((med) => {
                  const isSelected = med.id === activeMed?.id;
                  const orig = defaultMedicines.find(d => d.id === med.id);
                  const isEdited = orig && (
                    orig.price !== med.price ||
                    orig.originalPrice !== med.originalPrice ||
                    orig.discountPercentage !== med.discountPercentage ||
                    orig.image !== med.image ||
                    orig.name !== med.name
                  );

                  return (
                    <button
                      key={med.id}
                      onClick={() => {
                        stopCamera();
                        onSelectMedicine(med.id);
                      }}
                      className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${
                        isSelected 
                          ? 'bg-amber-500/20 border border-amber-500/40 text-slate-900 shadow-2xs font-bold' 
                          : 'hover:bg-white text-slate-700'
                      }`}
                    >
                      <img 
                        src={med.image} 
                        alt={med.name} 
                        className="w-11 h-11 object-contain rounded-xl bg-white border border-slate-200 p-1 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold truncate text-slate-900">{med.name}</p>
                          {isEdited && (
                            <span className="text-[9px] font-black text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded shrink-0">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-slate-900">₹{med.price}</span>
                          {med.originalPrice > med.price && (
                            <span className="text-[10px] text-slate-400 line-through">₹{med.originalPrice}</span>
                          )}
                          {med.discountPercentage > 0 && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1 rounded">
                              {med.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{med.packageSize}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Reset all button */}
              <div className="p-3 border-t border-slate-200 bg-white">
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to reset ALL ${medicines.length} medicines back to default prices and photos?`)) {
                      onResetAllMedicines();
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All {medicines.length} Medicines to Default</span>
                </button>
              </div>
            </div>

            {/* Right Pane: Complete Editable Form */}
            {activeMed && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Title & Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-slate-900">{activeMed.name}</h4>
                      {isCustomized ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                          Customized Live
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Default Values
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Category: <strong>{activeMed.categoryLabel}</strong> &bull; ID: <code className="text-[10px] font-mono">{activeMed.id}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCustomized && (
                      <button
                        type="button"
                        onClick={handleResetCurrent}
                        className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        <span>Revert to Default</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSaveMedicine()}
                      className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Update Website</span>
                    </button>
                  </div>
                </div>

                {/* Saved Notification */}
                {savedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Success! &quot;{formData.name}&quot; has been updated live on the website and saved!</span>
                  </div>
                )}

                <form onSubmit={handleSaveMedicine} className="space-y-6">
                  
                  {/* SECTION 1: PRICING, MRP & % OFF */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
                          <IndianRupee className="w-4 h-4" />
                        </div>
                        <h5 className="text-sm font-extrabold text-slate-900">Price, MRP &amp; Discount (% OFF) Settings</h5>
                      </div>
                      <span className="text-[11px] text-amber-900 font-semibold bg-amber-200/70 px-2 py-0.5 rounded-md">
                        Auto-calculating
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Main Selling Price */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>Main Selling Price (₹)</span>
                          <span className="text-[10px] text-emerald-700 font-bold">Customer pays this</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={formData.price}
                            onChange={(e) => handlePriceChange(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 font-extrabold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">Website par ye price bold dikhega.</p>
                      </div>

                      {/* Original Price / MRP */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>Original Price / MRP (₹)</span>
                          <span className="text-[10px] text-slate-500">Cut-price / Strikethrough</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={formData.originalPrice}
                            onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 font-extrabold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">Strikethrough (kata hua) MRP.</p>
                      </div>

                      {/* Discount % Off */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>Discount (% OFF)</span>
                          <span className="text-[10px] text-amber-800 font-bold">Badge text</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="99"
                            step="1"
                            value={formData.discountPercentage}
                            onChange={(e) => handleDiscountChange(Number(e.target.value))}
                            className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-white border border-slate-300 font-extrabold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">%</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Sticker badge: <strong>{formData.discountPercentage}% OFF</strong></p>
                      </div>
                    </div>

                    {/* Quick Preset Discount Buttons */}
                    <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Quick % Off Presets:</span>
                      {[0, 5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleApplyPresetDiscount(pct)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            formData.discountPercentage === pct
                              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                              : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {pct}% OFF
                        </button>
                      ))}
                    </div>

                    {/* Price Range Field */}
                    <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Market Price Range Tag (e.g. &quot;₹10–25&quot;, &quot;₹30–35&quot;)
                        </label>
                        <input
                          type="text"
                          value={formData.priceRange}
                          onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                          placeholder="₹10–25"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 max-w-xs">
                        Ye label card par <strong>Range: {formData.priceRange || 'N/A'}</strong> dikhayega.
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: PRODUCT IMAGE MANAGER */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-900 text-amber-400 rounded-lg">
                          <Camera className="w-4 h-4" />
                        </div>
                        <h5 className="text-sm font-extrabold text-slate-900">Product Image / Dawai Ki Photo</h5>
                      </div>
                      <span className="text-xs text-slate-500">Upload, camera, or web link</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Left: Image preview & status */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="relative w-full h-36 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center overflow-hidden">
                          {isOptimizingImage ? (
                            <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[11px] font-extrabold text-amber-700">Compressing &amp; Locking Photo...</span>
                            </div>
                          ) : (
                            <img
                              src={formData.image}
                              alt="Current Product"
                              className="max-h-full max-w-full object-contain"
                            />
                          )}
                        </div>
                        <div className="w-full text-center space-y-1">
                          <p className="text-[11px] font-bold text-slate-700 truncate w-full">Current Image Preview</p>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Permanent Lock Active</span>
                          </div>
                        </div>
                        {originalMed && originalMed.image !== formData.image && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: originalMed.image }))}
                            className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline"
                          >
                            Revert to original photo
                          </button>
                        )}
                      </div>

                      {/* Right: Tabbed Image Inputs */}
                      <div className="md:col-span-8 space-y-3">
                        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                          <button
                            type="button"
                            onClick={() => {
                              stopCamera();
                              setImageTab('upload');
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              imageTab === 'upload'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload from Phone/PC</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              stopCamera();
                              setImageTab('url');
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              imageTab === 'url'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Paste Web URL</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setImageTab('camera');
                              startCamera();
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              imageTab === 'camera'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Live Camera</span>
                          </button>
                        </div>

                        {/* SUBTAB 1: UPLOAD */}
                        {imageTab === 'upload' && (
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-amber-50/30 transition-all flex flex-col items-center justify-center gap-1.5 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                              Click here to choose photo from Phone Gallery / Files
                            </p>
                            <p className="text-[10px] text-slate-500">
                              JPG, PNG, WEBP supported &bull; Instant update
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </div>
                        )}

                        {/* SUBTAB 2: URL */}
                        {imageTab === 'url' && (
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">Paste Image Link / URL</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => {
                                  setUrlInput(e.target.value);
                                  setPreviewUrl(e.target.value);
                                }}
                                placeholder="https://images.unsplash.com/... or Google Image link"
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                              <button
                                type="button"
                                onClick={handleApplyUrl}
                                disabled={!urlInput.trim()}
                                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-black"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        )}

                        {/* SUBTAB 3: CAMERA */}
                        {imageTab === 'camera' && (
                          <div className="space-y-2">
                            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video max-h-48 flex items-center justify-center">
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-contain"
                              />
                              {!cameraActive && (
                                <div className="text-center text-slate-400 p-2">
                                  <Camera className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                  <p className="text-xs">Starting camera...</p>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={capturePhoto}
                                disabled={!cameraActive}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Capture Photo</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: PRODUCT INFORMATION & AVAILABILITY */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-100 text-slate-800 rounded-lg">
                        <Tag className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-extrabold text-slate-900">Product Name, Packaging &amp; Status</h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Medicine Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Medicine Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>

                      {/* Package Size */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Packaging Size (e.g. 10 tablets, 15 tablets, 100 ml)</label>
                        <input
                          type="text"
                          value={formData.packageSize}
                          onChange={(e) => setFormData(prev => ({ ...prev, packageSize: e.target.value }))}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      {/* Dosage Form */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Dosage Form</label>
                        <select
                          value={formData.dosageForm}
                          onChange={(e) => setFormData(prev => ({ ...prev, dosageForm: e.target.value as Medicine['dosageForm'] }))}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        >
                          <option value="Tablets">Tablets</option>
                          <option value="Capsules">Capsules</option>
                          <option value="Syrup">Syrup</option>
                          <option value="Ointment">Ointment</option>
                          <option value="Drops">Drops</option>
                          <option value="Spray">Spray</option>
                          <option value="Kit">Kit / Sachet</option>
                          <option value="Device">Device</option>
                        </select>
                      </div>

                      {/* Brand / Manufacturer */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Brand / Manufacturer</label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Stock & Prescription Toggles */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          {formData.inStock ? '🟢 In Stock (Available for Delivery)' : '🔴 Out of Stock'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.requiresPrescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, requiresPrescription: e.target.checked }))}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-400"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          {formData.requiresPrescription ? '📋 Doctor Prescription Required (Rx)' : '💊 OTC (Over-The-Counter)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* SECTION 4: LIVE STORE PREVIEW */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Eye className="w-4 h-4 text-amber-600" />
                      <h5 className="text-xs font-extrabold uppercase tracking-wider">Live Customer Card Preview</h5>
                    </div>

                    <div className="max-w-xs bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-3.5 space-y-2.5">
                      <div className="relative h-32 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                        {formData.discountPercentage > 0 && (
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-slate-950">
                            {formData.discountPercentage}% OFF
                          </span>
                        )}
                        <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900 text-amber-400">
                          15m
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">{formData.dosageForm} &bull; {formData.packageSize}</p>
                        <h6 className="text-xs font-extrabold text-slate-900 truncate">{formData.name}</h6>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-slate-900">₹{formData.price}</span>
                            {formData.originalPrice > formData.price && (
                              <span className="text-xs text-slate-400 line-through">₹{formData.originalPrice}</span>
                            )}
                          </div>
                          {formData.priceRange && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded inline-block">
                              Range: {formData.priceRange}
                            </span>
                          )}
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold text-[10px]">
                          + ADD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Changes are saved to browser storage and instantly live on your Go Plus website.
                    </p>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          onClose();
                        }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save &amp; Apply Changes</span>
                      </button>
                    </div>
                  </div>

                </form>

              </div>
            )}

          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Go Plus Owner Panel &bull; Live updates for Price, Image, % OFF, and stock</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
