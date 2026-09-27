export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        'primary-dark': '#EA580C',
        'primary-light': '#FB923C',
        secondary: '#000000',
        'secondary-dark': '#1F2937',
        background: '#FFFFFF',
        'background-alt': '#FDF8F3',
        'background-cream': '#FEF3E7',
        text: '#000000',
        'text-secondary': '#374151',
        'text-muted': '#6B7280',
        border: '#E5E7EB',
        'border-warm': '#FED7AA',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.04)',
        card: '0 4px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(249, 115, 22, 0.12)',
        button: '0 4px 12px rgba(249, 115, 22, 0.25)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
