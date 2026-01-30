/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0a0a",
        obsidian: "#121212",
        smoke: "#1a1a1a",
        ash: "#2a2a2a",
        silver: "#888888",
        bone: "#e8e4df",
        cream: "#f5f2ed",
        "electric-pink": "#ff2d7b",
        "neon-blue": "#00d4ff",
        "acid-green": "#a8ff00",
        "sunset-orange": "#ff6b35",
        "imessage-blue": "#007AFF",
        "sms-green": "#34C759",
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
