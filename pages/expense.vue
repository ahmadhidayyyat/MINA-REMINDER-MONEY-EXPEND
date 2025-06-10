<template>
  <div class="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">
        Daily Expense Tracker
      </h1>
      <p class="text-gray-500 mb-6">
        Track and manage all your financial transactions here
      </p>

      <div v-if="pending" class="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
        Loading expense data...
      </div>
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
        Error: {{ error.message }}
      </div>

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
          min="0"
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
          :disabled="pending"
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

      <div v-if="transformedExpenses.length" class="mt-8 border-t pt-6">
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
                  :key="item.id"
                  class="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="p-3">{{ formatTanggal(item.tanggal) }}</td>
                  <td class="p-3 font-semibold">Rp{{ item.jumlah }}</td>
                  <td class="p-3">{{ item.keterangan }}</td>
                  <td class="p-3 flex space-x-2">
                    <button
                      @click="mulaiEdit(item)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      @click="hapus(item.id)"
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

      <div
        v-if="!transformedExpenses.length && !pending"
        class="mt-10 text-center py-12"
      >
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

    <SimplePopup
      :show="showPopup"
      :message="popupMessage"
      :type="popupType"
      @close="showPopup = false"
    />
  </div>
  <ConfirmationDialog
    :show="showConfirmDialog"
    title="Confirm Deletion"
    message="Are you sure you want to delete this expense? This action cannot be undone."
    @confirm="executeDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import SimplePopup from "/components/SimplePopup.vue";
import ConfirmationDialog from "/components/ConfirmationDialog.vue";

// State untuk Form
const form = ref({ tanggal: null, jumlah: null, keterangan: "" });
const isEditing = ref(false);
const editingId = ref(null);

// State untuk Pop-up Notifikasi
const showPopup = ref(false);
const popupMessage = ref("");
const popupType = ref("success");

// State untuk Dialog Konfirmasi
const showConfirmDialog = ref(false);
const itemToDeleteId = ref(null);

const authStore = useMyAuthStore();

// Fetch data dari API
const {
  data: expensesData,
  pending,
  error,
  refresh,
} = await useFetch(`/api/expense/${authStore.user.id}`, {
  lazy: true,
  server: true,
});

// Mengubah format data agar sesuai dengan tampilan
const transformedExpenses = computed(() => {
  if (!expensesData.value) return [];
  return expensesData.value.map((expense) => ({
    id: expense.id,
    tanggal: expense.tanggal.split("T")[0],
    jumlah: expense.jumlah,
    keterangan: expense.deskripsi,
  }));
});

// Fungsi untuk memicu pop-up notifikasi
function triggerPopup(message, type = "success") {
  popupMessage.value = message;
  popupType.value = type;
  showPopup.value = true;
}

// Fungsi utama untuk submit form
const handleSubmit = async () => {
  if (isEditing.value) {
    await updatePengeluaran();
  } else {
    await tambahPengeluaran();
  }
};

// Fungsi CRUD
const tambahPengeluaran = async () => {
  if (
    !form.value.tanggal ||
    form.value.jumlah === null ||
    !form.value.keterangan.trim()
  ) {
    triggerPopup("Please fill all fields correctly.", "error");
    return;
  }
  try {
    const payload = {
      userId: authStore.user.id,
      deskripsi: form.value.keterangan,
      jumlah: form.value.jumlah,
      tanggal: form.value.tanggal,
    };
    await $fetch("/api/expense", { method: "POST", body: payload });
    resetForm();
    await refresh();
    triggerPopup("Expense added successfully!", "success");
  } catch (err) {
    console.error("Failed to add expense:", err);
    triggerPopup("Failed to add expense.", "error");
  }
};

const mulaiEdit = (item) => {
  isEditing.value = true;
  editingId.value = item.id;
  form.value = {
    tanggal: item.tanggal,
    jumlah: item.jumlah,
    keterangan: item.keterangan,
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const updatePengeluaran = async () => {
  if (
    !form.value.tanggal ||
    form.value.jumlah === null ||
    !form.value.keterangan.trim()
  ) {
    triggerPopup("Please fill all fields correctly for update.", "error");
    return;
  }
  try {
    const payload = {
      deskripsi: form.value.keterangan,
      jumlah: form.value.jumlah,
      tanggal: new Date(form.value.tanggal).toISOString(),
    };
    await $fetch(`/api/expense/${editingId.value}`, {
      method: "PUT",
      body: payload,
    });
    cancelEdit();
    await refresh();
    triggerPopup("Expense updated successfully!", "success");
  } catch (err) {
    console.error("Failed to update expense:", err);
    triggerPopup("Failed to update expense.", "error");
  }
};

// Fungsi untuk membuka dialog konfirmasi hapus
const hapus = (id) => {
  itemToDeleteId.value = id;
  showConfirmDialog.value = true;
};

// Fungsi yang dijalankan jika pengguna menekan "Confirm"
const executeDelete = async () => {
  if (!itemToDeleteId.value) return;

  showConfirmDialog.value = false;
  try {
    await $fetch(`/api/expense/${itemToDeleteId.value}`, {
      method: "DELETE",
    });
    await refresh();
    triggerPopup("Expense deleted successfully!", "success");
  } catch (err) {
    console.error("Failed to delete expense:", err);
    triggerPopup("Failed to delete expense.", "error");
  } finally {
    itemToDeleteId.value = null;
  }
};

// Fungsi yang dijalankan jika pengguna menekan "Cancel"
const cancelDelete = () => {
  showConfirmDialog.value = false;
  itemToDeleteId.value = null;
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = { tanggal: null, jumlah: null, keterangan: "" };
};

// Computed Properties untuk kalkulasi data
const totalPengeluaran = computed(() => {
  return transformedExpenses.value.reduce((sum, item) => sum + item.jumlah, 0);
});

const rataRataPerHari = computed(() => {
  if (transformedExpenses.value.length === 0) return 0;
  const uniqueDates = [
    ...new Set(transformedExpenses.value.map((item) => item.tanggal)),
  ];
  return Math.round(totalPengeluaran.value / uniqueDates.length) || 0;
});

const pengeluaranPerBulan = computed(() => {
  const grouped = {};
  const sortedPengeluaran = [...transformedExpenses.value].sort((a, b) =>
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

// Fungsi untuk formatting tampilan
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
</script>
