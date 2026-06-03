import type { Config } from 'tailwindcss'
const config: Config = { darkMode: 'class', content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { primary: { DEFAULT: '#1D9E75', dark: '#0F6E56', light: '#E1F5EE' }, 'brand-shopee': '#EE4D2D', 'brand-tiktok': '#010101' } } }, plugins: [] }
export default config
