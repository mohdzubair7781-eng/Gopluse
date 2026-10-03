import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Bike, 
  Package, 
  Store, 
  Navigation, 
  PhoneCall, 
  MessageSquare,
  AlertCircle,
  Share2
} from 'lucide-react';
import { Order } from '../types';

interface LiveTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onCancelOrder?: (orderId: string) => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  order,
  onClose,
  onCancelOrder,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // Start at rider dispatched for realistic excitement
  const [etaMinutes, setEtaMinutes] = useState(16);
  const [scooterProgress, setScooterProgress] = useState(38); // percentage along route (0 to 100)
  const [riderCallAlert, setRiderCallAlert] = useState(false);

  useEffect(() => {
    if (!order) return;

    // Simulate active movement of the rider towards customer destination
    const interval = setInterval(() => {
      setScooterProgress((prev) => {
        if (prev >= 96) {
          setCurrentStepIndex(4); // Arrived
          setEtaMinutes(1);
          return 98;
        }
        if (prev > 75) {
          setCurrentStepIndex(3); // Arriving
          setEtaMinutes(4);
        } else if (prev > 40) {
          setCurrentStepIndex(2); // On the way
          setEtaMinutes((m) => Math.max(2, m - 1));
        }
        return prev + 3;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  const steps = [
    { title: 'Order Confirmed', time: 'Just now', desc: 'Pharmacist accepted order' },
    { title: 'Prescription & Batch Verified', time: '2 mins ago', desc: 'Expiry checked, sealed in pouch' },
    { title: 'Go Plus Rider Picked Up', time: 'En route', desc: `${order.riderName} is on scooter` },
    { title: 'Arriving at Your Door', time: 'Upcoming', desc: `Reaching ${order.address.area}` },
    { title: 'Delivered Safely', time: 'Final', desc: 'Confirm with delivery OTP' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Live Go Plus Delivery Tracker
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                  ON TIME
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Order #{order.id} &bull; Estimated Arrival: <strong className="text-amber-400">{etaMinutes} mins</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable tracker body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Animated Local Map Route Visualizer */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 p-4 border border-slate-800 shadow-inner">
            
            {/* Map Canvas Background Grid */}
            <div 
              className="h-44 sm:h-52 w-full relative rounded-2xl overflow-hidden bg-[#0c1322]"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              {/* Simulated streets / roadmap lines */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Secondary streets */}
                <path d="M 30,160 L 220,160 L 380,80 L 580,80" stroke="#1e293b" strokeWidth="6" fill="none" />
                <path d="M 120,20 L 120,190" stroke="#1e293b" strokeWidth="5" fill="none" />
                <path d="M 460,10 L 460,180" stroke="#1e293b" strokeWidth="5" fill="none" />

                {/* Primary Delivery Route Curve */}
                <path 
                  id="delivery-route-path"
                  d="M 60,60 C 180,60 180,140 320,140 C 420,140 450,70 540,70" 
                  stroke="#334155" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  fill="none" 
                />
                
                {/* Active completed route highlight with glowing gradient */}
                <path 
                  d="M 60,60 C 180,60 180,140 320,140 C 420,140 450,70 540,70" 
                  stroke="url(#routeGradient)" 
                  strokeWidth="6" 
                  strokeDasharray="600"
                  strokeDashoffset={600 - (600 * scooterProgress / 100)}
                  strokeLinecap="round"
                  fill="none" 
                  className="transition-all duration-1000 ease-out"
                />

                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Origin: Local Chemist Hub */}
              <div className="absolute top-8 left-8 sm:left-10 flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-slate-900/90 px-2 py-0.5 rounded-md mt-1 border border-slate-700">
                  Local Chemist Hub
                </span>
              </div>

              {/* Destination: Customer Home */}
              <div className="absolute top-10 right-8 sm:right-12 flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded-md mt-1 border border-slate-700">
                  Your Address
                </span>
              </div>

              {/* Animated Scooter Courier Marker moving along percentage */}
              <div 
                className="absolute z-20 transition-all duration-1000 ease-out flex flex-col items-center"
                style={{
                  left: `${Math.min(85, Math.max(14, scooterProgress))}%`,
                  top: scooterProgress < 50 ? '38%' : '52%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Pulse wave behind rider */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-amber-400 rounded-full blur-xs opacity-60 animate-ping" />
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/50">
                    <Bike className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-1 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
                  <span>Go Plus Express</span>
                  <span className="font-mono">({etaMinutes}m)</span>
                </div>
              </div>

              {/* Bottom HUD overlay */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Navigation className="w-3 h-3 text-amber-400" />
                  Speed: 28 km/h &bull; Temperature Controlled Bag: 19°C
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  Distance: {(etaMinutes * 0.18).toFixed(1)} km
                </span>
              </div>
            </div>

            {/* OTP Verification Pill */}
            <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-medium text-slate-200">
                  Share OTP with rider upon delivery:
                </span>
              </div>
              <div className="px-3 py-1 bg-amber-500 text-slate-950 font-mono font-black text-base rounded-xl tracking-widest">
                {order.otp}
              </div>
            </div>
          </div>

          {/* Rider Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {order.riderName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{order.riderName}</h3>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md">
                    ★ 4.9
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{order.riderVehicle}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  ✓ Vaccinated &amp; Temperature Checked (98.2°F)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRiderCallAlert(true);
                  setTimeout(() => setRiderCallAlert(false), 4000);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Rider</span>
              </button>

              <button
                onClick={() => {
                  setRiderCallAlert(true);
                  setTimeout(() => setRiderCallAlert(false), 4000);
                }}
                className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                title="Message Rider"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {riderCallAlert && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between animate-in fade-in">
              <span>Connecting encrypted voice line to {order.riderName} ({order.riderPhone})...</span>
              <button onClick={() => setRiderCallAlert(false)} className="text-blue-500 font-bold">✕</button>
            </div>
          )}

          {/* Delivery Steps Progress Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Milestones
            </h4>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="relative flex items-start gap-3 pl-8">
                    {/* Circle marker */}
                    <div 
                      className={`absolute left-1.5 top-0.5 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${isCurrent ? 'text-amber-600' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destination Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Delivering to {order.address.fullName} ({order.address.type})</span>
            </div>
            <p className="text-slate-600 pl-5">
              {order.address.street}, {order.address.apartment && `${order.address.apartment}, `} {order.address.area}
            </p>
            {order.address.landmark && (
              <p className="text-slate-400 pl-5 text-[11px]">
                Landmark: {order.address.landmark}
              </p>
            )}
          </div>

          {/* Items in this Order */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Medicines in this Package ({order.items.length})
            </span>
            <div className="space-y-1.5">
              {order.items.map(({ medicine, quantity }) => (
                <div key={medicine.id} className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-800 font-medium">
                    {medicine.name} <span className="text-slate-400">x{quantity}</span>
                  </span>
                  <span className="font-mono text-slate-900">₹{medicine.price * quantity}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total ({order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'})</span>
                <span className="text-amber-600">₹{order.total}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>Chemist Support:</span>
            <a href="tel:8972947993" className="font-bold text-amber-600 hover:text-amber-700 underline">
              8972947993
            </a>
            <span>&bull;</span>
            <a href="mailto:goplus313@gmail.com" className="font-medium text-slate-700 hover:underline">
              goplus313@gmail.com
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-xs"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
