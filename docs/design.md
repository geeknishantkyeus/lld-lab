# Design System Specification Document

# LLD Lab — Design System & Visual Guidelines

| Metadata Attribute | Specification Value |
| :--- | :--- |
| **Title** | LLD Lab Design System Specification |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Theme** | CipherSchools Light Shell with Dark IDE Core |
| **Target Framework** | Tailwind CSS 4.0 / Vanilla CSS Tokens |
| **Author** | CipherSchools Product Design Team |
| **Last Updated** | September 2026 |

---

## Table of Contents
1. [Brand Identity](#1-brand-identity)
2. [Color Palette (CSS Variables)](#2-color-palette-css-variables)
   - [2.1 Core Palette Swatches](#21-core-palette-swatches)
   - [2.2 Complete CSS Custom Properties Token Sheet](#22-complete-css-custom-properties-token-sheet)
   - [2.3 Contrast Ratios & Accessibility (WCAG AAA)](#23-contrast-ratios--accessibility-wcag-aaa)
3. [Typography](#3-typography)
   - [3.1 Font Stacks](#31-font-stacks)
   - [3.2 Type Scale & Hierarchy](#32-type-scale--hierarchy)
4. [Spacing & Elevation System](#4-spacing--elevation-system)
   - [4.1 4px / 8px Spacing Matrix](#41-4px--8px-spacing-matrix)
   - [4.2 Border Radius Scale](#42-border-radius-scale)
   - [4.3 Elevation & Drop Shadows](#43-elevation--drop-shadows)
5. [UI Components](#5-ui-components)
   - [5.1 Buttons](#51-buttons)
   - [5.2 Cards & Containers](#52-cards--containers)
   - [5.3 Form Controls & Inputs](#53-form-controls--inputs)
   - [5.4 Badges & Status Pills](#54-badges--status-pills)
   - [5.5 Tables & Data Grids](#55-tables--data-grids)
6. [Layout Architecture](#6-layout-architecture)
   - [6.1 Global Shell Structure](#61-global-shell-structure)
   - [6.2 3-Column Split Workspace Grid](#62-3-column-split-workspace-grid)
7. [Iconography](#7-iconography)
8. [Animations & Micro-Interactions](#8-animations--micro-interactions)
9. [Responsive Breakpoints](#9-responsive-breakpoints)
10. [Logo Concept & Brand Assets](#10-logo-concept--brand-assets)

---

## 1. Brand Identity

**LLD Lab** embodies the design ethos of **CipherSchools**: clean, academic, rigorous, and developer-centric. It fuses the visual clarity of modern software engineering tools with the pedagogical warmth of interactive learning platforms.

### Design Principles
1. **Cognitive Clarity First:** Low-Level Design demands intense architectural concentration. The light chrome UI reduces eye strain, while the dark code editor provides optimal syntax focus.
2. **Deterministic Confidence:** Visual states (Pass, Fail, Warning, Queued) are unambiguous, using high-contrast status colors.
3. **Structured Blueprints:** Architectural diagrams, class hierarchies, and SOLID scores are rendered using sharp borders, clean dividers, and modular card structures reminiscent of engineering blueprints.
4. **Pedagogical Empathy:** Socratic hints and LLM architectural feedback are presented with supportive, non-punitive visual cues (subtle accents, clear callout cards).

---

## 2. Color Palette (CSS Variables)

The design system uses a curated light theme with CipherSchools signature **Primary Blue (`#2563EB`)** and **Secondary Orange (`#F97316`)**, paired with neutral canvas grays, dark body text, and a high-contrast dark code editor.

### 2.1 Core Palette Swatches

| Role | Color Name | Hex Code | Tailwind Token | Intended Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | Royal Blue | `#2563EB` | `blue-600` | Primary CTA buttons, active tabs, focus borders, primary links. |
| **Primary Hover** | Deep Blue | `#1D4ED8` | `blue-700` | Hover states for primary interactions. |
| **Secondary Brand** | Energetic Orange | `#F97316` | `orange-500` | Submit buttons, CipherSchools badge, execution triggers, highlight accents. |
| **Secondary Hover** | Burnt Orange | `#EA580C` | `orange-600` | Hover states for secondary actions. |
| **Background Base** | Pure White | `#FFFFFF` | `white` | Page base, primary card backgrounds, popovers. |
| **Background Canvas** | Slate Canvas Gray | `#F9FAFB` | `gray-50` | Split-pane background, sidebar containers, table headers. |
| **Surface Subdued** | Neutral Slate 100 | `#F3F4F6` | `gray-100` | Dividers, tab bar rail, inactive pill backgrounds. |
| **Text Primary** | Charcoal Gray | `#1F2937` | `gray-800` | Primary headings, problem statement markdown, main labels. |
| **Text Secondary** | Medium Slate | `#4B5563` | `gray-600` | Subtitles, metadata descriptions, placeholder text. |
| **Text Muted** | Light Charcoal | `#9CA3AF` | `gray-400` | Keyboard shortcut keys, disabled text, breadcrumb dividers. |
| **Border Subtle** | Border Gray | `#E5E7EB` | `gray-200` | Pane splitters, card outlines, table borders. |
| **Success** | Emerald Green | `#10B981` | `emerald-500`| Passed tests, 100% SOLID rubric, accepted verdict. |
| **Warning** | Warm Amber | `#F59E0B` | `amber-500` | Anti-pattern detected, hint penalty warning, code smells. |
| **Destructive** | Coral Red | `#EF4444` | `red-500` | Failing test cases, compiler errors, rejected verdict. |
| **Editor Dark BG** | Obsidian Black | `#1E1E1E` | N/A (Monaco) | Monaco Editor surface (VS Code Dark+ standard). |

### 2.2 Complete CSS Custom Properties Token Sheet

```css
/* apps/web/src/styles/design-tokens.css */
:root {
  /* Brand Tokens */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-light: #EFF6FF;
  --color-secondary: #F97316;
  --color-secondary-hover: #EA580C;
  --color-secondary-light: #FFF7ED;

  /* Neutral Backgrounds */
  --bg-canvas: #F9FAFB;
  --bg-surface: #FFFFFF;
  --bg-surface-hover: #F3F4F6;
  --bg-muted: #E5E7EB;

  /* Typography / Text Colors */
  --text-primary: #1F2937;
  --text-secondary: #4B5563;
  --text-muted: #9CA3AF;
  --text-inverse: #FFFFFF;

  /* Borders & Dividers */
  --border-subtle: #E5E7EB;
  --border-default: #D1D5DB;
  --border-focus: #2563EB;

  /* Status & Semantic Signals */
  --status-success: #10B981;
  --status-success-bg: #ECFDF5;
  --status-warning: #F59E0B;
  --status-warning-bg: #FFFBEB;
  --status-danger: #EF4444;
  --status-danger-bg: #FEF2F2;
  --status-info: #0284C7;
  --status-info-bg: #F0F9FF;

  /* Dark Code Sandbox Tokens */
  --editor-bg: #1E1E1E;
  --editor-gutter-bg: #252526;
  --editor-active-line: #2A2D2E;
  --editor-selection: #264F78;
  --editor-fg: #D4D4D4;
  --editor-tab-active: #1E1E1E;
  --editor-tab-inactive: #2D2D2D;

  /* Elevation Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  /* Radius Tokens */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2.3 Contrast Ratios & Accessibility (WCAG AAA)

| Color Pair | Foreground Hex | Background Hex | Contrast Ratio | Compliance Level |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Text on White** | `#1F2937` | `#FFFFFF` | **12.63 : 1** | WCAG AAA (Pass) |
| **Secondary Text on White** | `#4B5563` | `#FFFFFF` | **7.24 : 1** | WCAG AAA (Pass) |
| **Primary Blue on White** | `#2563EB` | `#FFFFFF` | **4.61 : 1** | WCAG AA Large/UI (Pass) |
| **White on Primary Blue** | `#FFFFFF` | `#2563EB` | **4.61 : 1** | WCAG AA Large/UI (Pass) |
| **White on Orange CTA** | `#FFFFFF` | `#EA580C` | **4.53 : 1** | WCAG AA Large/UI (Pass) |
| **Editor FG on Editor BG** | `#D4D4D4` | `#1E1E1E` | **10.51 : 1** | WCAG AAA (Pass) |

---

## 3. Typography

### 3.1 Font Stacks

LLD Lab pairs **Inter** for clean UI readability with **JetBrains Mono** for monospaced code editing and AST diagram labels.

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace;
}

body {
  font-family: var(--font-sans);
  color: var(--text-primary);
  background-color: var(--bg-canvas);
  -webkit-font-smoothing: antialiased;
}
```

### 3.2 Type Scale & Hierarchy

| Token Name | Size | Line Height | Weight | Tailwind Class | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | 32px / 2.00rem | 40px | 700 (Bold) | `text-3xl font-bold` | Problem title hero banner, major dashboard header. |
| `h1` | 24px / 1.50rem | 32px | 700 (Bold) | `text-2xl font-bold` | Problem description section headers, modal titles. |
| `h2` | 20px / 1.25rem | 28px | 600 (SemiBold) | `text-xl font-semibold` | Sub-sections, evaluation report headings. |
| `h3` | 16px / 1.00rem | 24px | 600 (SemiBold) | `text-base font-semibold` | Card headers, panel titles, tab group labels. |
| `body-base` | 14px / 0.875rem | 22px | 400 (Regular) | `text-sm font-normal` | Main problem text, requirements, hints, report notes. |
| `body-medium` | 14px / 0.875rem | 22px | 500 (Medium) | `text-sm font-medium` | Interactive button labels, table cell data, file tree nodes. |
| `caption` | 12px / 0.75rem | 16px | 500 (Medium) | `text-xs font-medium` | Status pills, timestamp strings, hotkey badges, tooltips. |
| `code-mono` | 13px / 0.8125rem | 20px | 400/500 | `font-mono text-[13px]` | Monaco code buffer, inline identifiers (`ParkingSpot`). |

---

## 4. Spacing & Elevation System

### 4.1 4px / 8px Spacing Matrix

| Spacing Token | Pixels | Rem Equivalent | Primary UI Application |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | 0.25rem | Icon-to-text gaps, inline pill padding, divider gaps. |
| `space-2` | 8px | 0.50rem | Compact button padding (py-1.5), file tree item indentation. |
| `space-3` | 12px | 0.75rem | Default input padding, card header inner spacing. |
| `space-4` | 16px | 1.00rem | Standard container padding, panel borders, modal body gap. |
| `space-6` | 24px | 1.50rem | Dashboard card margins, major section separations. |
| `space-8` | 32px | 2.00rem | Top navigation bar gutter, problem description vertical spacing. |
| `space-12`| 48px | 3.00rem | Empty state container padding, marketing banner offset. |

### 4.2 Border Radius Scale

```
+--------------------+   +--------------------+   +--------------------+   +--------------------+
|   radius-xs: 4px   |   |   radius-sm: 6px   |   |   radius-md: 8px   |   |  radius-full: 9999 |
|   (Code Badges)    |   |   (Input Fields)   |   |   (Cards, Panes)   |   |  (Pills, Avatars)  |
+--------------------+   +--------------------+   +--------------------+   +--------------------+
```

### 4.3 Elevation & Drop Shadows

```css
.card-elevation {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
}

.floating-panel-elevation {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
}
```

---

## 5. UI Components

### 5.1 Buttons

Buttons feature clear focus rings, active-press translation (`transform: translateY(1px)`), and explicit states.

```
+---------------------------+   +---------------------------+   +---------------------------+
|  Run Tests (Secondary)    |   | Submit Evaluation (Prim.) |   |   Reset Workspace (Ghost) |
|  [>] Orange (#F97316)     |   |  [^] Blue (#2563EB)       |   |   [x] Borderless Slate    |
+---------------------------+   +---------------------------+   +---------------------------+
```

```html
<!-- Primary Button (Blue) -->
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  <svg class="w-4 h-4" ...></svg>
  <span>Submit for Review</span>
</button>

<!-- Secondary Action Button (CipherSchools Orange) -->
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">
  <svg class="w-4 h-4" ...></svg>
  <span>Run Tests</span>
</button>

<!-- Outline / Ghost Button -->
<button class="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-all shadow-xs">
  <span>View Diff</span>
</button>
```

---

### 5.2 Cards & Containers

Cards are strictly bordered with 1px neutral gray, maintaining high legibility against the canvas gray background.

```html
<!-- Evaluation Score Card -->
<div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xs hover:border-gray-300 transition-colors">
  <div class="flex items-center justify-between pb-3 border-b border-gray-100">
    <div class="flex items-center gap-2">
      <span class="p-1.5 text-blue-600 bg-blue-50 rounded-md">
        <!-- SVG Icon -->
      </span>
      <h3 class="text-sm font-semibold text-gray-800">SOLID Audit Breakdown</h3>
    </div>
    <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
      48 / 60 Pts
    </span>
  </div>
  <div class="mt-3 space-y-2">
    <!-- Progress Bar item -->
    <div class="flex items-center justify-between text-xs">
      <span class="font-medium text-gray-600">Single Responsibility (SRP)</span>
      <span class="font-semibold text-gray-800">10 / 12</span>
    </div>
    <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
      <div class="bg-blue-600 h-full rounded-full" style="width: 83%"></div>
    </div>
  </div>
</div>
```

---

### 5.3 Form Controls & Inputs

- **Default State:** White background, 1px `#D1D5DB` border, `#1F2937` font color.
- **Focus State:** 2px ring in Primary Blue (`#2563EB`) with 0 offset.

```html
<!-- Search & Filter Input with Kbd Badge -->
<div class="relative flex items-center">
  <input 
    type="text" 
    placeholder="Search patterns or problems..." 
    class="w-full pl-9 pr-14 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow"
  />
  <span class="absolute left-3 text-gray-400">
    <svg class="w-4 h-4" ...></svg>
  </span>
  <kbd class="absolute right-3 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
    ⌘K
  </kbd>
</div>
```

---

### 5.4 Badges & Status Pills

| Status / Badge | Foreground | Background | Border | Example Appearance |
| :--- | :--- | :--- | :--- | :--- |
| **Accepted / 100% Pass** | `#047857` (Emerald 700) | `#ECFDF5` | `#A7F3D0` | `[● Accepted]` |
| **Needs Revision** | `#B45309` (Amber 700) | `#FFFBEB` | `#FDE68A` | `[▲ Needs Revision]` |
| **Compiler Error** | `#B91C1C` (Red 700) | `#FEF2F2` | `#FECACA` | `[✖ Error]` |
| **Difficulty: Medium** | `#C2410C` (Orange 700) | `#FFF7ED` | `#FFEDD5` | `[Medium]` |
| **Design Pattern** | `#1D4ED8` (Blue 700) | `#EFF6FF` | `#BFDBFE` | `[Strategy Pattern]` |

```html
<!-- Example Pattern Badge -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
  Strategy Pattern
</span>
```

---

### 5.5 Tables & Data Grids

Tables in LLD Lab present attempt history, test assertions, and leaderboard rankings cleanly:

```html
<div class="overflow-hidden border border-gray-200 rounded-lg shadow-xs">
  <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
    <thead class="bg-gray-50 text-gray-600 font-medium">
      <tr>
        <th class="px-4 py-3">Attempt #</th>
        <th class="px-4 py-3">Verdict</th>
        <th class="px-4 py-3">Score</th>
        <th class="px-4 py-3">Primary Anti-Pattern</th>
        <th class="px-4 py-3 text-right">Submitted</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100 bg-white">
      <tr class="hover:bg-gray-50/80 transition-colors">
        <td class="px-4 py-3 font-semibold text-gray-900">#03</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">Accepted</span>
        </td>
        <td class="px-4 py-3 font-mono font-semibold text-blue-600">88 / 100</td>
        <td class="px-4 py-3 text-gray-600">None detected</td>
        <td class="px-4 py-3 text-right text-gray-400 text-xs">2 hours ago</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 6. Layout Architecture

### 6.1 Global Shell Structure

```
+---------------------------------------------------------------------------------------------------+
|  [CipherSchools LLD Lab Logo]   Problems   Mastery   Cohort Leaderboard      [User Aarav] [Bell]  |
+---------------------------------------------------------------------------------------------------+
|  LLD-001: Parking Lot System  |  Java 21  |  [Run Tests]  [Submit For Review]  |  Time Left: 82m  |
+---------------------------------------------------------------------------------------------------+
|  LEFT PANEL (30%)             |  CENTER PANEL (45%)               |  RIGHT PANEL (25%)            |
|  - Problem Tab / UML Tab      |  - Tab Bar (ParkingSpot.java)     |  - Evaluation Results         |
|  - Functional Requirements    |  - Dark Monaco Code Editor        |  - SOLID Radar Chart          |
|  - Socratic Hint Accordion    |  - Bottom Terminal (Test Output)  |  - Longitudinal History       |
+---------------------------------------------------------------------------------------------------+
```

### 6.2 3-Column Split Workspace Grid

The workspace enforces a responsive desktop split-pane:
- **Left Column (30% width, min 320px):** Problem documentation, class relationship specifications, and dynamic Mermaid UML visualization.
- **Center Column (45% width, flex grow):** Multi-tab file manager, dark-themed Monaco code editor (`#1E1E1E`), and collapsible test execution console.
- **Right Column (25% width, min 280px):** Real-time hybrid evaluation scorecard, SOLID spider chart, and longitudinal memory warnings.
- **Gutter Splitters:** 4px draggable resize handles with hover state turning Primary Blue (`#2563EB`).

---

## 7. Iconography

LLD Lab uses **Lucide React** (`0.474.0`) icons, characterized by crisp, 2px stroke lines and geometric clarity.

| Icon Component | Visual Representation | Semantic Context |
| :--- | :--- | :--- |
| `Play` | Triangular run arrow | Run fast deterministic unit tests |
| `Send` / `UploadCloud` | Upward arrow | Submit code for full hybrid AI evaluation |
| `Lightbulb` | Glowing bulb | Unlock progressive Socratic hint |
| `GitCommit` | Branch node | Submission iteration / attempt history |
| `ShieldAlert` | Warning shield | Anti-pattern / code smell detected |
| `CheckCircle2` | Enclosed checkmark | Test assertion passed |
| `XCircle` | Enclosed cross | Test assertion failed |
| `Layers` | Stacked planes | Design pattern detected (GoF) |
| `Compass` | Radar indicator | SOLID compliance radar |
| `ExternalLink` | Diagonal arrow | Open linked CipherSchools lecture video |

---

## 8. Animations & Micro-Interactions

All interactions follow subtle, physics-based micro-transitions to maintain speed without distraction:

```css
/* Evaluation Progress Pulse */
@keyframes evaluating-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.02);
  }
}

.evaluating-beacon {
  animation: evaluating-pulse 1.8s ease-in-out infinite;
}

/* Accordion Hint Unlock Slide */
.hint-slide-down {
  transition: max-height 300ms cubic-bezier(0, 1, 0, 1), opacity 200ms ease-in-out;
}

/* Button Click Haptic Feedback Simulation */
.btn-press:active {
  transform: translateY(1px);
}
```

---

## 9. Responsive Breakpoints

| Breakpoint | Minimum Width | Layout Adaptations |
| :--- | :--- | :--- |
| `sm` | `640px` | Single-column stacked mode. Editor tabs convert to dropdown selector. |
| `md` | `768px` | 2-column layout (Left: Problem/Results toggle, Right: Monaco Editor). |
| `lg` | `1024px` | 3-column split layout enabled. Right panel collapses into drawer on demand. |
| `xl` | `1280px` | Full 3-column desktop layout (30% / 45% / 25%) with persistent panels. |
| `2xl` | `1536px` | Ultra-wide mode; centers workspace container at 1920px max-width. |

---

## 10. Logo Concept & Brand Assets

The **LLD Lab** logo is a harmonious lockup combining the **CipherSchools** academic insignia with architectural design brackets.

```
       +---+         +---+
       |   |---------|   |        LLD LAB
       +---+         +---+        BY CIPHERSCHOOLS
         |             |
       +---+         +---+        Color: #2563EB (Brackets)
       |   |---------|   |               #F97316 (Nodes)
       +---+         +---+
```

### Brand Logo Typography & Asset Specs
- **Symbol:** Four interconnected class nodes in a 2x2 matrix symbolizing object-oriented design patterns, connected with blueprint circuit lines.
- **Logotype:** Set in `Inter Bold` in Charcoal Gray (`#1F2937`) with "LAB" accented in CipherSchools Orange (`#F97316`).
- **Favicon:** Scalable vector SVG of the 2x2 blueprint nodes on a rounded royal blue (`#2563EB`) tile.
