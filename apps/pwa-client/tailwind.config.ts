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
        brand: {
          50: '#E6F9FF',
          100: '#B3EFFF',
          200: '#80E4FF',
          300: '#4DDAFF',
          400: '#1ACFFF',
          500: '#00C4FF', // Cyan Eléctrico / Cyan Brillante (Palabra 'free' y flecha dinámica)
          600: '#009FE0',
          700: '#0077D8', // Azul Cobalto Intermedio (Bordes y transiciones)
          800: '#004B99', // Azul Marino / Azul Profundo (Contornos exteriores y sombras biseladas)
          900: '#003366',
          950: '#001E3D',
        },
        alert: {
          500: '#E51922', // Rojo Señalización (Símbolo de prohibido sobre la 't')
          600: '#C7141C',
          700: '#A40E15',
        },
        ochre: {
          400: '#D6B485',
          500: '#C59B63', // Marrón Claro / Ocre (Cuerpo del ácaro animado)
          600: '#A67F4B',
          800: '#5A3B18', // Marrón Oscuro / Tinta (Patas y sombreado del ácaro)
        },
        dark: {
          bg: '#0A0E17', // Fondo ultra oscuro con tinte marino
          surface: '#101726', // Superficies y paneles principales
          card: '#151E32', // Tarjetas elevadas
          border: '#1E2B47', // Bordes con halo azul profundo
          hover: '#1C2843',
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
