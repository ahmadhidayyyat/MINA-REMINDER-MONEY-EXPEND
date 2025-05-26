<template>
  <div class="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">
        Daily Expense Tracker
      </h1>
      <p class="text-gray-500 mb-6">
        Track and manage all your financial transactions here
      </p>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <VueDatePicker
          v-model="form.tanggal"
          placeholder="Select date"
          teleport-center
          auto-apply
          :enable-time-picker="false"
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
          class="w-full text-white py-3 rounded-lg transition-colors duration-200 font-semibold"
          :class="
            isEditing
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600'
          "
        >
          {{ isEditing ? "Update Expense" : "Add Expense" }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          @click="cancelEdit"
          class="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold mt-2"
        >
          Cancel Edit
        </button>
      </form>

      <div v-if="pengeluaran.length" class="mt-8 border-t pt-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Monthly Summary</h2>

        <div
          v-for="(data, bulan) in pengeluaranPerBulan"
          :key="bulan"
          class="mt-8 pt-6 border-t first:mt-0 first:pt-0 first:border-t-0"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            {{ formatBulan(bulan) }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div
              class="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-lg"
            >
              <p class="text-blue-100 text-sm font-medium">Total Expenses</p>
              <p class="text-2xl font-bold">
                Rp{{ data.total.toLocaleString() }}
              </p>
            </div>
            <div
              class="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white shadow-lg"
            >
              <p class="text-green-100 text-sm font-medium">Average/Day</p>
              <p class="text-2xl font-bold">
                Rp{{ Math.round(data.total / data.totalHari).toLocaleString() }}
              </p>
            </div>
            <div
              class="bg-gradient-to-br from-sky-500 to-sky-600 p-4 rounded-xl text-white shadow-lg"
            >
              <p class="text-sky-100 text-sm font-medium">Total Transactions</p>
              <p class="text-2xl font-bold">{{ data.items.length }}</p>
            </div>
          </div>

          <h4 class="font-medium text-gray-700 mb-3 mt-6">Expense Details:</h4>
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
                  <th class="p-3 border-b font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in data.items"
                  :key="item.key"
                  class="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="p-3">{{ formatTanggal(item.tanggal) }}</td>
                  <td class="p-3 font-semibold">
                    Rp{{ item.jumlah.toLocaleString() }}
                  </td>
                  <td class="p-3">{{ item.keterangan }}</td>
                  <td class="p-3 flex space-x-2">
                    <button
                      @click="mulaiEdit(item)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      @click="hapus(item.key)"
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
      </div>

      <div v-if="!pengeluaran.length" class="mt-10 text-center py-12">
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
// Blok <script setup> Anda SAMA PERSIS seperti versi terakhir Anda yang sudah ada fitur edit dan VueDatePicker
// Tidak ada perubahan di sini jika sudah berfungsi sebelumnya.
import { ref, computed, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  setItemLocalStorage,
  getAllItemFromLocalStorage,
  removeItem,
  generateRandomKey,
} from "~/utils/localstorage";

// Asumsi fungsi-fungsi ini di-auto-import oleh Nuxt dari utils/storage.ts
// atau utils/localstorage.ts (sesuaikan dengan nama file Anda)

const pengeluaran = ref([]);
const form = ref({ tanggal: null, jumlah: null, keterangan: "" });
const isEditing = ref(false);
const editingKey = ref(null);

const handleSubmit = () => {
  if (isEditing.value) {
    updatePengeluaran();
  } else {
    tambahPengeluaran();
  }
};

const tambahPengeluaran = () => {
  if (
    !form.value.tanggal ||
    form.value.jumlah === null ||
    !form.value.keterangan.trim()
  ) {
    alert("Please fill all fields correctly.");
    return;
  }
  const keyUnik = generateRandomKey();
  const tanggalUntukSimpan = form.value.tanggal;

  const dataUntukDisimpan = {
    key: keyUnik,
    tanggal: tanggalUntukSimpan,
    jumlah: form.value.jumlah,
    keterangan: form.value.keterangan.trim(),
  };

  pengeluaran.value.unshift({ ...dataUntukDisimpan });
  setItemLocalStorage(keyUnik, dataUntukDisimpan);
  console.log("Data disimpan ke LS dengan key:", keyUnik, dataUntukDisimpan);

  resetForm();
};

const mulaiEdit = (item) => {
  isEditing.value = true;
  editingKey.value = item.key;
  form.value = {
    tanggal: item.tanggal,
    jumlah: item.jumlah,
    keterangan: item.keterangan,
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const updatePengeluaran = () => {
  const index = pengeluaran.value.findIndex(
    (item) => item.key === editingKey.value
  );
  if (index !== -1) {
    if (
      !form.value.tanggal ||
      form.value.jumlah === null ||
      !form.value.keterangan.trim()
    ) {
      alert("Please fill all fields correctly for update.");
      return;
    }
    const tanggalUntukSimpan = form.value.tanggal;
    const dataUntukDisimpan = {
      key: editingKey.value,
      tanggal: tanggalUntukSimpan,
      jumlah: form.value.jumlah,
      keterangan: form.value.keterangan.trim(),
    };
    pengeluaran.value[index] = { ...dataUntukDisimpan };
    setItemLocalStorage(editingKey.value, dataUntukDisimpan);
  }
  cancelEdit();
};

const cancelEdit = () => {
  isEditing.value = false;
  editingKey.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = { tanggal: null, jumlah: null, keterangan: "" };
};

const hapus = (key) => {
  if (confirm("Are you sure you want to delete this expense?")) {
    removeItem(key);
    pengeluaran.value = pengeluaran.value.filter((item) => item.key !== key);
  }
};

const totalPengeluaran = computed(() => {
  return pengeluaran.value.reduce((sum, item) => sum + item.jumlah, 0);
});

const rataRataPerHari = computed(() => {
  if (pengeluaran.value.length === 0) return 0;
  const uniqueDates = [
    ...new Set(pengeluaran.value.map((item) => item.tanggal)),
  ];
  return Math.round(totalPengeluaran.value / uniqueDates.length) || 0;
});

const pengeluaranPerBulan = computed(() => {
  const grouped = {};
  const sortedPengeluaran = [...pengeluaran.value].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal)
  );

  sortedPengeluaran.forEach((item) => {
    const date = new Date(item.tanggal + "T00:00:00");
    const bulanKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const dateString = item.tanggal;

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

  const sortedMonthKeys = Object.keys(grouped).sort().reverse();
  const result = {};
  for (const key of sortedMonthKeys) {
    const { uniqueDates, ...rest } = grouped[key];
    result[key] = rest;
  }
  return result;
});

const formatTanggal = (tanggalValue) => {
  if (!tanggalValue) return "";
  const date = new Date(tanggalValue + "T00:00:00");
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
  if (typeof getAllItemFromLocalStorage === "function") {
    const allItems = getAllItemFromLocalStorage();
    if (allItems && allItems.length) {
      pengeluaran.value = allItems.sort((a, b) =>
        b.tanggal.localeCompare(a.tanggal)
      );
    }
  } else {
    console.warn("getAllItemFromLocalStorage is not defined. Data not loaded.");
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
