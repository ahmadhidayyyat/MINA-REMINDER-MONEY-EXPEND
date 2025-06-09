export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
  }),
  getters: {
    getCount(state) {
      return state.count;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
