import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bricolage-grotesque': ['"Bricolage Grotesque"', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      fontWeight: {
        '800': '800',
        '600': '600',
        '400': '400',
        '100': '100',
        '900': '900',
      },
    },
  },
  plugins: [],
};

export default config;
