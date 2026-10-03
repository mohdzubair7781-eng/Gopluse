import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Clock, 
  CheckCircle, 
  Camera, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { PrescriptionOrder } from '../types';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArea: string;
  onSubmitPrescription: (data: {
    fileName: string;
    patientName: string;
    patientAge: string;
    patientPhone: string;
    deliveryAddress: string;
    requestCall: boolean;
    notes: string;
  }) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  selectedArea,
  onSubmitPrescription,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [requestCall, setRequestCall] = useState(true);
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.includes('image') && !selectedFile.type.includes('pdf')) {
      setError('Please upload a valid image (PNG, JPG) or PDF document.');
      return;
    }
    setError(null);
    setFile(selectedFile);

    if (selectedFile.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please attach or snap a photo of your doctor\'s prescription.');
      return;
    }
    if (!patientName.trim()) {
      setError('Please enter patient name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 7) {
      setError('Please enter a valid contact phone number.');
      return;
    }

    onSubmitPrescription({
      fileName: file.name,
      patientName,
      patientAge,
      patientPhone,
      deliveryAddress: deliveryAddress || `${selectedArea}, Local District`,
      requestCall,
      notes,
    });

    onClose();
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
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Doctor&apos;s Prescription</h2>
              <p className="text-xs text-slate-500">Local Pharmacist reviews &amp; dispatches in 15 mins</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* File Upload Zone */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Prescription Photo / Document *
            </label>

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-amber-500 bg-amber-50/60' 
                    : 'border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/30'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  accept="image/*,application/pdf"
                  className="hidden" 
                />
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Click to browse or drag &amp; drop prescription
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports JPG, PNG, WEBP, or PDF (Max 10MB)
                </p>
                
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Camera Snapshot accepted
                  </span>
                </div>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  {filePreview ? (
                    <img 
                      src={filePreview} 
                      alt="Prescription preview" 
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0" 
                    />
                  ) : (
                    <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-[11px] text-slate-500">{(file.size / 1024).toFixed(1)} KB • Ready for chemist review</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setFile(null); setFilePreview(null); }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Mock Sample Fill helper */}
          {!file && (
            <button
              type="button"
              onClick={() => {
                // Mock test prescription for quick testing
                setFile(new File(["prescription mock"], "Dr_Sharma_Rx_Prescription.png", { type: "image/png" }));
                setFilePreview("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80");
                setPatientName("Aarav Patel");
                setPatientAge("34");
                setPatientPhone("9876543210");
                setDeliveryAddress("Flat 402, Sunshine Apartments, Green Valley");
                setError(null);
              }}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium underline flex items-center gap-1"
            >
              ⚡ Fill sample test prescription details for quick demo
            </button>
          )}

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Age / Gender</label>
              <input
                type="text"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 28 / M"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>

          {/* Phone & Delivery Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address / Flat No.</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={`Street, Landmark (${selectedArea})`}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>

          {/* Pharmacist Call Option */}
          <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-2xl space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={requestCall}
                onChange={(e) => setRequestCall(e.target.checked)}
                className="mt-1 rounded-sm text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Have pharmacist call me before dispensing
                </span>
                <span className="text-slate-600">
                  Recommended if doctor&apos;s handwriting is unclear or you only need specific items from the slip.
                </span>
              </div>
            </label>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Instructions for Pharmacist / Rider (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Deliver only the 5-day antibiotic course, or ring doorbell twice."
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Trust points */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Confidential &amp; HIPAA Compliant
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Dispatches in 15–20 Mins
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              id="submit-prescription-btn"
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Prescription &amp; Dispatch Rider</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
