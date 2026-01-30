/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--color-void)",
        obsidian: "var(--color-obsidian)",
        smoke: "var(--color-smoke)",
        ash: "var(--color-ash)",
        silver: "var(--color-silver)",
        bone: "var(--color-bone)",
        cream: "var(--color-cream)",
        "electric-pink": "var(--color-electric-pink)",
        "neon-blue": "var(--color-neon-blue)",
        "acid-green": "var(--color-acid-green)",
        "sunset-orange": "var(--color-sunset-orange)",
        "imessage-blue": "var(--color-imessage-blue)",
        "sms-green": "var(--color-sms-green)",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["SF Mono", "Monaco", "monospace"],
      },
      animation: {
        "spin-slow": "spin-slow 8s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        marquee: "marquee 20s linear infinite",
      },
    },
  },
  plugins: [],
};
