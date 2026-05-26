/** @type {import('tailwindcss').Config} */
// Colors are wired to CSS variables that hold RGB-channel triplets (see src/styles/globals.css).
// Using rgb(var(--x) / <alpha-value>) lets Tailwind handle opacity modifiers like `bg-primary/10`.
const cssVarColor = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.module.css",
  ],
  theme: {
    extend: {
      colors: {
        background: cssVarColor('background'),
        foreground: cssVarColor('foreground'),
        card: {
          DEFAULT: cssVarColor('card'),
          foreground: cssVarColor('card-foreground'),
        },
        popover: {
          DEFAULT: cssVarColor('popover'),
          foreground: cssVarColor('popover-foreground'),
        },
        primary: {
          DEFAULT: cssVarColor('primary'),
          foreground: cssVarColor('primary-foreground'),
        },
        secondary: {
          DEFAULT: cssVarColor('secondary'),
          foreground: cssVarColor('secondary-foreground'),
        },
        muted: {
          DEFAULT: cssVarColor('muted'),
          foreground: cssVarColor('muted-foreground'),
        },
        accent: {
          DEFAULT: cssVarColor('accent'),
          foreground: cssVarColor('accent-foreground'),
        },
        destructive: {
          DEFAULT: cssVarColor('destructive'),
          foreground: cssVarColor('destructive-foreground'),
        },
        border: cssVarColor('border'),
        input: cssVarColor('input'),
        ring: cssVarColor('ring'),
        sidebar: {
          DEFAULT: cssVarColor('sidebar'),
          foreground: cssVarColor('sidebar-foreground'),
          primary: cssVarColor('sidebar-primary'),
          'primary-foreground': cssVarColor('sidebar-primary-foreground'),
          accent: cssVarColor('sidebar-accent'),
          'accent-foreground': cssVarColor('sidebar-accent-foreground'),
          border: cssVarColor('sidebar-border'),
          ring: cssVarColor('sidebar-ring'),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
