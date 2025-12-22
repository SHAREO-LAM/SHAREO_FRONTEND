
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts,js}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // PrimeVue ne doit pas etre reset
  },
  plugins: [],
}
