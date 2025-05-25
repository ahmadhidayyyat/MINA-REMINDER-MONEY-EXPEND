<template>
  <div class="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-900">
        Daily Expense Tracker
      </h1>
      <p class="text-gray-500 mb-6">
        Track and manage all your financial transactions here
      </p>
      <form @submit.prevent="tambahPengeluaran" class="space-y-4">
        <input
          type="date"
          v-model="form.tanggal"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      ></div>

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
                class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg my-3"
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
                  :key="index"
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
                :key="index"
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
import { ref, computed } from "vue";

const pengeluaran = ref([]);
const form = ref({ tanggal: "", jumlah: null, keterangan: "", key: "" });

const tambahPengeluaran = () => {
  pengeluaran.value.push({ ...form.value });
  const key = generateRandomKey();

  form.value.key = key;

  // Spread operator ... belajar
  const stringData = JSON.stringify({ ...form.value });
  setItemLocalStorage(key, stringData);
  console.log(stringData);

  form.value = { tanggal: "", jumlah: null, keterangan: "", key: "" };
};

const hapus = (index, key) => {
  removeItem(key);
  pengeluaran.value.splice(index, 1);
};

const totalPengeluaran = computed(() => {
  return pengeluaran.value.reduce((sum, item) => sum + item.jumlah, 0);
});

const rataRataPerHari = computed(() => {
  if (pengeluaran.value.length === 0) return 0;

  const uniqueDates = [
    ...new Set(pengeluaran.value.map((item) => item.tanggal)),
  ];
  return Math.round(totalPengeluaran.value / uniqueDates.length);
});

const pengeluaranPerBulan = computed(() => {
  const grouped = {};

  pengeluaran.value.forEach((item) => {
    const date = new Date(item.tanggal);
    const bulanKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const dateString = item.tanggal.split("T")[0];

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
    result[key] = rest;
  }

  return result;
});

const formatTanggal = (tanggal) => {
  const date = new Date(tanggal);
  // Diubah ke en-US agar format tanggal sesuai Bahasa Inggris
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
  // Diubah ke en-US agar format bulan sesuai Bahasa Inggris
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

const getDaysInMonth = (bulanKey) => {
  const [year, month] = bulanKey.split("-");
  return new Date(year, month, 0).getDate();
};

onMounted(() => {
  const allItem = getAllItemFromLocalStorage();
  if (allItem.length) {
    pengeluaran.value = allItem;
  }
});
</script>

<style>
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
