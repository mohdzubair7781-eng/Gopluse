import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Instagram, 
  ExternalLink, 
  Copy, 
  Check, 
  MessageCircle, 
  Clock, 
  MapPin, 
  ShieldCheck,
  Bike
} from 'lucide-react';
import { Logo } from './Logo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const contactNumber = "8972947993";
  const gmailAddress = "goplus313@gmail.com";
  const instagramUrl = "https://www.instagram.com/just_.zubair_?stkn=MW1lenVvaXIwbnJucg==";
  const instagramHandle = "@just_.zubair_";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white rounded-xl">
              <Logo size="sm" showSubtitle={false} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Contact Go Plus</h3>
              <p className="text-xs text-amber-400 font-medium">Local Medicine Delivery Support &amp; Enquiries</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Card 1: Phone / WhatsApp */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    Official Contact Number
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-0.5 font-mono">{contactNumber}</p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(contactNumber, 'phone')}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                title="Copy phone number"
              >
                {copiedType === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${contactNumber}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>

              <a
                href={`https://wa.me/91${contactNumber}?text=Hi%20Go%20Plus,%20I%20need%20medicine%20delivery`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: Gmail Support */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Official Gmail
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 break-all">{gmailAddress}</p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(gmailAddress, 'email')}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                title="Copy email address"
              >
                {copiedType === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={`mailto:${gmailAddress}?subject=Go%20Plus%20Medicine%20Delivery%20Enquiry`}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Send an Email</span>
            </a>
          </div>

          {/* Card 3: Instagram */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/20 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    Official Instagram
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900">{instagramHandle}</p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(instagramUrl, 'instagram')}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                title="Copy Instagram link"
              >
                {copiedType === 'instagram' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-opacity"
            >
              <Instagram className="w-4 h-4" />
              <span>Visit Instagram Profile ({instagramHandle})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Service Hours & Dispatch Guarantee */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>24x7 Express Delivery &bull; 15–25 Minutes Dispatch</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Have an urgent prescription or need a specific medicine brand? Reach us directly via phone call, WhatsApp, or Instagram DM. Our pharmacist team will verify stock and deliver directly to your door.
            </p>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
