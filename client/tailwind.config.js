// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        habibi: ['Habibi', 'serif'], // if you also use Habibi
        lora: ['Soria', 'serif'],     // <-- define lora here
      },
    },
  },

  plugins: [],
};
