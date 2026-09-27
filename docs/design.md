# Design Guidelines: LLD Lab

## 1. Color Palette

The platform uses a clean, light theme with primary brand accents:

| Token | Hex | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#2563EB` | `bg-primary`, `text-primary` | Main buttons, active links, accents |
| **Primary Dark** | `#1D4ED8` | `hover:bg-primary-dark` | Button hover states |
| **Secondary** | `#F97316` | `bg-secondary`, `text-secondary` | Highlights, CTA banner |
| **Background Alt** | `#F9FAFB` | `bg-background-alt` | Page background, cards canvas |
| **Surface** | `#FFFFFF` | `bg-white` | Cards, panels, navigation bar |
| **Text** | `#1F2937` | `text-text` | Primary headings and body text |
| **Text Secondary**| `#4B5563` | `text-text-secondary` | Labels, subtitles, descriptions |
| **Border** | `#E5E7EB` | `border-border` | Card outlines, dividers |
| **Success** | `#10B981` | `text-success`, `bg-success` | Passed checks, high scores (>=70) |
| **Warning** | `#F59E0B` | `text-warning`, `bg-warning` | Medium scores (40-69), notices |
| **Error** | `#EF4444` | `text-error`, `bg-error` | Low scores (<40), failed states |

---

## 2. Typography

- **UI Font:** System Sans (`Inter`, system-ui, -apple-system, sans-serif)
- **Code & Monospace:** `monospace` (Monaco editor dark theme `vs-dark`)

---

## 3. Core Component Conventions

- **Cards:** `bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition`
- **Primary Buttons:** `bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-button`
- **Difficulty Badges:**
  - Easy: `bg-success bg-opacity-10 text-success`
  - Medium: `bg-warning bg-opacity-10 text-warning`
  - Hard: `bg-error bg-opacity-10 text-error`
- **Status Pills:**
  - COMPLETED: `bg-success bg-opacity-10 text-success`
  - EVALUATING: `bg-warning bg-opacity-10 text-warning`
  - FAILED: `bg-error bg-opacity-10 text-error`
  - PENDING: `bg-primary bg-opacity-10 text-primary`
