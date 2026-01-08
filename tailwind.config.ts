import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
