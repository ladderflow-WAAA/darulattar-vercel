# Darul Attar Design System

## 1. Color Palette
- **Primary Brand Gold**: `#C0A080` (Champagne metallic warmth)
- **Deep Burnished Ochre**: `#8C6D47` (Text contrast and active states)
- **Soft Alabaster Accent**: `#EFE5DA` (Subtle pill backgrounds and borders)
- **Ivory Canvas**: `#FFFFFF` / `#FAF9F6` / `#FDFBF7` (Clean editorial light canvas)
- **Primary Charcoal**: `#111827` (Deep graphite typography)
- **Muted Stone**: `#4B5563` / `#6B7280` (Secondary body and attributes)
- **Border Subtle**: `#E5E7EB` / `#EAE6DF` (Whisper dividers)

## 2. Typography Strategy
- **Display Serif**: `Instrument Serif`, `Playfair Display`
- **Body & Sans**: `Plus Jakarta Sans`, `Lato`
- **Mono / Numerical**: `JetBrains Mono`
- **Typographic Alternation**: Within primary headings, emphasize exactly one key operative noun or adjective with an italic serif accent span (e.g. `Authentic Oud & <span className="font-editorial italic font-normal text-brand-gold-dark">Bespoke</span> Fragrances`).
- **Hierarchy Floor**: No cheap kicker eyebrows above headings. Headings speak directly with weight and proportion.

## 3. Motion & Physics
- Framer Motion hardware-accelerated transforms (`transform3d`).
- Staggered entrances (0.05s-0.1s step) with cubic-bezier easing (`[0.16, 1, 0.3, 1]`).
- Interactive magnetic tilt on cards (`rotateX`, `rotateY` via springs).
- Tactile hover feedback without jarring shifts.

## 4. Visual Elements & Rules
- Authentic artisanal imagery and abstract botanical/geometric motifs only.
- Strictly no human faces, animal depictions, or heads.
- Vector icons exclusively using clean SVG outlines.

