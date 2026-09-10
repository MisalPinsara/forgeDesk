/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f8f9ff', surface: '#ffffff', 'surface-subtle': '#eff4ff', 'surface-muted': '#e5eeff',
        primary: '#2346d5', 'primary-container': '#4361ee', 'on-primary': '#ffffff', ink: '#0b1c30',
        muted: '#565e74', outline: '#c4c5d7', sidebar: '#213145', 'sidebar-text': '#eaf1ff', danger: '#ba1a1a', success: '#006443',
      },
      boxShadow: { card: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)' },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
