<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <section class="grid md:grid-cols-2 gap-12 items-center my-16 sm:my-24">
        <div class="text-center md:text-left">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
          >
            Record Expenses and Set Reminders.
            <span class="text-blue-600">Life More Easy.</span>
          </h1>
          <p class="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
            One platform to manage all your financial records and important
            reminders. Take full control of your finances and schedule today.
          </p>
          <div
            class="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <NuxtLink
              to="/money"
              class="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Record Expenses
            </NuxtLink>
            <NuxtLink
              to="/reminder"
              class="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
            >
              See Reminder
            </NuxtLink>
          </div>
        </div>
        <div>
          <div
            class="bg-white p-1 rounded-xl shadow-2xl transform-gpu rotate-3 hover:rotate-0 transition-transform duration-500 shadow-blue-600"
          >
            <img
              src="/image/Group 4.png"
              alt="Foto Pembuat Aplikasi"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <section class="my-24 sm:my-32">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900">
            Your Flagship Features
          </h2>
          <p class="text-gray-600 mt-2">
            Designed to organize your daily life to be more productive
          </p>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl shadow-blue-500"
        >
          <div
            class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div
              class="bg-blue-100 text-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Spending Notes</h3>
            <p class="text-gray-600">
              Easily track every transaction. See a summary of your total and
              average spending instantly.
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div
              class="bg-green-100 text-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Task Reminder</h3>
            <p class="text-gray-600">
              Organize all tasks and get timely reminders. Manage priorities,
              postpone or cancel as needed.
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div
              class="bg-purple-100 text-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Local Storage</h3>
            <p class="text-gray-600">
              All your data is stored securely in your browser. No need to worry
              about losing data when the page reloads.
            </p>
          </div>
        </div>
      </section>
    </main>

    <footer
      class="max-w-7xl mx-auto text-center py-8 text-gray-500 border-t mt-16"
    >
      <p>
        © MINA MoneyTrack & Reminder - Manage your finances and organize your
        daily activities
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* Styling kustom bisa ditambahkan di sini jika perlu */
</style>
