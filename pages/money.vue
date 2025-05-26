<template>
  <div class="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">
        Daily Expense Tracker
      </h1>
      <p class="text-gray-500 mb-6">
        Track and manage all your financial transactions here
      </p>
      <form @submit.prevent="tambahPengeluaran" class="space-y-4">
        <VueDatePicker
          v-model="form.tanggal"
          placeholder="Select date"
          teleport-center
          auto-apply
          :enable-time-picker="false"
          :max-date="new Date()"
          format="yyyy-MM-dd"
          model-type="yyyy-MM-dd"
          class="w-full"
          input-class-name="custom-datepicker-input"
          :clearable="true"
          required
        />
        <input
          type="number"
          v-model.number="form.jumlah"
          placeholder="Expense amount"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="text"
          v-model="form.keterangan"
          placeholder="Description"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
        >
          Add
        </button>
      </form>

      <div
        v-if="pengeluaran.length"
        class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div
          class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total Expenses</p>
              <p class="text-2xl font-bold">
                Rp{{ totalPengeluaran.toLocaleString() }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div
          class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Average/Day</p>
              <p class="text-2xl font-bold">
                Rp{{ rataRataPerHari.toLocaleString() }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div
          class="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-xl text-white shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sky-100 text-sm font-medium">Total Transactions</p>
              <p class="text-2xl font-bold">{{ pengeluaran.length }}</p>
            </div>
            <div
              class="w-12 h-12 bg-sky-400 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pengeluaran.length" class="mt-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Monthly Summary</h2>
        <div class="grid gap-4">
          <div
            v-for="(data, bulan) in pengeluaranPerBulan"
            :key="bulan"
            class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg my-3"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-100 text-sm font-medium">
                      Total Expenses
                    </p>
                    <p class="text-2xl font-bold">
                      Rp{{ data.total.toLocaleString() }}
                    </p>
                  </div>
                  <div
                    class="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center opacity-50"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg my-3"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-green-100 text-sm font-medium">
                      Average/Day
                    </p>
                    <p class="text-2xl font-bold">
                      Rp{{
                        Math.round(data.total / data.totalHari).toLocaleString()
                      }}
                    </p>
                  </div>
                  <div
                    class="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center opacity-50"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-xl text-white shadow-lg my-3"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sky-100 text-sm font-medium">
                      Total Transactions
                    </p>
                    <p class="text-2xl font-bold">{{ data.items.length }}</p>
                  </div>
                  <div
                    class="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center opacity-50"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ formatBulan(bulan) }}
              </h3>
              <span
                class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full my-4"
                >{{ data.items.length }} transactions</span
              >
            </div>
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-700 mb-3">Expense Details:</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="(item, index) in data.items"
                  :key="item.key || index"
                  class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
                >
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-800">{{
                      item.keterangan
                    }}</span>
                    <span class="text-xs text-gray-500 ml-2">{{
                      formatTanggal(item.tanggal)
                    }}</span>
                  </div>
                  <span class="font-semibold text-gray-800"
                    >Rp{{ item.jumlah.toLocaleString() }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pengeluaran.length" class="mt-10">
        <h2 class="text-xl font-semibold mb-4">Expense Table</h2>
        <div class="overflow-auto rounded-lg border border-gray-300">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="bg-gray-50 text-left">
                <th class="p-3 border-b font-semibold text-gray-700">Date</th>
                <th class="p-3 border-b font-semibold text-gray-700">
                  Amount (Rp)
                </th>
                <th class="p-3 border-b font-semibold text-gray-700">
                  Description
                </th>
                <th class="p-3 border-b font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in pengeluaran"
                :key="item.key || index"
                class="border-b hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="p-3">{{ formatTanggal(item.tanggal) }}</td>
                <td class="p-3 font-semibold">
                  Rp{{ item.jumlah.toLocaleString() }}
                </td>
                <td class="p-3">{{ item.keterangan }}</td>
                <td class="p-3">
                  <button
                    @click="hapus(index, item.key)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="mt-10 text-center py-12">
        <div
          class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          No expense records yet
        </h3>
        <p class="text-gray-500">
          Start adding your daily expenses to see statistics
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// Menggunakan fungsi-fungsi dari file utils/storage.ts yang Anda berikan
// Pastikan file ini ada di folder utils dan nama fungsinya sesuai
// Untuk auto-import Nuxt 3, Anda tidak perlu baris import ini jika file ada di utils/
// import { setItemLocalStorage, getAllItemFromLocalStorage, removeItem, generateRandomKey } from '~/utils/your-storage-filename';

const pengeluaran = ref([]);
// Inisialisasi tanggal dengan null agar placeholder VueDatePicker muncul
const form = ref({ tanggal: null, jumlah: null, keterangan: "" }); // Hapus 'key' dari sini, akan di-generate saat tambah

const tambahPengeluaran = () => {
  if (
    !form.value.tanggal ||
    form.value.jumlah === null ||
    !form.value.keterangan.trim()
  ) {
    alert("Please fill all fields correctly.");
    return;
  }

  const keyUnik = generateRandomKey(); // Panggil fungsi generateRandomKey Anda

  // VueDatePicker v-model="form.tanggal" sudah menghasilkan string format "yyyy-MM-dd" jika modelType="yyyy-MM-dd"
  // atau objek Date jika modelType tidak diset spesifik. Kita akan konsisten pakai string "yyyy-MM-dd".
  let tanggalUntukSimpan = form.value.tanggal; // Ini sudah string "yyyy-MM-dd" dari datepicker

  // Jika form.tanggal adalah objek Date (default VueDatePicker tanpa model-type), konversi:
  if (form.value.tanggal instanceof Date) {
    const year = form.value.tanggal.getFullYear();
    const month = (form.value.tanggal.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const day = form.value.tanggal.getDate().toString().padStart(2, "0");
    tanggalUntukSimpan = `${year}-${month}-${day}`;
  }

  const dataUntukDisimpan = {
    // Objek yang akan di stringify dan disimpan
    key: keyUnik,
    tanggal: tanggalUntukSimpan,
    jumlah: form.value.jumlah,
    keterangan: form.value.keterangan.trim(),
  };

  // Item yang akan ditampilkan di UI (tanggal bisa tetap objek Date untuk kemudahan pemformatan)
  const itemUntukDitampilkan = {
    ...dataUntukDisimpan,
    tanggal: form.value.tanggal, // Biarkan objek Date untuk tampilan jika VDP tidak pakai model-type
    // atau tanggalUntukSimpan jika VDP pakai model-type string
  };

  pengeluaran.value.unshift(itemUntukDitampilkan);

  // Simpan ke Local Storage
  // Fungsi setItemLocalStorage Anda menerima (key, value). Value di-stringify di dalam fungsi itu.
  setItemLocalStorage(keyUnik, dataUntukDisimpan);
  console.log("Data disimpan ke LS dengan key:", keyUnik, dataUntukDisimpan);

  form.value = { tanggal: null, jumlah: null, keterangan: "" }; // Reset form
};

const hapus = (index, key) => {
  if (confirm("Are you sure you want to delete this expense?")) {
    removeItem(key);
    pengeluaran.value.splice(index, 1);
  }
};

const totalPengeluaran = computed(() => {
  return pengeluaran.value.reduce((sum, item) => sum + item.jumlah, 0);
});

const rataRataPerHari = computed(() => {
  if (pengeluaran.value.length === 0) return 0;
  const uniqueDates = [
    ...new Set(
      pengeluaran.value.map((item) => {
        // Jika item.tanggal adalah objek Date, format ke string YYYY-MM-DD
        if (item.tanggal instanceof Date) {
          return item.tanggal.toISOString().split("T")[0];
        }
        return item.tanggal; // Jika sudah string YYYY-MM-DD
      })
    ),
  ];
  return Math.round(totalPengeluaran.value / uniqueDates.length) || 0;
});

const pengeluaranPerBulan = computed(() => {
  const grouped = {};
  pengeluaran.value.forEach((item) => {
    const date = new Date(item.tanggal); // item.tanggal bisa objek Date atau string YYYY-MM-DD
    const bulanKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const dateString = date.toISOString().split("T")[0];

    if (!grouped[bulanKey]) {
      grouped[bulanKey] = {
        totalHari: 0,
        uniqueDates: new Set(),
        items: [],
        total: 0,
      };
    }
    if (!grouped[bulanKey].uniqueDates.has(dateString)) {
      grouped[bulanKey].uniqueDates.add(dateString);
      grouped[bulanKey].totalHari += 1;
    }
    grouped[bulanKey].items.push(item);
    grouped[bulanKey].total += item.jumlah;
  });

  const result = {};
  for (const key in grouped) {
    const { uniqueDates, ...rest } = grouped[key];
    rest.items.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    result[key] = rest;
  }
  return result;
});

const formatTanggal = (tanggalValue) => {
  // Menerima string "yyyy-MM-dd" atau objek Date
  if (!tanggalValue) return "";
  // Jika string, perlu ditambah 'T00:00:00' agar parsing Date tidak ambigu karena zona waktu
  const date =
    typeof tanggalValue === "string" && !tanggalValue.includes("T")
      ? new Date(tanggalValue + "T00:00:00")
      : new Date(tanggalValue);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatBulan = (bulanKey) => {
  const [year, month] = bulanKey.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
};

onMounted(() => {
  // Asumsi getAllItemFromLocalStorage() mengembalikan array objek pengeluaran
  // dengan 'tanggal' sebagai string "yyyy-MM-dd"
  const allItems = getAllItemFromLocalStorage();
  if (allItems && allItems.length) {
    pengeluaran.value = allItems
      .map((item) => ({
        ...item,
        // Konversi string tanggal dari localStorage kembali ke objek Date untuk VueDatePicker
        // Tambahkan 'T00:00:00' untuk menghindari masalah zona waktu saat parsing
        tanggal: item.tanggal ? new Date(item.tanggal + "T00:00:00") : null,
      }))
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }
});
</script>

<style scoped>
/* Styling untuk VueDatePicker agar seragam */
:deep(.custom-datepicker-input) {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
  padding-left: 1rem !important;
  padding-right: 2.5rem !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.5rem !important;
  font-size: 1rem !important;
  width: 100%;
  cursor: pointer;
}
:deep(.custom-datepicker-input:focus) {
  outline: none !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px #bfdbfe !important;
}
:deep(.dp__clear_icon) {
  right: 10px !important;
  color: #6b7280;
}
:deep(.dp__clear_icon:hover) {
  color: #1f2937;
}

/* Sisanya adalah style asli Anda */
body {
  font-family: "Inter", sans-serif;
}
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
