import React, { useState, useEffect, useMemo } from 'react';
import { 
  Pill, 
  Search, 
  UploadCloud, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Bike,
  Camera
} from 'lucide-react';
import { Medicine, CartItem, Order, DeliveryAddress } from './types';
import { SAMPLE_MEDICINES, LOCAL_AREAS, RIDERS_POOL } from './data/medicines';
import { 
  getInitialMedicines, 
  loadCustomMedicines, 
  saveCustomMedicines, 
  clearCustomMedicines 
} from './utils/medicineStorage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { MedicineCard } from './components/MedicineCard';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { MedicineCameraModal } from './components/MedicineCameraModal';
import { ContactModal } from './components/ContactModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { LocalPharmacyHubs } from './components/LocalPharmacyHubs';
import { Footer } from './components/Footer';
import { OwnerStudioModal } from './components/OwnerStudioModal';

export default function App() {
  // State
  const [selectedArea, setSelectedArea] = useState<string>(() => {
    return localStorage.getItem('goplus_area') || LOCAL_AREAS[0].name;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rxOnly, setRxOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'speed' | 'discount'>('popular');

  // Owner Authentication & Studio State
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('goplus_owner_auth') === 'true';
  });
  const [isOwnerStudioOpen, setIsOwnerStudioOpen] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);

  // Dynamic Medicines List (initialized synchronously for instant UI, backed by IndexedDB + LocalStorage)
  const [medicines, setMedicines] = useState<Medicine[]>(() => getInitialMedicines());

  // Load custom medicines from IndexedDB on startup (guarantees durability across reloads and tab closures)
  useEffect(() => {
    loadCustomMedicines().then((persisted) => {
      if (persisted && persisted.length > 0) {
        setMedicines(persisted);
      }
    });
  }, []);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('goplus_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('goplus_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [selectedDetailMedicine, setSelectedDetailMedicine] = useState<Medicine | null>(null);

  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [hasPrescription, setHasPrescription] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('goplus_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('goplus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('goplus_area', selectedArea);
  }, [selectedArea]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Owner Authentication & Product/Price Update Handlers
  const handleAuthenticateOwner = (pin: string): boolean => {
    // Strictly secure owner access: only secret PIN 313 is valid
    if (pin.trim() === '313') {
      setIsOwnerAuthenticated(true);
      localStorage.setItem('goplus_owner_auth', 'true');
      showToast('Welcome, Zubair Khan! Owner Product Studio unlocked.');
      return true;
    }
    return false;
  };

  const handleLogoutOwner = () => {
    setIsOwnerAuthenticated(false);
    localStorage.removeItem('goplus_owner_auth');
    showToast('Owner Mode locked.');
  };

  const handleUpdateMedicine = (updatedMed: Medicine) => {
    setMedicines(prev => {
      const next = prev.map(m => m.id === updatedMed.id ? updatedMed : m);
      // Persist asynchronously to both IndexedDB and LocalStorage
      saveCustomMedicines(next);
      return next;
    });

    // Also update in cart if present
    setCart(prev => prev.map(item => item.medicine.id === updatedMed.id ? { ...item, medicine: updatedMed } : item));

    // Keep detail modal updated in real-time if open
    setSelectedDetailMedicine(prev => prev && prev.id === updatedMed.id ? updatedMed : prev);

    showToast(`Saved & Locked! "${updatedMed.name}" photo & details permanently saved.`);
  };

  const handleResetMedicine = (medicineId: string) => {
    const original = SAMPLE_MEDICINES.find(s => s.id === medicineId);
    if (!original) return;
    handleUpdateMedicine(original);
    showToast(`Restored default settings for ${original.name}`);
  };

  const handleResetAllMedicines = () => {
    setMedicines(SAMPLE_MEDICINES);
    clearCustomMedicines();
    if (selectedDetailMedicine) {
      const original = SAMPLE_MEDICINES.find(s => s.id === selectedDetailMedicine.id);
      if (original) setSelectedDetailMedicine(original);
    }
    setCart(prev => prev.map(item => {
      const original = SAMPLE_MEDICINES.find(s => s.id === item.medicine.id);
      return original ? { ...item, medicine: original } : item;
    }));
    showToast(`All ${SAMPLE_MEDICINES.length} medicines restored to default prices, % OFF, and photos!`);
  };

  const handleOpenEditProduct = (medicine: Medicine) => {
    setEditingMedicineId(medicine.id);
    setIsOwnerStudioOpen(true);
  };

  // Cart operations
  const handleAddToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
    showToast(`Added ${medicine.name.split(' ')[0]} to bag!`);
  };

  const handleUpdateQuantity = (medicineId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.medicine.id === medicineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  // Prescription upload completion flow
  const handlePrescriptionSubmit = (data: {
    fileName: string;
    patientName: string;
    patientAge: string;
    patientPhone: string;
    deliveryAddress: string;
    requestCall: boolean;
    notes: string;
  }) => {
    setHasPrescription(true);

    // Pick random rider for prescription express fulfillment
    const randomRider = RIDERS_POOL[Math.floor(Math.random() * RIDERS_POOL.length)];
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create custom prescription order
    const prescriptionOrder: Order = {
      id: `GP-RX-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [
        {
          medicine: {
            id: 'rx-dispensed-1',
            name: `Prescription Meds (${data.fileName})`,
            brand: 'Dispensed by Licensed Chemist',
            genericName: 'Doctor Prescribed Formulation',
            category: 'prescription',
            categoryLabel: 'Prescription',
            dosageForm: 'Tablets',
            packageSize: 'Standard Dispensed Course',
            price: 240,
            originalPrice: 280,
            discountPercentage: 14,
            requiresPrescription: true,
            inStock: true,
            deliveryTimeMinutes: 18,
            rating: 5.0,
            reviewsCount: 1,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
            description: `Prescription verification completed for ${data.patientName}. Pharmacist checked notes: ${data.notes || 'Full course as indicated by physician'}.`,
            uses: ['Doctor instructed course'],
            composition: 'As per uploaded prescription',
            manufacturer: 'City Care Licensed Pharmacy',
            storage: 'Keep cool and dry',
            safetyAdvice: {},
          },
          quantity: 1,
        }
      ],
      prescriptionUploaded: true,
      prescriptionFileName: data.fileName,
      address: {
        fullName: data.patientName,
        phone: data.patientPhone,
        street: data.deliveryAddress,
        apartment: '',
        area: selectedArea,
        city: 'Local Area',
        pinCode: '110045',
        type: 'Home',
      },
      paymentMethod: 'cod',
      deliveryType: 'express',
      subtotal: 240,
      deliveryFee: 0,
      discount: 0,
      total: 240,
      status: 'confirmed',
      createdAt: Date.now(),
      estimatedDeliveryTime: Date.now() + 18 * 60 * 1000,
      riderName: randomRider.name,
      riderPhone: randomRider.phone,
      riderVehicle: randomRider.vehicle,
      otp: generatedOtp,
    };

    setOrders(prev => [prescriptionOrder, ...prev]);
    setActiveTrackingOrder(prescriptionOrder);
    setIsTrackingOpen(true);
    showToast(`Prescription submitted! Rider ${randomRider.name} assigned.`);
  };

  // Checkout order placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setActiveTrackingOrder(newOrder);
    setIsTrackingOpen(true);
    showToast(`Order #${newOrder.id} placed! 15m Go Plus Delivery initiated.`);
  };

  // Direct order via medicine photo
  const handleOrderPhotoDirectly = (photoData: {
    photoUrl: string;
    medicineNameEstimated: string;
    quantity: number;
    notes: string;
  }) => {
    const randomRider = RIDERS_POOL[Math.floor(Math.random() * RIDERS_POOL.length)];
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const photoOrder: Order = {
      id: `GP-CAM-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [
        {
          medicine: {
            id: `photo-med-${Date.now()}`,
            name: photoData.medicineNameEstimated || 'Photo Identified Medicine',
            brand: 'Verified Neighborhood Chemist',
            genericName: 'Customer Photo Sourced Order',
            category: 'fever-pain',
            categoryLabel: 'Photo Order',
            dosageForm: 'Tablets',
            packageSize: `${photoData.quantity} Unit(s)`,
            price: 120,
            originalPrice: 150,
            discountPercentage: 20,
            requiresPrescription: false,
            inStock: true,
            deliveryTimeMinutes: 18,
            rating: 5.0,
            reviewsCount: 1,
            image: photoData.photoUrl,
            description: `Chemist verified from user camera photo. Note: ${photoData.notes}`,
            uses: ['Local pharmacy verified medication'],
            composition: 'As identified from camera image',
            manufacturer: 'Licensed Pharmacy Partner',
            storage: 'Normal Room Temp',
            safetyAdvice: {},
          },
          quantity: photoData.quantity,
        }
      ],
      prescriptionUploaded: false,
      address: {
        fullName: 'Rahul Verma',
        phone: '+91 98765 21098',
        street: 'Flat 304, Green Heights',
        apartment: 'Tower B',
        area: selectedArea,
        city: 'Local Area',
        pinCode: '110045',
        type: 'Home',
      },
      paymentMethod: 'cod',
      deliveryType: 'express',
      subtotal: 120 * photoData.quantity,
      deliveryFee: 0,
      discount: 0,
      total: 120 * photoData.quantity,
      status: 'confirmed',
      createdAt: Date.now(),
      estimatedDeliveryTime: Date.now() + 18 * 60 * 1000,
      riderName: randomRider.name,
      riderPhone: randomRider.phone,
      riderVehicle: randomRider.vehicle,
      otp: generatedOtp,
    };

    setOrders(prev => [photoOrder, ...prev]);
    setActiveTrackingOrder(photoOrder);
    setIsTrackingOpen(true);
    showToast(`Chemist verified photo! Rider ${randomRider.name} dispatched.`);
  };

  // Filter and sort catalog
  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      // Category filter
      if (selectedCategory !== 'all' && med.category !== selectedCategory) {
        return false;
      }

      // Rx only filter
      if (rxOnly && !med.requiresPrescription) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = med.name.toLowerCase().includes(q);
        const matchesGeneric = med.genericName.toLowerCase().includes(q);
        const matchesBrand = med.brand.toLowerCase().includes(q);
        const matchesUses = med.uses.some(u => u.toLowerCase().includes(q));
        const matchesCategory = med.categoryLabel.toLowerCase().includes(q);

        if (!matchesName && !matchesGeneric && !matchesBrand && !matchesUses && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'speed') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      return b.rating - a.rating; // default: popular / rating
    });
  }, [medicines, selectedCategory, rxOnly, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenCamera={() => setIsCameraOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        activeOrderCount={orders.length}
        onOpenTracking={() => {
          if (orders.length > 0) {
            setActiveTrackingOrder(orders[0]);
            setIsTrackingOpen(true);
          }
        }}
        onOpenOwnerStudio={() => setIsOwnerStudioOpen(true)}
        isOwnerAuthenticated={isOwnerAuthenticated}
      />

      {/* Hero Section */}
      <Hero
        selectedArea={selectedArea}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenCamera={() => setIsCameraOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('medicine-catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickSearch={(query) => {
          setSearchQuery(query);
          const el = document.getElementById('medicine-catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main id="medicine-catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Section Title & Filter Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Explore Local Pharmacy Catalog</span>
                <span className="text-amber-500 font-mono text-sm font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  ⚡ 15–20 Mins
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                All medicines are in stock at licensed chemists near <strong className="text-slate-800">{selectedArea}</strong>.
              </p>
            </div>

            {searchQuery && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Search results for: <strong className="text-slate-900">&ldquo;{searchQuery}&rdquo;</strong>
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Owner Mode Active / Toggle Banner */}
          {isOwnerAuthenticated ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">👑 Owner Mode Active (Zubair Khan)</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                      Product &amp; Price Editor
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Aap kisi bhi dawai par <strong>&quot;Edit Price &amp; Photo&quot;</strong> dabakar uski Selling Price (₹), Original MRP, % OFF Discount aur Image badal sakte hain.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsOwnerStudioOpen(true)}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs"
                >
                  Manage Products &amp; Prices
                </button>
                <button
                  onClick={handleLogoutOwner}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
                >
                  Lock
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <button
                onClick={() => setIsOwnerStudioOpen(true)}
                className="text-xs text-slate-500 hover:text-amber-700 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Website Owner Portal &bull; Edit Prices, % OFF &amp; Photos</span>
              </button>
            </div>
          )}

          {/* Category Filter & Sorting Bar */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            rxOnly={rxOnly}
            onToggleRxOnly={setRxOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalProductsCount={filteredMedicines.length}
          />
        </div>

        {/* Medicines Grid */}
        {filteredMedicines.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Pill className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-900">No matching medicines found</h3>
              <p className="text-xs text-slate-500">
                We couldn&apos;t find any medicines matching your search &ldquo;{searchQuery}&rdquo;. Try searching for general terms like &apos;Paracetamol&apos;, &apos;Syrup&apos;, or upload your prescription directly.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setRxOnly(false); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsPrescriptionOpen(true)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Upload Doctor&apos;s Prescription Instead
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMedicines.map((medicine) => {
              const cartItem = cart.find(item => item.medicine.id === medicine.id);
              const quantityInCart = cartItem ? cartItem.quantity : 0;

              return (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  quantityInCart={quantityInCart}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onViewDetails={setSelectedDetailMedicine}
                  isOwnerMode={isOwnerAuthenticated}
                  onEditProduct={handleOpenEditProduct}
                  onEditImage={handleOpenEditProduct}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Local Pharmacy Hubs & Trust section */}
      <LocalPharmacyHubs
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Bottom Bar (When cart has items or for quick Rx upload) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-lg flex items-center justify-between gap-2">
        <button
          onClick={() => setIsCameraOpen(true)}
          className="flex-1 py-2 px-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Camera className="w-4 h-4" />
          <span>Snap Med 📷</span>
        </button>

        <button
          onClick={() => setIsPrescriptionOpen(true)}
          className="flex-1 py-2 px-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-300"
        >
          <UploadCloud className="w-4 h-4 text-amber-600" />
          <span>Upload Rx</span>
        </button>

        <button
          onClick={() => setIsContactOpen(true)}
          className="py-2 px-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 border border-slate-300"
          title="Contact Go Plus"
        >
          <PhoneCall className="w-4 h-4 text-amber-600" />
          <span>Help</span>
        </button>

        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex-1 py-2 px-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-between shadow-md"
          >
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Bag</span>
            </span>
            <span className="font-black text-amber-400">
              ₹{cart.reduce((s, i) => s + i.medicine.price * i.quantity, 0)}
            </span>
          </button>
        )}
      </div>

      {/* Modals & Drawers */}
      <MedicineDetailModal
        medicine={selectedDetailMedicine}
        onClose={() => setSelectedDetailMedicine(null)}
        quantityInCart={
          selectedDetailMedicine
            ? (cart.find(i => i.medicine.id === selectedDetailMedicine.id)?.quantity || 0)
            : 0
        }
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        isOwnerMode={isOwnerAuthenticated}
        onEditProduct={handleOpenEditProduct}
        onEditImage={handleOpenEditProduct}
      />

      <OwnerStudioModal
        isOpen={isOwnerStudioOpen}
        onClose={() => setIsOwnerStudioOpen(false)}
        medicines={medicines}
        defaultMedicines={SAMPLE_MEDICINES}
        selectedMedicineId={editingMedicineId}
        onSelectMedicine={setEditingMedicineId}
        onUpdateMedicine={handleUpdateMedicine}
        onResetMedicine={handleResetMedicine}
        onResetAllMedicines={handleResetAllMedicines}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onAuthenticate={handleAuthenticateOwner}
        onLogout={handleLogoutOwner}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <MedicineCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onAddToCart={handleAddToCart}
        onOrderPhotoDirectly={handleOrderPhotoDirectly}
        selectedArea={selectedArea}
      />

      <PrescriptionUploadModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        selectedArea={selectedArea}
        onSubmitPrescription={handlePrescriptionSubmit}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenPrescription={() => {
          setIsCartOpen(false);
          setIsPrescriptionOpen(true);
        }}
        hasPrescription={hasPrescription}
        selectedArea={selectedArea}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        selectedArea={selectedArea}
        hasPrescription={hasPrescription}
        onOrderPlaced={handleOrderPlaced}
      />

      <LiveTrackingModal
        order={activeTrackingOrder}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Floating 24x7 Help / Contact Button (Desktop) */}
      <button
        onClick={() => setIsContactOpen(true)}
        className="fixed bottom-6 right-6 z-30 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl border border-slate-700 hover:border-amber-400 transition-all hover:scale-105 active:scale-95 group"
        title="24x7 Pharmacy Helpline: 8972947993"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <PhoneCall className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold">Call: 8972947993</span>
      </button>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
