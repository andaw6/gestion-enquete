/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    // Ajoutez ici d'autres chemins si besoin
  ],
  theme: {
    extend: {
      colors: {

        // Couleur principale bleu foncé
        secondary: {
          DEFAULT: '#293F76',
          50: '#EAECF1',
          100: '#C1C6D6',
          200: '#949FBB',
          300: '#6A79A0',
          400: '#3D5487',
          500: '#293F76',
          600: '#233565',
          700: '#1D2B54',
          800: '#172143',
          900: '#111732',
        },

        // Couleur secondaire cyan
        primary: {
          DEFAULT: '#17ABDD',
          50: '#E7F4FA',
          100: '#BAE1F1',
          200: '#A1D8EC',
          300: '#71C9E7',
          400: '#22B2DF',
          500: '#17ABDD',
          600: '#1399C5',
          700: '#1087AD',
          800: '#0C7595',
          900: '#09637D',
        },

        // Couleur gris/noir personnalisée
        dark: {
          DEFAULT: '#272727',
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#5C5C5C',
          600: '#4D4C4C',
          700: '#3E3E3E',
          800: '#303030',
          900: '#272727',
          950: '#232322',
        },

        // Palettes alternatives regroupées
        customPalettes: {
          primary123: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#111827",
          },
          primary124: {
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            300: "#6EE7B7",
            400: "#34D399",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
            800: "#065F46",
            900: "#064E3B",
          },
        },

      },

      statusColors: {
        active: "#10b981",
        pending: "#f59e0b",
        blocked: "#ef4444",
        warning: "#eab308",
        info: "#3b82f6",
        success: "#22c55e",
      },

      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "inner-glow": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        intense:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        glow: "0 0 15px 2px rgba(34, 197, 94, 0.3)",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    // Vous pouvez activer Flowbite ou d'autres plugins si nécessaire
    // require('flowbite/plugin'),
    require("tailwindcss-animate")
  ],
};
