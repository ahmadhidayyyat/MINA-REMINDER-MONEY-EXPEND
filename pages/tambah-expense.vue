<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-700 mb-6">
      Tambah Pengeluaran Baru 📝
    </h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label
          for="deskripsi"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Deskripsi</label
        >
        <input
          type="text"
          id="deskripsi"
          v-model="form.deskripsi"
          placeholder="Contoh: Pembelian buku referensi"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <p v-if="errors.deskripsi" class="mt-1 text-xs text-red-500">
          {{ errors.deskripsi }}
        </p>
      </div>

      <div class="mb-4">
        <label for="jumlah" class="block text-sm font-medium text-gray-700 mb-1"
          >Jumlah (Rp)</label
        >
        <input
          type="number"
          id="jumlah"
          v-model.number="form.jumlah"
          placeholder="Contoh: 150000"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <p v-if="errors.jumlah" class="mt-1 text-xs text-red-500">
          {{ errors.jumlah }}
        </p>
      </div>

      <div class="mb-6">
        <label
          for="tanggal"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Tanggal</label
        >
        <input
          type="date"
          id="tanggal"
          v-model="form.tanggal"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <p v-if="errors.tanggal" class="mt-1 text-xs text-red-500">
          {{ errors.tanggal }}
        </p>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Menyimpan..." : "Simpan Pengeluaran" }}
        </button>
      </div>
    </form>

    <div v-if="submittedData" class="mt-8 p-4 bg-gray-50 rounded">
      <h3 class="text-lg font-medium text-gray-700">Data Terkirim:</h3>
      <pre class="text-sm text-gray-600 whitespace-pre-wrap">{{
        JSON.stringify(submittedData, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Tipe untuk data formulir
interface ExpenseForm {
  deskripsi: string;
  jumlah: number | null;
  tanggal: string; // Akan dikirim sebagai string YYYY-MM-DD, server akan mengonversinya jika perlu
}

// Tipe untuk error validasi
interface FormErrors {
  deskripsi?: string;
  jumlah?: string;
  tanggal?: string;
}

const form = ref<ExpenseForm>({
  deskripsi: "",
  jumlah: null,
  tanggal: new Date().toISOString().split("T")[0], // Default tanggal hari ini (YYYY-MM-DD)
});

const errors = ref<FormErrors>({});
const submittedData = ref<any | null>(null); // Dibuat 'any' untuk fleksibilitas data yang dikirim/diterima
const isSubmitting = ref(false);

const validateForm = (): boolean => {
  errors.value = {}; // Reset error sebelum validasi

  if (!form.value.deskripsi.trim()) {
    errors.value.deskripsi = "Deskripsi tidak boleh kosong.";
  }
  if (form.value.jumlah === null || form.value.jumlah <= 0) {
    errors.value.jumlah = "Jumlah harus berupa angka positif.";
  }
  if (!form.value.tanggal) {
    errors.value.tanggal = "Tanggal tidak boleh kosong.";
  } else {
    // Validasi format tanggal sederhana (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(form.value.tanggal)) {
      errors.value.tanggal = "Format tanggal tidak valid (YYYY-MM-DD).";
    } else {
      const d = new Date(form.value.tanggal);
      // Cek apakah tanggal yang dihasilkan valid. getTime() akan NaN jika tidak valid.
      // Juga, pastikan tahun tidak terlalu jauh di masa lalu/depan jika diperlukan,
      // misal, untuk menghindari input seperti "0000-01-01".
      if (
        isNaN(d.getTime()) ||
        d.getFullYear() < 1900 ||
        d.getFullYear() > 2200
      ) {
        errors.value.tanggal = "Tanggal tidak valid.";
      }
    }
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  submittedData.value = null;

  // Data yang akan dikirim ke API, sesuai dengan skema Zod
  const payload = {
    deskripsi: form.value.deskripsi,
    jumlah: Number(form.value.jumlah), // Pastikan jumlah adalah angka
    // 'tanggal' akan dikirim sebagai string 'YYYY-MM-DD' dari input type="date"
    // Skema Zod di server akan menangani parsing ke objek Date jika 'optional().transform()' digunakan.
    // Jika endpoint API mengharapkan string datetime penuh (ISO), maka perlu penyesuaian.
    // Untuk input type="date", format YYYY-MM-DD sudah cukup.
    tanggal: form.value.tanggal,
  };

  try {
    // Ganti '/api/expense' dengan endpoint API POST Anda yang sebenarnya
    // Endpoint API POST harus sudah disesuaikan untuk menerima field: deskripsi, jumlah, tanggal
    const response = await $fetch("/api/expense", {
      // Asumsi endpoint ada di /api/expense/index.post.ts
      method: "POST",
      body: payload,
    });

    console.log("Pengeluaran berhasil disimpan:", response);
    submittedData.value = response; // Tampilkan data yang dikembalikan oleh server

    // Reset form setelah berhasil
    form.value = {
      deskripsi: "",
      jumlah: null,
      tanggal: new Date().toISOString().split("T")[0],
    };
    alert("Pengeluaran berhasil disimpan!");
  } catch (error: any) {
    console.error("Gagal menyimpan pengeluaran:", error);
    submittedData.value = { error: true, details: error.data || error.message };

    if (error.data && error.data.data && Array.isArray(error.data.data)) {
      // Jika API mengembalikan array error validasi (seperti dari Zod di server)
      const apiErrors = error.data.data
        .map((err: any) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      alert(`Gagal menyimpan:\n${apiErrors}`);
      // Anda bisa memetakan error ini kembali ke errors.value jika path cocok
      error.data.data.forEach((err: any) => {
        if (err.path && err.path[0] && form.value.hasOwnProperty(err.path[0])) {
          errors.value[err.path[0] as keyof FormErrors] = err.message;
        }
      });
    } else if (error.data && error.data.statusMessage) {
      alert(`Gagal menyimpan: ${error.data.statusMessage}`);
    } else {
      alert("Terjadi kesalahan saat menyimpan pengeluaran.");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styling tambahan jika diperlukan */
</style>
