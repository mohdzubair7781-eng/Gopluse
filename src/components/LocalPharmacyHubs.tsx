import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ThermometerSnowflake, 
  PhoneCall, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2,
  Bike,
  Mail,
  Instagram
} from 'lucide-react';
import { LOCAL_AREAS } from '../data/medicines';

interface LocalPharmacyHubsProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
  onOpenPrescription: () => void;
}

export const LocalPharmacyHubs: React.FC<LocalPharmacyHubsProps> = ({
  selectedArea,
  onSelectArea,
  onOpenPrescription,
}) => {
  return (
    <section className="bg-white py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Hyperlocal Chemist Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Local Pharmacies in Your Area
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Go Plus connects directly with registered, licensed brick-and-mortar chemists in your neighborhood for rapid 15–20 minute doorstep dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Currently Serving:</span>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl">
              📍 {selectedArea}
            </span>
          </div>
        </div>

        {/* Local Area Hub Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOCAL_AREAS.map((hub) => {
            const isCurrent = hub.name === selectedArea;
            return (
              <div
                key={hub.code}
                onClick={() => onSelectArea(hub.name)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-md'
                    : 'border-slate-200 hover:border-amber-300 hover:shadow-md bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-slate-400">
                      HUB {hub.code}
                    </span>
                    <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-emerald-700'
                    }`}>
                      ⚡ {hub.eta}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">
                    {hub.hub}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Serving {hub.name}</span>
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Open 24/7 &bull; Active
                  </span>
                  <span className={`text-xs font-bold ${isCurrent ? 'text-amber-700' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    {isCurrent ? 'Selected Hub ✓' : 'Switch Here →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Feature Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Cold-Chain Temperature Bags</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Insulin, eye drops, antibiotics, and vaccines are packed in insulated temperature-regulated rider boxes to ensure optimal efficacy.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Tamper-Evident Medical Seal</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every package leaves the chemist with a high-security tamper seal. You can inspect the seal before giving your OTP to the rider.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Go Plus Dedicated Riders</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our riders operate agile electric and standard scooters to bypass neighborhood traffic and deliver within 15 to 25 minutes.
            </p>
          </div>
        </div>

        {/* Emergency Call Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 inline-block">
              24x7 EMERGENCY PHARMACY HELPLINE
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Can&apos;t find your prescribed medicine?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Our on-call licensed pharmacists will check stock across affiliated local stores and arrange custom sourcing within 30 minutes.
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <PhoneCall className="w-3.5 h-3.5" /> 8972947993
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-slate-200 font-medium">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> goplus313@gmail.com
              </span>
              <span>&bull;</span>
              <a 
                href="https://www.instagram.com/just_.zubair_?stkn=MW1lenVvaXIwbnJucg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-semibold underline"
              >
                <Instagram className="w-3.5 h-3.5" /> @just_.zubair_
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:8972947993"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 8972947993</span>
            </a>

            <button
              onClick={onOpenPrescription}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              <span>Upload Prescription</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
