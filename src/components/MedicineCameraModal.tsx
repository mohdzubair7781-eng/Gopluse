import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  RotateCcw, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ShoppingBag, 
  Plus, 
  AlertCircle, 
  Phone, 
  Bike, 
  Eye, 
  Search, 
  FlipHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Medicine } from '../types';
import { SAMPLE_MEDICINES } from '../data/medicines';

interface MedicineCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (medicine: Medicine) => void;
  onOrderPhotoDirectly: (photoData: {
    photoUrl: string;
    medicineNameEstimated: string;
    quantity: number;
    notes: string;
  }) => void;
  selectedArea: string;
}

const SAMPLE_DEMO_PHOTOS = [
  {
    name: 'Dolo 650 Strip',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    matchedMedicineId: 'med-2',
    confidence: '99% Match',
  },
  {
    name: 'Paracetamol 500 mg Strip',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    matchedMedicineId: 'med-1',
    confidence: '98% Match',
  },
  {
    name: 'Cough Syrup (100ml) Bottle',
    url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&auto=format&fit=crop&q=80',
    matchedMedicineId: 'med-13',
    confidence: '97% Match',
  },
  {
    name: 'Betadine Ointment (20g) Tube',
    url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
    matchedMedicineId: 'med-14',
    confidence: '96% Match',
  },
];

export const MedicineCameraModal: React.FC<MedicineCameraModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onOrderPhotoDirectly,
  selectedArea,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [matchedMedicine, setMatchedMedicine] = useState<Medicine | null>(null);
  const [alternativeMatches, setAlternativeMatches] = useState<Medicine[]>([]);
  const [notes, setNotes] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [directOrderSubmitted, setDirectOrderSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetState();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported by your browser or in this window.');
        return;
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError('Unable to open live camera. You can still upload a photo or pick from sample medicine photos below.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const resetState = () => {
    setCapturedPhoto(null);
    setIsScanning(false);
    setMatchedMedicine(null);
    setAlternativeMatches([]);
    setNotes('');
    setDirectOrderSubmitted(false);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
      analyzeMedicinePhoto(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhoto(dataUrl);
      stopCamera();
      analyzeMedicinePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handlePickDemoPhoto = (demo: typeof SAMPLE_DEMO_PHOTOS[0]) => {
    setCapturedPhoto(demo.url);
    stopCamera();
    analyzeMedicinePhoto(demo.url, demo.matchedMedicineId);
  };

  // Smart matching simulation
  const analyzeMedicinePhoto = (photoUrl: string, explicitMatchId?: string) => {
    setIsScanning(true);
    setMatchedMedicine(null);
    setAlternativeMatches([]);

    setTimeout(() => {
      setIsScanning(false);

      if (explicitMatchId) {
        const found = SAMPLE_MEDICINES.find(m => m.id === explicitMatchId);
        if (found) {
          setMatchedMedicine(found);
          setAlternativeMatches(SAMPLE_MEDICINES.filter(m => m.id !== found.id && m.category === found.category).slice(0, 2));
          return;
        }
      }

      // Default smart recognition: Match Dolo 650 or first medicine with related alternatives
      const match = SAMPLE_MEDICINES[0]; // Dolo 650
      setMatchedMedicine(match);
      setAlternativeMatches([SAMPLE_MEDICINES[1], SAMPLE_MEDICINES[2]]);
    }, 1200);
  };

  const handleRetake = () => {
    resetState();
    startCamera();
  };

  const handleSendToChemist = () => {
    if (!capturedPhoto) return;
    setDirectOrderSubmitted(true);
    onOrderPhotoDirectly({
      photoUrl: capturedPhoto,
      medicineNameEstimated: matchedMedicine?.name || 'Photo Identified Medicine',
      quantity: orderQuantity,
      notes: notes || 'Please deliver this exact medicine seen in photo',
    });

    setTimeout(() => {
      onClose();
    }, 1600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Snap Medicine Photo &bull; Instant Match
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AI + Chemist Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Snap a tablet strip, syrup box, or tube to find or order instantly
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Viewfinder / Captured Photo Display */}
          {!capturedPhoto ? (
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px]">
              
              {/* Live Video Feed */}
              {!cameraError ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover max-h-[380px]"
                  />

                  {/* Camera Reticle / Target Frame Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                    <div className="w-64 sm:w-72 h-44 sm:h-52 border-2 border-dashed border-amber-400/90 rounded-2xl relative shadow-2xl">
                      {/* Corner marks */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-amber-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-amber-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-amber-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-amber-400" />

                      {/* Center helper line */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-amber-300 bg-slate-950/70 px-2.5 py-1 rounded-full backdrop-blur-xs">
                          Align medicine name or tablet strip
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Viewfinder Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                    {/* Switch Camera */}
                    <button
                      type="button"
                      onClick={() => setFacingMode(m => m === 'environment' ? 'user' : 'environment')}
                      className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700 transition-colors shadow-lg"
                      title="Flip camera"
                    >
                      <FlipHorizontal className="w-5 h-5" />
                    </button>

                    {/* Shutter Button */}
                    <button
                      type="button"
                      onClick={handleCapture}
                      className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                      title="Capture Medicine Photo"
                    >
                      <div className="w-13 h-13 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-inner">
                        <Camera className="w-6 h-6" />
                      </div>
                    </button>

                    {/* Upload from Gallery button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700 transition-colors shadow-lg"
                      title="Upload photo"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                /* Camera Error / Permission Fallback View */
                <div className="p-8 text-center max-w-md space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white">Live Camera Preview</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cameraError}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Gallery</span>
                    </button>
                    <button
                      onClick={startCamera}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Camera Again</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden canvas for capturing video frame */}
              <canvas ref={canvasRef} className="hidden" />
              {/* Hidden file input for file upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            /* Photo Captured View & Recognition Result */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-900 rounded-3xl p-4 border border-slate-800">
                {/* Captured Image */}
                <div className="sm:col-span-4 relative h-40 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-700">
                  <img
                    src={capturedPhoto}
                    alt="Captured medicine"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-md">
                    Photo Captured
                  </span>
                </div>

                {/* Status Column */}
                <div className="sm:col-span-8 space-y-2 text-white">
                  {isScanning ? (
                    <div className="py-4 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 text-sm font-bold animate-pulse">
                        <Sparkles className="w-4 h-4" />
                        <span>Analyzing medicine package &amp; salt composition...</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Checking matching tablets, dosage, and local stock in {selectedArea}...
                      </p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-amber-500 animate-progress rounded-full" />
                      </div>
                    </div>
                  ) : matchedMedicine ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Medicine Recognized
                        </span>
                        <span className="text-[11px] text-amber-300 font-mono">
                          98% Match
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white">
                        {matchedMedicine.name}
                      </h3>
                      <p className="text-xs text-amber-400 font-medium">
                        {matchedMedicine.genericName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {matchedMedicine.packageSize} &bull; Mfr: {matchedMedicine.brand}
                      </p>

                      <div className="pt-2 flex items-center gap-3">
                        <span className="text-lg font-black text-white">
                          ₹{matchedMedicine.price}
                        </span>
                        <button
                          onClick={() => {
                            onAddToCart(matchedMedicine);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag &bull; ₹{matchedMedicine.price}</span>
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="pt-1">
                    <button
                      onClick={handleRetake}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 underline transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake or choose different photo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Pharmacist Doorstep Dispatch Card */}
              <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Send Photo Directly to Chemist for 15-Min Delivery
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Chemist Online
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Can&apos;t confirm if this is the exact match? No problem! Our licensed neighborhood pharmacist will inspect your photo, verify the medicine batch, and dispatch a Go Plus scooter rider immediately.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Packs / Quantity Needed</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 5].map(qty => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setOrderQuantity(qty)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                            orderQuantity === qty
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {qty} {qty === 1 ? 'Pack' : 'Packs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Customer Note (Optional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Deliver full strip, ring doorbell"
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    disabled={directOrderSubmitted}
                    onClick={handleSendToChemist}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-80"
                  >
                    {directOrderSubmitted ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chemist Received! Dispatching Rider...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Bike className="w-4 h-4" />
                        <span>Confirm &bull; Dispatch via Go Plus Scooter (₹{matchedMedicine ? matchedMedicine.price * orderQuantity : 120})</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Test Photos */}
          {!capturedPhoto && (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Or Try Sample Medicine Photos for Quick Demo:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_DEMO_PHOTOS.map((demo) => (
                  <button
                    key={demo.name}
                    onClick={() => handlePickDemoPhoto(demo)}
                    className="p-2 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-left transition-all group flex flex-col items-center text-center"
                  >
                    <img
                      src={demo.url}
                      alt={demo.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-16 object-cover rounded-xl mb-1.5"
                    />
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-amber-700">
                      {demo.name}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-semibold">
                      {demo.confidence}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Pharmacist Guarantee */}
          <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All photo orders are cross-checked by a registered local pharmacist prior to billing and delivery.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
