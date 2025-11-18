/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VS Code Dark Theme Colors
        vscode: {
          bg: '#1e1e1e',           // Main background
          sidebar: '#252526',       // Sidebar/navbar
          panel: '#2d2d30',        // Panels/cards
          input: '#3c3c3c',        // Input fields
          hover: '#2a2d2e',        // Hover states
          border: '#3e3e42',       // Borders
          text: {
            primary: '#cccccc',    // Main text
            secondary: '#858585',  // Secondary text
            bright: '#ffffff',     // Headers/important
          },
          accent: {
            blue: '#007acc',       // Primary actions
            green: '#89d185',      // Success
            red: '#f48771',        // Error/delete
            yellow: '#cca700',     // Warning
            purple: '#c586c0',     // Special
          }
        }
      },
    },
  },
  plugins: [],
}