import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Keeping Shadcn/ui CSS variables
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			
  			// Custom brand colors from UI mockups
  			brand: {
  				blue: {
  					50: '#dbeafe',
  					100: '#bfdbfe',
  					200: '#93c5fd',
  					300: '#60a5fa',
  					400: '#3b82f6',
  					500: '#2563eb',
  					600: '#1d4ed8',
  					700: '#1e40af',
  					800: '#1e3a8a',
  					900: '#1e3a8a'
  				},
  				green: {
  					50: '#d1fae5',
  					100: '#a7f3d0',
  					200: '#6ee7b7',
  					300: '#34d399',
  					400: '#10b981',
  					500: '#059669',
  					600: '#047857',
  					700: '#065f46',
  					800: '#064e3b',
  					900: '#022c22'
  				},
  				orange: {
  					50: '#fed7aa',
  					100: '#fdba74',
  					200: '#fb923c',
  					300: '#f97316',
  					400: '#ea580c',
  					500: '#dc2626',
  					600: '#c2410c',
  					700: '#9a3412',
  					800: '#7c2d12',
  					900: '#431407'
  				},
  				purple: {
  					50: '#e9d5ff',
  					100: '#d8b4fe',
  					200: '#c084fc',
  					300: '#a855f7',
  					400: '#9333ea',
  					500: '#7c3aed',
  					600: '#6d28d9',
  					700: '#5b21b6',
  					800: '#4c1d95',
  					900: '#2e1065'
  				}
  			},
  			
  			// Semantic colors for opportunity levels
  			opportunity: {
  				high: '#10b981',
  				medium: '#f59e0b',
  				low: '#6b7280'
  			},
  			
  			// Chart colors
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		
  		// Custom spacing for consistent layout
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		
  		// Typography
  		fontSize: {
  			'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
  			'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  			'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  			'5xl': ['3rem', { lineHeight: '1' }]
  		},
  		
  		// Custom animations
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-in': 'slideIn 0.3s ease-out',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		
  		keyframes: {
  			fadeIn: {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' }
  			},
  			slideIn: {
  				'0%': { transform: 'translateY(-10px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' }
  			}
  		},
  		
  		// Box shadows
  		boxShadow: {
  			'soft': '0 2px 4px rgba(0, 0, 0, 0.05)',
  			'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  			'strong': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  		},
  		
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
