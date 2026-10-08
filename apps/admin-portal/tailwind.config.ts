import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#0A0E17',
          sidebar: '#0E1524',
          card: '#131B2E',
          border: '#1D2A45',
          hover: '#1A253D',
          accent: '#00C4FF', // Cyan Primario
          cobalt: '#0077D8', // Azul Cobalto
          navy: '#004B99', // Azul Marino Profundo
          red: '#E51922', // Rojo Alerta Prohibición
          ochre: '#C59B63', // Ocre Ácaro
          cyan: '#00C4FF',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#E51922',
        },
        brand: {
          500: '#00C4FF',
          600: '#009FE0',
          700: '#0077D8',
          800: '#004B99',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
