// ~/utils/storage.ts

export interface Todo {
  id: number;
  text: string;
  status: "pending" | "completed" | "canceled";
  reminder_at: string | null;
  priority: "none" | "low" | "medium" | "high";
  reminder_fired: boolean;
  is_reminding: boolean;
  cancellation_reason: string | null;
  pending_reason: string | null;
  overdue_text: string | null;
}

const TODO_STORAGE_KEY = "todoAppReminderData";

/**
 * Memuat seluruh array data tugas dari Local Storage.
 */
export const loadTodos = (): Todo[] => {
  // Pastikan kode ini hanya berjalan di sisi browser (client)
  if (typeof window === "undefined") {
    return [];
  }

  const savedData = localStorage.getItem(TODO_STORAGE_KEY);
  if (savedData) {
    try {
      // Ubah data string kembali menjadi object/array JavaScript
      return JSON.parse(savedData);
    } catch (e) {
      console.error("Gagal memuat data Todo dari Local Storage:", e);
      return []; // Kembalikan array kosong jika data rusak
    }
  }
  return []; // Kembalikan array kosong jika tidak ada data tersimpan
};

/**
 * Menyimpan seluruh array data tugas ke Local Storage.
 */
export const saveTodos = (todos: Todo[]): void => {
  if (typeof window === "undefined") return;

  // Ubah object/array JavaScript menjadi format string JSON untuk disimpan
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
};
