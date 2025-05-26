// ~/utils/localstorage.ts

// Tipe data untuk satu item pengeluaran
export interface Item {
  key: string;
  tanggal: string; // Disimpan sebagai string format "YYYY-MM-DD"
  jumlah: number;
  keterangan: string;
}

/**
 * Menyimpan atau memperbarui item di Local Storage.
 * @param key Kunci unik untuk item.
 * @param value Objek item yang akan disimpan.
 */
export const setItemLocalStorage = (key: string, value: Item): void => {
  // Pastikan hanya berjalan di client side dan localStorage tersedia
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Item saved/updated in LS with key ${key}:`, value);
    } catch (e) {
      console.error("Error saving/updating item to Local Storage:", e);
    }
  }
};

/**
 * Mengambil semua item pengeluaran yang relevan dari Local Storage.
 * @returns {Item[]} Array dari item pengeluaran.
 */
export const getAllItemFromLocalStorage = (): Item[] => {
  const items: Item[] = [];
  if (typeof window !== "undefined" && window.localStorage) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Filter kunci: Asumsi kunci yang relevan memiliki panjang 4 karakter.
      // Ini adalah logika dari kode Anda sebelumnya.
      if (key && key.length === 4) {
        try {
          const storedItemString = localStorage.getItem(key);
          if (storedItemString) {
            const storedItemObject: Item = JSON.parse(storedItemString);
            // Validasi sederhana untuk memastikan objek memiliki properti yang diharapkan
            if (
              storedItemObject &&
              typeof storedItemObject.key === "string" &&
              typeof storedItemObject.tanggal === "string"
            ) {
              items.push(storedItemObject);
            } else {
              console.warn(
                `Skipping malformed item with key ${key}:`,
                storedItemString
              );
            }
          }
        } catch (e) {
          console.error(`Failed to parse item with key ${key}:`, e);
        }
      }
    }
  }
  console.log("Loaded all items from LS:", items);
  return items;
};

/**
 * Mengambil satu item spesifik dari Local Storage berdasarkan kuncinya.
 * (Fungsi ini mungkin tidak Anda gunakan secara langsung di kode .vue saat ini, tapi bagus untuk dimiliki)
 * @param key Kunci item yang akan diambil.
 * @returns {Item | null} Objek item atau null jika tidak ditemukan.
 */
export const getItem = (key: string): Item | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const itemString = localStorage.getItem(key);
      return itemString ? JSON.parse(itemString) : null;
    } catch (e) {
      console.error(`Failed to get item with key ${key}:`, e);
      return null;
    }
  }
  return null;
};

/**
 * Menghapus item dari Local Storage berdasarkan kuncinya.
 * @param key Kunci item yang akan dihapus.
 */
export const removeItem = (key: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.removeItem(key);
      console.log(`Item removed from LS with key ${key}`);
    } catch (e) {
      console.error(`Error removing item with key ${key}:`, e);
    }
  }
};

/**
 * Membuat kunci acak 4 karakter.
 * @returns {string} Kunci acak.
 */
export const generateRandomKey = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};
