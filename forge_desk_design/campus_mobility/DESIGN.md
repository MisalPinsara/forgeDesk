---
name: Campus Mobility
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2e4edc'
  primary: '#2346d5'
  on-primary: '#ffffff'
  primary-container: '#4361ee'
  on-primary-container: '#f4f2ff'
  inverse-primary: '#bac3ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006443'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f57'
  on-tertiary-container: '#ccffe2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#001159'
  on-primary-fixed-variant: '#0031c4'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 2.5rem
  space-3xl: 3.5rem
  sidebar-width: 260px
---

## Brand & Style

This design system establishes an accessible, welcoming, and high-trust campus transportation experience. Designed primarily for university students, faculty, and academic staff, the UI prioritizes instantaneous comprehension, approachable warmth, and uncompromised clarity over dense technical workflows.

The visual direction draws from **Corporate / Modern** principles infused with soft, consumer-grade SaaS ergonomics. It leverages high-contrast dual environments: a calm, grounded midnight/dark navy framing spine on the left that anchors global navigation, paired with an expansive, luminous light work surface for primary interactions. Structural elements feature friendly radii, balanced padding, and clean hierarchy to make coordinating daily rides feel reliable and effortless.

## Colors

The palette uses a crisp, high-clarity distribution:
- **Primary (`#4361ee`)**: A vibrant royal blue used for decisive actions, focused outlines, active navigation pills, and dynamic interactive states.
- **Secondary / Sidebar Chrome (`#0f172a`)**: Deep slate navy providing high-contrast structure for global persistence. Subdued navigation links sit at `#94a3b8`, shifting to pure `#ffffff` when active.
- **Tertiary / Success (`#10b981`)**: Emerald tone reserved for active trip indicators, verified driver status, and positive seat confirmations.
- **Destructive / Alert (`#ef4444`)**: Crisp crimson applied to cancellation triggers and critical warning badges.
- **Canvas & Surface Backgrounds**: The main workspace utilizes an ultra-clean base of `#f8fafc` paired with pure white (`#ffffff`) card surfaces to maintain distinction without harsh brightness.
- **Borders & Dividers**: Delicate borders set at `#e2e8f0` provide structural definition while preventing visual noise.

## Typography

Typographic scale is powered strictly by **Inter** to ensure maximum legibility at varying sizes across complex forms and travel manifests. 

- **Page Titles (`headline-xl`)**: Rendered in 700 weight with tight tracking to anchor primary dashboard sections.
- **Section Headers (`headline-lg`, `headline-md`)**: Crisp 600 weight denoting card groupings, ride route headings, and detail panels.
- **Body Rhythm**: Default body content uses `body-md` (14px) with ample line height (20px) to maximize scanning speed. Subordinate metadata (timestamps, passenger counts, vehicle specs) utilizes `body-sm` tinted with muted slate (`#64748b`).
- **Caps Labels (`label-sm`)**: Used for status chips (e.g., `ACTIVE`, `PENDING`), tracking slightly wider at `+0.05em` to prevent compressed text fatigue.

## Layout & Spacing

The layout follows a fluid-hybrid desktop pattern anchored by a fixed-width left navigation rail (`260px`).

- **Application Canvas**: The content stage uses fluid horizontal stretch with a maximum bounded inner width of `1280px` to maintain optimal line lengths.
- **Grid & Gutters**: Card forms and multi-attribute filters utilize a responsive 12-column grid with `1.5rem` (`24px`) gutters on desktop, collapsing to single-column cascades on mobile viewports.
- **Inner Surface Padding**: Cards and content containers strictly apply `1.5rem` to `2rem` of internal padding to create open, uncluttered breathing room around data lists.
- **Vertical Rhythm**: Page headers are separated from control bars by `1.5rem`, while ride items in listing sequences maintain an explicit `0.75rem` gap to preserve visual distinction without overwhelming the scroll depth.

## Elevation & Depth

This design system avoids heavy skeuomorphic drop shadows and synthetic dark overlays, relying instead on low-contrast outlines and micro-ambient depth to keep layouts feeling feather-light:

- **Level 0 (Flat Canvas)**: Base background `#f8fafc`.
- **Level 1 (Surface Cards & Panels)**: `#ffffff` background bounded by a crisp `1px` border of `#e2e8f0` with an ambient diffused shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Interactive Floating Elements & Dropdowns)**: Elevated pickers, modal popovers, and hovered interactive ride rows: `0 10px 15px -3px rgba(15, 23, 42, 0.07), 0 4px 6px -4px rgba(15, 23, 42, 0.04)` over a border of `#cbd5e1`.
- **Level 3 (Focused Inputs & Primary Buttons)**: Focus rings employ a dual-ring treatment—a pure white `2px` inner knockout bordered by a `2px` bloom of `rgba(67, 97, 238, 0.35)`.

## Shapes

The design system adopts a **Rounded** (Level 2) geometry:
- **Base Components (`rounded-lg` / `0.5rem` - `8px`)**: Form inputs, action buttons, search fields, and persistent sidebar nav items.
- **Containers & Surfaces (`rounded-xl` / `0.75rem` - `1rem`)**: Ride search boxes, passenger overview cards, and detail summary panels.
- **Pills (`9999px`)**: Status chips, badge counters, seat availability tags, and user avatars to introduce soft organic accents that contrast with the structured grid.

## Components

### Buttons
- **Primary Action**: Solid `#4361ee` fill, `#ffffff` text, font weight 600, height 40px (or 44px for primary page headers), `rounded-lg` (8px). Subtle hover state shifting to `#3651d4`.
- **Secondary / Outlined Action**: Transparent fill with `1px` border `#e2e8f0`, text `#334155`, hovering to surface `#f1f5f9`.
- **Destructive Outlined**: Transparent fill, border `#fecaca`, text `#dc2626`, hovering to `#fef2f2`.
- **Sidebar Nav Items**: Full-width interactive targets (height 40px) with `0.5rem` border radius. Active items fill with solid `#4361ee` and pure white text; inactive items display `#94a3b8` text and icons, transitioning smoothly to white text with an ultra-subtle white alpha overlay (`rgba(255, 255, 255, 0.06)`) on hover.

### Form Inputs & Select Controls
- **Fields**: Background `#ffffff`, border `1px solid #cbd5e1`, 42px height, 12px horizontal padding, radius 8px (`rounded-lg`).
- **Input Icons**: Prepended location pin, calendar, or clock icons in `#94a3b8`.
- **State**: Focus state applies `border-color: #4361ee` accompanied by a soft `3px` focus ring glow (`rgba(67, 97, 238, 0.15)`).

### Badges & Chips
- **Status Tags**: Pill-shaped (`rounded-full`), height 22px, padding 2px 10px, uppercase `label-sm` (11px, 700 weight).
  - *Active*: `#ecfdf5` background, `#059669` text.
  - *Pending*: `#fffbeb` background, `#d97706` text.
  - *Seats Remaining*: `#f1f5f9` background, `#475569` text with soft slate outline.

### Ride Row Cards
- **Structure**: Standalone horizontal white cards with `1px solid #e2e8f0` borders, `rounded-xl` corners, and `1.25rem` padding.
- **Content Hierarchy**: Left side features route origin/destination arrow format (`Origin → Destination`) in 600 weight, immediately followed below by route metadata (time, schedule, driver name) in `body-sm` `#64748b`. Right-aligned stack houses the status pill and seat availability indicator.
- **Hover Motion**: Smooth elevation transition from Level 1 to Level 2 with a border shift to `#cbd5e1`.

### Breadcrumbs & Context Headers
- Back navigation buttons are enclosed in rounded 6px light borders (`#e2e8f0`), paired with subdued trail typography (`#64748b`) navigating directly to parent collections.