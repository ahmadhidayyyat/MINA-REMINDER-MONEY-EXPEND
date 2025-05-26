<template>
  <div class="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          Todo App & Reminder
        </h1>
        <p class="text-gray-500 mb-6">
          Track and organize all your important tasks here.
        </p>

        <!-- Fixed Date Picker Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <input
            v-model="newTodo.text"
            @keyup.enter="addTodo"
            placeholder="What needs to be done?"
            class="md:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="relative">
            <VueDatePicker
              v-model="newTodo.reminder_at"
              :is24="true"
              enable-seconds
              placeholder="Set reminder time"
              teleport-center
              auto-apply
              :min-date="new Date()"
              input-class-name="dp-fixed-input"
              :clearable="true"
            />
          </div>
          <select
            v-model="newTodo.priority"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="none">No Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            @click="addTodo"
            class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow"
          >
            Add Task
          </button>
        </div>

        <div class="space-y-6">
          <div
            v-if="Object.keys(groupedTodos).length === 0"
            class="text-center text-gray-500 py-6"
          >
            🎉<br />
            No tasks yet. Please add your first task.
          </div>
          <div v-for="(dayTasks, day) in groupedTodos" :key="day">
            <h3
              class="text-lg font-bold text-gray-700 mb-3 pb-2 border-b-2 border-blue-300"
            >
              {{ day }}
            </h3>
            <div class="space-y-3">
              <div
                v-for="todo in dayTasks"
                :key="todo.id"
                class="p-4 border rounded-lg transition-all duration-300 flex flex-col"
                :class="getCardClass(todo)"
              >
                <div class="flex-grow">
                  <span
                    class="font-medium"
                    :class="{ 'line-through': todo.status !== 'pending' }"
                    >{{ todo.text }}</span
                  >
                  <div
                    class="flex items-center gap-4 text-xs text-gray-500 mt-2"
                  >
                    <span
                      v-if="todo.priority !== 'none'"
                      class="font-semibold px-2 py-0.5 rounded-full"
                      :class="getPriorityBadgeClass(todo.priority)"
                      >Priority: {{ todo.priority }}</span
                    >
                    <div
                      v-if="todo.reminder_at"
                      class="flex items-center gap-1"
                      :class="{
                        'text-blue-600 font-bold animate-pulse':
                          todo.is_reminding &&
                          !(todo.overdue_text && todo.status === 'pending'),
                      }"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{{ formatReminderDate(todo.reminder_at) }}</span>
                    </div>
                  </div>
                  <p
                    v-if="
                      todo.status === 'canceled' && todo.cancellation_reason
                    "
                    class="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded-md"
                  >
                    <b>Reason for cancellation:</b>
                    {{ todo.cancellation_reason }}
                  </p>
                  <p
                    v-if="todo.pending_reason"
                    class="text-xs text-yellow-700 mt-2 p-2 bg-yellow-50 rounded-md"
                  >
                    <b>Info for pending:</b> {{ todo.pending_reason }}
                  </p>
                  <p
                    v-if="todo.overdue_text && todo.status === 'pending'"
                    class="text-sm font-bold text-red-700 mt-2 p-2 bg-red-500/10 rounded-lg flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ todo.overdue_text }}</span>
                  </p>
                </div>

                <div
                  class="flex items-center gap-2 mt-4 pt-3 border-t sm:border-none sm:pt-0 sm:mt-0 sm:ml-auto flex-shrink-0"
                >
                  <template v-if="todo.status === 'pending'">
                    <button
                      @click="markAs(todo.id, 'completed')"
                      class="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full hover:bg-green-600"
                    >
                      Done
                    </button>
                    <button
                      @click="openModal('pending', todo.id)"
                      class="px-3 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
                    >
                      Pend
                    </button>
                    <button
                      @click="openModal('cancel', todo.id)"
                      class="px-3 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </template>
                  <button
                    @click="deleteTodo(todo.id)"
                    class="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div v-if="modalContext.type === 'pending'">
          <h3 class="text-lg font-bold mb-4">Pend Task</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Pend until when?</label
              >
              <VueDatePicker
                v-model="modalInput.new_date"
                :is24="true"
                enable-seconds
                placeholder="Select new reminder time"
                teleport-center
                auto-apply
                :min-date="new Date()"
                class="w-full"
                input-class-name="dp-fixed-input"
                :clearable="true"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Reason for pending?</label
              >
              <textarea
                v-model="modalInput.reason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Waiting for client confirmation"
              ></textarea>
            </div>
          </div>
        </div>
        <div v-if="modalContext.type === 'cancel'">
          <h3 class="text-lg font-bold mb-4">Cancel Task</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Reason for cancellation?</label
            >
            <textarea
              v-model="modalInput.reason"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., The project is no longer proceeding"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          <button
            @click="handleModalSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const todos = ref([]);
const newTodo = ref({ text: "", reminder_at: null, priority: "none" });
const isModalOpen = ref(false);
const modalContext = ref({ type: null, todoId: null });
const modalInput = ref({ new_date: null, reason: "" });

watch(
  todos,
  (newTodos) => {
    const todosToSave = newTodos.map((todo) => ({
      ...todo,
      reminder_at: todo.reminder_at
        ? new Date(todo.reminder_at).toISOString()
        : null,
    }));
    if (typeof saveTodos === "function") {
      saveTodos(todosToSave);
    }
  },
  { deep: true }
);

onMounted(() => {
  if (typeof loadTodos === "function") {
    const loadedTodos = loadTodos();
    todos.value = loadedTodos.map((todo) => ({
      ...todo,
      reminder_at: todo.reminder_at ? new Date(todo.reminder_at) : null,
    }));
  }
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  setInterval(checkReminders, 5000);
});

const groupedTodos = computed(() => {
  const groups = {};
  const undatedTasks = [];
  todos.value.forEach((todo) => {
    if (todo.reminder_at) {
      const date = new Date(todo.reminder_at);
      const dayKey = date.toISOString().split("T")[0];
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(todo);
    } else {
      undatedTasks.push(todo);
    }
  });
  const sortedGroupKeys = Object.keys(groups).sort();
  const sortedGroups = {};
  for (const key of sortedGroupKeys) {
    const date = new Date(key);
    const displayKey = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    sortedGroups[displayKey] = groups[key];
  }
  if (undatedTasks.length > 0)
    sortedGroups["Tasks Without a Date"] = undatedTasks;
  return sortedGroups;
});

const addTodo = () => {
  if (newTodo.value.text.trim()) {
    todos.value.unshift({
      id: Date.now(),
      text: newTodo.value.text.trim(),
      status: "pending",
      reminder_at: newTodo.value.reminder_at,
      priority: newTodo.value.priority,
      reminder_fired: false,
      is_reminding: false,
      cancellation_reason: null,
      pending_reason: null,
      overdue_text: null,
    });
    newTodo.value = { text: "", reminder_at: null, priority: "none" };
  }
};

const markAs = (id, newStatus) => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) todo.status = newStatus;
};

const deleteTodo = (id) => {
  if (confirm("Are you sure you want to permanently delete this task?")) {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  }
};

const openModal = (type, todoId) => {
  const todo = todos.value.find((t) => t.id === todoId);
  modalContext.value = { type, todoId };
  if (type === "pending" && todo && todo.reminder_at) {
    modalInput.value = { new_date: new Date(todo.reminder_at), reason: "" };
  } else {
    modalInput.value = { new_date: null, reason: "" };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleModalSubmit = () => {
  const { type, todoId } = modalContext.value;
  const todo = todos.value.find((t) => t.id === todoId);
  if (!todo) return;

  if (type === "pending") {
    if (modalInput.value.new_date) todo.reminder_at = modalInput.value.new_date;
    if (modalInput.value.reason) todo.pending_reason = modalInput.value.reason;
    todo.reminder_fired = false;
    todo.is_reminding = false;
    todo.overdue_text = null;
  } else if (type === "cancel") {
    todo.status = "canceled";
    if (modalInput.value.reason)
      todo.cancellation_reason = modalInput.value.reason;
  }
  closeModal();
};

const formatReminderDate = (dateValue) => {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  return date.toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const formatOverdueTime = (dateValue) => {
  const now = new Date();
  const reminderTime =
    typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  const overdueTime = now - reminderTime;
  const minutes = Math.floor(overdueTime / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `Overdue: ${days} days`;
  if (hours > 0) return `Overdue: ${hours} hours`;
  if (minutes > 0) return `Overdue: ${minutes} minutes`;
  return "Overdue: Just now";
};

const getCardClass = (todo) => {
  if (todo.overdue_text && todo.status === "pending")
    return "border-l-4 border-red-500 bg-red-500/10 animate-pulse";
  if (todo.status === "completed")
    return "border-l-4 border-green-500 bg-green-500/10 opacity-70";
  if (todo.status === "canceled")
    return "border-l-4 border-gray-400 bg-gray-500/10 opacity-60";
  return "border-l-4 border-blue-500 bg-blue-500/5";
};

const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-blue-200 text-blue-800";
    default:
      return "";
  }
};

const checkReminders = () => {
  const now = new Date();
  todos.value.forEach((todo) => {
    todo.overdue_text = null;
    if (todo.reminder_at && todo.status === "pending") {
      const reminderTime = new Date(todo.reminder_at);
      if (now >= reminderTime) {
        todo.is_reminding = true;
        todo.overdue_text = formatOverdueTime(reminderTime);
        if (!todo.reminder_fired) {
          new Notification("TASK OVERDUE!", {
            body: `The task "${todo.text}" is past its due time.`,
            icon: "/favicon.ico",
          });
          todo.reminder_fired = true;
        }
      } else {
        todo.is_reminding = false;
      }
    } else {
      todo.is_reminding = false;
    }
  });
};
</script>

<style scoped>
/* Fixed Date Picker Styles */
:deep(.dp-fixed-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  background-color: white;
  min-height: 3rem;
}

:deep(.dp-fixed-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

:deep(.dp__clear_icon) {
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

:deep(.dp__clear_icon:hover) {
  color: #ef4444;
}

/* Original styles preserved */
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
</style>
