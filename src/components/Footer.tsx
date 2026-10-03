import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Heart, Clock, Bike, Instagram, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2 rounded-2xl inline-block">
              <Logo size="md" showSubtitle={false} />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              <strong>Go Plus</strong> is your trusted neighborhood medicine delivery partner. We dispatch verified pharmaceutical essentials, emergency painkillers, baby care, and doctor-prescribed drugs to your home within 15–25 minutes.
            </p>
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Dispatch Active
              </span>
              <span>&bull;</span>
              <span>Local Pharmacy Drug License #DL-GO-98124</span>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="tel:8972947993"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>8972947993</span>
              </a>

              <a
                href="mailto:goplus313@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/50 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>goplus313@gmail.com</span>
              </a>

              <a
                href="https://www.instagram.com/just_.zubair_?stkn=MW1lenVvaXIwbnJucg=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-orange-500/20 text-pink-300 border border-pink-500/30 hover:border-pink-400 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>@just_.zubair_</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Medicines</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-amber-400 cursor-pointer">Fever &amp; Paracetamol</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Cold, Cough &amp; Syrups</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">First Aid &amp; Betadine</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Diabetes &amp; BP Tablets</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Stomach &amp; Antacids</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Multivitamins &amp; Vitamin C</span></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Services</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-amber-400 cursor-pointer">Upload Doctor Prescription</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">15-Min Express Scooter Delivery</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Chronic Refill Subscriptions</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Pharmacist Phone Consultation</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Temperature Controlled Cold-Bag</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Hospital Emergency Drop</span></li>
            </ul>
          </div>

          {/* Col 4: Contact & Local Hub */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Contact &amp; Connect</h4>
            <div className="space-y-2.5 text-slate-400">
              <a 
                href="tel:8972947993"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Call / WhatsApp</p>
                  <p className="text-slate-200 font-bold">8972947993</p>
                </div>
              </a>

              <a 
                href="mailto:goplus313@gmail.com"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Email Support</p>
                  <p className="text-slate-200 font-bold">goplus313@gmail.com</p>
                </div>
              </a>

              <a 
                href="https://www.instagram.com/just_.zubair_?stkn=MW1lenVvaXIwbnJucg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Instagram</p>
                  <p className="text-pink-300 font-bold flex items-center gap-1">
                    <span>@just_.zubair_</span>
                    <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-2 pt-1 border-t border-slate-900">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Go Plus Central Pharmacy Depot, Main Avenue Hub</span>
              </div>
              
              <p className="flex items-center gap-2 text-amber-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Open 24 Hours &bull; 7 Days</span>
              </p>
            </div>
          </div>

        </div>

        {/* Legal disclaimer on medicines */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">Statutory Pharmaceutical Disclaimer:</p>
          <p>
            Go Plus acts as a licensed technological and delivery fulfillment platform connecting verified consumers with registered retail pharmacies. Prescription medicines (marked Rx) will only be delivered upon valid digital prescription verification by a registered pharmacist as mandated by national drug regulations.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>&copy; {new Date().getFullYear()} Go Plus Medicine Delivery 🚚 &bull; All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/just_.zubair_?stkn=MW1lenVvaXIwbnJucg==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 flex items-center gap-1 font-semibold"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span>&bull;</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Delivery</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 cursor-pointer">Pharmacy License</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
