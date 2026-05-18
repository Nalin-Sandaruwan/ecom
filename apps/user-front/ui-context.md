# UI Design Context - ChilleBazzar (User Frontend)

> [!IMPORTANT]
> **AI AGENT RULES:**
> 1. Always prioritize the design specifications in this file over generic styling or training data defaults.
> 2. Maintain strict adherence to the OKLCH color system defined in `globals.css`.
> 3. Use the **Geist** and **Inter** font families as configured in `layout.tsx`.
> 4. Ensure all new components follow the "Premium Organic" aesthetic: clean layouts, subtle glassmorphism, and high-quality imagery.

## Design Vision
ChilleBazzar is a high-end e-commerce platform specializing in premium organic produce (specifically chillies). The design should feel sophisticated, trustworthy, and "fresh".

## Design Tokens

### Color Palette (OKLCH)
| Token | OKLCH Value | Visual Description | Usage |
|-------|-------------|-------------------|-------|
| Background | `1 0 0` | Pure White | Page backgrounds |
| Foreground | `0.145 0 0` | Deep Charcoal | Primary text |
| Primary | `0.527 0.154 25.069` | Vibrant "Chilli" Red | Call-to-actions, branding, highlights |
| Secondary | `0.967 0.001 286.375` | Subtle Soft Tint | Secondary backgrounds, accents |
| Muted | `0.97 0 0` | Very Light Gray | Backgrounds for cards/sections |
| Heading | `#240000` (Hex) | Dark Maroon | Headlines and major titles |

### Typography
- **Primary Font**: `Geist` (Sans) - Used for general UI and body text.
- **Display Font**: `Geist` (Sans - Black/Heavy weight) - Used for massive, tracking-tight headlines.
- **System Fallback**: `Inter` / `Sans-serif`.

### Components & Spacing
- **Border Radius**: Default is `0.625rem` (`10px`), but used up to `4rem` for decorative cards.
- **Shadows**: Large, soft shadows for "floating" elements (e.g., `shadow-2xl shadow-primary/30`).
- **Gradients**: Often used for text clipping and decorative background pulses.

## Architecture Guidelines
1. **Responsive First**: All components must be fully responsive from mobile to ultra-wide (1920px+).
2. **Modular Components**: Section-based architecture (e.g., `Hero`, `Navbar`, `Footer`) as seen in `app/page.tsx`.
3. **Animations**: Use `framer-motion` for subtle entry transitions (fade-in, scale-up) and pulse effects on decorative elements.
