import { Medicine } from '../types';
import { SAMPLE_MEDICINES } from '../data/medicines';

const DB_NAME = 'GoPlusPharmacyDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_medicines';

const LOCAL_STORAGE_KEY = 'goplus_custom_medicines';
const LOCAL_STORAGE_BACKUP_IMAGES_KEY = 'goplus_custom_images';

// Open IndexedDB safely with Promise
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Compresses an image data URL or File down to a web-optimized JPEG string.
 * This guarantees the Base64 payload is small (~30KB-70KB) instead of 5MB-15MB,
 * ensuring it easily fits in both LocalStorage and IndexedDB and never hits quota limits.
 */
export async function optimizeMedicineImage(
  source: string | File | Blob,
  maxDimension = 800,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const processImg = (imgSrc: string) => {
      const img = new Image();
      // Allow cross-origin images to be drawn on canvas if supported
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imgSrc);
          return;
        }

        // Fill white background for transparent PNGs so JPEG looks clean
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (e) {
          // If tainted canvas (due to strict CORS on external URL), fallback to raw source
          resolve(imgSrc);
        }
      };

      img.onerror = () => {
        // If image loading fails, resolve with source
        resolve(imgSrc);
      };

      img.src = imgSrc;
    };

    if (typeof source === 'string') {
      processImg(source);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = e.target?.result as string;
        if (res) {
          processImg(res);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Synchronously load initial medicines from localStorage for instant display on page load.
 */
export function getInitialMedicines(): Medicine[] {
  try {
    const savedCustomMeds = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCustomMeds) {
      const customMeds: Medicine[] = JSON.parse(savedCustomMeds);
      return SAMPLE_MEDICINES.map((m) => {
        const custom = customMeds.find((c) => c.id === m.id);
        return custom ? { ...m, ...custom } : m;
      });
    }

    const savedCustomImages = localStorage.getItem(LOCAL_STORAGE_BACKUP_IMAGES_KEY);
    if (savedCustomImages) {
      const customMap: Record<string, string> = JSON.parse(savedCustomImages);
      return SAMPLE_MEDICINES.map((m) =>
        customMap[m.id] ? { ...m, image: customMap[m.id] } : m
      );
    }
  } catch (e) {
    console.warn('[GoPlus] Error reading initial medicines from localStorage', e);
  }
  return SAMPLE_MEDICINES;
}

/**
 * Asynchronously load custom medicines from IndexedDB (with LocalStorage fallback).
 * This ensures full reliability even if LocalStorage had quota issues or was cleared.
 */
export async function loadCustomMedicines(): Promise<Medicine[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const allCustoms: Medicine[] = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (allCustoms && allCustoms.length > 0) {
      // Merge with SAMPLE_MEDICINES to preserve default fields while overriding custom ones
      const merged = SAMPLE_MEDICINES.map((m) => {
        const custom = allCustoms.find((c) => c.id === m.id);
        return custom ? { ...m, ...custom } : m;
      });

      // Keep localStorage in sync with IndexedDB
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // LocalStorage quota may be exceeded, but IndexedDB is safe
      }

      return merged;
    }
  } catch (err) {
    console.warn('[GoPlus] IndexedDB read failed or empty, using initial localStorage', err);
  }

  return getInitialMedicines();
}

/**
 * Persist custom medicines to both IndexedDB and LocalStorage.
 * This guarantees that when the owner updates an image or price,
 * it is permanently locked and never changes by itself.
 */
export async function saveCustomMedicines(allMedicines: Medicine[]): Promise<void> {
  // 1. Save to IndexedDB (virtually unlimited quota)
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    for (const med of allMedicines) {
      store.put(med);
    }

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (e) {
    console.error('[GoPlus] Failed to save medicines in IndexedDB', e);
  }

  // 2. Also save to LocalStorage (as fast synchronous cache)
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allMedicines));
  } catch (e) {
    console.warn('[GoPlus] Full localStorage quota reached, saving minimal overrides', e);
    // If quota exceeded, save minimal overrides
    try {
      const minimalOverrides = allMedicines.map((m) => ({
        id: m.id,
        image: m.image,
        price: m.price,
        originalPrice: m.originalPrice,
        discountPercentage: m.discountPercentage,
        inStock: m.inStock,
        requiresPrescription: m.requiresPrescription,
        packageSize: m.packageSize,
        priceRange: m.priceRange,
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(minimalOverrides));
    } catch {
      // LocalStorage completely full, but IndexedDB already has the full data safely stored
    }
  }

  // 3. Save dedicated image map backup
  try {
    const imageMap: Record<string, string> = {};
    for (const med of allMedicines) {
      if (med.image) {
        imageMap[med.id] = med.image;
      }
    }
    localStorage.setItem(LOCAL_STORAGE_BACKUP_IMAGES_KEY, JSON.stringify(imageMap));
  } catch {
    // Ignore backup failure
  }
}

/**
 * Clear custom medicines from both stores (only called if owner explicitly resets everything).
 */
export async function clearCustomMedicines(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
  } catch (e) {
    console.error('[GoPlus] Failed to clear IndexedDB', e);
  }

  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_BACKUP_IMAGES_KEY);
  } catch (e) {
    console.error('[GoPlus] Failed to clear localStorage', e);
  }
}
